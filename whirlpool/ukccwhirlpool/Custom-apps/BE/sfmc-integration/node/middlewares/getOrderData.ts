//@ts-nocheck

import { CustomLogger } from "../utils/Logger";
import { getOrderIdByCtx, isValidTradePolicy, routeToLabel, sendAlert } from "../utils/functions";
import { UserInfo } from "../typings/types";
import { getUserInfoByParam } from "../clients/VtexMP";

export async function getOrderData(ctx: Context|StatusChangeContext, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  let orderId = getOrderIdByCtx(ctx);
  let blackList = ctx.state.appSettings.vtex.mpOrderBlackList?.split(";");
  let orderBelongsToBL = false;
  for(let i=0; i<blackList?.length && !orderBelongsToBL; i++){
    if(orderId.includes(blackList[i])){
      orderBelongsToBL=true;
    }
  }
  if(!orderBelongsToBL){
    try{
      ctx.state.orderData = (await ctx.clients.VtexMP.getOrder(orderId)).data;
      let skuContextEmailPromises = [];
      let distinctSkus = [];
      ctx.state.orderData.items.forEach(i => {
        if(!distinctSkus.includes(i.id)){
          distinctSkus.push(i.id);
        }
      })
      distinctSkus.forEach(s => {
        skuContextEmailPromises.push(new Promise<any>((resolve,reject) => {
          ctx.clients.VtexMP.getSkuContext(s)
          .then(res => resolve({skuId: s, context: res.data}))
          .catch(err => reject(err));
        }));
      });
      skuContextEmailPromises.push(getUserInfoByParam(ctx, "userId", ctx.state.orderData?.clientProfileData?.userProfileId));
      let skuContextEmailResponses = await Promise.all(skuContextEmailPromises);
      ctx.state.skuContexts = skuContextEmailResponses.filter(f => f.context!=undefined);
      ctx.state.userInfo = skuContextEmailResponses.find(f => f.email!=undefined);
      if(isValidTradePolicy(ctx, ctx.state.userInfo.tradePolicy)){
        ctx.state.distinctSkus = distinctSkus;
        await next();
      }else{
        ctx.status = 500;
        ctx.body = "Invalid Trade Policy";
        ctx.vtex.logger.error(label+"invalid trade policy");
      }
    }catch(err){
      //console.log(err)
      let msg = err.message!=undefined?err.message:JSON.stringify(err);
      ctx.vtex.logger.error(label+msg);
      sendAlert(ctx);
      ctx.status = 500;
      ctx.body = "Internal Server Error";
    }
  }else{
    ctx.status = 403;
    ctx.body = "Forbidden Access";
  }
}
