const FormData = require('form-data')

export async function InitLogin(ctx: Context, next: () => Promise<any>) {
  try {
    let startLoginForm = new FormData();
    startLoginForm.append("accountName", ctx.vtex.account);
    startLoginForm.append("scope", ctx.vtex.account);
    startLoginForm.append("returnUrl", "https://" + ctx.host + "/");
    startLoginForm.append("callbackUrl", "https://" + ctx.host + "/api/vtexid/oauth/finish?popup=false");
    startLoginForm.append("user", ctx.state.req!.email);
    startLoginForm.append("fingerprint", "");
    ctx.state.cookie = (await ctx.clients.AuthUser.startLogin(startLoginForm)).headers["set-cookie"];
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
