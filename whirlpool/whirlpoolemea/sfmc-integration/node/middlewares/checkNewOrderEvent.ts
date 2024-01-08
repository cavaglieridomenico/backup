export async function checkNewOrderEvent(ctx: StatusChangeContext, next: () => Promise<any>) {
  if (ctx.state.appSettings.vtex.eventNewOrder?.toLowerCase() == ctx.body.currentState?.toLowerCase()) {
    await next();
  }
}
