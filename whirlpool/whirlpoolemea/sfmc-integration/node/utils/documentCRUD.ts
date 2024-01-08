import { Pagination } from "../typings/types";
import { maxRetries, maxTime } from "./constants";
import { stringify, wait } from "./functions";

export async function createDocument(ctx: Context | StatusChangeContext, dataEntity: string, fields: Object, retry: number = 0, mRetry: number = 0, mTime: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.createDocument({ dataEntity: dataEntity, fields: fields })
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < (mRetry > 0 ? mRetry : maxRetries)) {
          await wait((mTime > 0 ? mTime : maxTime));
          return createDocument(ctx, dataEntity, fields, retry + 1, mRetry, mTime).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({
            message: "create " + dataEntity + " failed  -- details: " + (err.response?.data ? stringify(err.response.data) : stringify(err)),
            status: err.response?.status ? err.response.status : 500
          });
        }
      })
  })
}

export async function updatePartialDocument(ctx: Context, dataEntity: string, id: string, fields: Object, retry: number = 0, mRetry: number = 0, mTime: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.updatePartialDocument({ dataEntity: dataEntity, id: id, fields: fields })
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < (mRetry > 0 ? mRetry : maxRetries)) {
          await wait((mTime > 0 ? mTime : maxTime));
          return updatePartialDocument(ctx, dataEntity, id, fields, retry + 1, mRetry, mTime).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({
            message: "update " + dataEntity + " failed  -- details: " + (err.response?.data ? stringify(err.response.data) : stringify(err)),
            status: err.response?.status ? err.response.status : 500
          });
        }
      })
  })
}

export async function searchDocuments(ctx: Context, dataEntity: string, fields: string[], where: string, pagination: Pagination, retryIfNotFoundRecord: boolean, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: dataEntity, fields: fields, where: where, pagination: pagination })
      .then(async (res) => {
        if (res.length == 0 && retryIfNotFoundRecord && retry < maxRetries) {
          await wait(maxTime)
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          resolve(res)
        }
      })
      .catch(async (err) => {
        if (retry < maxRetries) {
          await wait(maxTime)
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({
            message: "search " + dataEntity + " failed  -- details: " + (err.response?.data ? stringify(err.response.data) : stringify(err)),
            status: err.response?.status ? err.response.status : 500
          });
        }
      })
  })
}
