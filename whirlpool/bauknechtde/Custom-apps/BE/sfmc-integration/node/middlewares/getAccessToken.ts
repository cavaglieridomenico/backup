//@ts-nocheck

import { SFMCSettings } from "../typings/config";
import { TradePolicy } from "../typings/types";
import { getSFMCDataByTradePolicy, isValid, routeToLabel, sendAlert } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function getAccessToken(ctx: Context|StatusChangeContext|Invitation, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    let sfmcData: SFMCSettings = undefined;
    if(isValid(ctx.state.userInfo?.tradePolicy)){
      sfmcData = getSFMCDataByTradePolicy(ctx.state.appSettings, ctx.state.userInfo?.tradePolicy);
    }else{
      if(ctx.state.appSettings.vtex.isCCProject){
        if(isValid(ctx.body?.eventId)){
          sfmcData = getSFMCDataByTradePolicy(ctx.state.appSettings, TradePolicy.FF);
        }
      }else{
        sfmcData = getSFMCDataByTradePolicy(ctx.state.appSettings, TradePolicy.O2P);
      }
    }
    await checkSfmcData(sfmcData);
    ctx.state.accessToken = (await ctx.clients.SFMCAuth.getAccessToken(sfmcData))?.access_token;
    ctx.state.sfmcData = sfmcData;
    await next();
  }catch(err){
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    let label = routeToLabel(ctx);
    ctx.vtex.logger.error(label+msg);
    sendAlert(ctx);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function checkSfmcData(sfmcData: SFMCSettings): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if(isValid(sfmcData)){
      resolve(true)
    }else{
      reject({message: "invalid trade policy"});
    }
  })
}
