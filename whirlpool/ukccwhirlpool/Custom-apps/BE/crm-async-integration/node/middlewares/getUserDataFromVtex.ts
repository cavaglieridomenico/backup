//@ts-nocheck

import { CCEntityName, CCEntityFields, PAEntityName, PAEntityFields, maxRetry } from "../utils/constants";
import { isValid, json2XmlCRM, json2XmlSAPPO } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { CCRecord, PARecord } from "../typings/types";
import { searchDocuments } from "../utils/documentCRUD";

export async function getUserDataFromVtex(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  if (isValid(ctx.query.id)) {
    try {
      let customer: CCRecord = (await searchDocuments(ctx, CCEntityName, CCEntityFields, "vtexUserId=" + ctx.query.id, { page: 1, pageSize: 100 }, false, maxRetry))[0];
      let vipInfo: PARecord = undefined;
      if (isValid(customer?.partnerCode)) {
        vipInfo = (await searchDocuments(ctx, PAEntityName, PAEntityFields, "accessCode=" + customer.partnerCode, { page: 1, pageSize: 100 }, false, maxRetry))[0];
      }
      let response = ctx.state.appSettings.useSapPo ? json2XmlSAPPO(ctx, customer, vipInfo) : json2XmlCRM(ctx, customer, vipInfo);
      ctx.res.setHeader("Content-Type", "text/xml");
      ctx.body = response;
      ctx.status = 200;
      ctx.vtex.logger.info("get user " + ctx.query.id + " from Vtex: OK -- data: " + JSON.stringify(response));
    } catch (err) {
      //console.log(err)
      ctx.body = "Internal Server Error";
      ctx.status = 500;
      ctx.vtex.logger.error("get user " + ctx.query.id + " from Vtex: failed -- err: " + JSON.stringify((err.message != undefined ? err.message : (err.response?.data != undefined ? err.response.data : err))));
    }
  } else {
    ctx.body = "Bad Request";
    ctx.status = 400;
  }
  await next();
}
