export async function checkOrderEvent(ctx: OrderEvent, next: () => Promise<any>) {
  if (ctx.state.appSettings.limitOrders.orderEvent?.toLowerCase() == ctx.body.currentState?.toLowerCase()) {
    await next();
  } else {
    console.info(`event ${ctx.body.currentState} (orderId: ${ctx.body.orderId}) skipped`);
  }
}
