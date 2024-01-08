import { isValid, stringify, wait } from "../utils/commons";
import { AppSettings } from "../typings/config";
import { APP } from "@vtex/api";


export async function getAppSettings(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await checkAppSettings(ctx.state.appSettings);
    process.env[`${ctx.vtex.account}-SFMC`] = JSON.stringify({
      sfmcKey: ctx.state.appSettings.sfmcKey,
      hasNewsletterMDEntity: ctx.state.appSettings.hasNewsletterMDEntity,
      newsletterMDEntity : ctx.state.appSettings.newsletterMDEntity
    });

    await next();

  } catch (err) {
    let msg = err.message ? err.message : stringify(err);    
    ctx.state.logger.error("[Update user profiling optin] - " + msg);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context, retry: number = 0): Promise<AppSettings> {
  return new Promise<AppSettings>((resolve, reject) => {
    ctx.clients.apps.getAppSettings(APP.ID)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < 5) {
          await wait(250);
          return getAppSettingsWithRetry(ctx, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: `error while retrieving app settings --details: ${stringify(err)}` });
        }
      });
  })
}

async function checkAppSettings(appSettings: AppSettings): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (isValid(appSettings.sfmcKey)) {
      resolve(true)
    } else {
      reject({ message: "error while retrieving app settings --details: some app properties are empty" })
    }
  })
}
