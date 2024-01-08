
import { getRequestPayload, routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function fetchRequest(ctx: Context, next: () => Promise<any>) {
  const logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    ctx.state.req = ctx.state.req ? ctx.state.req : await getRequestPayload(ctx);
    ctx.state.orderFormId = ctx.state.orderFormId ? ctx.state.orderFormId : ctx.vtex.route.params.orderFormId as string;
    let cart = await ctx.clients.Vtex.getCart(ctx.state.orderFormId);
    ctx.state.cart = cart;
    ctx.state.originalItems = cart.items.map((i, index) => { return { index: index, id: i.id, quantity: i.quantity } });
    ctx.state.req.orderItems.forEach(i => {
      ctx.state.cart.items[i.index].quantity = i.quantity;
    })
    ctx.state.largeComparisonFG = true;
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
