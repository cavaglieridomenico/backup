import { APP } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { routeToLabel, stringify, wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function getAppSettings(ctx: Context | OrderEvent, next: () => Promise<any>) {
  const logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await next();
  } catch (err) {
    console.error(err);
    let msg = label + err.msg;
    logger.error(msg);
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context | OrderEvent, retry: number = 0): Promise<AppSettings> {
  return new Promise<AppSettings>((resolve, reject) => {
    ctx.clients.apps.getAppSettings(APP.ID)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return getAppSettingsWithRetry(ctx, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: `error while retrieving app settings --details: ${stringify(err)}` });
        }
      });
  })
}
