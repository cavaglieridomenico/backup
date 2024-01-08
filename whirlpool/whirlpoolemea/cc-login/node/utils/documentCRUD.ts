import { memoryCache } from "..";
import { maxRetry, maxWaitTime } from "./constants";
import { wait } from "./functions";

export async function createDocument(ctx: Context | NewOrder, dataEntity: string, fields: any, retry: number = 0): Promise<any> {
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

export async function updatePartialDocument(ctx: Context | NewOrder, dataEntity: string, id: string, fields: any, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.updatePartialDocument({ dataEntity: dataEntity, id: id, fields: fields })
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

export async function searchDocuments(ctx: Context | NewOrder, dataEntity: string, fields: any[], where: string | undefined = undefined, pagination: any = { page: 1, pageSize: 10 }, output: any[] = [], retry: number = 0): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: dataEntity, fields: fields, where: where, pagination: pagination })
      .then((res: any[]) => {
        output = output.concat(res);
        if (res.length < pagination.pageSize) {
          resolve(output)
        } else {
          return searchDocuments(ctx, dataEntity, fields, where, { page: pagination.page + 1, pageSize: pagination.pageSize }, output).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        }
        return;
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

export async function scrollDocuments(ctx: Context, dataEntity: string, fields: string[], where: string | undefined = undefined, mdToken: string | undefined = undefined, size: number = 1000, data: any[] = [], retry: number = 0): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    let label = `scroll-${dataEntity}-${fields.join("-")}-${where ? where.replace(/[\=| |\(|\)]/g, "-") : ""}`;
    if (memoryCache.has(label)) {
      console.info(`${dataEntity} data retrieved from cache`);
      resolve(memoryCache.get(label));
    } else {
      ctx.clients.masterdata.scrollDocuments({ dataEntity: dataEntity, fields: fields, where: where, mdToken: mdToken, size: size })
        .then((res: any) => {
          data = data.concat(res.data);
          if (res.data?.length < size) {
            memoryCache.set(label, data);
            resolve(data);
          } else {
            return scrollDocuments(ctx, dataEntity, fields, where, res.mdToken, size, data, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }
          return;
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return scrollDocuments(ctx, dataEntity, fields, where, mdToken, size, data, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    }
  })
}
