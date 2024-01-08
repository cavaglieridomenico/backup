export async function ProductByRef(ctx: Context, next: () => Promise<any>) {

  let refid = ctx.vtex.route.params.refid as string
  ctx.body = await ctx.clients.vtexAPI.GetProductByRefId(refid)
  ctx.status=200
  await next()
}
