import { APP, Apps } from "@vtex/api";
import { CustomLogger } from "../utils/Logger";
import { stringify } from "../utils/functions";

export async function GetAppSettings(ctx: Context, next: () => Promise<any>) {
  try {
    const logger = new CustomLogger(ctx);
    ctx.vtex.logger = logger
    ctx.set("Cache-Control", "no-store")
    ctx.state.settings = await getAppSettingsWithRetry(ctx.clients.apps);
    process.env[`${ctx.vtex.account}-WP_URL`] = ctx.state.settings.wpUrl
    await next();
  } catch (err) {
    ctx.state.logger.error(`[GET APP SETTINGS] error: ${stringify(err)}`)
    ctx.status = 500;
    ctx.body = err.message || "Internal Server Error";
  }
}

const getAppSettingsWithRetry = (Apps: Apps, retry: number = 0): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    Apps.getAppSettings(APP.ID)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < 5) {
          return getAppSettingsWithRetry(Apps, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: "error while retrieving app settings --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
        }
      });
  })
}