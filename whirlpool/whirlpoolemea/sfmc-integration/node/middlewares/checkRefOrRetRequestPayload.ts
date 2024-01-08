import { getRequestPayload, isValidReturnOrRefundForm, routeToLabel, stringify } from "../utils/functions";

export async function checkRefOrRetRequestPayload(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.reqPayload = await getRequestPayload(ctx);
    if (isValidReturnOrRefundForm(ctx.state.reqPayload)) {
      await next();
    } else {
      ctx.status = 400;
      ctx.body = "Bad Request";
    }
  } catch (err) {
    let label = routeToLabel(ctx);
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(label + msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
