import { SFMCSettings } from "../typings/config";
import { TradePolicy } from "../typings/types";
import { getSFMCDataByHostname, getSFMCDataByOrder, getSFMCDataByTradePolicy, isValid, routeToLabel, sendAlert, stringify } from "../utils/functions";

export async function getAccessToken(ctx: Context | StatusChangeContext | Invitation | DropPriceAlertContext | BackInStockContext, next: () => Promise<any>) {
  try {
    let sfmcData: SFMCSettings | undefined = undefined;
    let ignoreEvent: Boolean = false;
    if (isValid(ctx.state.orderData?.salesChannel)) {
      if ((ctx as Context).host?.includes(ctx.vtex.account) && (ctx as Context).query?.host) {
        sfmcData = getSFMCDataByHostname(ctx as Context); // order confirmation and order cancellation
      } else {
        sfmcData = getSFMCDataByOrder(ctx as Context | StatusChangeContext); // order confirmation and order cancellation
      }
    } else {
      if (isValid((ctx as Invitation | BackInStockContext).body?.eventId)) {

        sfmcData = getSFMCDataByTradePolicy(ctx.state.appSettings, (ctx as Invitation | BackInStockContext ).body.cluster); // ff invitation and vip invitation or back in stock
      } else if (isValid((ctx as DropPriceAlertContext).body)) {
        if ((ctx as DropPriceAlertContext).body.PriceModified) { //due to handle stockModified event
          sfmcData = getSFMCDataByTradePolicy(ctx.state.appSettings, TradePolicy.O2P) // O2P DropPrice (admitted only in O2P)
        } else {
          ignoreEvent = true;
        }
      } else {
        sfmcData = getSFMCDataByHostname(ctx as Context); // order return and order refund
      }
    }
    if (!ignoreEvent) {
      await checkSfmcData(sfmcData);
      ctx.state.accessToken = (await ctx.clients.SFMCAuth.getAccessToken(sfmcData!))?.access_token;
      ctx.state.sfmcData = sfmcData;
      await next();
    }
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    let label = routeToLabel(ctx);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function checkSfmcData(sfmcData: SFMCSettings | undefined): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (isValid(sfmcData)) {
      resolve(true)
    } else {
      reject({ message: "invalid trade policy" });
    }
  })
}
