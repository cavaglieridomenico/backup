//@ts-nocheck

import CoBody = require("co-body");
import { enabledCredentials, isValid, baseUrl, ASfields, maxRetry, maxWaitTime, wait, thirtyDays, maxDays, mdPageSize} from "../utils/constants";
import { CustomLogger } from "../utils/Logger";
import { ASrecord} from "../typing/types";

export async function backInStock(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  let credentials: [] = enabledCredentials[ctx.vtex.account];
  if(credentials.find(f => f.key==ctx.req.headers[("X-VTEX-API-AppKey").toLowerCase()] && f.token==ctx.req.headers[("X-VTEX-API-AppToken").toLowerCase()])!=undefined){
    let refId = undefined;
    try{
      refId = (await CoBody(ctx.req))?.refId;
      if(isValid(refId)){
        let currentDate = new Date(Date.now()).toISOString();
        let dateFrom = new Date(Date.parse(currentDate));
        dateFrom.setDate(dateFrom.getDate()-maxDays);
        let skuId = (await ctx.clients.Vtex.getSkuByRefId(refId))?.data?.Id;
        let ASRecords: ASrecord[] = await getASRecords(ctx, skuId, dateFrom.toISOString(), currentDate, [], 1, mdPageSize, 0);
        if(ASRecords.length>0){
          let skuContextImages = await Promise.all([ctx.clients.Vtex.getSkuContext(skuId),ctx.clients.Vtex.getImages(skuId)]);
          let skuContext = skuContextImages[0]?.data;
          let images = skuContextImages[1]?.data;
          let mainImage = images.find(f => f.IsMain==true)?.ArchiveId;
          let mainImageUrl = skuContext.Images.find(f => f.FileId==mainImage)?.ImageUrl;
          let dataToUpdate: ASrecord = {
            notificationSend: "true",
            productImageUrl: baseUrl[ctx.vtex.account]+mainImageUrl.split(".com.br")[1],
            productUrl: baseUrl[ctx.vtex.account]+skuContext.DetailUrl,
            sendAt: new Date(Date.now()).toISOString(),
            skuRefId: refId
          }
          currentDate = Date.parse(currentDate);
          ASRecords?.forEach(r => {
            ctx.clients.masterdata.updatePartialDocument({dataEntity: "AS", id: r.id, fields: dataToUpdate})
            .then(res => {
              ctx.vtex.logger.info("Back in stock "+refId+": notification sent to the user "+r.email);
            })
            .catch(err => {
              //console.log(err)
              ctx.vtex.logger.error("Back in stock "+refId+": notification failed for the user "+r.email+" --details: "+(err?.response?.data!=undefined?err.response.data:JSON.stringify(err)));
            });
          });
        }
        ctx.body = "OK";
        ctx.status = 200;
      }else{
        ctx.body = "Bad request";
        ctx.status = 400;
      }
    }catch(err){
      //console.log(err)
      ctx.body = "Internal Server Error";
      ctx.status = 500;
      ctx.vtex.logger.error("Back in stock "+refId+": "+(err.message!=undefined?err.message:("an unknown error occurred while retrieving product / customers data --details "+(err?.response?.data!=undefined?err.response.data:JSON.stringify(err)))));
    }
  }else{
    ctx.body = "Not Authorized";
    ctx.status = 403;
  }
  await next();
}

async function getASRecords(ctx: Context, skuId: number, dateFrom: Date, dateTo: Date, result: [], page: number, pageSize: number, retry: number): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.masterdata.searchDocuments({dataEntity: "AS", fields: ASfields, where: "notificationSend=false AND skuId="+skuId+" AND (createdAt between "+dateFrom+" AND "+dateTo+")", pagination: {page: page, pageSize: pageSize}})
    .then(res => {
      result = result.concat(res);
      if(res.length<pageSize){
        resolve(result);
      }else{
        return getASRecords(ctx, skuId, dateFrom, dateTo, result, page+1, pageSize, 0).then(res1 => resolve(res1)).catch(err1 => reject(err1));
      }
    })
    .catch(async(err) => {
      if(retry<=maxRetry){
        await wait(maxWaitTime);
        return getASRecords(ctx, skuId, dateFrom, dateTo, result, page, pageSize, retry+1).then(res1 => resolve(res1)).catch(err1 => reject(err1));
      }else{
        reject({message:"error while retrieving AS records --details: "+(err.response?.data!=undefined?err.response.data:JSON.stringify(err))})
      }
    })
  })
}
