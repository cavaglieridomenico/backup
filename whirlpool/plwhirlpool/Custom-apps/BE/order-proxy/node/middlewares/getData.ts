export async function getOrderData(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.set('Cache-Control', 'no-store');
    const id: any = ctx.vtex.route.params.id
    let incomingData: any = await ctx.clients.vtexAPI.getOrder(id)
      .catch((err) => console.log("UPS", err))
    let items: any[] = incomingData.data.items
    let arr: any[] = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].quantity > 1) {
        for (let el = 0; el < items[i].quantity; el++) {
          arr.push({
            ...items[i],
            quantity: 1,
            priceTags: [
              {
                ...items[i].priceTags[0],
                value: items[i].priceTags[0]?.value / items[i].quantity,
                rawValue: items[i].priceTags[0]?.rawValue / items[i].quantity
              }
            ],
            sellingPrice: items[i].sellingPrice,
            priceDefinition: {
              sellingPrices: [
                {
                  value: items[i].priceDefinition.sellingPrices[0]?.value,
                  quantity: 1
                }
              ],
              calculatedSellingPrice: items[i].priceDefinition?.calculatedSellingPrice,
              total: items[i].priceDefinition?.total / items[i]?.quantity
            }
          })
        }
      } else {
        arr.push({ ...items[i] })
      }
    }
    incomingData.data.items = arr;
    ctx.body = incomingData.data
    await next()
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}
