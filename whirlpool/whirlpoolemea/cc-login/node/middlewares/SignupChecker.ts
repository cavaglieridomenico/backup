import { EMRecord, FFRecord, PARecord } from "../typings/MasterData";
import { TradePolicy } from "../typings/TradePolicy";
import { AuthHash, UserAuthentication } from "../typings/UserAuthentication";
import { CLEntityFields, CLEntityName, EPPEntityFields, FFIEntityFields, VIPEntityFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { isBoolean, isValid } from "../utils/functions";
//nel caso non mi arrivi la company password devo controllare la session, nel caso ci sia va avanti anzi ctx.clients.session.getSession(ctx.vtex.sessionToken)

export async function SignupChecker(ctx: Context, next: () => Promise<any>) {
  try {
    if (isValidSignUpData(ctx.state.req)) {
      ctx.state.llCustomLog!.email = ctx.state.req!.email!;
      let res = await isRegisteredUser(ctx, ctx.state.req!);
      ctx.state.accountWithoutPassword = res.accountWithoutPassword;
      if (res.accountWithoutPassword) {
        ctx.state.userData = res.data;
      }
      switch (ctx.state.tradePolicyInfo!.name) {
        case TradePolicy.EPP:
          ctx.state.employee = await canRegisterInEPP(ctx, ctx.state.req!);
          ctx.state.llCustomLog!.clockNumber = ctx.state.employee!.clockNumber!;
          ctx.state.llCustomLog!.hrNumber = ctx.state.employee!.hrNumber!;
          break;
        case TradePolicy.FF:
          ctx.state.invitation = await canRegisterInFF(ctx, ctx.state.req!);
          ctx.state.llCustomLog!.invitingUser = ctx.state.invitation!.invitingUser;
          break;
        case TradePolicy.VIP:
          ctx.state.llCustomLog!.partnerCode = ctx.state.req?.accessCode;
          ctx.state.partner = await canRegisterInVIP(ctx, ctx.state.req!);
      }
      ctx.state.authFlow = AuthHash.SIGNUP;
      await next();
    } else {

      ctx.state.llLogger.error({ status: 400, message: "Bad request: missing value for some registration fields (name, surname, optin, locale)" });
      ctx.status = 400;
      ctx.body = "Bad Request";
    }
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Internal Server Error";
  }
}

function isValidSignUpData(payload: UserAuthentication | undefined): boolean {
  return isValid(payload?.email) && isValid(payload?.name) && isValid(payload?.surname) && isBoolean(payload?.optin) && isValid(payload?.locale); // no need to check tradePolicy since it is checked in the previous mdlware
}

async function isRegisteredUser(ctx: Context, customerData: UserAuthentication): Promise<any> {
  return new Promise<Object>((resolve, reject) => {
    searchDocuments(ctx, CLEntityName, CLEntityFields, "email=" + customerData.email, { page: 1, pageSize: 100 }, [])
      .then(res => {
        if (res.length > 0) {
          // if (isValid(res[0].userId)) {
          //   reject({ code: 409, msg: "Email already used" });
          // } else {

          resolve({ accountWithoutPassword: true, data: res[0] })
          // }
        } else {
          resolve({ accountWithoutPassword: false });
        }
      })
      .catch(err => reject(err));
  })
}

async function canRegisterInEPP(ctx: Context, customerData: UserAuthentication): Promise<EMRecord> {
  let code = customerData.surname!.substring(0, 2).toLocaleLowerCase();
  return new Promise<EMRecord>((resolve, reject) => {
    searchDocuments(ctx, ctx.state.appSettings.EPP!.recordsMDName!, EPPEntityFields, "(clockNumber=" + customerData.id + " OR hrNumber=" + customerData.id + ") AND integrityCode=" + code + " AND status=true", { page: 1, pageSize: 100 }, [])
      .then(res => {
        if (res.length > 0) {
          if (!isValid(res[0].email)) {
            resolve(res[0]);
          }
          else {
            ctx.state.llLogger.error({ status: 403, message: "EPP User with identification number: " + customerData.id + " already registered with email: " + res[0].email });
            reject({ code: 403, msg: "Employee code already registered" });
          }
        } else {
          searchDocuments(ctx, ctx.state.appSettings.EPP!.recordsMDName!, EPPEntityFields, "(clockNumber=" + customerData.id + " OR hrNumber=" + customerData.id + ") AND status=true", { page: 1, pageSize: 100 }, [])
            .then(res1 => {
              if (res1.length > 0) {
                ctx.state.llLogger.error({ status: 403, message: "Incorrect integrity code: " + code });
                reject({ code: 403, msg: "Incorrect surname" });
              }
              else {
                ctx.state.llLogger.error({ status: 403, message: "Incorrect employee code: " + customerData.id });
                reject({ code: 403, msg: "Incorrect employee code" });
              }
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  })
}

async function canRegisterInFF(ctx: Context, customerData: UserAuthentication): Promise<FFRecord> {
  return new Promise<FFRecord>((resolve, reject) => {
    searchDocuments(ctx, ctx.state.appSettings.FF!.recordsMDName!, FFIEntityFields, "invitedUser=" + customerData.email, { page: 1, pageSize: 100 }, [])
      .then((res: FFRecord[]) => {
        if (res.length > 0 && (!isValid(res[0].cluster) || res[0].cluster == TradePolicy.FF)) {
          if (!isValid(res[0].activationDate) && Date.now() < Date.parse(res[0].expirationDate)) {
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

async function canRegisterInVIP(ctx: Context, customerData: UserAuthentication): Promise<PARecord> {

  return new Promise<PARecord>((resolve, reject) => {
    if (isValid(customerData.accessCode)) {
      searchDocuments(ctx, ctx.state.appSettings.VIP!.recordsMDName!, VIPEntityFields, "accessCode=" + customerData.accessCode + " AND status=true", { page: 1, pageSize: 100 }, [])
        .then((res: PARecord[]) => {
          if (res.length > 0) {
            if (customerData.companyPassword && res.some((el) => el.companyPassword == customerData.companyPassword)) {
              if (res[0].accessCode == ctx.state.appSettings.VIP?.invitationToken) {
                searchDocuments(ctx, ctx.state.appSettings.FF!.recordsMDName!, FFIEntityFields, "invitedUser=" + customerData.email, { page: 1, pageSize: 100 }, [])
                  .then((res1: FFRecord[]) => {
                    if (res1.length > 0 && res1[0].cluster == TradePolicy.VIP) {
                      if (!isValid(res1[0].activationDate) && Date.now() < Date.parse(res1[0].expirationDate)) {
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
              ctx.clients.session.getSession(ctx.vtex.sessionToken!, ["public.accessCode"])
                .then((data) => {
                  if (data?.sessionData?.namespaces?.public?.accessCode) {
                    data.sessionData.namespaces.public.accessCode.value == customerData.accessCode
                      ? resolve(res[0])
                      : reject({ code: 403, msg: "No session for VIP User" });
                  } else
                    reject({ code: 403, msg: "VIP Company Password is wrong or password not present" });

                })
            }
          } else {
            reject({ code: 403, msg: "No VIP Company correctly registered with this accessCode" });
          }
        })
        .catch(err => reject(err));
    } else {
      reject({ code: 403, msg: "No VIP Company correctly registered with this accessCode" });
    }
  });
}
