//@ts-ignore
//@ts-nocheck

import {callSalesforceTokenApiRefund} from "./service.refoundreturn.order";
import {json} from 'co-body'
import { CustomLogger } from "../utils/Logger";

/**
 * returnOrder - called for refund operation  after filling in the online form
 * @param ctx reference to the object that "owns" the currently executing code
 * @param next 
 */
export async function returnOrder(
    ctx: Context,
    next: () => Promise<any>
) {
    ctx.set('Cache-Control', 'no-store');
    ctx.vtex.logger = new CustomLogger(ctx);
    let product = {};
    try{
      product = await json(ctx.req);
      const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
      process.env.TEST = JSON.stringify(appSettings);
      let res = await callSalesforceTokenApiRefund(ctx, JSON.parse(process.env.TEST+"").keyReturn, product, 2);
      ctx.status = res.status;
      ctx.message = res.message;
      ctx.vtex.logger.info(res.message);
    }catch(e){
      if(e.response==undefined){
        ctx.status = e.status;
        ctx.message = e.message;
        ctx.vtex.logger.error(e.message);
      }else{
        ctx.status = e?.response?.status;
        ctx.message = "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - app settings: "+e?.response?.data?.message;
        ctx.vtex.logger.error("Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - app settings: "+e?.response?.data?.message);
      }
    }
    await next()
}
