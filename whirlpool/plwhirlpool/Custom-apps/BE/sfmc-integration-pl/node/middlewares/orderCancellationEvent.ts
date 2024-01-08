import { CustomLogger } from "../utils/Logger";
import { createOrCancelOrder } from "./triggerCreateOrCancelOrder";
export async function cancelOrderEvent(ctx: StatusChangeContext, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    console.log(ctx.body);
    const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
    let servicesName = appSettings.servicesName;
    let baseURL = appSettings.baseURL;
    process.env.SFMC = JSON.stringify(appSettings);
    let tokenCredential = {
      grant_type: appSettings.grantType,
      client_id: appSettings.clientId,
      client_secret: appSettings.clientSecret
    }
    await createOrCancelOrder(ctx, servicesName, appSettings.orderDetailsKeyConf, appSettings.emailTriggerKeyCanc, 0, ctx.body.orderId, tokenCredential, baseURL);

  } catch (err) {
    ctx.vtex.logger.error("Cancel " + ctx.body.orderId + " - app settings: " + err.response?.data?.message != undefined ? err.response.data.message : "Internal Server Error");
  }
  await next()
}
