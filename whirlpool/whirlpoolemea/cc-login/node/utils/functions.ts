import { maxRetry, maxWaitTime } from "./constants";
import { CCTradePolicy, TradePolicy } from "../typings/TradePolicy"
import { CookieObj } from "../typings/UserAuthentication";
import { SiteInfo } from "../typings/configs";

export function isValid(field: any): boolean {
  return field != undefined && field != null && field != "null" && field != "" && field != " " && field != !"-" && field != "_";
}

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

export function isValidCCTradePolicy(tradePolicy: string): boolean {
  let ret = false;
  if (isValid(tradePolicy)) {
    ret = (tradePolicy == CCTradePolicy.EPP) || (tradePolicy == CCTradePolicy.FF) || (tradePolicy == CCTradePolicy.VIP);
  }
  return ret;
}

export function isBoolean(input: any): boolean {
  return input == true || input == false;
}


export async function sendEventWithRetry(ctx: Context, app: string, event: string, payload: any, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.events.sendEvent("", event, payload)
      .then(res => {
        ctx.state.llLogger.info("Event: '" + event + "' sent, payload: " + JSON.stringify(payload));
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          ctx.state.llLogger.error("Event: '" + event + "' not sent, " + err + ", payload: " + JSON.stringify(payload) + ", retry " + retry);
          await wait(maxWaitTime);
          return sendEventWithRetry(ctx, app, event, payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err);
        }
      })
  })
}

export function parseCookie(cookie: string, ctx: Context): CookieObj {
  let cookieObj: CookieObj = {};
  let slices = cookie.split(";");
  let cookieNameAndValue = slices[0].split("=");
  cookieObj.name = cookieNameAndValue[0];
  cookieObj.value = cookieNameAndValue[1];
  slices.forEach(s => {
    let data = s.split("=");
    let field = data[0].toLowerCase().trim();
    let value = data[1];
    switch (field) {
      case "expires":
        cookieObj.expiration = new Date(value);
        break;
      case "domain":
        cookieObj.domain = ctx.hostname;
        break;
      case "path":
        cookieObj.path = value;
        break;
      case "secure":
        cookieObj.secure = true;
        break;
      case "httponly":
        cookieObj.httponly = true;
        break;
      case "samesite":
        cookieObj.samesite = value.toLowerCase() == "none" ? false : value;
        break;
    }
  })
  cookieObj.secure = ((cookieObj.samesite + "").toLowerCase() == "lax" || (cookieObj.samesite + "").toLowerCase() == "strict") ? false : cookieObj.secure;
  cookieObj.httponly = !cookieObj.httponly ? false : cookieObj.httponly;
  return cookieObj;
}

export async function checkUserId(userId: string|undefined): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (isValid(userId)) {
      resolve(true)
    } else {
      reject({ code: 500, msg: "Invalid user id" });
    }
  })
}

export function getSiteInfoByCtx(ctx: Context): SiteInfo | undefined {
  let hostname = ctx.host?.includes(ctx.vtex.account) ? ctx.query.host as string : ctx.host;
  return getSiteInfoByHostname(ctx, hostname);
}

export function getSiteInfoByHostname(ctx: Context, hostname: string): SiteInfo | undefined {
  let siteInfo: SiteInfo|undefined = undefined;
  let appSettings = ctx.state.appSettings;
  if (!appSettings.isCCProject) {
    siteInfo = appSettings.O2P;
    siteInfo!.cluster = TradePolicy.O2P;
  } else {
    switch (hostname.toLowerCase()) {
      case appSettings.EPP?.hostname.toLowerCase():
        siteInfo = appSettings.EPP;
        siteInfo!.cluster = TradePolicy.EPP;
        break;
      case appSettings.FF?.hostname.toLowerCase():
        siteInfo = appSettings.FF;
        siteInfo!.cluster = TradePolicy.FF;
        break;
      case appSettings.VIP?.hostname.toLowerCase():
        siteInfo = appSettings.VIP;
        siteInfo!.cluster = TradePolicy.VIP;
        break;
    }
  }
  return siteInfo;
}

export async function isNotUndefined(data: any, err: { code: number, msg: string }|undefined = undefined): Promise<boolean> {
  return new Promise((resolve, reject) => {
    data ? resolve(true) : reject(err);
  })
}
