//@ts-ignore
//@ts-nocheck

import { createOrCancelOrder } from "./triggerCreateOrCancelOrder";
import { CustomLogger } from "../utils/Logger";
import { enabledCredentials } from "../utils/constants";

export async function cancelOrder(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  ctx.set('Cache-Control', 'no-store');
  let credentials: [] = enabledCredentials[ctx.vtex.account];
  if (credentials.find(f => f.key == ctx.req.headers[("X-VTEX-API-AppKey").toLowerCase()] && f.token == ctx.req.headers[("X-VTEX-API-AppToken").toLowerCase()]) != undefined) {
    if (ctx.query.id != undefined && ctx.query.id != null && ctx.query.id != "") {
      try {
        const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
        let servicesName = appSettings.servicesName;
        let baseURL = appSettings.baseURL;
        process.env.SFMC = JSON.stringify(appSettings);
        let tokenCredential = {};
        tokenCredential["grant_type"] = JSON.parse(process.env.SFMC + "").grantType;
        tokenCredential["client_id"] = JSON.parse(process.env.SFMC + "").clientId;
        tokenCredential["client_secret"] = JSON.parse(process.env.SFMC + "").clientSecret;
        let res = await createOrCancelOrder(ctx, servicesName, JSON.parse(process.env.SFMC + "").orderDetailsKeyConf, JSON.parse(process.env.SFMC + "").emailTriggerKeyCanc, 0, ctx.query.id, tokenCredential, baseURL);
        ctx.status = 200;
        ctx.body = "OK";
        ctx.vtex.logger.info(res.message);
      } catch (e) {
        ctx.status = 500;
        ctx.body = "Internal Server Error";
        if (e.response == undefined) {
          ctx.vtex.logger.error(e.message != undefined ? e.message : "Cancel " + ctx.query.id + ": Internal Server Error");
        } else {
          ctx.vtex.logger.error("Cancel " + ctx.query.id + " - app settings: " + e.response?.data?.message != undefined ? e.response?.data?.message : "Internal Server Error");
        }
      }
    } else {
      ctx.status = 400;
      ctx.body = "Empty (or bad) query param";
    }
  } else {
    ctx.body = "Not Authorized";
    ctx.status = 403;
  }
  await next()
}
