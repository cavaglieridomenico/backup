//@ts-ignore
//@ts-nocheck

import { mapErrorMessage, sendAlert } from "../utils/function";
import { CustomLogger } from "../utils/Logger";
import { checkTokenEvent } from "./service";

export async function someStates(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
    process.env.TEST = JSON.stringify(appSettings)
    let res = await checkTokenEvent(ctx, JSON.parse(process.env.TEST + "").key1Conf, JSON.parse(process.env.TEST + "").key2Conf, 1);
    ctx.status = res.status;
    ctx.body = res.message;
    ctx.vtex.logger.info(res.message);
  } catch (e) {
    sendAlert(ctx, `Create order ${ctx.body.orderId} - VTEX ERROR`, `Create order ${ctx.body.orderId}: ${mapErrorMessage(e)}`)
    if (e.response == undefined) {
      ctx.status = e.status;
      ctx.message = e.message;
      ctx.vtex.logger.error(e.message);
    } else {
      ctx.status = e?.response?.status;
      ctx.message = "Create " + ctx.body.orderId + " - app settings: " + e?.response?.data?.message;
      ctx.vtex.logger.error("Create " + ctx.body.orderId + " - app settings: " + e?.response?.data?.message);
    }
  }
  await next()
}
