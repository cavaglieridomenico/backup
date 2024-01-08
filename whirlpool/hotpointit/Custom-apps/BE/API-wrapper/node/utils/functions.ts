import { MasterData } from "@vtex/api"
import { defaultCookie, GA_TRANSACTION_ENTITY, maxRetry, maxWaitTime } from "./constants"

export const GetLoggedUserEmail = async (ctx: Context) => {
  let loggedUser = await ctx.clients.AuthUser.GetLoggedUser(ctx.vtex.storeUserAuthToken || ctx.cookies.get(`${defaultCookie}_${ctx.vtex.account}`))
  return loggedUser?.user
}

export const searchGaOrder = async (masterdata: MasterData, orderId: string, addIfNotPresent: string) => {
  return masterdata.searchDocuments({
    dataEntity: GA_TRANSACTION_ENTITY,
    fields: ['_all'],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `orderId= ${orderId}`
  }).then(res => {
    if (res.length > 0) return true
    else {
      if (addIfNotPresent.toLowerCase() == "true") addOrderId(masterdata, orderId)
      return false
    }
  }).catch(() => undefined)
}

export const addOrderId = async (masterdata: MasterData, orderId: string) => {
  return masterdata.createDocument({
    dataEntity: GA_TRANSACTION_ENTITY,
    fields: {
      "orderId": orderId
    }
  }).then(() => true).catch(() => false)
}

export function isValid(field: any): boolean {
  return field != undefined && field != null && field != "undefined" && field != "null" && field != "" && field != " " && field != "-" && field != "_";
}


export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
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
