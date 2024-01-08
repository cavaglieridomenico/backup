import { isValid } from "../utils/functions";
import { AucsmCookie, UserAuthentication } from "../typings/UserAuthentication";
import { AES256Decode, base64Decode } from "../utils/cryptography";
import { TradePolicyInfo } from "../typings/TradePolicy";

export async function SetPasswordChecker(ctx: Context, next: () => Promise<any>) {
  try {
    if (isValidSetPassord(ctx.state.req)) {
      let aucsmCookie: AucsmCookie = JSON.parse(base64Decode(AES256Decode(ctx.cookies.get("_aucsm")!)));
      let vssCookie = ctx.cookies.get("_vss");
      await isConsistentRequest(ctx.host, ctx.state.tradePolicyInfo, vssCookie, aucsmCookie);
      ctx.state.cookie = buildNewHeader(ctx);
      ctx.state.req!.email = aucsmCookie.req.email;
      ctx.state.req!.name = aucsmCookie.req.name;
      ctx.state.req!.surname = aucsmCookie.req.surname;
      ctx.state.req!.optin = aucsmCookie.req.optin;
      ctx.state.req!.id = aucsmCookie.req.id;
      ctx.state.req!.locale = aucsmCookie.req.locale;
      ctx.state.invitation = aucsmCookie.invitation;
      ctx.state.employee = aucsmCookie.employee;
      ctx.state.partner = aucsmCookie.partner;
      ctx.state.vipInvitation = aucsmCookie.vipInvitation;
      ctx.state.authFlow = aucsmCookie.authFlow;
      ctx.state.userData = aucsmCookie.userData;
      ctx.state.accountWithoutPassword = aucsmCookie.accountWithoutPassword;
      ctx.state.llCustomLog!.email = ctx.state.req!.email;
      ctx.state.llCustomLog!.hrNumber = isValid(ctx.state.employee?.hrNumber) ? ctx.state.employee!.hrNumber : null;
      ctx.state.llCustomLog!.clockNumber = isValid(ctx.state.employee?.clockNumber) ? ctx.state.employee!.clockNumber : null;
      ctx.state.llCustomLog!.partnerCode = isValid(ctx.state.partner?.accessCode) ?  ctx.state.partner!.accessCode : null;
      ctx.state.llCustomLog!.invitingUser = isValid(ctx.state.invitation?.invitingUser) ? ctx.state.invitation!.invitingUser : (isValid(ctx.state.vipInvitation?.invitingUser) ? ctx.state.vipInvitation!.invitingUser : null);
      await next();
    } else {
      ctx.status = 400;
      ctx.body = "Bad Request";
    }
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

function isValidSetPassord(payload: UserAuthentication | undefined): boolean {
  return isValid(payload?.password) && isValid(payload?.accessKey);
}

async function isConsistentRequest(host: string, tradePolicyInfo: TradePolicyInfo | undefined, vss: string | undefined, aucsm: AucsmCookie): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (host == aucsm.hostname && tradePolicyInfo?.name == aucsm.tradePolicyInfo.name && aucsm.vss == vss) {
      resolve(true);
    } else {
      reject({ code: 403, msg: "Invalid cookies or user's tradepolicy" });
    }
  })
}

function buildNewHeader(ctx: Context): string {
  let vss = ctx.cookies.get("_vss");
  let aucsm = ctx.cookies.get("_aucsm");
  return "_aucsm=" + aucsm + ";_vss=" + vss + ";";
}
