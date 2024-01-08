import { APP } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { routeToLabel, sendAlert, stringify, wait } from "../utils/functions";

export async function getAppSettings(ctx: Context | StatusChangeContext | Invitation, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    process.env[`${ctx.vtex.account}-SELLER`] = JSON.stringify(ctx.state.appSettings.vtex.sellerAccount);
    process.env[`${ctx.vtex.account}-GCP`] = JSON.stringify(ctx.state.appSettings.gcp);
    process.env[`${ctx.vtex.account}-MKTPLACE`] = JSON.stringify({
      key: ctx.state.appSettings.vtex.mpAppKey,
      token: ctx.state.appSettings.vtex.mpAppToken
    });
    await next();
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    let label = routeToLabel(ctx);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context | StatusChangeContext | Invitation, retry: number = 0): Promise<AppSettings> {
  return new Promise<AppSettings>((resolve, reject) => {
    ctx.clients.apps.getAppSettings(APP.ID)
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
