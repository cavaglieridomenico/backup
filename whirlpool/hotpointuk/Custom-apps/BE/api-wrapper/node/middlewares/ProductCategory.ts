export async function ProductCategory(ctx: Context, next: () => Promise<any>) {

  let productid = ctx.vtex.route.params.id as string
  let product = await ctx.clients.vtexAPI.GetProduct(productid)
  ctx.body = { Id: product.Id, CategoryId: product.CategoryId } //add productid also
  ctx.status = 200
  await next()
}
