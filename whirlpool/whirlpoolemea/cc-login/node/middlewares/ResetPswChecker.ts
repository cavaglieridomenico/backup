import { TradePolicy } from "../typings/TradePolicy";
import { AuthHash, UserAuthentication } from "../typings/UserAuthentication";
import { isValid } from "../utils/functions";
import { canLoginInEPP, canLoginInFF, canLoginInVIP, isConsistentRequest, isRegisteredUser } from "./LoginChecker";

export async function ResetPswChecker(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.llCustomLog!.email = ctx.state.req!.email!;
    if (isValidResetPswData(ctx.state.req)) {
      ctx.state.userData = await isRegisteredUser(ctx, ctx.state.req!);
      await isConsistentRequest(ctx.state.tradePolicyInfo!.name!, ctx.state.userData!.userType!);
      switch (ctx.state.tradePolicyInfo!.name) {
        case TradePolicy.EPP:
          ctx.state.employee = await canLoginInEPP(ctx, ctx.state.req!);
          ctx.state.llCustomLog!.clockNumber = ctx.state.employee!.clockNumber!;
          ctx.state.llCustomLog!.hrNumber = ctx.state.employee!.hrNumber!;
          break;
        case TradePolicy.FF:
          ctx.state.invitation = await canLoginInFF(ctx, ctx.state.req!);
          ctx.state.llCustomLog!.invitingUser = ctx.state.invitation!.invitingUser;
          break;
        case TradePolicy.VIP:
          ctx.state.llCustomLog!.partnerCode = ctx.state.userData!.partnerCode!;
          ctx.state.partner = await canLoginInVIP(ctx, ctx.state.req!, ctx.state.userData!.partnerCode!);
      }
      ctx.state.authFlow = AuthHash.RESETPSW;
      await next();
    } else {
      ctx.state.llLogger.error({ status: 400, message: "Bad request: missing email or locale" });
      ctx.status = 400;
      ctx.body = "Bad Request"
    }
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Internal Server Error";
  }
}

function isValidResetPswData(payload: UserAuthentication|undefined): boolean {
  return isValid(payload?.email) && isValid(payload?.locale); // no need to check tradePolicy since it is checked in the previous mdlware
}
