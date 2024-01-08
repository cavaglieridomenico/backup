//@ts-nocheck

import { isValid, routeToLabel, wait } from "../utils/mapper";
import { CustomLogger } from "../utils/Logger";
import { AppSettings } from "../typings/types";


export async function getAppSettings(ctx: Context, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await checkAppSettings(ctx.state.appSettings);
    process.env.CRM = JSON.stringify({
      crmEnvironment: ctx.state.appSettings.crmEnvironment,
      crmPassword: ctx.state.appSettings.crmPassword,
      useSapPo: ctx.state.appSettings.useSapPo,
      gcpHost: ctx.state.appSettings.gcpHost
    });
    await next();
  }catch(err){
    //console.log(err);
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    let label = routeToLabel(ctx);
    ctx.vtex.logger.error(label+msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context, retry: number = 0): Promise<AppSettings>{
  return new Promise<AppSettings>((resolve,reject) => {
    ctx.clients.apps.getAppSettings(ctx.vtex.account+".crm-async-integration")
    .then(res => resolve(res))
    .catch(async(err) => {
      if(retry<5){
        await wait(250);
        return getAppSettingsWithRetry(ctx, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "error while retrieving app settings --details: "+JSON.stringify(err.response?.data!=undefined?err.response.data:err)});
      }
    });
  })
}

async function checkAppSettings(appSettings: AppSettings): Promise<boolean> {
  return new Promise<boolean>((resolve,reject) => {
    if(isValid(appSettings.crmEnvironment) && isValid(appSettings.crmPassword && isValid(appSettings.gcpHost) && isValid(appSettings.gcpProjectId) && isValid(appSettings.gcpClientEmail) &&
      isValid(appSettings.gcpPrivateKey) && isValid(appSettings.gcpTargetAudience) && isValid(appSettings.gcpBrand) && isValid(appSettings.gcpCountry) && isValid(appSettings.enabledAPICredentials)
      && isValid(appSettings.MDKey) && isValid(appSettings.enabledMDKeyHash) && isValid(appSettings.defaultLocale) && isValid(appSettings.localTimeLocale) && isValid(appSettings.localTimeZone) &&
      isValid(appSettings.webIdPrefix) && isValid(appSettings.maxNumOfDigitsForPhone) && isValid(appSettings.authCookie))){
      resolve(true)
    }else{
      reject({message: "error while retrieving app settings --details: some app properties are empty"})
    }
  })
}
