//@ts-nocheck

import CoBody = require("co-body");
import { EPPEventType, EPPExportRecord, EMRecord } from "../typings/types";
import { createDocument, searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { EMEntityFields, EMEntityName, maxRetry } from "../utils/constants";
import { CustomLogger } from "../utils/Logger";
import { isValid, wait } from "../utils/mapper";

const eppMaxRetry = 50;
const eppMaxWaitTime = 1500;

export async function eppExportHandler(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    let records = await getRequestPayload(ctx);
    getAllEPPUsers(ctx, [])
    .then(epps => {
      let firstRecord = records[0];
      if(firstRecord?.event==EPPEventType.FULL_INSERT){
        handleFull(ctx, records, epps).then(res => ctx.vtex.logger.info("EPP full import: requests sent. Expected active users: "+records.length));
      }else{
        let existingUsers = epps.filter(f => f.status).length;
        let newUsers = records?.filter(f => f.event==EPPEventType.DELTA_INSERT)?.length;
        let usersToRemove =  records?.filter(f => f.event==EPPEventType.DELTA_DELETE)?.length;
        handleDelta(ctx, records, epps).then(res => ctx.vtex.logger.info("EPP delta import: requests sent. Expected active users: "+(existingUsers+newUsers-usersToRemove)+" -- new users: "+newUsers+"; users to remove: "+usersToRemove));
      }
    })
    .catch(err => ctx.vtex.logger.error("EPP import: failed --err: "+err.message))
    ctx.status = 200;
    ctx.body = "OK";
  }catch(err){
    //console.log(err)
    ctx.status = 500;
    ctx.body = err.message!=undefined?("EPP import: failed --err: "+err.message):"Internal Server Error";
    if(isValid(err.message)){
      ctx.vtex.logger.error("EPP import: failed --err: "+err.message);
    }
  }
  await next();
}

async function getRequestPayload(ctx: Context): Promise<EPPExportRecord[]> {
  return new Promise<EPPExportRecord[]>((resolve,reject) => {
    let payload = "";
    ctx.req.on("data", (chunk) => payload += Buffer.from(chunk, "binary").toString("utf8"));
    ctx.req.on("end", () => resolve(JSON.parse(payload)));
    ctx.req.on("error", (err) => reject({message: "error while retrieving the request payload --details: "+JSON.stringify(err)}))
  })
}

async function getAllEPPUsers(ctx: Context, output: [], token: string = undefined, size: number = 1000, retry: number = 0): Promise<EMRecord[]> {
  return new Promise<EMRecord[]>((resolve,reject) => {
    ctx.clients.masterdata.scrollDocuments({dataEntity: EMEntityName, fields: EMEntityFields, mdToken: token, size: size})
    .then(res => {
      output = output.concat(res.data);
      if(res.data.length<size){
        resolve(output)
      }else{
        return getAllEPPUsers(ctx, output, res.mdToken, size, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }
    })
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(eppMaxWaitTime);
        return getAllEPPUsers(ctx, output, token, size, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "scroll "+EPPEntityName+" failed --details: "+(err.response?.data!=undefined?JSON.stringify(err.response.data):JSON.stringify(err))});
      }
    })
  })
}

async function handleFull(ctx: Context, records: EPPExportRecord[], EPPrecords: EMRecord[]): Promise<boolean>{
  return new Promise<boolean>(async (resolve,reject) => {
    for(let i=0; i<records.length; i++){
      let record = EPPrecords.find(f => f.email.toLowerCase()==records[i].emailAddress.toLowerCase());
      if(isValid(record)){
        if(record.status!=true){
          updatePartialDocument(ctx, EMEntityName, record.id, {status: true}, 0, eppMaxRetry, eppMaxWaitTime)
          .catch(err => ctx.vtex.logger.error("EPP full import - insert EPP user "+records[i].emailAddress+": failed --err: "+(err.message!=undefined?err.message:JSON.stringify(err))+" --payload: "+JSON.stringify(records[i])))
          await wait(1);
        }
      }else{
        createDocument(ctx, EMEntityName, {email: records[i].emailAddress, status: true}, 0, eppMaxRetry, eppMaxWaitTime)
        .catch(err => ctx.vtex.logger.error("EPP full import - insert EPP user "+records[i].emailAddress+": failed --err: "+(err.message!=undefined?err.message:JSON.stringify(err))+" --payload: "+JSON.stringify(records[i])))
        await wait(1);
      }
    }
    for(let i=0; i<EPPrecords.length; i++){
      let record = records.find(f => f.emailAddress.toLowerCase()==EPPrecords[i].email.toLowerCase());
      if(!isValid(record)){
        updatePartialDocument(ctx, EMEntityName, EPPrecords[i].id, {status: false}, 0, eppMaxRetry, eppMaxWaitTime)
        .catch(err => ctx.vtex.logger.error("EPP full import - disable EPP user "+EPPrecords[i].email+": failed --err: "+(err.message!=undefined?err.message:JSON.stringify(err))))
        await wait(1);
      }
    }
    resolve(true)
  })
}

async function handleDelta(ctx: Context, records: EPPExportRecord[], EPPrecords: EMRecord[]): Promise<boolean>{
  return new Promise<boolean>(async(resolve,reject) => {
    for(let i=0; i<records.length; i++){
      switch(records[i].event){
        case EPPEventType.DELTA_INSERT:
          handleDeltaInsert(ctx, records[i], EPPrecords)
          .then(res => res.recordSkipped?ctx.vtex.logger.info("EPP delta import - insert EPP user "+records[i].emailAddress+": skipped"):"")
          .catch(err => ctx.vtex.logger.error("EPP delta import - insert EPP user "+records[i].emailAddress+": failed --err: "+(err.message!=undefined?err.message:JSON.stringify(err))+" --payload: "+JSON.stringify(records[i])));
          break;
        case EPPEventType.DELTA_DELETE:
          handleDeltaDelete(ctx, records[i], EPPrecords)
          .then(res => res.recordSkipped?ctx.vtex.logger.info("EPP delta import - disable EPP user "+records[i].emailAddress+": skipped"):"")
          .catch(err => ctx.vtex.logger.error("EPP delta import - disable EPP user "+records[i].emailAddress+": failed --err: "+(err.message!=undefined?err.message:JSON.stringify(err))+" --payload: "+JSON.stringify(records[i])));
          break;
        default:
          ctx.vtex.logger.error("EPP delta import - unknown event '"+records[i].event+"' for the EPP user "+records[i].emailAddress);
      }
      await wait(1);
    }
    resolve(true)
  })
}

async function handleDeltaInsert(ctx: Context, record: EPPExportRecord, EPPrecords: EMRecord[]): Promise<any> {
  return new Promise<any>((resolve,reject) => {
    let user = EPPrecords.find(f => f.email.toLowerCase()==record.emailAddress.toLowerCase());
    if(isValid(user)){
      if(user.status!=true){
        return updatePartialDocument(ctx, EMEntityName, user.id, {status: true}, 0, eppMaxRetry, eppMaxWaitTime).then(res => resolve(res)).catch(err => reject(err));
      }else{
        resolve({recordSkipped: true})
      }
    }else{
      return createDocument(ctx, EMEntityName, {email: record.emailAddress, status: true}, 0, eppMaxRetry, eppMaxWaitTime).then(res => resolve(res)).catch(err => reject(err));
    }
  })
}

async function handleDeltaDelete(ctx: Context, record: EPPExportRecord, EPPrecords: EMRecord[]): Promise<any> {
  return new Promise<any>((resolve,reject) => {
    let user = EPPrecords.find(f => f.email.toLowerCase()==record.emailAddress.toLowerCase());
    if(isValid(user)){
      if(user.status!=false){
        return updatePartialDocument(ctx, EMEntityName, user.id, {status: false}, 0, eppMaxRetry, eppMaxWaitTime).then(res => resolve(res)).catch(err => reject(err));
      }else{
        resolve({recordSkipped: true})
      }
    }else{
      reject({status: 404, message: "not found"});
    }
  })
}
