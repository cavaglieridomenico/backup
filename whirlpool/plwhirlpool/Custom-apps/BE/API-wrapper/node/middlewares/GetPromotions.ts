export async function GetPromotions(ctx: Context, next: () => Promise<any>) {

  let promotions = await ctx.clients.vtexAPI.GePromotions()

  promotions = JSON.parse(JSON.stringify(promotions))

  promotions.items = promotions.items.map((prom: { name: any; beginDate: any; endDate: any; isActive: any }) => {
    let beginDate = new Date(prom.beginDate)
    let endDate = new Date(prom.endDate)
    beginDate.setTime(beginDate.getTime() + 2 * 3600000)
    endDate.setTime(endDate.getTime() + 2 * 3600000)
    if(endDate.getHours()==0 && endDate.getMinutes()==0){
      endDate.setDate(endDate.getDate()-1);
    }
    return {
      name: prom.name,
      beginDate: beginDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: prom.isActive
    }
  })
  ctx.body = promotions
  ctx.status = 200
  await next()
}
