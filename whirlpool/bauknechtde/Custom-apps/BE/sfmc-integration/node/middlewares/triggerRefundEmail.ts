//@ts-nocheck

import { routeToLabel } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";
import { refundEmailMapper } from "../utils/mapper";

export async function triggerRefundEmail(ctx: Context, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try{
    let payload = refundEmailMapper(ctx.state.reqPayload);
    let res = await ctx.clients.SFMCRest.triggerEmail(payload, ctx.state.sfmcData?.refundEmailKey, ctx.state.accessToken);
    ctx.vtex.logger.info(label+res.message);
    ctx.status = 200;
    ctx.body = "OK";
    await next();
  }catch(err){
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    ctx.vtex.logger.error(label+msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
