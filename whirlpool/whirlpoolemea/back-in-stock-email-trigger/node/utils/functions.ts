import { maxRetry, maxWaitTime } from "./constants";

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time);
  })
}

export function isValid(param: any): any {
  return param != undefined && param != null && param != "undefined" && param != "null" && param != "" && param != " " && param != "_" && param != "-";
}

export function stringify(data: any): string {
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data;
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

export async function sendEventWithRetry(ctx: Context, event: string, payload: any, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.events.sendEvent("", event, payload) // sending in broadcast mode
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return sendEventWithRetry(ctx, event, payload).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err);
        }
      })
  })
}
