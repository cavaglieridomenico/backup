export async function GetProductSpecification(ctx: Context, next: () => Promise<any>) {

  let productid = ctx.vtex.route.params.id as string
  ctx.body = await ctx.clients.vtexAPI.GetProductSpecification(productid)
  ctx.status=200
  await next()
}
