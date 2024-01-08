//@ts-nocheck

import { AppSettings } from "../typings/config";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { getCircularReplacer, isValid, routeToLabel, sendAlert } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";


export async function getAppSettings(ctx: Context|StatusChangeContext, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try{
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await checkAppSettings(ctx.state.appSettings);
    process.env.DnG = JSON.stringify(ctx.state.appSettings);
    await next();
  }catch(err){
    //console.log(err);
    let msg = err.message ? err.message : JSON.stringify(err);
    label ? ctx.vtex.logger.error(label+msg) : "";
    sendAlert(ctx);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context, retry: number = 0): Promise<AppSettings>{
  return new Promise<AppSettings>((resolve,reject) => {
    ctx.clients.apps.getAppSettings(ctx.vtex.account+".dng-service")
    .then(res => resolve(res))
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime);
        return getAppSettingsWithRetry(ctx, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "error while retrieving app settings --details: "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())});
      }
    });
  })
}

async function checkAppSettings(appSettings: AppSettings): Promise<boolean> {
  return new Promise<boolean>((resolve,reject) => {
    if(isValid(appSettings.dng.client) && isValid(appSettings.dng.clientChannel) && isValid(appSettings.dng.clientReference) && isValid(appSettings.dng.hostname) && isValid(appSettings.dng.username) &&
      isValid(appSettings.dng.password) && isValid(appSettings.dng.redirectUrl) && isValid(appSettings.dng.promoCode) && isValid(appSettings.vtex.mdName) & isValid(appSettings.vtex.legalWarrantyId) &&
      isValid(appSettings.vtex.extendedWarrantyId) && isValid(appSettings.vtex.defaultCountry) && isValid(appSettings.vtex.commCodeSpecName) && isValid(appSettings.vtex.enabledAPICredentials)){
      resolve(true);
    }else{
      reject({message: "error while retrieving app settings --details: some app properties are empty"})
    }
  })
}
