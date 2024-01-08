//@ts-nocheck

import CoBody = require("co-body");
import { isValid} from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { parse } from "../utils/XMLParser";
import { CCEntityName, CLEntityName, maxRetry } from "../utils/constants";
import { CCRecord, CLRecord } from "../typings/types";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";

export async function setCrmBpId(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  let cc: CCRecord = undefined;
  try{
    ctx.req.headers["content-type"]="text/plain";
    let req = await CoBody(ctx.req);
    req = await parse(req);
    let userData = {
        email: (
                ctx.state.appSettings.useSapPo ?
                req["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_CREACON_MYACC.Response"]["CS_ADDRESS_DATA"]["EMAIL_ADDRESS"] :
                req["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsCreaconMyaccResponse"]["CsAddressData"]["EmailAddress"]
              ),
        crmBpId: (
                ctx.state.appSettings.useSapPo ?
                req["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_CREACON_MYACC.Response"]["CS_NAME_DATA"]["CRM_BP_ID"] :
                req["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsCreaconMyaccResponse"]["CsNameData"]["CrmBpId"]
              )
    }
    let results = await Promise.all(
      [
        searchDocuments(ctx, CCEntityName, ["id","crmBpId","vtexUserId"], "email="+userData.email, {page: 1, pageSize: 100}, false, maxRetry),
        searchDocuments(ctx, CLEntityName, ["id","crmBpId"], "email="+userData.email, {page: 1, pageSize: 100}, false, maxRetry)
      ]
    );
    cc = results[0][0];
    let cl: CLRecord = results[1][0];
    if(!isValid(cc.crmBpId) || !isValid(cl.crmBpId))
    {
      await updatePartialDocument(ctx, CCEntityName, cc.id, {crmBpId: userData.crmBpId}, maxRetry);
      await updatePartialDocument(ctx, CLEntityName, cl.id, {crmBpId: userData.crmBpId}, maxRetry);
      ctx.vtex.logger.info("set crmBpId "+cc.vtexUserId+": OK -- data: "+JSON.stringify(userData));
    }
    ctx.body = "OK";
    ctx.status = 200;
  }catch(err){
    //console.log(err)
    ctx.body = "Internal Server Error";
    ctx.status = 500;
    ctx.vtex.logger.error("set crmBpId "+cc?.vtexUserId+": failed -- err: "+JSON.stringify((err.message!=undefined?err.message:(err.response?.data!=undefined?err.response.data:err))));
  }
  await next();
}
