import { isValid } from "../utils/functions";

export async function InitVIPSession(ctx: Context, next: () => Promise<any>) {
  try {
    const sessionToken = ctx.cookies.get("vtex_session");
    if (isValid(ctx.state.partner?.accessCode)) {
      const vipAcccessCode = ctx.state.partner!.accessCode;
      const authorizedSessionCookies = await ctx.clients.AuthUser.authorizeVIPSessionCookies(sessionToken, vipAcccessCode);
      ctx.cookies.set("vtex_session", authorizedSessionCookies.data.sessionToken);
      ctx.cookies.set("vtex_segment", authorizedSessionCookies.data.segmentToken);
    }
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Internal Server Error";
  }
}
