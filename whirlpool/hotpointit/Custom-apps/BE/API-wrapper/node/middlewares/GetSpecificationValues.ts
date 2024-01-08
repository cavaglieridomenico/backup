export async function GetSpecificationValues(ctx: Context, next: () => Promise<any>) {

    let specId = ctx.vtex.route.params.id as string
    ctx.body = await ctx.clients.vtexAPI.GetSpecificationFields(specId)
    ctx.status=200
    await next()
  }
  