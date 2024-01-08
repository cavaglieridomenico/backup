import { OrderConfCancTemplate } from "../typings/types";
import { routeToLabel, sendAlert, stringify } from "../utils/functions";
import { confCancEmailMapper } from "../utils/mapper";

export async function triggerCancellationEmail(ctx: Context, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  try {
    let payload: OrderConfCancTemplate = await confCancEmailMapper(ctx);
    let templateKey = ctx.state.sfmcData?.cancellationEmailKey.find(t => t.key?.toLowerCase() == ctx.state.locale?.toLowerCase())?.value;
    let res = await ctx.clients.SFMCRest.triggerEmail(payload, templateKey!, ctx.state.accessToken!);
    ctx.state.logger.info(label + res.message);
    ctx.status = 200;
    ctx.body = "OK";
    await next();
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
