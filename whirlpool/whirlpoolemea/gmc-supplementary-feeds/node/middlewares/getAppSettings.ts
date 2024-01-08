
import { APP } from "@vtex/api";
import { AppSettings } from "../typings/configs";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions";

export async function getAppSettings(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    ctx.state.feedSettings = ctx.state.appSettings?.feedsSettings?.find(({ feedName }) => ctx.originalUrl.split("/").pop()?.toLowerCase().includes(feedName.toLowerCase()))
    if (ctx.state.feedSettings) {
      await next();
    } else {
      ctx.status = 400;
      ctx.body = "Invalid feed name"
      ctx.state.logger.error("[GET APP SETTINGS] - Invalid Feed Name")
    }
  } catch (err) {
    ctx.state.logger.error(`[GET APP SETTINGS] - ${stringify(err)}`);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context, retry: number = 0): Promise<AppSettings> {
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
