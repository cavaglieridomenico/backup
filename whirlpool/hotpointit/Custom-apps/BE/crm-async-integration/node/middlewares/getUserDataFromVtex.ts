//@ts-nocheck

import CoBody = require("co-body");
import { ccFields, enabledCredentials } from "../utils/constants";
import { isValid, json2Xml } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";

export async function getUserDataFromVtex(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  let credentials: [] = enabledCredentials[ctx.vtex.account];
  if (credentials.find(f => f.key == ctx.req.headers[("X-VTEX-API-AppKey").toLowerCase()] && f.token == ctx.req.headers[("X-VTEX-API-AppToken").toLowerCase()]) != undefined) {
    if (isValid(ctx.query.id)) {
      try {
        let customer = (await ctx.clients.masterdata.searchDocuments({ dataEntity: "CC", fields: ccFields, where: "vtexUserId=" + ctx.query.id, pagination: { page: 1, pageSize: 100 } }))[0];
        let response = {}
        Object.keys(customer).forEach(k => {
          if (k != "addressId" && k != "id" && k != "vtexUserId" /*&& k!="crmBpId"*/) {
            response[k] = customer[k];
          }
        })
        response = json2Xml(ctx, response);
        ctx.res.setHeader("Content-Type", "text/xml")
        ctx.body = response;
        ctx.status = 200;
        ctx.vtex.logger.info("get user " + ctx.query.id + " from Vtex: OK -- data: " + JSON.stringify(response));
      } catch (err) {
        //console.log(err)
        ctx.body = "Internal error";
        ctx.status = 500;
        cctx.vtex.logger.err("get user " + ctx.query.id + " from Vtex: failed -- err: " + JSON.stringify((err.message != undefined ? err.message : (err.response?.data != undefined ? err.response.data : err))));
      }
    } else {
      ctx.body = "Bad request";
      ctx.status = 400;
    }
  } else {
    ctx.body = "Not Authorized";
    ctx.status = 403;
  }
  await next();
}
