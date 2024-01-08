import { isValid } from "../utils/functions";

const FormData = require('form-data')

export async function ValidateAccountCredentials(ctx: Context, next: () => Promise<any>) {
  try {
    let validateCredentialsForm = new FormData();
    validateCredentialsForm.append("login", ctx.state.req!.email);
    validateCredentialsForm.append("password", ctx.state.req!.password);
    validateCredentialsForm.append("recaptcha", "");
    validateCredentialsForm.append("fingerprint", "");
    ctx.state.cookie = (await ctx.clients.AuthUser.validateCredentials(validateCredentialsForm, ctx.state.cookie as string[])).headers["set-cookie"];
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 401, message: err.msg ? err.msg : err.data || "Invalid Credentials" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Invalid Credentials";
  }
}
