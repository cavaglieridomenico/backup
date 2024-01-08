import { checkUserId, isValid } from "../utils/functions";
const FormData = require('form-data')

export async function SetAccountPassword(ctx: Context, next: () => Promise<any>) {
  try {
    let setPasswordForm = new FormData();
    setPasswordForm.append("login", ctx.state.req!.email);
    setPasswordForm.append("newPassword", ctx.state.req!.password);
    setPasswordForm.append("currentPassword", "");
    setPasswordForm.append("accesskey", ctx.state.req!.accessKey);
    setPasswordForm.append("recaptcha", "");
    let res = await ctx.clients.AuthUser.setPassword(setPasswordForm, ctx.state.cookie as string);
    ctx.state.cookie = res.headers["set-cookie"];
    ctx.state.userId = isValid(res.data.userId) ? res.data.userId : ctx.state.userData?.userId;
    await checkUserId(ctx.state.userId);
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 401, message: err.msg ? err.msg : err.data || "Invalid Credentials" });
    ctx.status = err.code ? err.code : 401;
    ctx.body = err.msg ? err.msg : "Invalid Credentials";
  }
}
