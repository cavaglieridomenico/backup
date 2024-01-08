import { ConnectorMasterDataEntity, VbaseBucket } from "./constants"
import crypto from 'crypto'

export async function CreateEntry(ctx: Context, key: string, body: any) {
  let doc = await ctx.clients.masterdata.createDocument({
    dataEntity: ConnectorMasterDataEntity,
    fields: body
  })

  body.id = doc.DocumentId
  await ctx.clients.vbase.saveJSON(VbaseBucket, HashKey(key), body)
}


export async function UpdateEntry(ctx: Context, key: string, body: any) {
  let vbaseUpdate: Promise<any> = ctx.clients.vbase.saveJSON(VbaseBucket, HashKey(key), body)
  await Promise.all([
    vbaseUpdate,
    ctx.clients.masterdata.createOrUpdatePartialDocument({
      dataEntity: ConnectorMasterDataEntity,
      fields: body
    })
  ])
}

export async function GetEntry(ctx: Context, key: string, keyfield: string, filterCondition?: string, timeout = 2000, maxRetries = 1, currentRetry = 0): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let entry: any = await ctx.clients.vbase.getJSON(VbaseBucket, HashKey(key), true).catch(() => undefined)
    if (entry == null || entry == undefined) {
      ctx.clients.masterdata.searchDocuments<any>({
        dataEntity: ConnectorMasterDataEntity,
        fields: ['id', 'social', 'acceptedTerms', 'newsletteroptin', 'authcode', 'vtexstate', 'redirecturi'],
        pagination: {
          page: 1,
          pageSize: 1
        },
        where: `${keyfield}=${key}${filterCondition ? " AND " + filterCondition : ''}`
      }).then(results => {
        if (results.length > 0) {
          resolve(results[0])
        } else {
          if (currentRetry >= maxRetries) {
            reject("Not found, Finished retries")
            return
          }
          setTimeout(() => {
            GetEntry(ctx, key, keyfield, filterCondition, timeout, maxRetries, currentRetry + 1).then(res => resolve(res), err => reject(err))
          }, timeout)
        }
      }, () => {
        if (currentRetry >= maxRetries) {
          reject("Finished retries")
          return
        }
        setTimeout(() => {
          GetEntry(ctx, key, keyfield, filterCondition, timeout, maxRetries, currentRetry + 1).then(res => resolve(res), err => reject(err))
        }, timeout)
      })
    } else {
      ctx.clients.vbase.deleteFile(VbaseBucket, HashKey(key)).catch(err => ctx.vtex.logger.error(err))
      resolve(entry)
    }
  })
}

const HashKey = (key: string) => {
  return crypto.createHash('sha256').update(key).digest('hex')
}
