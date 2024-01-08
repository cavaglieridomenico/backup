import { isValid, routeToLabel, stringify, wait } from "../utils/commons";
import { AppSettings } from "../typings/config";
import { APP } from "@vtex/api";


export async function getAppSettings(ctx: Context | OrderEvent | NewsletterSubscription | LoggedUser, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await getAppSettingsWithRetry(ctx);
    await checkAppSettings(ctx.state.appSettings);
    process.env[`${ctx.vtex.account}-CRM`] = JSON.stringify({
      crmEnvironment: ctx.state.appSettings.crmEnvironment,
      crmPassword: ctx.state.appSettings.crmPassword,
      useSapPo: ctx.state.appSettings.useSapPo,
      isUkProject: ctx.state.appSettings.isUkProject
    });
    process.env[`${ctx.vtex.account}-GCP`] = JSON.stringify({
      gcpProjectId: ctx.state.appSettings.gcpProjectId,
      gcpTargetAudience: ctx.state.appSettings.gcpTargetAudience,
      gcpClientEmail: ctx.state.appSettings.gcpClientEmail,
      gcpPrivateKey: ctx.state.appSettings.gcpPrivateKey,
      gcpHost: ctx.state.appSettings.gcpHost,
      gcpBrand: ctx.state.appSettings.gcpBrand,
      gcpCountry: ctx.state.appSettings.gcpCountry
    });
    /*ctx.vtex.logger.debug({
      action: 'Context App Settings',
      account: ctx.vtex.account,
      Brand: ctx.state.appSettings.gcpBrand,
      Country: ctx.state.appSettings.gcpCountry
    })
    ctx.state.logger.debug(`account: ${ctx.vtex.account}; settings GCP: ${process.env[`${ctx.vtex.account}-GCP`]}; settings CRM: ${process.env[`${ctx.vtex.account}-CRM`]}`);*/
    await next();
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    let label = routeToLabel(ctx);
    ctx.state.logger.error(label + msg);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getAppSettingsWithRetry(ctx: Context | OrderEvent | NewsletterSubscription | LoggedUser, retry: number = 0): Promise<AppSettings> {
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
    if (isValid(appSettings.crmEnvironment) && isValid(appSettings.crmPassword &&
      isValid(appSettings.gcpHost) && isValid(appSettings.gcpProjectId) && isValid(appSettings.gcpClientEmail) && isValid(appSettings.gcpPrivateKey) && isValid(appSettings.gcpTargetAudience) &&
      isValid(appSettings.enabledAPICredentials) && isValid(appSettings.MDKey) && isValid(appSettings.enabledMDKeyHash) && isValid(appSettings.authCookie) && isValid(appSettings.crmEntityName) &&
      isValid(appSettings.defaultLocale) /*&& isValid(appSettings.defaultSource)*/ && isValid(appSettings.defaultCountry) && isValid(appSettings.localTimeLocale) && isValid(appSettings.localTimeZone) &&
      isValid(appSettings.webIdPrefix) && isValid(appSettings.maxNumOfDigitsForPhone) && isValid(appSettings.maxNumOfCharForWebId))) {
      resolve(true)
    } else {
      reject({ message: "error while retrieving app settings --details: some app properties are empty" })
    }
  })
}
