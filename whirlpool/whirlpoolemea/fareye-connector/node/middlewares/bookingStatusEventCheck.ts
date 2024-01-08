import { FB_STATUS } from "../typings/fareye";
import { isValid, stringify } from "../utils/functions";


export async function checkOrderEvent(ctx: Context | OrderEvent, next: () => Promise<any>) {
  let orderId = (ctx as OrderEvent).body?.orderId ?? ctx.vtex.route.params.orderId;
  let currentState = (ctx as OrderEvent).body?.currentState ?? ctx.vtex.route.params.currentState;
  try {
    ctx.state.order = await ctx.clients.Vtex.getOrder(orderId);
    //check if the order must be ignored, so when the order come from a marketplace that is not served by FarEye connector
    if (isInBlackList((ctx as Context), orderId)) {
      throw new Error("#ignoreOrder")
    }
    let isMarketplace = ctx.state.appSettings.Vtex_Settings.Admin.MarketPlace.IsMarketplace;
    if (!isMarketplace) {
      //check if it's a marketplace order, if yes call the service in the marketplace account, otherwise proceed with the next middleware
      if (isValid(ctx.state.order.affiliateId)) {
        switch (currentState) {
          case "handling":
            await ctx.clients.MP_Sync.SetBookingStatus(ctx.state.order.marketplaceOrderId, FB_STATUS.SAP_MANAGED, ctx.state.order.marketplace.name);
            break;
        }
      } else {
        await next();
      }
    } else {
      await next();
    }
  } catch (error) {
    //console.error(error);
    if (error.message == "#ignoreOrder") {
      (ctx as Context).status = 200;
    } else {
      (ctx as Context).status = 500;
      let label = `Booking status update (orderId: ${orderId}):`;
      let msg = error.msg ? error.msg : stringify(error);
      ctx.state.logger.error(`${label} ${msg}`);
    }
  }
}

//check if the order must be ignored, because the account to call isn't served by FarEye
function isInBlackList(ctx: Context, orderId: string) {
  let isIncluded = false;
  let blackList = (ctx as Context).state.appSettings.Vtex_Settings.Admin.MarketPlace.MP_PrefixToIgnore?.split(",") ?? [];
  for (let i = 0; i < blackList.length && !isIncluded; i++) {
    if (orderId.includes(blackList[i])) {
      isIncluded = true;
    }
  }
  return isIncluded;
}
