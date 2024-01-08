

import { Pagination } from "../typings/md";
import { stringify, wait } from "./commons";
import { maxRetry, maxRetrySync, maxWaitTime, maxWaitTimeSync } from "./constants";

export async function createDocument(ctx: Context | OrderEvent | NewsletterSubscription | LoggedUser, dataEntity: string, fields: any, retry: number = 0, mRetry: number = 0, mTime: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.createDocument({ dataEntity: dataEntity, fields: fields })
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < (mRetry > 0 ? mRetry : maxRetry)) {
          await wait((mTime > 0 ? mTime : maxWaitTime));
          return createDocument(ctx, dataEntity, fields, retry + 1, mRetry, mTime).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `create ${dataEntity} failed  --details: ${stringify(err)}` });
        }
      })
  })
}

export async function updatePartialDocument(ctx: Context | OrderEvent | NewsletterSubscription | LoggedUser, dataEntity: string, id: string, fields: Object, retry: number = 0, mRetry: number = 0, mTime: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.updatePartialDocument({ dataEntity: dataEntity!, id: id, fields: fields })
      .then(res => {        
        resolve(res);        
      })
      .catch(async (err) => {
        if (retry < (mRetry > 0 ? mRetry : maxRetry)) {
          await wait((mTime > 0 ? mTime : maxWaitTime));
          return updatePartialDocument(ctx, dataEntity, id, fields, retry + 1, mRetry, mTime).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `update ${dataEntity} failed  --details: ${stringify(err)}` });
        }
      })
  })
}

export async function searchDocuments(ctx: Context | OrderEvent | NewsletterSubscription | LoggedUser, dataEntity: string, fields: string[], where: string, pagination: Pagination = { page: 1, pageSize: 10 }, retryIfNotFoundRecord: Boolean = false, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: dataEntity, fields: fields, where: where, pagination: pagination })
      .then(async (res) => {
        if (res.length == 0 && retryIfNotFoundRecord && retry < maxRetry) {
          await wait(maxWaitTime)
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          resolve(res)
        }
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime)
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `search ${dataEntity} failed  --details: ${stringify(err)}` });
        }
      })
  })
}

export async function createOrUpdateDocument(ctx: Context | OrderEvent | NewsletterSubscription, dataEntity: string, fields: any[], searchCondition: string, data: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    searchDocuments(ctx, dataEntity, fields, searchCondition, { page: 1, pageSize: 10 }, false)
      .then(async (res) => {
        try {
          let id: string | undefined = undefined;
          if (res?.length > 0) {
            id = res[0].id;
            await updatePartialDocument(ctx, dataEntity, id!, data);
          } else {
            id = (await createDocument(ctx, dataEntity, data)).DocumentId;
          }
          resolve(id!)
        } catch (err) {
          reject(err);
        }
      })
      .catch(err => reject(err))
  })
}

export async function deleteDocument(ctx: Context, dataEntity: string, id: string, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.deleteDocument({ dataEntity: dataEntity, id: id })
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetrySync) {
          await wait(maxWaitTimeSync);
          return deleteDocument(ctx, dataEntity, id, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `delete ${dataEntity} (id=${id}) failed  --details: ${stringify(err)}` })
        }
      })
  })
}
