//@ts-nocheck

import { sha512 } from "../utils/cryptography";

export async function checkVtexCredentials(ctx: Context, next: () => Promise<any>){
  try{
    let enabledCredentials = ctx.state.appSettings.enabledAPICredentials?.split(";");
    if(enabledCredentials!=undefined){
      let found = enabledCredentials.find(f => f.split(":")[0]==sha512(ctx.get("X-VTEX-API-AppKey")).substring(0,64) && f.split(":")[1]==sha512(ctx.get('X-VTEX-API-AppToken')).substring(0,64));
      if(found!=undefined){
        await next();
      }else{
        ctx.status = 401;
        ctx.body = "Invalid Credentials";
      }
    }else{
      ctx.status = 403;
      ctx.body = "Forbidden Access";
    }
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}


export async function checkMDCredentials(ctx: Context, next: () => Promise<any>){
  try{
    let enabledMDKey = ctx.state.appSettings.enabledMDKeyHash;
    if(enabledMDKey!=undefined){
      let found = enabledMDKey==sha512(ctx.get("app-key")).substring(0,64);
      if(found){
        await next();
      }else{
        ctx.status = 401;
        ctx.body = "Invalid Credentials";
      }
    }else{
      ctx.status = 403;
      ctx.body = "Forbidden Access";
    }
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error"
  }
}
