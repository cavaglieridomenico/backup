//@ts-nocheck

import CoBody = require("co-body");
import { accessKey, ccFields } from "../utils/constants";
import { mapADInfo, ADInfoAreEqual, mapCLInfo, getMostRecentAddress, CLInfoAreEqual, isAddressCreatedyTheBackflow } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { APP, ForbiddenError } from "@vtex/api";
import { createDocument, updatePartialDocument, searchDocuments } from "../utils/documentCRUD";
import { stringify } from "../utils/functions";

export async function notificationHandler(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  if(ctx.req.headers["app-key"]==accessKey){
    try{
      ctx.state.appSettings = await ctx.clients.apps.getAppSettings(APP.ID);
      process.env.CRM = JSON.stringify(ctx.state.appSettings);
      let userData = await CoBody(ctx.req);
      switch(userData.notification){
        case "user created":
          handleUserCreated(ctx, userData)
          .then(res => {
            if(!res.ignore){
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            ctx.vtex.logger.error(err.message ? err.message : "create customer: notification failed -- err: "+stringify(err));
          });
          break;
        case "user updated":
          handleUserUpdated(ctx, userData)
          .then(res => {
            if(!res.ignore){
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            ctx.vtex.logger.error(err.message ? err.message : "update customer: notification failed -- err: "+stringify(err));
          });
          break;
        case "address created":
          handleAddressCreatedOrUpdated(ctx, userData)
          .then(res => {
            if(!res.ignore){
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            ctx.vtex.logger.error(err.message ? err.message : "create address: notification failed -- err: "+stringify(err));
          });
          break;
        case "address updated":
          handleAddressCreatedOrUpdated(ctx, userData)
          .then(res => {
            if(!res.ignore){
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            ctx.vtex.logger.error(err.message ? err.message : "update address: notification failed -- err: "+stringify(err));
          });
          break;
        case "address deleted":
          handleAddressDeleted(ctx, userData)
          .then(res => {
            if(!res.ignore){
              ctx.vtex.logger.info(res.message);
            }
          })
          .catch(err => {
            ctx.vtex.logger.error(err.message ? err.message : "delete address: notification failed -- err: "+stringify(err));
          });
          break;
        default:
          throw new ForbiddenError("unknown notification");
      }
      ctx.body = "OK";
      ctx.status = 200;
    }catch(err){
      //console.log(err)
      ctx.body = err.message ? err.message : "Internal Server Error";
      ctx.status = 500;
      ctx.vtex.logger.error(err.status==403 ? "unknown notification -- err: "+stringify(err) : "unknown error -- details: "+stringify(err));
    }
  }else{
    ctx.body = "Not Authorized";
    ctx.status = 403;
  }
  await next();
}

async function handleUserCreated(ctx: Context, userData: Object): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    try{
      let customer = mapCLInfo(ctx, userData);
      await createDocument(ctx, "CC", customer);
      await updatePartialDocument(ctx, "CL", customer.vtexUserId, {webId: customer.webId})
      await ctx.clients.GCP.notify({event: "NEW", userId: userData.id, country: ctx.state.appSettings.gcpCountry, brand: ctx.state.appSettings.gcpBrand});
      resolve({message: "create customer "+userData.id+": notification sent -- data: "+JSON.stringify(customer), status: 200, ignore: false});
    }catch(err){
      //console.log(err)
      reject({message: "create customer "+userData.id+": notification failed -- err: "+(err.message ? err.message : stringify(err)), status: 500, ignore: false});
    }
  });
}

async function handleUserUpdated(ctx: Context, userData: Object): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    let ignoreLog = true;
    try{
      let customer = mapCLInfo(ctx, userData);
      let ccRecord = (await searchDocuments(ctx, "CC", ccFields, "vtexUserId="+userData.id, {page: 1, pageSize: 100}))[0];
      if(ccRecord==undefined){
        return handleUserCreated(ctx,userData).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }
      if(!CLInfoAreEqual(customer,ccRecord)){
        await updatePartialDocument(ctx, "CC", ccRecord.id, customer);
        await ctx.clients.GCP.notify({event: "OLD", userId: userData.id, country: ctx.state.appSettings.gcpCountry, brand: ctx.state.appSettings.gcpBrand});
        ignoreLog = false;
        }
        resolve({message: "update customer "+userData.id+": notification sent -- data: "+JSON.stringify(customer), status: 200, ignore: ignoreLog});
      }catch(err){
        //console.log(err)
        reject({message: "update customer "+userData.id+": notification failed -- err: "+(err.message ? err.message : stringify(err)), status: 500, ignore: false});
      }
  });
}

async function handleAddressCreatedOrUpdated(ctx: Context, userData: Object): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    let ignoreLog = true;
    try{
      let address = mapADInfo(ctx, userData);
      let ccRecord = (await searchDocuments(ctx, "CC", ccFields, "vtexUserId="+userData.userId, {page: 1, pageSize: 100}))[0];
      if(!ADInfoAreEqual(address,ccRecord)){
        await updatePartialDocument(ctx, "CC", ccRecord.id, address);
        if(!isAddressCreatedyTheBackflow(userData)){
          await ctx.clients.GCP.notify({event: "OLD", userId: userData.userId, country: ctx.state.appSettings.gcpCountry, brand: ctx.state.appSettings.gcpBrand});
          ignoreLog = false;
        }
      }
      resolve({message: "create / update address "+userData.userId+": notification sent -- data: "+JSON.stringify(address), status: 200, ignore: ignoreLog});
    }catch(err){
      //console.log(error);
      reject({message: "create / update address "+userData.userId+": notification failed -- err: "+(err.message ? err.message : stringify(err)), status: 500, ignore: false});
    }
  });
}

async function handleAddressDeleted(ctx: Context, userData: Object): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    let ignoreLog = true;
    try{
      let p0 = new Promise<any>((resolve,reject) => {
        searchDocuments(ctx, "AD", ["id","addressType","street","number","complement","city","state","postalCode","country","lastInteractionIn"], "userId="+userData.userId, {page: 1, pageSize: 1000})
        .then(res => {
          resolve(res.filter(f => f.addressType.toLowerCase()=="residential"));
        })
        .catch(err => {
          reject(err);
        })
      });
      let p1 = new Promise<any>((resolve,reject) => {
        searchDocuments(ctx, "CC", ccFields, "vtexUserId="+userData.userId, {page: 1, pageSize: 1000})
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          reject(err);
        })
      });
      let results = await Promise.all([p0,p1]);
      let addresses: [] = results[0];
      let ccRecord = results[1];
      let address = {};
      if(addresses.length>0){
        let recentAddress = getMostRecentAddress(addresses);
        address = mapADInfo(ctx, recentAddress);
        if(!ADInfoAreEqual(address,ccRecord)){
          await updatePartialDocument(ctx, "CC", ccRecord.id, address);
          await ctx.clients.GCP.notify({event: "OLD", userId: userData.userId, country: ctx.state.appSettings.gcpCountry, brand: ctx.state.appSettings.gcpBrand});
          ignoreLog = false;
        }
      }else{
        await updatePartialDocument(ctx, "CC", ccRecord.id, {addressId: null});
      }
      resolve({message: "delete address "+userData.userId+": notification sent -- data: "+JSON.stringify(address), status: 200, ignore: ignoreLog});
    }catch(err){
      //console.log(err)
      reject({message: "delete address "+userData.userId+": notification failed -- err: "+(err.message ? err.message : stringify(err)), status: 500, ignore: false});
    }
  });
}
