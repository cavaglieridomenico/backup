

import { APP } from "@vtex/api";
import { AppSettings } from "../typings/configs";
import { isValid } from "../utils/functions";

export async function GetAppSettings(ctx: Context | NewOrder, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await ctx.clients.apps.getAppSettings(APP.ID);
    await checkAppSettings(ctx.state.appSettings);
    await next();
  } catch (err) {
    (ctx as Context).status = 500;
    ctx.body = err.msg ? err.msg : "Internal Server Error";
  }
}

async function checkAppSettings(appSettings: AppSettings): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (
      !appSettings.isCCProject ||
      (
        appSettings.isCCProject && isValid(appSettings.EPP?.hostname) && isValid(appSettings.EPP?.tradePolicyId) &&
        isValid(appSettings.FF?.hostname) && isValid(appSettings.FF?.tradePolicyId) &&
        isValid(appSettings.VIP?.hostname) && isValid(appSettings.VIP?.tradePolicyId)
      )
    ) {
      resolve(true);
    } else {
      reject({ msg: "Some app properties aren't set up correctly" });
    }
  })
}
