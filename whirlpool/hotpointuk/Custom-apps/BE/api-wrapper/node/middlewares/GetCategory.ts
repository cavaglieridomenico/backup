export async function GetCategory(ctx: Context, next: () => Promise<any>) {

  let categoryid = ctx.vtex.route.params.id as string
  ctx.body = await ctx.clients.vtexAPI.GetCategory(categoryid)
  ctx.status=200
  await next()
}
