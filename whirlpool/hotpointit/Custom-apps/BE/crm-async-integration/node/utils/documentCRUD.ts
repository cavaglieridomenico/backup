//@ts-nocheck

import { wait } from "./mapper";
import { maxRetry,maxWaitTime } from "./constants"
import { stringify } from "./functions";

export async function createDocument(ctx: Context, dataEntity: string, fields: {}, retry: number = 0): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.masterdata.createDocument({dataEntity: dataEntity, fields: fields})
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<=maxRetry){
        await wait(maxWaitTime)
        retry++;
        return createDocument(ctx, dataEntity, fields, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "create "+dataEntity+" failed  -- details: "+stringify(err), status: 500});
      }
    })
  })
}

export async function updatePartialDocument(ctx: Context, dataEntity: string, id: string, fields: {}, retry: number = 0): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.masterdata.updatePartialDocument({dataEntity: dataEntity, id: id, fields: fields})
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<=maxRetry){
        await wait(maxWaitTime)
        retry++;
        return updatePartialDocument(ctx, dataEntity, id, fields, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "update "+dataEntity+" failed  -- details: "+stringify(err), status: 500});
      }
    })
  })
}

export async function searchDocuments(ctx: Context, dataEntity: string, fields: [], where: string, pagination: {}, retry: number = 0): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.masterdata.searchDocuments({dataEntity: dataEntity, fields: fields, where: where, pagination: pagination})
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<=maxRetry){
        await wait(maxWaitTime)
        retry++;
        return searchDocuments(ctx, dataEntity, fields, where, pagination, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "search "+dataEntity+" failed  -- details: "+stringify(err), status: 500});
      }
    })
  })
}
