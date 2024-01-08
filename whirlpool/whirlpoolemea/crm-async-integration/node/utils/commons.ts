import { CCRecord, CLRecord, TradePolicy } from "../typings/md";
import { maxRetry, maxWaitTime } from "./constants";

export function checkNameAndSurname(cl: CLRecord | CCRecord): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    return (isValid(cl?.firstName) && isValid(cl?.lastName)) ? resolve(true) : reject({ message: `no name / surname (record skipped)` })
  })
}

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

export async function isDefined(data: any, msg: string, code: number | undefined = undefined): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    data ? resolve(true) : reject({ message: msg, code: code });
  })
}

export const replaceMultipleOccurrences = (data: string, searchValue: string, replaceValue: string): string => {
  data = data.replace(searchValue, replaceValue);
  return data.includes(searchValue) ? replaceMultipleOccurrences(data, searchValue, replaceValue) : data;
}

export function normalizeString(stringToNormalize: string): string {
  stringToNormalize = stringToNormalize.replace(/[\+|\[|\]|\/|\!|\"|\£|\$|\%|\&|\(|\)|\=|\\|\?|\^|\||\{|\}|\°|\#|\;|\.|\:|\_|\<|\>|\•|\²]/g, "");
  stringToNormalize = stringToNormalize.replace(/\-/g, " ");
  stringToNormalize = stringToNormalize.replace(/\,/g, " ");
  stringToNormalize = replaceMultipleOccurrences(stringToNormalize, "  ", " ");
  return stringToNormalize;
}

export function normalizeAndCutString(stringToCut: any, maxLength: number = 9999, normalize: boolean = false): string | null {
  stringToCut = isValid(stringToCut) ? (stringToCut + "").trim() : null;
  if (stringToCut) {
    stringToCut = normalize ? normalizeString(stringToCut).trim() : stringToCut;
    stringToCut = stringToCut.substr(0, maxLength).trim();
  }
  return stringToCut;
}

export function isValid(field: any): boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
}

export function getTradePolicyById(ctx: Context | OrderEvent | NewsletterSubscription, channel: string): string | undefined {
  let result: string | undefined = undefined;
  switch (channel) {
    case ctx.state.appSettings.epp?.tradePolicyId:
      result = TradePolicy.EPP;
      break;
    case ctx.state.appSettings.ff?.tradePolicyId:
      result = TradePolicy.FF;
      break;
    case ctx.state.appSettings.vip?.tradePolicyId:
      result = TradePolicy.VIP;
      break;
  }
  return result
}

export function routeToLabel(ctx: any): string {
  let label = "Unknown event: ";
  switch (ctx.vtex.route.id) {
    case "notificationHandler":
      label = "Notification handler: ";
      break;
    case "setCrmBpId":
      label = "Set crmBpId: ";
      break;
    case "getUserDataFromVtex":
      label = "Get user from Vtex: ";
      break;
    case "getUserDataFromCRM":
      label = "Get user from CRM: ";
      break;
    case "eppExportHandler":
      label = "Epp export handler: ";
      break;
  }
  if (isValid(ctx.body?.eventId)) {
    label = ctx.body.eventId;
  }
  if (isValid(ctx.vtex.eventInfo?.sender)) {
    label = "Guest user registration: ";
  }
  return label;
}

export const valueOrUndefined = (str: any): any => {
  return str ?? undefined;
}

export const removeUndefinedProperties = (obj: any): any => {
  Object.keys(obj)?.forEach(p => {
    if (!obj[p]) {
      delete obj[p];
    }
  })
  return obj;
}

export async function sendEventWithRetry(ctx: Context, app: string, event: string, data: any, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.events.sendEvent("", event, data)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return sendEventWithRetry(ctx, app, event, data, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `Error while sending the event "${event}" --err: ${stringify(err)} --data: ${stringify(data)}` })
        }
      })
  })
}
