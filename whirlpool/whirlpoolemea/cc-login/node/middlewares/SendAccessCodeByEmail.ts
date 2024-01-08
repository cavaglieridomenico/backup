const FormData = require('form-data')
import { AucsmCookie, AuthHash } from "../typings/UserAuthentication";
import { nineDotFiveMinutes } from "../utils/constants";
import { AES256Encode, base64Encode } from "../utils/cryptography";
import { parseCookie } from "../utils/functions";

export async function SendAccessCodeByEmail(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  try {
    let sendEmailForm = new FormData();
    sendEmailForm.append("email", ctx.state.req!.email);
    sendEmailForm.append("locale", ctx.state.req!.locale);
    sendEmailForm.append("recaptcha", "");
    await ctx.clients.AuthUser.sendEmail(sendEmailForm, ctx.state.cookie as string[])
    .then(res => {
      return res
    })
    .catch(err => {
      ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: JSON.stringify("Failed to send access code - ", err.msg ? err.msg : err.data) || "Internal Server Error" });
      
      return err
    });
    
    let cookieValue = "";
    (ctx.state.cookie as string[])?.forEach(c => {
      let parsedCookie = parseCookie(c, ctx);
      ctx.cookies.set(parsedCookie.name!, parsedCookie.value, {
        expires: parsedCookie.expiration,
        domain: ctx.host,//parsedCookie.domain,
        path: "/",//parsedCookie.path,
        /*secure: parsedCookie.secure,
        sameSite: parsedCookie.samesite,
        httpOnly: parsedCookie.httponly,*/
        overwrite: true
      });
      cookieValue = parsedCookie.value!;
    });
    let aucsmCookie: AucsmCookie = {
      req: ctx.state.req!,
      tradePolicyInfo: ctx.state.tradePolicyInfo!,
      hostname: ctx.host,
      employee: ctx.state.employee,
      vipInvitation: ctx.state.vipInvitation,
      partner: ctx.state.partner,
      invitation: ctx.state.invitation,
      authFlow: ctx.state.authFlow!,
      userData: ctx.state.userData,
      accountWithoutPassword: ctx.state.accountWithoutPassword,
      vss: cookieValue,
    }
    ctx.cookies.set("_aucsm", AES256Encode(base64Encode(JSON.stringify(aucsmCookie))), { maxAge: nineDotFiveMinutes, domain: ctx.host, path: "/",/*secure: true, httpOnly: true, sameSite: false,*/ overwrite: true });
    ctx.cookies.set(ctx.state.appSettings.authCookie!);
    ctx.state.authFlow == AuthHash.SIGNUP ?
      ctx.state.llLogger.info({ status: 200, message: "User is trying to complete a registration..." }) :
      ctx.state.llLogger.info({ status: 200, message: "User is trying to reset the password..." });
    ctx.status = 200;
    ctx.body = "OK"
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
