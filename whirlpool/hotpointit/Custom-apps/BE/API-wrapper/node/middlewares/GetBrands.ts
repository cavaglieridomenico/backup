export async function GetBrands(ctx: Context, next: () => Promise<any>) {

  ctx.body = await ctx.clients.vtexAPI.GetBrands()
  ctx.status=200
  await next()
}
