import { CCRecord } from "../typings/md";
import { stringify, wait } from "./commons";
import { VBaseBucketCC, maxRetrySync, maxWaitTimeSync } from "./constants";

export async function saveOrUpdateCCRecordInVBase(ctx: Context, record: CCRecord, update: CCRecord | undefined = undefined, retry: number = 0): Promise<any> {
  let key = `${ctx.vtex.account}-CC-${record.vtexUserId}`;
  record = update ? buildCCRecordToSaveInVBase(record, update) : record;
  return new Promise<any>((resolve, reject) => {
    ctx.clients.vbase.saveJSON(VBaseBucketCC, key, record)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetrySync) {
          await wait(maxWaitTimeSync);
          return saveOrUpdateCCRecordInVBase(ctx, record, update, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `Error while saving CC record in VBase --data: ${JSON.stringify(record)} --err: ${stringify(err)}` })
        }
      })
  })
}

export async function getCCRecordFromVBase(ctx: Context, id: string, retry: number = 0): Promise<any> {
  let key = `${ctx.vtex.account}-CC-${id}`;
  return new Promise<any>((resolve, reject) => {
    ctx.clients.vbase.getJSON(VBaseBucketCC, key, true)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetrySync) {
          await wait(maxWaitTimeSync);
          return getCCRecordFromVBase(ctx, id, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `Error while retrieving CC record from VBase --ref: ${key} --err: ${stringify(err)}` })
        }
      })
  })
}

export async function deleteCCRecordFromVBase(ctx: Context, id: string, retry: number = 0): Promise<any> {
  let key = `${ctx.vtex.account}-CC-${id}`;
  return new Promise<any>((resolve, reject) => {
    ctx.clients.vbase.deleteFile(VBaseBucketCC, key)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (err.response.status != 404) {
          if (retry < maxRetrySync) {
            await wait(maxWaitTimeSync);
            return deleteCCRecordFromVBase(ctx, id, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `Error while deleting CC record from VBase --ref: ${key} --err: ${stringify(err)}` })
          }
        } else {
          resolve({ notFound: true })
        }
      })
  })
}

export function buildCCRecordToSaveInVBase(cc: CCRecord | any, update: CCRecord | any): CCRecord {
  Object.keys(update)?.filter(k => Object.keys(cc)?.includes(k))?.forEach(k => cc[k] = update[k]);
  return cc;
}
