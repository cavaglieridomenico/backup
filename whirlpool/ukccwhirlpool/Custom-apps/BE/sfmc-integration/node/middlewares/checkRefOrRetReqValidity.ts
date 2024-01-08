//@ts-nocheck

import { getUserInfoByParam } from "../clients/VtexMP";
import { UserInfo } from "../typings/types";
import { isValidTradePolicy, routeToLabel } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function checkRefOrRetReqValidity(ctx: Context, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try{
    if(ctx.state.appSettings.vtex.retRefIntegrityCheck){
      let userInfo = await getUserInfoByParam(ctx, "email", ctx.state.reqPayload.ContactAttributes.SubscriberAttributes.ClientEmail);
      if(isValidTradePolicy(ctx, userInfo.tradePolicy)){
        let blackList = ctx.state.appSettings.vtex.mpOrderBlackList?.split(";");
        let orderBelongsToBL = false;
        for(let i=0; i<blackList?.length && !orderBelongsToBL; i++){
          if(ctx.state.reqPayload.ContactAttributes.SubscriberAttributes.OrderNumber.includes(blackList[i])){
            orderBelongsToBL=true;
          }
        }
        if(!orderBelongsToBL){
          let userOrders = (await ctx.clients.VtexMP.getOrdersByEmail(userInfo.email, 1, 15, ctx.state.reqPayload.ContactAttributes.SubscriberAttributes.OrderNumber)).data?.list;
          if(userOrders.length>0){
            let order = (await ctx.clients.VtexMP.getOrder(ctx.state.reqPayload.ContactAttributes.SubscriberAttributes.OrderNumber)).data;
            let productId = ctx.state.reqPayload.ContactAttributes.SubscriberAttributes.ProductCode.trim();
            productId = productId.includes("-WER")?productId.split("-")[0]:productId;
            let found = order.items.find(f => f.refId==productId || f.ean==productId)!=undefined?true:false;
            if(found){
              ctx.state.userInfo = userInfo;
              await next();
            }else{
              ctx.status = 500;
              ctx.body = "Internal Server Error";
              ctx.vtex.logger.error(label+"product "+productId+" not found in the specified order --payload: "+JSON.stringify(ctx.state.reqPayload));
            }
          }else{
            ctx.status = 500;
            ctx.body = "Internal Server Error";
            ctx.vtex.logger.error(label+"order not found --payload: "+JSON.stringify(ctx.state.reqPayload));
          }
        }else{
          ctx.status = 500;
          ctx.body = "Internal Server Error";
        }
      }else{
        ctx.status = 500;
        ctx.body = "Internal Server Error";
        ctx.vtex.logger.error(label+"invalid trade policy --payload: "+JSON.stringify(ctx.state.reqPayload));
      }
    }else{
      await next();
    }
  }catch(err){
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    ctx.vtex.logger.error(label+msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
