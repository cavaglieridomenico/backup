import { maxRetry, maxWaitTime } from "./constants";
import { AES256Decode , GetHash } from "../utils/cryptography";
import { AppSettings } from "../typings/config"
import { ProfilingRequest } from "../typings/types"

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return ({ }, value: object | null) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

export function stringify(data: any): string {
  return typeof data == 'object' ? JSON.stringify(data, getCircularReplacer()) : (data + "");
}

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

export function isValid(field: any): boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
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

export function isAuthenticatedRequest(settings: AppSettings, req : ProfilingRequest) : boolean {
  //console.log("clear key : " + AES256Decode(settings.sfmcKey))
  //console.log("hash :" + GetHash(req.email + AES256Decode(settings.sfmcKey)))
  return req.dig == GetHash(req.email + AES256Decode(settings.sfmcKey)) 
}

