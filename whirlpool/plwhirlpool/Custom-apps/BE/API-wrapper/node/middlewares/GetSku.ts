export async function GetSKU(ctx: Context, next: () => Promise<any>) {

  let skuid = ctx.vtex.route.params.id as string
  let sku = await ctx.clients.vtexAPI.GetSKU(skuid)
  ctx.body = sku
  ctx.status=200
  await next()
}
