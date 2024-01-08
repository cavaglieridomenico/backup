//@ts-nocheck

import { maxRetry, maxWaitTime } from "./constants"
import { DocumentResponse, Pagination } from "../typings/types";
import { getCircularReplacer, wait } from "./functions";

export async function createDocument(ctx: Context, dataEntity: string, fields: Object, retry: number = 0): Promise<DocumentResponse>{
  return new Promise<DocumentResponse>((resolve,reject) => {
    ctx.clients.masterdata.createDocument({dataEntity: dataEntity, fields: fields})
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime);
        return createDocument(ctx, dataEntity, fields, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "create "+dataEntity+" failed  -- details: "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())});
      }
    })
  })
}

export async function updatePartialDocument(ctx: Context, dataEntity: string, id: string, fields: Object, retry: number = 0): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.masterdata.updatePartialDocument({dataEntity: dataEntity, id: id, fields: fields})
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime);
        return updatePartialDocument(ctx, dataEntity, id, fields, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "update "+dataEntity+" failed  -- details: "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())});
      }
    })
  })
}

export async function searchDocuments(ctx: Context, dataEntity: string, fields: string[], where: string, pagination: Pagination, retryIfNotFoundRecord: Boolean, retry: number = 0): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.masterdata.searchDocuments({dataEntity: dataEntity, fields: fields, where: where, pagination: pagination})
    .then(async(res) => {
      if(res.length==0 && retryIfNotFoundRecord && retry<maxRetry){
        await wait(maxWaitTime)
        return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        resolve(res)
      }
    })
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime)
        return searchDocuments(ctx, dataEntity, fields, where, pagination, retryIfNotFoundRecord, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "search "+dataEntity+" failed  -- details: "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())});
      }
    })
  })
}
