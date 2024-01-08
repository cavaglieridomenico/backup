//@ts-nocheck

import { DGRecord } from "../typings/types";
import { AlertEntity, vbaseBucket } from "./constants";
import { createDocument, searchDocuments } from "./documentCRUD";

export function isValid(field: any): Boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
}

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

export function formatPrice(price: number): string {
  price = price.toString();
  return price=="0"?"0.00":(price.substring(0, price.length-2)+"."+ price.substring(price.length-2,price.length));
}

export async function retrieveItemToken(ctx: Context, orderId: string, itemId: string, warrantyId: string): Promise<string>{
  return new Promise<string>((resolve,reject) => {
    ctx.clients.vbase.getJSON(vbaseBucket, orderId+"-"+itemId+"-"+warrantyId, true)
    .then(token => {
      if(isValid(token)){
        resolve(token)
        ctx.clients.vbase.deleteFile(vbaseBucket, orderId+"-"+itemId+"-"+warrantyId)
      }else{
        searchDocuments(ctx, ctx.state.appSettings.vtex.mdName, ["itemToken"], "orderId="+orderId+" AND itemId="+itemId+" AND typeOfWarranty="+warrantyId, {page: 1, pageSize: 5}, true)
        .then((res: DGRecord[]) => res.length>0 ? resolve(res[0].itemToken) : reject(false))
        .catch(err => reject(err))
      }
    })
    .catch(() => {
      searchDocuments(ctx, ctx.state.appSettings.vtex.mdName, ["itemToken"], "orderId="+orderId+" AND itemId="+itemId+" AND typeOfWarranty="+warrantyId, {page: 1, pageSize: 5}, true)
      .then((res: DGRecord[]) => res.length>0 ? resolve(res[0].itemToken) : reject(false))
      .catch(err => reject(err))
    })
  })
}

export function routeToLabel(ctx: Context | StatusChangeContext): string|undefined {
  let label = undefined;
  if(ctx.vtex.eventInfo?.sender==undefined){
    switch(ctx.vtex.route.id){
      case "sendDataToDng":
        label = "Data sending to DnG - order "+ctx.vtex.route.params.orderId+": ";
        break;
    }
  }else{
    label = "Data sending to DnG - order "+ctx.body.orderId+": ";
  }
  return label;
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export function sendAlert(ctx: Context): Promise<boolean> {
  return new Promise<boolean>(async(resolve, reject) => {
    try{
      if(ctx.vtex.eventInfo?.sender!=undefined){
        await createDocument(ctx, AlertEntity, {subject: "D&G Error", message: "Error while sending order data to D&G. Order id: "+ctx.body.orderId+"."})
      }
      resolve(true)
    }catch(err){
      reject(err)
    }
  })
}
