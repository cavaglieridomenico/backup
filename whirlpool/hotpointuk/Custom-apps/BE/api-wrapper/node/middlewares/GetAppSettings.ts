import { APP } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { CustomLogger } from "../utils/customLogger";
import { routeToLabel, wait } from "../utils/functions";

export async function getAppSettings(ctx: Context | NewOrder, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await next();
  } catch (err) {
    if (label != undefined) {
      ctx.vtex.logger.error(label + err.msg);
    }
  }
}

async function getAppSettingsWithRetry(ctx: Context | NewOrder, retry: number = 0): Promise<AppSettings> {
  return new Promise<AppSettings>((resolve, reject) => {
    ctx.clients.apps.getAppSettings(APP.ID)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return getAppSettingsWithRetry(ctx, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: "error while retrieving app settings --details: " + JSON.stringify(err) });
        }
      });
  })
}
