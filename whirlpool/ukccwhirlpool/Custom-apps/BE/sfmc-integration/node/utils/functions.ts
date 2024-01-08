//@ts-nocheck

import { json } from 'co-body'
import { AddServGeneralInfo, AppSettings, SFMCSettings } from '../typings/config';
import { TradePolicy } from "../typings/types";
import { AlertEntity, maxRetries, maxTime, serviceName } from "./constants";
import { createDocument } from './documentCRUD';

export async function wait(time: number): Promise<Boolean> {
  return new Promise<Boolean>((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time);
  });
}

export function isValid(param: any): Boolean{
  return param!=undefined && param!=null && param!="undefined" && param!="null" && param!="" && param!=" " && param!="-" && param!="_";
}

export function isValidTradePolicy(ctx: Context, tradePolicy: string): Boolean{
  let result = false;
  if(ctx.state.appSettings.vtex.isCCProject){
    result = tradePolicy==TradePolicy.EPP || tradePolicy==TradePolicy.FF || tradePolicy==TradePolicy.VIP;
  }else{
    result = !isValid(tradePolicy) || tradePolicy==TradePolicy.O2P;
  }
  return result;
}

export function isValidReturnOrRefundForm(payload: Object): Boolean {
  return isValid(payload.ContactAttributes?.SubscriberAttributes?.ClientEmail) && isValid(payload.ContactAttributes?.SubscriberAttributes?.OrderNumber)
          && isValid(payload.ContactAttributes?.SubscriberAttributes?.ProductCode)
}

export function getSFMCDataByTradePolicy(appSettings: AppSettings, tradePolicy: string): SFMCSettings{
  let result: SFMCSettings = undefined;
  switch(tradePolicy){
    case TradePolicy.O2P:
      result = appSettings.o2p;
      break;
    case TradePolicy.EPP:
      result = appSettings.epp;
      break;
    case TradePolicy.FF:
      result = appSettings.ff;
      break;
    case TradePolicy.VIP:
      result = appSettings.vip;
      break;
  }
  return result;
}

export function routeToLabel(ctx: Context|StatusChangeContext|Invitation): string{
  let label = "Unknown event: ";
  if(ctx.vtex.eventInfo?.sender==undefined){
    switch(ctx.vtex.route.id){
      case "createOrder":
        label = "Create order "+ctx.vtex.route.params.orderId+": ";
        break;
      case "cancelOrder":
        label = "Cancel order "+ctx.vtex.route.params.orderId+": ";
        break;
      case "refundOrder":
        label = "Refund order: ";
        break;
      case "returnOrder":
        label = "Return order: ";
        break;
    }
  }else{
    if(isValid(ctx.body.eventId)){
      label = ctx.body.eventId+" "+ctx.body.invitedUser+": ";
    }else{
      label = "Create order "+ctx.body.orderId+": ";
    }
  }
  return label;
}

export function getOrderIdByCtx(ctx: Context|StatusChangeContext): any{
  if(ctx.vtex.eventInfo?.sender==undefined){
    return ctx.vtex.route.params.orderId;
  }
  return ctx.body.orderId;
}

export function alignServiceNames(additionalServices: AddServGeneralInfo[], order: Object): Object{
  for(let i=0; i<order.items.length; i++){
    for(let j=0; j<order.items[i].bundleItems.length; j++){
      let name = additionalServices?.find(s => s.serviceIds?.split(",").includes(order.items[i].bundleItems[j].additionalInfo.offeringTypeId+""))?.serviceName;
      if(isValid(name)){
        order.items[i].bundleItems[j].name = name;
      }
    }
  }
  return order;
}

export async function getRequestPayload(ctx: Context|StatusChangeContext, retry: number = 0) {
  return new Promise<any>((resolve,reject) => {
    json(ctx.req)
    .then(res => resolve(res))
    .catch(async(err) => {
      if(retry<maxRetries){
        await wait(maxTime);
        return getRequestPayload(ctx, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "error while retrieving request payload --details "+JSON.stringify(err.response?.data!=undefined?err.response.data:err)});
      }
    });
  });
}

export function getProductUrl(ctx: Context, tradePolicy: string, skuContext: any): string {
  let baseUrl = "https://";
  switch(tradePolicy){
    case TradePolicy.EPP:
      baseUrl += ctx.state.appSettings.epp?.hostname;
      break;
    case TradePolicy.FF:
      baseUrl += ctx.state.appSettings.ff?.hostname;
      break;
    case TradePolicy.VIP:
      baseUrl += ctx.state.appSettings.vip?.hostname;
      break;
    case TradePolicy.O2P:
      baseUrl += ctx.state.appSettings.o2p?.hostname;
      break;
    default:
      baseUrl += ctx.hostname;
  }
  return baseUrl+skuContext.DetailUrl;
}

export function sendAlert(ctx: Context): Promise<boolean> {
  return new Promise<boolean>(async(resolve, reject) => {
    try{
      if(ctx.vtex.eventInfo?.sender==undefined){
        switch(ctx.vtex.route.id){
          case "cancelOrder":
            await createDocument(ctx, AlertEntity, {subject: "SFMC Error", message: "Error while sending the cancellation email for the order "+ctx.vtex.route.params.orderId+"."})
            break;
        }
      }else{
        if(!isValid(ctx.body.eventId)){
          await createDocument(ctx, AlertEntity, {subject: "SFMC Error", message: "Error while sending the confirmation email for the order "+ctx.body.orderId+"."})
        }
      }
      resolve(true)
    }catch(err){
      reject(err)
    }
  })
}
