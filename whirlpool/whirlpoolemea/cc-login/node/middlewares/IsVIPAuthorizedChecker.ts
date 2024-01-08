import { PARecord } from "../typings/MasterData";
import { TradePolicy } from "../typings/TradePolicy";
import { VIPEntityFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { isValid } from "../utils/functions";

export async function IsVIPAuthorizedChecker(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  try {
    if (!ctx.state.trustVIP) {
      const cookies = ctx.headers?.cookie?.split(";");
      if (isSessionTokenInCookies(cookies)) {
        const session = await ctx.clients.AuthUser.getSession(cookies!);
        if (isValid(session?.data?.namespaces?.public?.accessCode?.value) && ctx.state.tradePolicyInfo?.name == TradePolicy.VIP) {
          ctx.state.llCustomLog!.partnerCode = session?.data?.namespaces?.public?.accessCode?.value;
          await isValidAccessCode(ctx, session!.data!.namespaces!.public!.accessCode!.value);
          ctx.status = 200;
          ctx.body = "OK";
        } else {
          ctx.cookies.set("vtex_session");
          ctx.cookies.set("vtex_segment");
          ctx.state.llLogger.error({ status: 403, message: "Not a valid accessCode" });
          ctx.status = 403;
          ctx.body = "Access denied";
        }
      } else {
        ctx.state.llLogger.error({ status: 403, message: "Not a valid session cookie" });
        ctx.status = 403;
        ctx.body = "Access denied";
      }
    } else {
      ctx.status = 200;
      ctx.body = "OK";
    }
  } catch (err) {
    ctx.cookies.set("vtex_session");
    ctx.cookies.set("vtex_segment");
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = isValid(err.code) ? err.code : 500;
    ctx.body = isValid(err.msg) ? err.msg : "Internal Server Error";
  }
  await next();
}

const isSessionTokenInCookies = (cookies: string[] | undefined): boolean => {
  return cookies ? cookies?.some(cookie => cookie.trim().startsWith("vtex_session=")) : false;
}

async function isValidAccessCode(ctx: Context, accessCode: string): Promise<PARecord> {
  return new Promise<PARecord>((resolve, reject) => {
    searchDocuments(ctx, ctx.state.appSettings.VIP!.recordsMDName!, VIPEntityFields, "accessCode=" + accessCode + " AND status=true", { page: 1, pageSize: 100 }, [])
      .then(res => {
        if (res.length > 0) {
          resolve(res[0]);
        } else {
          reject({ code: 403, msg: "No VIP Company correctly registered with this accessCode" });
        }
      })
      .catch(err => reject(err));
  })
}
