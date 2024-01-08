
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
    process.env.PO = JSON.stringify({
      environment: ctx.state.appSettings.sappo.environment,
      password: ctx.state.appSettings.sappo.password,
    });
    await next();
  } catch (err) {
    console.error(err);
    let msg = label + err.msg;
    ctx.vtex.logger.error(msg);
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
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

async function checkAppSettings(appSettings: AppSettings): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (
      isValid(appSettings.sappo.environment) && isValid(appSettings.sappo.password) &&
      isValid(appSettings.vtex.enabledAPICredentials) && isValid(appSettings.vtex.inStockShippingPolicy) && isValid(appSettings.vtex.additionalServicesData) &&
      isValid(appSettings.vtex.categoriesMap) && isValid(appSettings.vtex.deliveryMatrix.mdName) && isValid(appSettings.vtex.deliveryTimeCalc.mdName) && isValid(appSettings.vtex.deliveryTimeCalc.mainRecordId) &&
      isValid(appSettings.vtex.depotConfiguration.mdName) && isValid(appSettings.vtex.depotConfiguration.defaultEOD) && isValid(appSettings.vtex.offsetTable.mdName) && isValid(appSettings.vtex.holidayTable.mdName) &&
      isValid(appSettings.vtex.reservationTable.mdName) &&
      isValid(appSettings.hdx.userId) && isValid(appSettings.hdx.password) && isValid(appSettings.hdx.systemID) && isValid(appSettings.hdx.clientNum) && isValid(appSettings.hdx.isoLanguageCode) &&
      isValid(appSettings.hdx.isoCountryCode) && isValid(appSettings.hdx.isoCurrencyCode) && isValid(appSettings.hdx.visitNumDays) && isValid(appSettings.hdx.visitTimeSlotGroupNum) &&
      isValid(appSettings.hdx.visitTimeSlotNum) && isValid(appSettings.hdx.visitReleasedInd)
    ) {
      resolve(true)
    } else {
      reject({ msg: `error while retrieving app settings --details: some app properties are empty` })
    }
  })
}
