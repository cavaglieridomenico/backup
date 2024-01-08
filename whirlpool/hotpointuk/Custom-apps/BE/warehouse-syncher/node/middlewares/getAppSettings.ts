import { APP } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { isValid, routeToLabel, stringify, wait } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function getAppSettings(ctx: Context | OrderEvent, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await checkAppSettings(ctx.state.appSettings);
    process.env.WHSYN = JSON.stringify(ctx.state.appSettings);
    await next();
  } catch (err) {
    console.error(err);
    let msg = err.msg ? err.msg : err;
    ctx.vtex.logger.error(label + stringify(msg));
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
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
          reject({ msg: "error while retrieving app settings --details: " + stringify(err) });
        }
      });
  })
}

async function checkAppSettings(appSettings: AppSettings): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (
      (
        isValid(appSettings.vtex.allowedCredentials) && appSettings.vtex.stockAvailability?.length > 0
      ) &&
      (
        appSettings.vtex.isMP ||
        (
          !appSettings.vtex.isMP &&
          isValid(appSettings.sappo.environment) && isValid(appSettings.sappo.password) && isValid(appSettings.sappo.sid) && isValid(appSettings.sappo.notificationThreshold) &&
          isValid(appSettings.vtex.inStockWarehouse) && isValid(appSettings.vtex.outOfStockWarehouse) && appSettings.vtex.categories?.length > 0 &&
          isValid(appSettings.vtex.shippingPolicyInStockMDA) && isValid(appSettings.vtex.resDefaultZipCode) && isValid(appSettings.vtex.resDefaultCountry) && isValid(appSettings.vtex.resExpiration) &&
          isValid(appSettings.vtex.mp?.accountName) && isValid(appSettings.vtex.mp?.username) && isValid(appSettings.vtex.mp?.psw) &&
          isValid(appSettings.vtex.mp?.realm) && isValid(appSettings.vtex.mp?.hashAlgorithm)
        )
      )
    ) {
      resolve(true)
    } else {
      reject({ msg: "error while retrieving app settings --details: some app properties are empty" })
    }
  })
}
