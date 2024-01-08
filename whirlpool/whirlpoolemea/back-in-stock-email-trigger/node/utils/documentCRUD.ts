import { maxRetry, maxWaitTime } from "./constants";
import { stringify, wait } from "./functions";

export async function createDocument(ctx: Context, dataEntity: string, fields: Object, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.createDocument({ dataEntity: dataEntity, fields: fields })
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return createDocument(ctx, dataEntity, fields, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: "create " + dataEntity + " failed  -- details: " + stringify(err) });
        }
      })
  })
}

export async function updatePartialDocument(ctx: Context, dataEntity: string, id: string, fields: Object, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.updatePartialDocument({ dataEntity: dataEntity, id: id, fields: fields })
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return updatePartialDocument(ctx, dataEntity, id, fields, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: "update " + dataEntity + " failed (id: " + id + ")  -- details: " + stringify(err) });
        }
      })
  })
}

export async function deleteDocument(ctx: Context, dataEntity: string, id: string, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.deleteDocument({ dataEntity: dataEntity, id: id })
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return deleteDocument(ctx, dataEntity, id, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: "delete " + dataEntity + " failed (id: " + id + ") --details: " + stringify(err) });
        }
      })
  })
}

export async function searchDocuments(ctx: Context, dataEntity: string, fields: string[], where: string, pagination: { page: number, pageSize: number }, retryIfNotFoundRecord: boolean = false, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: dataEntity, fields: fields, where: where, pagination: pagination })
      .then(async (res) => {
        if (res.length == 0 && retryIfNotFoundRecord && retry < maxRetry) {
          await wait(maxWaitTime);
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          resolve(res);
        }
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime)
          return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: "search " + dataEntity + " failed  -- details: " + stringify(err) });
        }
      })
  })
}
