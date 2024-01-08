import { OrderDetails } from "../typings/types";
import { routeToLabel, sendAlert, stringify } from "../utils/functions";
import { orderDetailsMapper } from "../utils/mapper";

export async function sendOrderDetails(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  try {
    let orderDetails: OrderDetails = orderDetailsMapper(ctx.state.orderData, ctx, ctx.state.coupons!, ctx.state.premiumProducts!, ctx.state.skuContexts!, ctx.state.skuImages!);
    let templateKey = ctx.state.sfmcData?.orderDetailsKey.find(t => t.key?.toLowerCase() == ctx.state.locale?.toLowerCase())?.value;
    let res = await ctx.clients.SFMCRest.sendOrderDetails(orderDetails, templateKey!, ctx.state.accessToken!);
    ctx.state.logger.info(label + res.message);
    await next();
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}
