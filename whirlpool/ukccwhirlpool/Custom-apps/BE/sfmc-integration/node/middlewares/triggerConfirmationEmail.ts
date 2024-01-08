//@ts-nocheck

import { OrderConfCancTemplate } from "../typings/types";
import { routeToLabel, sendAlert } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";
import { confCancEmailMapper } from "../utils/mapper";

export async function triggerConfirmationEmail(ctx: Context|StatusChangeContext, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try{
    let payload: OrderConfCancTemplate = confCancEmailMapper(ctx.state.orderData, ctx.state.ecofeeTotal, ctx.state.userInfo, ctx.state.appSettings);
    let res = await ctx.clients.SFMCRest.triggerEmail(payload, ctx.state.sfmcData?.confirmationEmailKey, ctx.state.accessToken);
    ctx.vtex.logger.info(label+res.message);
    ctx.status = 200;
    ctx.body = "OK";
    await next();
  }catch(err){
    //console.log(err)
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    ctx.vtex.logger.error(label+msg);
    sendAlert(ctx);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
