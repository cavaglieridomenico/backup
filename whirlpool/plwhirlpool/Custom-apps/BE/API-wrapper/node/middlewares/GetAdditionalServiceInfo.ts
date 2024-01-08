export async function GetAdditionServiceByCategoryId(ctx: Context, next: () => Promise<any>) {
    try {
      ctx.body = await ctx.clients.masterdata.searchDocuments({
        dataEntity: "SA",
        fields: ['id', 'serviceName', 'price'],
        pagination: {
          page: 1,
          pageSize: 20
        },
        where: `categoryId=${ctx.query.categoryId}`
      })
    }
    catch (err) {
      console.log(err)
      ctx.body = []
    }
    ctx.set("Cache-Control", "no-store")
    ctx.status = 200
    await next()
  }