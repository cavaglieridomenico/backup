import { PARecord } from "../typings/MasterData";
import { TradePolicy } from "../typings/TradePolicy";
import { UserAuthentication } from "../typings/UserAuthentication";
import { CLEntityFields, CLEntityName, VIPEntityFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { isValid } from "../utils/functions";

export async function VIPAuthorizationChecker(ctx: Context, next: () => Promise<any>) {
  try {
    // if (!ctx.state.trustVIP) {
    ctx.state.llCustomLog!.partnerCode = ctx.state.req!.accessCode!;
    if (ctx.state.req?.email && !ctx.state.req?.accessCode) {
      let vipUser = await searchDocuments(ctx, CLEntityName, CLEntityFields, "email=" + ctx.state.req?.email, { page: 1, pageSize: 5 }, [])
      if (vipUser.length > 0 && vipUser[0].userType.toLowerCase() == "vip")
        ctx.state.req.accessCode = vipUser[0].partnerCode
    }
    if (isValidVIPAuthorizationData(ctx.state.req) && ctx.state.tradePolicyInfo?.name == TradePolicy.VIP) {
      await isVIPUserInvited(ctx, ctx.state.req!);
      const vipInfo = await isVIPUserRegistered(ctx, ctx.state.req!);
      ctx.state.partner = vipInfo;
      await next()
    } else {
      ctx.state.llLogger.error({ status: 403, message: "Not a valid accessCode" });
      ctx.status = 403;
      ctx.body = "Access denied";
    }
    // } else {
    //   ctx.status = 200;
    //   ctx.body = "OK";
    // }
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Internal Server Error";
  }
}

function isValidVIPAuthorizationData(payload: UserAuthentication | undefined): boolean {
  return isValid(payload?.accessCode); // no need to check tradePolicy since it is checked in the previous mdlware
}

function isVIPUserInvited(ctx: Context, payload: UserAuthentication): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (payload.accessCode != ctx.state.appSettings.VIP?.invitationToken) {
      resolve(true);
    } else {
      reject({ code: 403, msg: "VIP invited, access denied" });
    }
  })
}

async function isVIPUserRegistered(ctx: Context, vipUserData: UserAuthentication): Promise<PARecord> {
  return new Promise<PARecord>((resolve, reject) => {
    // The Partner entity is used to store the infos about the VIP users
    searchDocuments(ctx, ctx.state.appSettings.VIP!.recordsMDName!, VIPEntityFields, "accessCode=" + vipUserData.accessCode + " AND status=true AND autologinEnabled=true", { page: 1, pageSize: 100 }, [])
      .then(res => {
        if (res.length > 0)
          resolve(res[0]);
        else {
          if (vipUserData.companyPassword)
            searchDocuments(ctx, ctx.state.appSettings.VIP!.recordsMDName!, VIPEntityFields, "companyPassword=" + vipUserData.companyPassword + " AND status=true" + " AND accessCode=" + vipUserData.accessCode, { page: 1, pageSize: 100 }, [])
              .then(res => {
                if (res.length > 0)
                  resolve(res[0])
                else
                  reject({ code: 403, msg: "No VIP Company matching with companyPassword && accessCode" });
              })
              .catch(err => reject(err));
          else
            reject({ code: 403, msg: "Autologin not enabled and no companyPassword passed" });
        }
      })
  })
}
