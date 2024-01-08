import { maxRetry, maxWaitTime } from "./constants";

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

export function isValid(field: any): Boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
}

export function routeToLabel(ctx: Context | NewOrder): string | undefined {
  let label = undefined
  if (ctx.vtex.eventInfo?.sender != undefined) {
    label = "New Order: ";
  }
  return label;
}

export async function sendEventWithRetry(ctx: Context, app: string, event: string, payload: any, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.events.sendEvent("", event, payload)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return sendEventWithRetry(ctx, app, event, payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err);
        }
      })
  })
}
