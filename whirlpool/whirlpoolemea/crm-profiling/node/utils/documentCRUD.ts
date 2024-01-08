import { maxRetry, maxWaitTime } from "./constants";
import { wait } from "./commons";

export async function createDocument(ctx: Context, dataEntity: string, fields: {}, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.createDocument({ dataEntity: dataEntity, fields: fields })
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime)
          return createDocument(ctx, dataEntity, fields, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err);
        }
      })
  })
}

export async function updatePartialDocument(ctx: Context, dataEntity: string, id: string | undefined, fields: {}, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.updatePartialDocument({ dataEntity: dataEntity, id: id || "", fields: fields })
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime)
          return updatePartialDocument(ctx, dataEntity, id, fields, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err);
        }
      })
  })
}

export async function searchDocuments(ctx: Context, dataEntity: string, fields: string[], where: string, pagination: any, output: any[] = [], retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: dataEntity, fields: fields, where: where, pagination: pagination })
      .then((res: any) => {
        output = output.concat(res);
        if (res.length < pagination.pageSize) {
          resolve(output)
        } else {
          return searchDocuments(ctx, dataEntity, fields, where, { page: pagination.page + 1, pageSize: pagination.pageSize }, output, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        }
        return null
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return searchDocuments(ctx, dataEntity, fields, where, pagination, output, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject(err);
        }
      })
  })
}
