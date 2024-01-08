import { stringify } from "querystring";
import { AppSettings } from "../typings/configs";
import { maxRetries, maxTime } from "../utils/constants";
import { wait } from "../utils/functions";

export async function getAppSettings(ctx: Context, next: () => Promise<any>) {

  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await next();
  } catch (err) {
    (ctx as Context).status = 500;
  }
}

async function getAppSettingsWithRetry(ctx: Context, retry: number = 0): Promise<AppSettings> {

  return new Promise<AppSettings>((resolve, reject) => {

    ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetries) {
          await wait(maxTime);
          return getAppSettingsWithRetry(ctx, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: "error while retrieving app settings --details: " + stringify(err.response?.data ? err.response.data : err) });
        }
      });
  })
}
