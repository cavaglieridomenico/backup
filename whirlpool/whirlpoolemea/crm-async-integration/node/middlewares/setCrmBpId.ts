import { CCEntityFields, CLEntityName, maxRetry } from "../utils/constants";
import { CCRecord, CLRecord } from "../typings/md";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { isValid, stringify } from "../utils/commons";
import CoBody from "co-body";
import { CreateConsumerUK_Response } from "../typings/crm/UK";
import { readSetCrmBpIdReq } from "../utils/mapper";
import { saveOrUpdateCCRecordInVBase } from "../utils/CC-VBase";

export async function setCrmBpId(ctx: Context, next: () => Promise<any>) {
  let cc: CCRecord = {};
  try {
    ctx.req.headers["content-type"] = ctx.state.appSettings.isUkProject ? "application/json" : "text/plain";
    let req: string | CreateConsumerUK_Response = await CoBody(ctx.req);
    let parsedReq = await readSetCrmBpIdReq(ctx, req);
    let results = await Promise.all(
      [
        searchDocuments(ctx, ctx.state.appSettings.crmEntityName, CCEntityFields, `email=${parsedReq.email}`, { page: 1, pageSize: 10 }, false, maxRetry),
        searchDocuments(ctx, CLEntityName, ["id", "crmBpId"], `email=${parsedReq.email}`, { page: 1, pageSize: 10 }, false, maxRetry)
      ]
    );
    cc = results[0][0];
    let cl: CLRecord = results[1][0];
    if (!isValid(cc.crmBpId) || !isValid(cl.crmBpId)) {
      await Promise.all([
        updatePartialDocument(ctx, ctx.state.appSettings.crmEntityName, cc.id!, { crmBpId: parsedReq.bpId }, maxRetry),
        saveOrUpdateCCRecordInVBase(ctx, cc, { crmBpId: parsedReq.bpId })
      ])
      await updatePartialDocument(ctx, CLEntityName, cl.id!, { crmBpId: parsedReq.bpId }, maxRetry);
      ctx.state.logger.info(`set crmBpId ${cc.vtexUserId}: OK --data: ${stringify(parsedReq)}`);
    }
    ctx.body = "OK";
    ctx.status = 200;
  } catch (err) {
    console.error(err);
    ctx.body = "Internal Server Error";
    ctx.status = 500;
    ctx.state.logger.error(`set crmBpId ${cc?.vtexUserId}: failed --err: ${stringify(err.message ? err.message : err)}`);
  }
  await next();
}
