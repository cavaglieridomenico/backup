import { CLRecord, EMRecord, FFRecord, PARecord } from "../typings/MasterData";
import { TradePolicy } from "../typings/TradePolicy";
import { UserAuthentication } from "../typings/UserAuthentication";
import { CLEntityFields, CLEntityName, EPPEntityFields, FFIEntityFields, VIPEntityFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { isValid } from "../utils/functions";

export async function LoginChecker(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.llCustomLog!.email = ctx.state.req!.email!;
    if (isValidLoginData(ctx.state.req)) {
      ctx.state.userData = await isRegisteredUser(ctx, ctx.state.req!);
      ctx.state.userId = ctx.state.userData.userId!;
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
      await next();
    } else {
      ctx.state.llLogger.error({ status: 400, message: "Bad Request: missing email or password" });
      ctx.status = 400;
      ctx.body = "Bad Request"
    }
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Internal Server Error";
  }
}

function isValidLoginData(payload: UserAuthentication | undefined): boolean {
  return isValid(payload?.email) && isValid(payload?.password); // no need to check tradePolicy since it is checked in the previous mdlware
}

export async function isConsistentRequest(hostTradePolicy: string, userTradePolicy: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (hostTradePolicy == userTradePolicy || (hostTradePolicy == TradePolicy.O2P && userTradePolicy == null)) {
      resolve(true);
    } else {
      reject({ code: 403, msg: "User registered as: " + (isValid(userTradePolicy) ? userTradePolicy : "O2P") + " is trying to access from domain: " + hostTradePolicy });
    }
  })
}

export async function isRegisteredUser(ctx: Context, customerData: UserAuthentication): Promise<CLRecord> {
  return new Promise<CLRecord>((resolve, reject) => {
    searchDocuments(ctx, CLEntityName, CLEntityFields, "email=" + customerData.email + " AND userId is not null", { page: 1, pageSize: 100 }, [])
      .then(res => {
        if (res.length > 0) {
          resolve(res[0]);
        } else {
          reject({ code: 404, msg: "Email not found" });
        }
      })
      .catch(err => reject(err));
  })
}

export async function canLoginInEPP(ctx: Context, customerData: UserAuthentication): Promise<EMRecord> {
  return new Promise<EMRecord>((resolve, reject) => {
    searchDocuments(ctx, ctx.state.appSettings.EPP!.recordsMDName!, EPPEntityFields, "email=" + customerData.email + " AND status=true", { page: 1, pageSize: 100 }, [])
      .then(res => {
        if (res.length > 0) {
          resolve(res[0]);
        } else {
          reject({ code: 403, msg: "The email provided is not associated with a valid employee code" });
        }
      })
      .catch(err => reject(err));
  })
}

export async function canLoginInFF(ctx: Context, customerData: UserAuthentication): Promise<FFRecord> {
  return new Promise<FFRecord>((resolve, reject) => {
    searchDocuments(ctx, ctx.state.appSettings.FF!.recordsMDName!, FFIEntityFields, "invitedUser=" + customerData.email, { page: 1, pageSize: 100 }, [])
      .then((res: FFRecord[]) => {
        if (res.length > 0 && (!isValid(res[0].cluster) || res[0].cluster == TradePolicy.FF)) {
          if (Date.now() < Date.parse(res[0].expirationDate)) { // removed condition isValid(res[0].activationDate) because it would block the access to the re-invited users
            resolve(res[0]);
          } else {
            reject({ code: 403, msg: "FF Invitation expired" });
          }
        } else {
          reject({ code: 403, msg: "The email provided is not associated with a valid FF invitation" });
        }
      })
      .catch(err => reject(err));
  })
}

export async function canLoginInVIP(ctx: Context, customerData: UserAuthentication, accessCode: string): Promise<PARecord> {
  return new Promise<PARecord>((resolve, reject) => {
    searchDocuments(ctx, ctx.state.appSettings.VIP!.recordsMDName!, VIPEntityFields, "accessCode=" + accessCode + " AND status=true", { page: 1, pageSize: 100 }, [])
      .then((res: PARecord[]) => {
        if (res.length > 0) {
          if (res[0].accessCode == ctx.state.appSettings.VIP?.invitationToken) {
            searchDocuments(ctx, ctx.state.appSettings.FF!.recordsMDName!, FFIEntityFields, "invitedUser=" + customerData.email, { page: 1, pageSize: 100 }, [])
              .then((res1: FFRecord[]) => {
                if (res1.length > 0 && res1[0].cluster == TradePolicy.VIP) {
                  if (Date.now() < Date.parse(res1[0].expirationDate)) {
                    ctx.state.vipInvitation = res1[0];
                    ctx.state.llCustomLog!.invitingUser = ctx.state.vipInvitation!.invitingUser;
                    resolve(res[0]);
                  } else {
                    reject({ code: 403, msg: "VIP Invitation expired" });
                  }
                } else {
                  reject({ code: 403, msg: "The email provided is not associated with a valid VIP invitation" });
                }
              })
              .catch(err => reject(err));
          } else {
            resolve(res[0]);
          }
        } else {
          reject({ code: 403, msg: "No VIP Company correctly registered with this accessCode" });
        }
      })
      .catch(err => reject(err));
  })
}
