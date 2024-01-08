//@ts-nocheck

import { getRequestPayload, wait } from "../typings/functions";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { CustomLogger } from "../utils/logger";

export async function deleteLogs(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    let ids: [] = await getRequestPayload(ctx);
    deleteAll(ctx, ids).then(res => ctx.vtex.logger.info("Logs deletion: "+res)).catch(err => ctx.vtex.logger.error("Logs deletion: "+err))
    ctx.status = 200;
    ctx.body = "OK";
  }catch(err){
    if(err.message!=undefined){
      ctx.vtex.logger.error("Logs deletion: "+err.message);
    }
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}

async function deleteWithRetry(ctx: Context, entity: string, id: string, retry?: number = 0): Promise<any> {
  return new Promise<any>((resolve,reject) => {
    ctx.clients.masterdata.deleteDocument({dataEntity: entity, id: id})
    .then(() => resolve(true))
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime);
        return deleteWithRetry(ctx, entity, id, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject("error while deleting the log "+id+" --details: "+JSON.stringify(err))
      }
    })
  })
}

async function deleteAll(ctx: Context, ids: string[]): Promise<any> {
  return new Promise<any>(async(resolve) => {
    for(let i=0; i<ids.length; i++){
      deleteWithRetry(ctx, "LC", ids[i]).catch(err => ctx.vtex.logger.error("Logs deletion: "+err));
      await wait(1);
    }
    resolve("requests sent.")
  })
}

