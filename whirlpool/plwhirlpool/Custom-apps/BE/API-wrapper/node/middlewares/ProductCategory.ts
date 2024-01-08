//@ts-nocheck

export async function ProductCategory(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  let productId: string = ctx.vtex.route.params.id;
  let product = await ctx.clients.vtexAPI.GetProduct(productId);
  ctx.body = { Id: product.Id, CategoryId: product.CategoryId };
  ctx.status = 200;
  await next()
}
