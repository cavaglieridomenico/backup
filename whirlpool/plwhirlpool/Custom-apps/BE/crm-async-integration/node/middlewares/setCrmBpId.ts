//@ts-nocheck

import CoBody = require("co-body");
import { isValid, stringify } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { parse } from "../utils/XMLParser";
import { updatePartialObjInVbase } from "../utils/Vbase";
import { CUSTOMERS_BUCKET } from "../utils/constants";

export async function setCrmBpId(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  let cc = undefined;
  let userData = undefined;
  try {
    ctx.req.headers["content-type"] = "text/plain";
    let req = await CoBody(ctx.req);
    req = await parse(req);
    if (JSON.parse(process.env.CRM).server === 'crm') {
      userData = {
        email: req["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsCreaconMyaccResponse"]["CsAddressData"]["EmailAddress"],
        crmBpId: req["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsCreaconMyaccResponse"]["CsNameData"]["CrmBpId"]
      }
    } else if (JSON.parse(process.env.CRM).server === 'sap-po') {
      userData = {
        email: req["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_CREACON_MYACC.Response"]["CS_ADDRESS_DATA"]["EMAIL_ADDRESS"],
        crmBpId: req["SOAP:Envelope"]["SOAP:Body"]["ns0:Z_ES_CREACON_MYACC.Response"]["CS_NAME_DATA"]["CRM_BP_ID"]
      }
    }
    let p0 = new Promise<any>((resolve, reject) => {
      ctx.clients.masterdata.searchDocuments({ dataEntity: "CC", fields: ["id", "crmBpId", "vtexUserId"], where: "email=" + userData.email, pagination: { page: 1, pageSize: 100 } })
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          reject(err);
        })
    })
    let p1 = new Promise<any>((resolve, reject) => {
      ctx.clients.masterdata.searchDocuments({ dataEntity: "CL", fields: ["id", "crmBpId"], where: "email=" + userData.email, pagination: { page: 1, pageSize: 100 } })
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          reject(err);
        })
    })
    let results = await Promise.all([p0, p1]);
    cc = results[0];
    let cl = results[1];
    if (!isValid(cc.crmBpId) || !isValid(cl.crmBpId)) {
      await updatePartialObjInVbase(ctx, CUSTOMERS_BUCKET, cc?.vtexUserId, { crmBpId: userData.crmBpId })
      await ctx.clients.masterdata.updatePartialDocument({ dataEntity: "CC", id: cc.id, fields: { crmBpId: userData.crmBpId } });
      await ctx.clients.masterdata.updatePartialDocument({ dataEntity: "CL", id: cl.id, fields: { crmBpId: userData.crmBpId } });
      ctx.vtex.logger.info("set crmBpId " + cc?.vtexUserId + ": OK -- data: " + JSON.stringify(userData));
    }
    ctx.body = "OK";
    ctx.status = 200;
  } catch (err) {
    console.log(err)
    ctx.body = "Internal Server Error";
    ctx.status = 500;
    ctx.vtex.logger.error("set crmBpId " + cc?.vtexUserId + ": failed -- err: " + stringify(err));
  }
  await next();
}
