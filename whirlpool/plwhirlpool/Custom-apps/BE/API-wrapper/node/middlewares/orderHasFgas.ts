//@ts-nocheck

export async function orderHasFgas(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-store")
  if (ctx.query.orderId != undefined && ctx.query.orderId != "") {
    try {
      let order: any = await ctx.clients.vtexAPI.GetOrder(ctx.query.orderId);
      let containsFgas: boolean = false

      for (let item of order?.items) {
        let vtexResponse: any = await ctx.clients.vtexAPI.GetProductSpecification(item.productId)
        containsFgas = vtexResponse.find(function (specification: any) { return specification['Name'] === "fgas" })?.['Value'][0] == "false";
        if (containsFgas) break;
      }

      ctx.body = containsFgas;
      ctx.status = 200;
    } catch (err) {
      ctx.body = "Internal Server Error"
      ctx.status = 500
    }
  } else {
    ctx.body = "Bad request";
    ctx.status = 400
  }

  await next();
}