import { isValid, routeToLabel, sendAlert, stringify } from "../utils/functions";
import { sha_512_256 } from "../utils/cryptography";
import { CustomApps } from "../typings/types";

export async function getOrderData(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  try {
    ctx.state.locale = ctx.state.orderData.customData?.customApps?.find((app: any) => app.id == CustomApps.PROFILE)?.fields?.locale;
    ctx.state.locale = isValid(ctx.state.locale) ? ctx.state.locale : ctx.state.appSettings.vtex.defaultLocale5C;
    ctx.state.orderData.items.forEach((item: any, index: number) => item.uniqueId = sha_512_256(item.id + index).substring(0, 32).toUpperCase());
    let skuContextEmailPromises: Promise<any>[] = [];
    let distinctSkus: any[] = [];
    ctx.state.orderData.items.forEach((i: any) => {
      if (!distinctSkus.includes(i.id)) {
        distinctSkus.push(i.id);
      }
    })

    distinctSkus.forEach(s => {
      skuContextEmailPromises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.VtexMP.getSkuContext(s)
          .then(res => resolve({ skuId: s, context: res.data }))
          .catch(err => reject(err));
      }));
    });
    skuContextEmailPromises.push(ctx.clients.VtexMP.getUserInfoByParam(ctx, "userId", ctx.state.orderData?.clientProfileData?.userProfileId));
    let skuContextEmailResponses = await Promise.all(skuContextEmailPromises);
    ctx.state.skuContexts = skuContextEmailResponses.filter((f: any) => f.context);
    ctx.state.userInfo = skuContextEmailResponses.find(f => f.email);
    ctx.state.distinctSkus = distinctSkus;

    ctx.state.spare_accDetails = {
      spAccIndex: [],
      containSpareAcc: false,
      estematedDeliveryDate_SpAcc: ""
    }

    await next();

  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}
