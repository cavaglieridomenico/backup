import { PaymentMD } from "../typings/PaymentMD"
import { MasterDataEntity, VBaseBucket } from "./constants"
import { CustomLogger } from "./Logger"

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
  let logger = new CustomLogger(ctx)
  return new Promise(async (resolve, reject) => {
    let existingPayment: any =
      keyfield == PaymentKeys.ORDERID
        ? await ctx.clients.vbase.getJSON(VBaseBucket, key, true).catch((err) => {
          console.error(err)
          logger.error("[GetPayment] order:" + key + " - Error retrieving payment in Vbase ")
          logger.debug(err)
          return undefined
        })
        : undefined
    if (existingPayment == null || existingPayment == undefined) {
      ctx.clients.masterdata.searchDocuments<PaymentMD>({
        dataEntity: MasterDataEntity,
        fields: ['_all'],
        pagination: {
          page: 1,
          pageSize: 1
        },
        where: `${keyfield}=${key}`
      }).then(results => {
        if (results.length > 0) {
          resolve(results[0])
        } else {
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


