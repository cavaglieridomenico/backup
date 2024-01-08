//@ts-nocheck

import { getRequestPayload, isValidReturnOrRefundForm, routeToLabel } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function checkRefOrRetRequestPayload(ctx: Context, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    ctx.state.reqPayload = await getRequestPayload(ctx);
    if(isValidReturnOrRefundForm(ctx.state.reqPayload)){
      await next();
    }else{
      ctx.status = 400;
      ctx.body = "Bad Request";
    }
  }catch(err){
    let label = routeToLabel(ctx);
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    ctx.vtex.logger.error(label+msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
