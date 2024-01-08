import { ClientProfileDataCustom, OrderForm } from "../typings/orderForm";
import { routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function updateCartItems(ctx: Context, next: () => Promise<any>) {
  const logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    if (
      (ctx.state.cart.clientProfileData as ClientProfileDataCustom).canBuyMDAs &&
      (ctx.state.cart.clientProfileData as ClientProfileDataCustom).canPlaceOrders &&
      (ctx.state.cart.clientProfileData as ClientProfileDataCustom).underMDAQtyThreshold
    ) {
      let cart: OrderForm = await ctx.clients.Vtex.updateCartItems(ctx.state.orderFormId, ctx.state.req);
      (cart.clientProfileData as ClientProfileDataCustom).canBuyMDAs = (ctx.state.cart.clientProfileData as ClientProfileDataCustom).canBuyMDAs;
      (cart.clientProfileData as ClientProfileDataCustom).canPlaceOrders = (ctx.state.cart.clientProfileData as ClientProfileDataCustom).canPlaceOrders;
      (cart.clientProfileData as ClientProfileDataCustom).underMDAQtyThreshold = (ctx.state.cart.clientProfileData as ClientProfileDataCustom).underMDAQtyThreshold;
      ctx.state.cart = cart;
    } else {
      ctx.state.cart.items.forEach((i, index) => i.quantity = ctx.state.originalItems.find(j => j.index == index && i.id == j.id)!.quantity);
    }
    await next();
  } catch (err) {
    console.error(err);
    let msg = err.msg ? err.msg : stringify(err);
    msg = label + msg;
    logger.error(msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }

}
