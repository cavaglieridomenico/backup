export async function GetCateogryTree(ctx: Context, next: () => Promise<any>) {

    let categoryLevels = ctx.vtex.route.params.levels as string
    ctx.body = await ctx.clients.vtexAPI.GetCateogryTree(categoryLevels)
    ctx.status=200
    await next()
  }
  