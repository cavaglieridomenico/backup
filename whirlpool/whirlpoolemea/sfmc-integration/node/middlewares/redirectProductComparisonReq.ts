import CoBody = require("co-body");
import { productComparisonServiceEndpoint } from "../utils/constants";
import { stringify } from "../utils/functions";

export async function redirectProductComparisonRequest(ctx: Context, next: () => Promise<any>) {
  try {
    if (ctx.state.appSettings.gcp?.redirectToWS && ctx.state.appSettings.gcp.wsName?.toLowerCase() != ctx.vtex.workspace) {
      ctx.state.productComparisonReq = await CoBody(ctx.req);
      ctx.body = await ctx.clients.VtexDevEnv.redirectPOSTRequestToWS(productComparisonServiceEndpoint, ctx.state.productComparisonReq);
      ctx.status = 200;
    } else {
      await next();
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
    ctx.state.logger.error(`Product comparison: ${err.message ? err.message : stringify(err)}`)
  }
}
