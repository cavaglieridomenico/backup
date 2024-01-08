import { isValid } from "../utils/functions";

export async function InitVIPAuthorization(ctx: Context, next: () => Promise<any>) {
  try {
    const sessionToken = ctx.cookies.get("vtex_session");
    console.log(sessionToken, "TOKEN");

    const vipAcccessCode = ctx.state.partner!.accessCode;
    const authorizedSessionCookies = await ctx.clients.AuthUser.authorizeVIPSessionCookies(sessionToken, vipAcccessCode);
    console.log(vipAcccessCode, "ACCESS");
    // If the cookies are correctly updated and authorized, the session cookies are inserted in the response
    ctx.cookies.set("vtex_session", authorizedSessionCookies.data.sessionToken);
    ctx.cookies.set("vtex_segment", authorizedSessionCookies.data.segmentToken);
    // An 200 status code is returned
    ctx.status = 200;
    ctx.body = {
      userCompany: ctx.state.partner?.name
    };
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Internal Server Error";
  }
}
