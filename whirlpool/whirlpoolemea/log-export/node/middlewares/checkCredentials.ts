//@ts-nocheck

import { sha512 } from "../utils/cryptography";

export async function checkCredentials(ctx: Context, next: () => Promise<any>){
  try{
    let enabledCredentials = ctx.state.config;
    if(enabledCredentials!=undefined){
      let found = enabledCredentials.key==sha512(ctx.get("X-VTEX-API-AppKey")).substring(0,64) && enabledCredentials.token==sha512(ctx.get('X-VTEX-API-AppToken')).substring(0,64);
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
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
