//@ts-nocheck

import { AppSettings } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { routeToLabel, sendAlert, wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";


export async function getAppSettings(ctx: Context|StatusChangeContext|Invitation, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    process.env.SFMC = JSON.stringify(ctx.state.appSettings);
    await next();
  }catch(err){
    console.log(err);
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    let label = routeToLabel(ctx);
    ctx.vtex.logger.error(label+msg);
    sendAlert(ctx);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context|StatusChangeContext|Invitation, retry: number = 0): Promise<AppSettings>{
  return new Promise<AppSettings>((resolve,reject) => {
    ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID)
    .then(res => resolve(res))
    .catch(async(err) => {
      if(retry<maxRetries){
        await wait(maxTime);
        return getAppSettingsWithRetry(ctx, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "error while retrieving app settings --details: "+JSON.stringify(err.response?.data!=undefined?err.response.data:err)});
      }
    });
  })
}
