import { CustomLogger } from "../utils/CustomLogger"
export async function retrieveCookie(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    ctx.state.CheckoutOrderFormOwnershipCookie = ctx.cookies.get("CheckoutOrderFormOwnership") as string
    console.log("cookie in retrieveCookie: ", ctx.state.CheckoutOrderFormOwnershipCookie, "oth;", ctx.get("CheckoutOrderFormOwnership"));
    await next()
  } catch (err) {
    ctx.vtex.logger.error(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

