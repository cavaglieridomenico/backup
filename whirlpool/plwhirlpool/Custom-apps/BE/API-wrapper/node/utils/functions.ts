//@ts-nocheck

import { localeMap, sapCodeToBillingType } from "./constants";

export function isValid(field: string): Boolean{
  return field!=undefined && field!=null && field!="null" && field!="" && field!=" " && field!=!"-" && field!="_";
}

export function getInvoiceName(ctx: Context, name: string){
  try{
    let slices = name.split("-");
    let invoiceName = sapCodeToBillingType[(slices[0]+"").toUpperCase()][localeMap[ctx.vtex.account]]+"-"+slices[1];
    return invoiceName;
  }catch(err){
    return name;
  }
}

export async function wait(time: number): Promise<any>{
  return new Promise<any>((resolve) => {
    setTimeout(() => {resolve(true)},time);
  })
}
