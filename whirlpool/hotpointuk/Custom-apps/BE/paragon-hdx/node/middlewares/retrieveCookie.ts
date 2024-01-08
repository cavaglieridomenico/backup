import { CustomLogger } from "../utils/Logger";
import { routeToLabel } from "../utils/functions";
export async function retrieveCookie(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    ctx.state.CheckoutOrderFormOwnershipCookie = ctx.cookies.get("CheckoutOrderFormOwnership")
    await next()
  } catch (err) {
    let msg = label + err.msg;
    ctx.vtex.logger.error(msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

