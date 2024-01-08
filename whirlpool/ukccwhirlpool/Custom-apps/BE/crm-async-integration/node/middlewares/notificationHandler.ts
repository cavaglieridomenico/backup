//@ts-nocheck

import CoBody = require("co-body");
import { ADEntityFields, ADEntityName, CCEntityName, CCEntityFields, CLEntityName } from "../utils/constants";
import { mapADInfo, ADInfoAreEqual, mapCLInfo, getMostRecentAddress, CLInfoAreEqual, isAddressCreatedyTheBackflow, isValid, mapCCToCL } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { ForbiddenError } from "@vtex/api";
import { GoogleAuth } from "google-auth-library";
import { createDocument, updatePartialDocument, searchDocuments } from "../utils/documentCRUD";
import { getGCPClient, getGCPAuthToken } from "../clients/GCP";
import { AES256Decode } from "../utils/cryptography";
import { GCPPayload } from "../typings/GCP";
import { ADRecord, CCRecord, CLRecord, DOIStatus } from "../typings/types";

export async function notificationHandler(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    const gcpAuth = new GoogleAuth({
      projectId: ctx.state.appSettings.gcpProjectId,
      credentials: {
        client_email: ctx.state.appSettings.gcpClientEmail,
        private_key: AES256Decode(ctx.state.appSettings.gcpPrivateKey)
      }
    });
    let userData: CLRecord|ADRecord = await CoBody(ctx.req)
    switch(userData.notification){
      case "user created":
        handleUserCreated(ctx, userData, gcpAuth)
        .then(res => {
          if(!res.ignore){
            ctx.vtex.logger.info(res.message);
          }
        })
        .catch(err => {
          //console.log(err)
          ctx.vtex.logger.error(err.message!=undefined?err.message:("create customer: notification failed -- err: "+JSON.stringify(err)));
        });
        break;
      case "user updated":
        handleUserUpdated(ctx, userData, gcpAuth)
        .then(res => {
          if(!res.ignore){
            ctx.vtex.logger.info(res.message);
          }
        })
        .catch(err => {
          //console.log(err)
          ctx.vtex.logger.error(err.message!=undefined?err.message:("update customer: notification failed -- err: "+JSON.stringify(err)));
        });
        break;
      case "address created":
        handleAddressCreatedOrUpdated(ctx, userData, gcpAuth)
        .then(res => {
          if(!res.ignore){
            ctx.vtex.logger.info(res.message);
          }
        })
        .catch(err => {
          //console.log(err)
          ctx.vtex.logger.error(err.message!=undefined?err.message:("create address: notification failed -- err: "+JSON.stringify(err)));
        });
        break;
      case "address updated":
        handleAddressCreatedOrUpdated(ctx, userData, gcpAuth)
        .then(res => {
          if(!res.ignore){
            ctx.vtex.logger.info(res.message);
          }
        })
        .catch(err => {
          //console.log(err)
          ctx.vtex.logger.error(err.message!=undefined?err.message:("update address: notification failed -- err: "+JSON.stringify(err)));
        });
        break;
      case "address deleted":
        handleAddressDeleted(ctx, userData, gcpAuth)
        .then(res => {
          if(!res.ignore){
            ctx.vtex.logger.info(res.message);
          }
        })
        .catch(err => {
          //console.log(err)
          ctx.vtex.logger.error(err.message!=undefined?err.message:("delete address: notification failed -- err: "+JSON.stringify(err)));
        });
        break;
      default:
        throw new ForbiddenError("unknown notification");
    }
    ctx.status = 200;
    ctx.body= "OK";
  }catch(err){
    //console.log(err)
    ctx.body = err.message!=undefined?err.message:"Internal Server Error";
    ctx.status = err.status!=undefined?err.status:500;
    ctx.vtex.logger.error(err.status==403?("unknown notification -- err: "+JSON.stringify(err)):("unknown error -- details: "+JSON.stringify(err)));
  }
  await next();
}

async function handleUserCreated(ctx: Context, userData: CLRecord, gcpAuth: GoogleAuth): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    try{
      let customer = mapCLInfo(ctx, userData);
      await createDocument(ctx, CCEntityName, customer);
      let updatedCLRecord = mapCCToCL(customer); // for DOI scope
      await updatePartialDocument(ctx, CLEntityName, customer.vtexUserId, {webId: customer.webId, isNewsletterOptIn: updatedCLRecord.isNewsletterOptIn, doubleOptinStatus: updatedCLRecord.doubleOptinStatus})
      const gcpClient = await getGCPClient(gcpAuth);
      const token = await getGCPAuthToken(ctx, gcpClient);
      let gcpNotififaction: GCPPayload = {
        event: "NEW",
        userId: userData.id,
        brand: ctx.state.appSettings.gcpBrand,
        country: ctx.state.appSettings.gcpCountry
      }
      await ctx.clients.GCP.notify(gcpNotififaction, token);
      resolve({message: "create customer "+userData.id+": notification sent -- data: "+JSON.stringify(customer), status: 200, ignore: false});
    }catch(err){
      //console.log(err)
      reject({message: "create customer "+userData.id+": notification failed -- err: "+(err.message!=undefined?err.message:(err.response?.data!=undefined?err.response.data:JSON.stringify(err))),
      status: err.status!=undefined?err.status:(err.response?.status!=undefined?err.response.status:500), ignore: false});
    }
  });
}

async function handleUserUpdated(ctx: Context, userData: CLRecord, gcpAuth: GoogleAuth): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    let ignoreLog = true;
    try{
      let customer = mapCLInfo(ctx, userData);
      let ccRecord: CCRecord = (await searchDocuments(ctx, CCEntityName, CCEntityFields, "vtexUserId="+userData.id, {page: 1, pageSize: 100}, true))[0];
      if(ccRecord==undefined){
        return handleUserCreated(ctx,userData,gcpAuth).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }
      if(!CLInfoAreEqual(customer,ccRecord)){
        await updatePartialDocument(ctx, CCEntityName, ccRecord.id, customer);
        if(!ctx.state.appSettings.doubleOptin || (ctx.state.appSettings.doubleOptin && userData.doubleOptinStatus!=DOIStatus.PENDING)){ //userData needed for the case noOptin --> optin
          const gcpClient = await getGCPClient(gcpAuth);
          const token = await getGCPAuthToken(ctx, gcpClient);
          let gcpNotififaction: GCPPayload = {
            event: "OLD",
            userId: userData.id,
            brand: ctx.state.appSettings.gcpBrand,
            country: ctx.state.appSettings.gcpCountry
          }
          await ctx.clients.GCP.notify(gcpNotififaction, token);
          ignoreLog = false;
        }
      }
      // for DOI Scope //
      let updatedCLRecord = mapCCToCL(customer);
      if((updatedCLRecord.isNewsletterOptIn+"")!=(userData.isNewsletterOptIn+"") || (updatedCLRecord.doubleOptinStatus+"")!=(userData.doubleOptinStatus+"")){
        await updatePartialDocument(ctx, CLEntityName, userData.id, {isNewsletterOptIn: updatedCLRecord.isNewsletterOptIn, doubleOptinStatus: updatedCLRecord.doubleOptinStatus})
      }
      ///////////////////
      resolve({message: "update customer "+userData.id+": notification sent -- data: "+JSON.stringify(customer), status: 200, ignore: ignoreLog});
    }catch(err){
      //console.log(err)
      reject({message: "update customer "+userData.id+": notification failed -- err: "+(err.message!=undefined?err.message:(err.response?.data!=undefined?err.response.data:JSON.stringify(err))),
      status: err.status!=undefined?err.status:(err.response?.status!=undefined?err.response.status:500), ignore: false});
    }
  });
}

async function handleAddressCreatedOrUpdated(ctx: Context, userData: ADRecord, gcpAuth: GoogleAuth): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    let ignoreLog = true;
    try{
      let address = mapADInfo(ctx, userData);
      let ccRecord: CCRecord = (await searchDocuments(ctx, CCEntityName, CCEntityFields, "vtexUserId="+userData.userId, {page: 1, pageSize: 100}, true))[0];
      if(!ADInfoAreEqual(address,ccRecord)){
        await updatePartialDocument(ctx, CCEntityName, ccRecord.id, address);
        if(!isAddressCreatedyTheBackflow(userData) && (!ctx.state.appSettings.doubleOptin || (ctx.state.appSettings.doubleOptin && ccRecord.doubleOptinStatus!=DOIStatus.PENDING))){
          const gcpClient = await getGCPClient(gcpAuth);
          const token = await getGCPAuthToken(ctx, gcpClient);
          let gcpNotififaction: GCPPayload = {
            event: "OLD",
            userId: userData.userId,
            brand: ctx.state.appSettings.gcpBrand,
            country: ctx.state.appSettings.gcpCountry
          }
          await ctx.clients.GCP.notify(gcpNotififaction, token);
          ignoreLog = false;
        }
      }
      resolve({message: "create / update address "+userData.userId+": notification sent -- data: "+JSON.stringify(address), status: 200, ignore: ignoreLog});
    }catch(err){
      //console.log(error);
      reject({message: "create / update address "+userData.userId+": notification failed -- err: "+(err.message!=undefined?err.message:(err.response?.data!=undefined?err.response.data:JSON.stringify(err))),
      status: err.status!=undefined?err.status:(err.response?.status!=undefined?err.response.status:500), ignore: false});
    }
  });
}

async function handleAddressDeleted(ctx: Context, userData: ADRecord, gcpAuth: GoogleAuth): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    let ignoreLog = true;
    try{
      let results = await Promise.all(
        [
          searchDocuments(ctx, ADEntityName, ADEntityFields, "userId="+userData.userId, {page: 1, pageSize: 1000}, false),
          searchDocuments(ctx, CCEntityName, CCEntityFields, "vtexUserId="+userData.userId, {page: 1, pageSize: 1000}, false)
        ]
      );
      let addresses: ADRecord[] = results[0];
      let ccRecord: CCRecord = results[1][0];
      let address = {};
      if(addresses.length>0){
        let recentAddress = getMostRecentAddress(addresses);
        address = mapADInfo(ctx, recentAddress);
        if(!ADInfoAreEqual(address,ccRecord)){
          await updatePartialDocument(ctx, CCEntityName, ccRecord.id, address);
          if(!ctx.state.appSettings.doubleOptin || (ctx.state.appSettings.doubleOptin && ccRecord.doubleOptinStatus!=DOIStatus.PENDING)){
            const gcpClient = await getGCPClient(gcpAuth);
            const token = await getGCPAuthToken(ctx, gcpClient);
            let gcpNotififaction: GCPPayload = {
              event: "OLD",
              userId: userData.userId,
              brand: ctx.state.appSettings.gcpBrand,
              country: ctx.state.appSettings.gcpCountry
            }
            await ctx.clients.GCP.notify(gcpNotififaction, token);
            ignoreLog = false;
          }
        }
      }else{
        await updatePartialDocument(ctx, CCEntityName, ccRecord.id, {addressId: null});
      }
      resolve({message: "delete address "+userData.userId+": notification sent -- data: "+JSON.stringify(address), status: 200, ignore: ignoreLog});
    }catch(err){
      //console.log(err)
      reject({message: "delete address "+userData.userId+": notification failed -- err: "+(err.message!=undefined?err.message:(err.response?.data!=undefined?err.response.data:JSON.stringify(err))),
      status: err.status!=undefined?err.status:(err.response?.status!=undefined?err.response.status:500), ignore: false});
    }
  });
}
