//@ts-nocheck

import { sha512 } from "../utils/hash";

export async function checkVtexCredentials(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  try{
    process.env.CRM = JSON.stringify(await ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID+""));
    let enabledCredentials = JSON.parse(process.env.CRM).enabledAPICredentials.split(";");
    ctx.status = 401;
    ctx.body = "Invalid Credentials";
    if(enabledCredentials!=undefined){
      let found = enabledCredentials.find(f => f.split(":")[0]==sha512(ctx.get("X-VTEX-API-AppKey")) && f.split(":")[1]==sha512(ctx.get('X-VTEX-API-AppToken')));
      if(found!=undefined){
        await next();
      }
    }
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error"
  }
}

export async function checkMDCredentials(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  try{
    process.env.CRM = JSON.stringify(await ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID+""));
    let enabledMDKey = JSON.parse(process.env.CRM).enabledMDKey;
    let found = enabledMDKey==sha512(ctx.get("app-key"));
    ctx.status = 401;
    ctx.body = "Invalid Credentials";
    if(found){
      await next();
    }
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error"
  }
}
