import { stringify } from "querystring";
import { maxRetry, maxWaitTime } from "./constants";
import { wait } from "./mapper";

export async function saveObjInVbase(ctx: Context, bucket: string, path: any, data: any, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.vbase.saveJSON(bucket, path, data)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return saveObjInVbase(ctx, bucket, path, data, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: `Error while storing json in the bucket ${bucket} for the ref ${path} --data: ${data} --details: ${stringify(err)}` })
        }
      })
  })
}

export async function updatePartialObjInVbase(ctx: Context, bucket: string, path: any, data: any, retry: number = 0): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    const objData = await getObjFromVbase(ctx, bucket, path, 0).catch(() => ({}))
    Object.keys(data).map(key => { if (data[key] == null || data[key] == undefined) { delete data[key]; } })
    ctx.clients.vbase.saveJSON(bucket, path, { ...objData, ...data })
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return updatePartialObjInVbase(ctx, bucket, path, data, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: `Error while storing json in the bucket ${bucket} for the ref ${path} --data: ${data} --details: ${stringify(err)}` })
        }
      })
  })
}

export async function getObjFromVbase(ctx: Context, bucket: string, path: string, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.vbase.getJSON(bucket, path)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return getObjFromVbase(ctx, bucket, path, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: `Error while fetching json from the bucket ${bucket} for the ref ${path} --details: ${stringify(err)}` })
        }
      })
  })
}

export async function deleteObjFromVbase(ctx: Context, bucket: string, path: string, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.vbase.deleteFile(bucket, path)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return deleteObjFromVbase(ctx, bucket, path, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: `Error while deleting data from the bucket ${bucket} for the ref ${path} --details: ${stringify(err)}` })
        }
      })
  })
}