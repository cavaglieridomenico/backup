export async function returnCart(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  ctx.status = 200;
  ctx.body = ctx.state.cart;
  await next();
}
