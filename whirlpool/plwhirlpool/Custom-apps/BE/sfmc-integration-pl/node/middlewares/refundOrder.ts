//@ts-ignore
//@ts-nocheck

import { triggerRefundOrReturnEmail } from "./triggerRefundOrReturnEmail";
import { json } from 'co-body'
import { CustomLogger } from "../utils/Logger";

export async function refundOrder(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  let product = {};
  let requestPayloadPromise = new Promise<any>((resolve, reject) => {
    json(ctx.req)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
  });
  let appSettings;
  let appSettingsPromise = new Promise<any>((resolve, reject) => {
    ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
  });
  try {
    let responses = await Promise.all([requestPayloadPromise, appSettingsPromise]);
    product = responses[0];
    appSettings = responses[1];
    process.env.SFMC = JSON.stringify(appSettings);
    let tokenCredential = {};
    tokenCredential["grant_type"] = JSON.parse(process.env.SFMC + "").grantType;
    tokenCredential["client_id"] = JSON.parse(process.env.SFMC + "").clientId;
    tokenCredential["client_secret"] = JSON.parse(process.env.SFMC + "").clientSecret;
    let res = await triggerRefundOrReturnEmail(ctx, JSON.parse(process.env.SFMC + "").refundKey, product, 1, tokenCredential);
    ctx.status = 200;
    ctx.vtex.logger.info("OK");
    ctx.body = "OK";
    ctx.vtex.logger.info(res.message);
  } catch (e) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
    if (e.response == undefined) {
      ctx.vtex.logger.error(e.message != undefined ? e.message : "Refund " + product.ContactAttributes?.SubscriberAttributes?.OrderNumber + ": Internal Server Error");
    } else {
      ctx.vtex.logger.error("Refund " + product.ContactAttributes?.SubscriberAttributes?.OrderNumber + " - app settings: " + e.response?.data?.message != undefined ? e.response?.data?.message : "Internal Server Error");
    }
  }
  await next()
}
