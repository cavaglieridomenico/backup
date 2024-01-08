//@ts-nocheck

import { getEinsteinRecommendations } from "../clients/SFMCRecommender";
import { getTradePolicyByEmail } from "../clients/VtexMP";
import { getSFMCDataByTradePolicy, isValidTradePolicy } from "../utils/functions";

export async function getProductRecommendations(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  try{
    let authToken = ctx.cookies.get(ctx.state.appSettings.vtex.mpAuthCookie);
    let email = (await ctx.clients.VtexMP.getAuthenticatedUser(authToken)).data?.user;
    let tradePolicy = await getTradePolicyByEmail(ctx, email);
    if(isValidTradePolicy(ctx, tradePolicy)){
      let sfmcData = getSFMCDataByTradePolicy(ctx.state.appSettings, tradePolicy);
      //let recommendations = await ctx.clients.SFMCRecommender.getRecommendations(email, ctx.state.appSettings.vtex.defaultLocale5C, sfmcData);
      let recommendations = await getEinsteinRecommendations(email, ctx.state.appSettings.vtex.defaultLocale5C, sfmcData);
      let skuToReturn = [];
      let skuPromises = [];
      recommendations[0]?.items?.forEach(r => {
        if((r.image_link+"").includes(ctx.vtex.account)){
          skuPromises.push(new Promise<any>((resolve) => {
            ctx.clients.VtexMP.getSkuByRefId(r.sku_id)
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              resolve(undefined);
            })
          }))
        }
      })
      let skuPromisesResponses = await Promise.all(skuPromises);
      skuPromisesResponses.forEach(s => {
        if(s!=undefined){
          skuToReturn.push(s.Id);
        }
      })
      ctx.status = 200;
      ctx.body = skuToReturn;
    }else{
      ctx.status = 500;
      ctx.body = "Invalid Trade Policy"
    }
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error"
  }
  await next()
}
