import { CLRecord } from "../typings/MasterData";
import { AuthHash } from "../typings/UserAuthentication";
import { TradePolicy } from "../typings/TradePolicy";
import { CLEntityName, EPPEntityFields } from "../utils/constants";
import { createDocument, updatePartialDocument, searchDocuments } from "../utils/documentCRUD";
import { isValid } from "../utils/functions";

export async function AdditionalSignUpOperations(ctx: Context, next: () => Promise<any>) {
  try {
    if (ctx.state.authFlow == AuthHash.SIGNUP) {
      let user: CLRecord = {
        firstName: ctx.state.req!.name,
        lastName: ctx.state.req!.surname,
        isNewsletterOptIn: ctx.state.req!.optin,
        userType: isValid(ctx.state.tradePolicyInfo?.name) ? ctx.state.tradePolicyInfo!.name as string : null,
        partnerCode: isValid(ctx.state.partner?.accessCode) ? ctx.state.partner!.accessCode as string : null,
        userId: ctx.state.userId,
        clockNumber: isValid(ctx.state.employee?.clockNumber) ? ctx.state.employee!.clockNumber as string : null,
        hrNumber: isValid(ctx.state.employee?.hrNumber) ? ctx.state.employee!.hrNumber as string : null,
      }
      if (ctx.state.tradePolicyInfo!.name == TradePolicy.EPP) {
        let employeeId = await getEPPRecordId(ctx, ctx.state.req!.id!);
        await updatePartialDocument(ctx, ctx.state.appSettings.EPP!.recordsMDName!, employeeId, { email: ctx.state.req!.email });
      } else {  // If the tradepolicy is FF or VIP
        if (ctx.state.invitation || ctx.state.vipInvitation) {
          ctx.state.userActivationDate = new Date().toISOString();
          user.activationDate = ctx.state.userActivationDate;
          user.invitingUser = ctx.state.invitation ? ctx.state.invitation!.invitingUser : ctx.state.vipInvitation!.invitingUser;
        }
      }
      if (!ctx.state.accountWithoutPassword) {
        user.email = ctx.state.req!.email;
        await createDocument(ctx, CLEntityName, user);
      } else {
        await updatePartialDocument(ctx, CLEntityName, ctx.state.userData!.id!, user);
      }
    }
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getEPPRecordId(ctx: Context, employeeId: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    searchDocuments(ctx, ctx.state.appSettings.EPP!.recordsMDName!, EPPEntityFields, "clockNumber=" + employeeId + " OR hrNumber=" + employeeId, { page: 1, pageSize: 100 }, [])
      .then((res: any[]) => {
        if (res.length > 0) {
          resolve(res[0].id);
        } else {
          reject({ code: 403, msg: "Forbidden Access" });
        }
      })
      .catch(err => reject(err));
  })
}
