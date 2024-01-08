//@ts-nocheck

import { localeMap, maxRetry, maxWaitTime, sapCodeToBillingType } from "./constants";
import { CCTradePolicy } from "../typings/TradePolicy"
import { CookieObj } from "../typings/UserAuthentication";

export function isValid(field: string|undefined|null): boolean{
  return field!=undefined && field!=null && field!="null" && field!="" && field!=" " && field!=!"-" && field!="_";
}

export function getInvoiceName(ctx: Context, name: string): string{
  try{
    let slices = name.split("-");
    let invoiceName = sapCodeToBillingType[(slices[0]+"").toUpperCase()][localeMap[ctx.vtex.account]]+"-"+slices[1];
    return invoiceName;
  }catch(err){
    return name;
  }
}

export async function wait(time: number): Promise<any>{
  return new Promise<any>((resolve) => {
    setTimeout(() => {resolve(true)},time);
  })
}

export function isValidCCTradePolicy(tradePolicy: string): boolean{
  let ret = false;
  if(isValid(tradePolicy)){
    ret = (tradePolicy==CCTradePolicy.EPP) || (tradePolicy==CCTradePolicy.FF)|| (tradePolicy==CCTradePolicy.VIP);
  }
  return ret;
}

export function isBoolean(input: any): boolean{
  return input==true || input==false;
}


export async function sendEventWithRetry(ctx: Context, app: string, event: string, payload: any, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve,reject) => {
    ctx.clients.events.sendEvent("", event, payload)
    .then(res => resolve(res))
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime);
        return sendEventWithRetry(ctx, app, event, payload, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
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
    switch(field){
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
        cookieObj.samesite = value.toLowerCase()=="none"?false:value;
        break;
    }
  })
  cookieObj.secure = ((cookieObj.samesite+"").toLowerCase()=="lax" || (cookieObj.samesite+"").toLowerCase()=="strict")?false:cookieObj.secure;
  cookieObj.httponly = cookieObj.httponly==undefined?false:cookieObj.httponly;
  return cookieObj;
}

export async function checkUserId(userId: string): Promise<boolean>{
  return new Promise<boolean>((resolve,reject) => {
    if(isValid(userId)){
      resolve(true)
    }else{
      reject({code: 500, msg: "Invalid user id"});
    }
  })
}
