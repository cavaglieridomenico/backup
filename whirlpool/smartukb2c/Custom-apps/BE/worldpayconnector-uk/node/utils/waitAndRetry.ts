import { PaymentMD } from "../typings/PaymentMD"
import { MasterDataEntity } from "./constants"

export async function GetPayment(ctx: Context, key: string, timeout = 2000, maxRetries = 1, currentRetry = 0): Promise<any> {
  return new Promise((resolve, reject) => {
    let existingPayment: any = ctx.clients.vtexAPI.memoryCache?.get(key)
    if (existingPayment == undefined) {
      console.log("not found in cache")
      ctx.clients.masterdata.searchDocuments<PaymentMD>({
        dataEntity: MasterDataEntity,
        fields: ['id', 'status', 'transactionid', 'denytoken', 'orderid'],
        pagination: {
          page: 1,
          pageSize: 1
        },
        where: `orderid=${key}`
      }).then(results => {
        if (results.length > 0) {
          resolve(results[0])
        } else {
          console.log("not found, retrying")
          if (currentRetry >= maxRetries) {
            reject("Finished retries")
            return
          }
          setTimeout(() => {
            GetPayment(ctx, key, timeout, maxRetries, currentRetry + 1).then(res => resolve(res), err => reject(err))
          }, timeout)
        }
      }, error => {
        console.log(error)
        if (currentRetry >= maxRetries) {
          reject("Finished retries")
          return
        }
        setTimeout(() => {
          GetPayment(ctx, key, timeout, maxRetries, currentRetry + 1).then(res => resolve(res), err => reject(err))
        }, timeout)
      })
    } else {
      resolve(existingPayment)
    }
  })
}
