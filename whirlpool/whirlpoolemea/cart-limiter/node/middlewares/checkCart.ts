import { ClientProfileDataCustom } from "../typings/orderForm";
import { SkuContext } from "../typings/sku";
import { CLEntity, CLFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { isValid, routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function checkCart(ctx: Context, next: () => Promise<any>) {
  const logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    ctx.state.orderFormId = ctx.state.orderFormId ? ctx.state.orderFormId : ctx.vtex.route.params.orderFormId as string;
    ctx.state.cart = ctx.state.cart ? ctx.state.cart : await ctx.clients.Vtex.getCart(ctx.state.orderFormId);
    let numberOfMDAs = 0;
    let numberOfOrders = 0;
    ctx.state.underMDAQtyThreshold = true;
    if (
      (ctx.state.appSettings.limitMDAs.status && ctx.state.appSettings.limitMDAs.salesChannels?.split(",").includes(ctx.state.cart.salesChannel)) ||
      (ctx.state.appSettings.limitMDAQuantity.status && ctx.state.appSettings.limitMDAQuantity.salesChannels?.split(",").includes(ctx.state.cart.salesChannel))
    ) {
      let distinctSkus = new Set(ctx.state.cart.items.map(item => item.id));
      let promises: Promise<any>[] = [];
      distinctSkus.forEach(s => {
        promises.push(ctx.clients.Vtex.getSkuContext(s));
      })
      let skus: SkuContext[] = await Promise.all(promises)
      if (ctx.state.appSettings.limitMDAs.status && ctx.state.appSettings.limitMDAs.salesChannels?.split(",").includes(ctx.state.cart.salesChannel)) {
        let excludedCategories = ctx.state.appSettings.limitMDAs.excludedCategories?.split(",");
        skus.forEach(s => {
          let categories = s.ProductCategoryIds.split("/").filter(c => c != "");
          let found = false;
          for (let i = 0; i < categories.length && !found; i++) {
            if (excludedCategories?.includes(categories[i])) {
              found = true;
            }
          }
          if (!found) {
            ctx.state.cart.items.filter(i => i.id == (s.Id + "")).forEach(i => numberOfMDAs += i.quantity);
          }
        })
      } else {
        console.info("check on the total quantity of MDAs: skipped --details: limit disabled or unknown saleschannel");
      }
      if (ctx.state.appSettings.limitMDAQuantity.status && ctx.state.appSettings.limitMDAQuantity.salesChannels?.split(",").includes(ctx.state.cart.salesChannel)) {
        let excludedCategories = ctx.state.appSettings.limitMDAs.excludedCategories?.split(",");
        for (let i = 0; i < skus.length && ctx.state.underMDAQtyThreshold; i++) {
          let categories = skus[i].ProductCategoryIds.split("/").filter(c => c != "");
          let found = false;
          for (let j = 0; j < categories.length && !found; j++) {
            if (excludedCategories?.includes(categories[j])) {
              found = true;
            }
          }
          if (!found) {
            let quantity = 0;
            ctx.state.cart.items.filter(item => item.id == (skus[i].Id + "")).forEach(item => quantity += item.quantity);
            ctx.state.underMDAQtyThreshold = (quantity <= ctx.state.appSettings.limitMDAQuantity?.threshold! && isValid(ctx.state.appSettings.limitMDAQuantity.threshold)) || !isValid(ctx.state.appSettings.limitMDAQuantity.threshold);
          }
        }
      } else {
        console.info("check on the quantity of each MDA: skipped --details: limit disabled or unknown saleschannel");
      }
    } else {
      console.info("check on MDAs limits: skipped --details: limits disabled or unknown saleschannels");
    }
    if (ctx.state.appSettings.limitOrders.status && ctx.state.appSettings.limitOrders.salesChannels?.split(",").includes(ctx.state.cart.salesChannel)) {
      let consumer = await ctx.clients.Vtex.getLoggedUser(ctx.cookies.get(ctx.state.appSettings.authCookie) as string);
      let user: any[] = await searchDocuments(ctx, CLEntity, CLFields.concat([ctx.state.appSettings.limitOrders.fieldNameCounter as string]), `email=${consumer.user}`, { page: 1, pageSize: 10 }, false);
      let placedOrders = user[0][ctx.state.appSettings.limitOrders.fieldNameCounter as string];
      numberOfOrders = user.length > 0 ? (placedOrders ? placedOrders : 0) : 0;
    } else {
      console.info("check on orders: skipped --details: limit disabled or unknwon sales channel");
    }
    console.info("#MDAs: ", numberOfMDAs);
    console.info("#Orders: ", numberOfOrders);
    (ctx.state.cart.clientProfileData as ClientProfileDataCustom).canBuyMDAs = !ctx.state.largeComparisonFG ?
      ((numberOfMDAs < ctx.state.appSettings.limitMDAs.threshold! && isValid(ctx.state.appSettings.limitMDAs.threshold)) || !isValid(ctx.state.appSettings.limitMDAs.threshold)) :
      ((numberOfMDAs <= ctx.state.appSettings.limitMDAs.threshold! && isValid(ctx.state.appSettings.limitMDAs.threshold)) || !isValid(ctx.state.appSettings.limitMDAs.threshold));
    (ctx.state.cart.clientProfileData as ClientProfileDataCustom).canPlaceOrders = (numberOfOrders < ctx.state.appSettings.limitOrders.threshold! && isValid(ctx.state.appSettings.limitOrders.threshold)) || !isValid(ctx.state.appSettings.limitOrders.threshold);
    (ctx.state.cart.clientProfileData as ClientProfileDataCustom).underMDAQtyThreshold = ctx.state.underMDAQtyThreshold;
    await next();
  } catch (err) {
    console.error(err)
    let msg = err.msg ? err.msg : stringify(err);
    msg = label + msg;
    logger.error(msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
