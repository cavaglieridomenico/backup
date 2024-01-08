import { APP } from "@vtex/api";
import { AppSettings } from "../typing/config";
import { isValid } from "../utils/functions";

export async function getAppSettings(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await ctx.clients.apps.getAppSettings(APP.ID);
    await checkAppSettings(ctx.state.appSettings!);
    await next();
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = err.msg ? err.msg : "Internal Server Error";
  }
}

async function checkAppSettings(appSettings: AppSettings): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (
      isValid(appSettings.sessionCookie) && isValid(appSettings.allowedCredentials) && isValid(appSettings.mdEntity) && isValid(appSettings.crmEvent) &&
      (
        (
          !appSettings.isCCProject &&
          isValid(appSettings.o2pInfo?.hostname)
        )
        ||
        (
          appSettings.isCCProject &&
          isValid(appSettings.eppInfo?.hostname) && isValid(appSettings.eppInfo?.tradePolicyId) && isValid(appSettings.eppInfo?.clusterLabel) &&
          isValid(appSettings.ffInfo?.hostname) && isValid(appSettings.ffInfo?.tradePolicyId) && isValid(appSettings.ffInfo?.clusterLabel) &&
          isValid(appSettings.vipInfo?.hostname) && isValid(appSettings.vipInfo?.tradePolicyId) & isValid(appSettings.vipInfo?.clusterLabel)
        )
      )
    ) {
      resolve(true)
    } else {
      reject({ msg: "Error while retrieving app settings --details: some app properties are empty" })
    }
  })
}
