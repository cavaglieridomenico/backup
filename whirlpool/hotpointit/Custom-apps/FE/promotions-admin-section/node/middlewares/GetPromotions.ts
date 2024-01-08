export async function GetPromotions(ctx: Context, next: () => Promise<any>) {

  ctx.set("cache-control", 'no-store')
  let promoList = await ctx.clients.Vtex.GetPromotionsList()

  let promotionDetails = await Promise.all(
    promoList.items.map((promo: { idCalculatorConfiguration: string, utmSource: string }) => new Promise<any>(async (resolve) => {
      try {

        //get data from calculatorconfiguration and coupon API services
        resolve(await Promise.all([
          ctx.clients.Vtex.GetPromotionDetails(promo.idCalculatorConfiguration),
          promo.utmSource != "" ? ctx.clients.Vtex.GetCoupons(promo.utmSource) : Promise.resolve([])
        ]))

      } catch (err) {
        console.error(err)
        resolve(undefined)
      }
    }))
  )

  ctx.body = promotionDetails.filter(promo => promo != undefined).map(([promotionDetail, promoCoupon]: any) => {
    let promoFromList = promoList.items.find((p: { idCalculatorConfiguration: any }) => p.idCalculatorConfiguration == promotionDetail.idCalculatorConfiguration)
    return {
      id: promotionDetail.idCalculatorConfiguration,
      name: promotionDetail.name,
      beginDate: promotionDetail.beginDateUtc,
      endDate: promotionDetail.endDateUtc,
      discountType: promotionDetail.type,
      categories: promotionDetail.categories,
      brands: promotionDetail.brands,
      products: promotionDetail.products,
      state: promoFromList.status,
      utmSource: promoFromList.utmSource,
      utmCampaign: promoFromList.utmCampain || promoFromList.utmCampaign || '',
      coupon: promoCoupon.length > 0 ? 'yes' : 'no', //se almeno 1 --> yes else no
      highlightedDiscount: promotionDetail.isFeatured ? 'yes' : 'no' //isFeatured della chiamata GetPromotionDetails if true -> yes else no
    }
  })

  ctx.status = 200

  await next()
}
