import { isValid, routeToLabel, stringify } from "../utils/functions";
import { returnEmailMapper } from "../utils/mapper";

export async function triggerReturnEmail(ctx: Context, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  try {
    let payload = returnEmailMapper(ctx.state.reqPayload);
    let locale = isValid(ctx.state.reqPayload.locale) ? ctx.state.reqPayload.locale as string : ctx.state.appSettings.vtex.defaultLocale5C;
    let templateKey = ctx.state.sfmcData?.returnEmailKey.find(t => t.key?.toLowerCase() == locale.toLowerCase())?.value;
    let res = await ctx.clients.SFMCRest.triggerEmail(payload, templateKey!, ctx.state.accessToken!);
    ctx.state.logger.info(label + res.message);
    ctx.status = 200;
    ctx.body = "OK";
    await next();
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(label + msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
