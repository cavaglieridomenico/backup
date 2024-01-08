import { ASfields, maxRetry, maxWaitTime, maxDays, commercialCode, pageLimit } from "../utils/constants";
import { CustomLogger } from "../utils/Logger";
import { RequestPayload } from "../typing/BISNotification";
import { isValid, stringify, wait } from "../utils/functions";
import { updatePartialDocument } from "../utils/documentCRUD";
import { ASRecord } from "../typing/md";
import { SearchTerm, TradePolicyInfo } from "../typing/config";
import CoBody from "co-body";

export async function backInStock(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let request: RequestPayload | undefined = undefined;
  try {
    request = await CoBody(ctx.req);
    await checkPayload(request);
    let contextInfo = await getContextInfo(ctx, request!);
    let currentDate: string = new Date().toISOString();
    let dateFrom = new Date(currentDate);
    let mDays = isValid(ctx.state.appSettings!.maxDays) ? ctx.state.appSettings!.maxDays : maxDays;
    dateFrom.setDate(dateFrom.getDate() - mDays!);
    let skuId = (await ctx.clients.Vtex.getSkuByRefId(request!.refId))?.Id;
    let searchTerm = ctx.state.appSettings?.searchField == SearchTerm.skuId ? skuId.toString() : request!.refId;
    let ASRecords = await getASRecords(ctx, searchTerm, dateFrom.toISOString(), currentDate, contextInfo.tradePolicyId, ctx.state.appSettings!.searchField);
    if (ASRecords.length > 0) {
      let [skuContext, images] = await Promise.all([
        ctx.clients.Vtex.getSkuContext(skuId),
        ctx.clients.Vtex.getSkuImages(skuId)
      ]);
      let mainImage = images.find(f => f.IsMain)?.ArchiveId;
      mainImage = mainImage ?? images[0].ArchiveId;
      let mainImageUrl = skuContext.Images.find(f => f.FileId == mainImage)?.ImageUrl;
      let dataToUpdate: ASRecord = {
        skuId: skuId + "",
        productUrl: "https://" + contextInfo.hostname + skuContext.DetailUrl,
        productImageUrl: mainImageUrl,
        commercialCode: skuContext.ProductSpecifications?.find(ps => ps.FieldName == commercialCode)?.FieldValues[0],
        notificationSend: "true",
        sendAt: new Date().toISOString(),
      }
      ASRecords?.forEach(r => {
        updatePartialDocument(ctx, ctx.state.appSettings!.mdEntity, r.id!, dataToUpdate)
          .then(() => {
            ctx.vtex.logger.info("Back in stock " + request!.refId + ": notification sent to the user " + r.email);
          })
          .catch(err => {
            console.error(err);
            ctx.vtex.logger.error("Back in stock " + request!.refId + ": notification failed for the user " + r.email + " --err: " + stringify(err));
          });
      })
      ctx.body = "OK";
    } else {
      ctx.body = "No active subscriptions for the refId " + searchTerm;
    }
    ctx.status = 200;
  } catch (err) {
    //console.error(err);
    ctx.body = err.msg ? err.msg : "Internal Server Error";
    ctx.status = err.code ? err.code : 500;
    ctx.status != 400 ? ctx.vtex.logger.error("Back in stock " + request?.refId + ": notification failed --err: " + stringify(err)) : null;
  }
  await next();
}

async function checkPayload(payload: RequestPayload | undefined): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    isValid(payload?.refId) ? resolve(true) : reject({ msg: "Bad Request", code: 400 });
  })
}

async function getASRecords(ctx: Context, searchTerm: string, dateFrom: string, dateTo: string, tradePolicyId: string | undefined = undefined, searchField: string, result: ASRecord[] = [], page: number = 1, pageSize: number = 1000, retry: number = 0): Promise<ASRecord[]> {
  return new Promise<ASRecord[]>((resolve, reject) => {
    let queryPiece = isValid(tradePolicyId) ? ("AND tradePolicy=" + tradePolicyId + "  ") : "";
    ctx.clients.masterdata.searchDocuments({ dataEntity: ctx.state.appSettings!.mdEntity, fields: ASfields, where: "notificationSend=false " + queryPiece + `AND ${searchField}=` + searchTerm + " AND (createdAt between " + dateFrom + " AND " + dateTo + ")", pagination: { page: page, pageSize: pageSize } })
      .then(res => {
        result = result.concat(res as ASRecord[]);
        if (res.length < pageSize) {
          resolve(result);
        } else {
          if (page < pageLimit) {
            return getASRecords(ctx, searchTerm, dateFrom, dateTo, tradePolicyId, searchField, result, page + 1, pageSize, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            resolve(result);
          }
        }
        return;
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return getASRecords(ctx, searchTerm, dateFrom, dateTo, tradePolicyId, searchField, result, page, pageSize, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: "error while retrieving " + ctx.state.appSettings!.mdEntity + " records --details: " + stringify(err) })
        }
      })
  })
}

async function getContextInfo(ctx: Context, req: RequestPayload): Promise<TradePolicyInfo> {
  return new Promise<TradePolicyInfo>((resolve, reject) => {
    let context: TradePolicyInfo | undefined = undefined;
    if (!ctx.state.appSettings!.isCCProject) {
      if (ctx.state.appSettings!.hasClusterInfo) {
        if (req.cluster == ctx.state.appSettings!.o2pInfo?.clusterLabel) {
          context = ctx.state.appSettings!.o2pInfo;
        }
      } else {
        context = ctx.state.appSettings!.o2pInfo;
      }
    } else {
      if (req.cluster == ctx.state.appSettings!.eppInfo?.clusterLabel) {
        context = ctx.state.appSettings!.eppInfo;
      }
      if (req.cluster == ctx.state.appSettings!.ffInfo?.clusterLabel) {
        context = ctx.state.appSettings!.ffInfo;
      }
      if (req.cluster == ctx.state.appSettings!.vipInfo?.clusterLabel) {
        context = ctx.state.appSettings!.vipInfo;
      }
    }
    if (isValid(context)) {
      resolve(context!)
    } else {
      reject({ msg: "context not found" })
    }
  })
}
