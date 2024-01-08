import { OrderConfCancTemplate } from "../typings/types";
import { isPresale, routeToLabel, sendAlert, stringify } from "../utils/functions";
import { confCancEmailMapper } from "../utils/mapper";

export async function triggerConfirmationEmail(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  try {
    let payload: OrderConfCancTemplate = await confCancEmailMapper(ctx);
    const { value: templateKey, alternateValue: presaleTemplateKey } = ctx.state.sfmcData?.confirmationEmailKey.find(t => t.key?.toLowerCase() == ctx.state.locale?.toLowerCase())!;
    let res = await ctx.clients.SFMCRest.triggerEmail(payload, isPresale(ctx.state.orderData) ? presaleTemplateKey! : templateKey!, ctx.state.accessToken!);
    ctx.state.logger.info(label + res.message);
    (ctx as Context).status = 200;
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
