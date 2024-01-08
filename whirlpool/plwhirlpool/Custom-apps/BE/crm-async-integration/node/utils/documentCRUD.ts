//@ts-nocheck

import { stringify, wait } from "./mapper";
import { maxRetry, maxWaitTime } from "./constants"

export async function createDocument(ctx: Context, dataEntity: string, fields: {}, retry: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.createDocument({ dataEntity: dataEntity, fields: fields })
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry <= maxRetry) {
          await wait(maxWaitTime)
          return createDocument(ctx, dataEntity, fields, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          console.log(err)
          reject({
            message: err.message != undefined ? ("create " + dataEntity + " failed  -- details: " + err.message) : (err.response?.data != undefined ? ("create " + dataEntity + " failed  -- details: " + err.response.data) : "create " + dataEntity + " failed"),
            status: err.status != undefined ? err.status : (err.response?.status != undefined ? err.response.status : 500)
          });
        }
      })
  })
}

export async function updatePartialDocument(ctx: Context, dataEntity: string, id: string, fields: {}, retry: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.vtex.logger.debug(`updating CC record for ${id} , body ${stringify(fields)}`)
    ctx.clients.masterdata.updatePartialDocument({ dataEntity: dataEntity, id: id, fields: fields })
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        ctx.vtex.logger.debug(`error updating CC record for ${id} , error ${stringify(err)}`)
        if (retry <= maxRetry) {
          await wait(maxWaitTime)
          return updatePartialDocument(ctx, dataEntity, id, fields, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({
            message: err.message != undefined ? ("update " + dataEntity + " failed  -- details: " + err.message) : (err.response?.data != undefined ? ("update " + dataEntity + " failed  -- details: " + err.response.data) : "update " + dataEntity + " failed"),
            status: err.status != undefined ? err.status : (err.response?.status != undefined ? err.response.status : 500)
          });
        }
      })
  })
}

export async function searchDocuments(ctx: Context, dataEntity: string, fields: [], where: string, pagination: {}, retry: number, retryIfNotFoundRecord: Boolean): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: dataEntity, fields: fields, where: where, pagination: pagination })
      .then(async (res) => {
        if (res.length == 0 && retryIfNotFoundRecord && retry <= maxRetry) {
          await wait(maxWaitTime)
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retry + 1, retryIfNotFoundRecord).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          resolve(res)
        }
      })
      .catch(async (err) => {
        if (retry <= maxRetry) {
          await wait(maxWaitTime)
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retry + 1, retryIfNotFoundRecord).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({
            message: err.message != undefined ? ("search " + dataEntity + " failed  -- details: " + err.message) : (err.response?.data != undefined ? ("search " + dataEntity + " failed  -- details: " + err.response.data) : "search " + dataEntity + " failed"),
            status: err.status != undefined ? err.status : (err.response?.status != undefined ? err.response.status : 500)
          });
        }
      })
  })
}
