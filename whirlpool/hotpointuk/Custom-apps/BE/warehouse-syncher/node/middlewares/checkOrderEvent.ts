import { OrderState } from "../typings/order";

export async function checkOrderEvent(ctx: OrderEvent, next: () => Promise<any>) {
  if (ctx.body.orderId.split("-").length > 2) { // => markeplace orders
    if (ctx.body.currentState == OrderState.ACCEPTED || ctx.body.currentState == OrderState.HANDLING) {
      await next();
    } else {
      console.info("event '" + ctx.body.currentState + "' skipped for the order: " + ctx.body.orderId);
    }
  } else { // => seller orders
    if (ctx.body.currentState == OrderState.CREATED || ctx.body.currentState == OrderState.HANDLING) {
      await next();
    } else {
      console.info("event '" + ctx.body.currentState + "' skipped for the order: " + ctx.body.orderId);
    }
  }
}
