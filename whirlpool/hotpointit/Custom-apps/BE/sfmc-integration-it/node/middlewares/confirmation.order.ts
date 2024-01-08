//@ts-ignore
//@ts-nocheck

import { checkToken } from "./service";
import { CustomLogger } from "../utils/Logger";

export async function confirmationCreateOrder(
  ctx: Context,
  next: () => Promise<any>
) {
  ctx.vtex.logger = new CustomLogger(ctx);
  ctx.set('Cache-Control', 'no-store');
  if (ctx.query.id != undefined && ctx.query.id != null && ctx.query.id != "") {
    try {
      const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
      process.env.TEST = JSON.stringify(appSettings);
      let res = await checkToken(ctx, JSON.parse(process.env.TEST + "").key1Conf, JSON.parse(process.env.TEST + "").key2Conf, 1)
      ctx.status = res.status;
      ctx.body = res.message;
      ctx.vtex.logger.info(res.message);
    } catch (e) {
      if (e.response == undefined) {
        ctx.status = e.status;
        ctx.message = e.message;
        ctx.vtex.logger.error(e.message);
      } else {
        ctx.status = e?.response?.status;
        ctx.message = "Create " + ctx.query.id + " - app settings: " + e?.response?.data?.message;
        ctx.vtex.logger.error("Create " + ctx.query.id + " - app settings: " + e?.response?.data?.message);
      }
    }
  } else {
    ctx.status = 400;
    ctx.res.end("Empty (or bad) query param");
  }
  await next()
}
