//@ts-nocheck

import { PaymentMD } from "../typings/PaymentMD"
import { MasterDataEntity, VBaseBucket } from "./constants"

export enum PaymentKeys {
  PAYMENTID = "id",
  ORDERID = "orderid"
}

export async function SavePayment(ctx: Context, key: string, body: any, finalUpdate = false) {
  let vbaseUpdate: Promise<any> = finalUpdate ? ctx.clients.vbase.deleteFile(VBaseBucket, key) : ctx.clients.vbase.saveJSON(VBaseBucket, key, body)
  await Promise.all([
    vbaseUpdate,
    ctx.clients.masterdata.createOrUpdatePartialDocument({
      dataEntity: MasterDataEntity,
      fields: body
    })
  ])
}

export async function GetPayment(ctx: Context, key: string, timeout = 2000, maxRetries = 1, keyfield = PaymentKeys.ORDERID, currentRetry = 0): Promise<PaymentMD> {
  return new Promise(async (resolve, reject) => {
    let existingPayment: any = keyfield == PaymentKeys.ORDERID ? await ctx.clients.vbase.getJSON(VBaseBucket, key, true).catch(() => undefined) : undefined
    if (existingPayment == null || existingPayment == undefined) {
      console.log("not found in cache")
      ctx.clients.masterdata.searchDocuments<PaymentMD>({
        dataEntity: MasterDataEntity,
        fields: ['id', 'orderid', 'status', 'transactionid', 'callbackUrl', 'settleid', 'value', 'denytoken', 'authorizationId', 'debitCreditIndicator'],
        pagination: {
          page: 1,
          pageSize: 1
        },
        where: `${keyfield}=${key}`
      }).then(results => {
        if (results.length > 0) {
          resolve(results[0])
        } else {
          console.log("not found, retrying")
          if (currentRetry >= maxRetries) {
            reject("Not found, Finished retries")
            return
          }
          setTimeout(() => {
            GetPayment(ctx, key, timeout, maxRetries, keyfield, currentRetry + 1).then(res => resolve(res), err => reject(err))
          }, timeout)
        }
      }, error => {
        console.log(error)
        if (currentRetry >= maxRetries) {
          reject("Finished retries")
          return
        }
        setTimeout(() => {
          GetPayment(ctx, key, timeout, maxRetries, keyfield, currentRetry + 1).then(res => resolve(res), err => reject(err))
        }, timeout)
      })
    } else {
      resolve(existingPayment)
    }
  })
}


