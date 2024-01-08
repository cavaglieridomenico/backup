//@ts-nocheck

import { OrderDetails } from "../typings/types";
import { routeToLabel, sendAlert } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";
import { orderDetailsMapper } from "../utils/mapper";

export async function sendOrderDetails(ctx: Context|StatusChangeContext, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try{
    let orderDetails: OrderDetails = orderDetailsMapper(ctx.state.orderData, ctx, ctx.state.coupons, ctx.state.premiumProducts, ctx.state.skuContexts, ctx.state.skuImages);
    let res = await ctx.clients.SFMCRest.sendOrderDetails(orderDetails, ctx.state.sfmcData?.orderDetailsKey, ctx.state.accessToken);
    ctx.vtex.logger.info(label+res.message);
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
