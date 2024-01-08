
import { APP } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { routeToLabel, stringify, wait } from "../utils/functions";
import { cleanUpAntiThrottler } from "./antiThrottler";

export async function getAppSettings(ctx: Context | OrderEvent, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    //set up of process environment variables, in order to pass information to clients
    process.env[`${ctx.vtex.account}-FarEye`] = JSON.stringify(ctx.state.appSettings.FarEye_Settings);
    process.env[`${ctx.vtex.account}-MarketPlace`] = JSON.stringify(ctx.state.appSettings.Vtex_Settings.Admin.MarketPlace);
    await next();
  } catch (err) {
    let label = routeToLabel(ctx);
    ctx.state.logger.error(`${label} ${err.msg}`);
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
    cleanUpAntiThrottler(ctx);
  }
}

async function getAppSettingsWithRetry(ctx: Context | OrderEvent, retry: number = 0): Promise<AppSettings> {
  return new Promise<AppSettings>((resolve, reject) => {
    ctx.clients.apps.getAppSettings(APP.ID)
      .then((res: any) => resolve(res))
      .catch(async (err: any) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return getAppSettingsWithRetry(ctx, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: `error while retrieving app settings --details: ${stringify(err)}` });
        }
      });
  })
}
