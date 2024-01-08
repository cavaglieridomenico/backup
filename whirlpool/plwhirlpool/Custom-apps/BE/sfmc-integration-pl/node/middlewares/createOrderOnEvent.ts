//@ts-ignore
//@ts-nocheck

import { mapErrorMessage, sendAlert } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";
import { createOrCancelOrder } from "./triggerCreateOrCancelOrder";

export async function createOrderOnEvent(ctx: StatusChangeContext, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
    let servicesName = appSettings.servicesName;
    let baseURL = appSettings.baseURL;
    process.env.SFMC = JSON.stringify(appSettings);
    let tokenCredential = {};
    tokenCredential["grant_type"] = JSON.parse(process.env.SFMC + "").grantType;
    tokenCredential["client_id"] = JSON.parse(process.env.SFMC + "").clientId;
    tokenCredential["client_secret"] = JSON.parse(process.env.SFMC + "").clientSecret;
    createOrder(ctx, servicesName, JSON.parse(process.env.SFMC + "").orderDetailsKeyConf, JSON.parse(process.env.SFMC + "").emailTriggerKeyConf, 1, ctx.body.orderId, tokenCredential, baseURL, 0)
      .then(res => {
        ctx.vtex.logger.info(res.message);
      })
      .catch(err => {
        sendAlert(ctx, `Create order ${ctx.body.orderId} - VTEX ERROR`, `Create order ${ctx.body.orderId}: ${mapErrorMessage(err)}`)
        ctx.vtex.logger.error(err.message != undefined ? err.message : "Create order " + ctx.body.orderId + ": Internal Server Error");
      });
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    sendAlert(ctx, `Create order ${ctx.body.orderId} - VTEX ERROR`, `Create order ${ctx.body.orderId}: ${mapErrorMessage(err)}`)
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
    ctx.vtex.logger.error("Create " + ctx.body.orderId + " - app settings: " + err.response?.data?.message != undefined ? err.response.data.message : "Internal Server Error");
  }
  await next()
}

async function createOrder(ctx: Context, servicesName: string, orderDetailsKey: number, emailTriggerKery: number, event: number, orderId: string, tokenCredential: Object, baseURL: string, retry: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    createOrCancelOrder(ctx, servicesName, orderDetailsKey, emailTriggerKery, event, orderId, tokenCredential, baseURL)
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry <= 10) {
          await wait(5000);
          retry++;
          return createOrder(ctx, servicesName, orderDetailsKey, emailTriggerKery, event, orderId, tokenCredential, baseURL, retry).catch(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          //console.log(err)
          reject(err);
        }
      });
  });
}

async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}
