import { wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";
import { AppSettings } from "../typings/interface";
import { CatalogUpdateEvent } from "..";
import { APP } from "@vtex/api";

export async function getAppSettings(ctx: CatalogUpdateEvent | Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
  } catch (err) {
    ctx.vtex.logger.error(err.message || err);
  }
  await next()
}

async function getAppSettingsWithRetry(ctx: CatalogUpdateEvent | Context, retry: number = 0): Promise<AppSettings> {
  return new Promise<AppSettings>((resolve, reject) => {
    ctx.clients.apps.getAppSettings(APP.ID)
      .then((res: any) => resolve(res))
      .catch(async (err: any) => {
        if (retry < 5) {
          await wait(250);
          return getAppSettingsWithRetry(ctx, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: "error while retrieving app settings --details: " + JSON.stringify(err.response?.data ? err.response.data : err) });
        }
      });
  })
}
