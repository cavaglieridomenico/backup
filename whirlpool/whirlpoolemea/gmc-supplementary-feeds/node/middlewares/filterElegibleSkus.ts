import { stringify } from "../utils/functions"


export async function getEligibleSKUS(ctx: Context, next: () => Promise<any>) {
  try {
    const GET_SKU_IDS_PROMISES = ctx.state.appSettings.vtexSettings.categoryIds.split(",").map((categoryId) => ctx.clients.Vtex.getSkuIdsByCategoryId(categoryId))
    let skuIds: string[] = (await Promise.all(GET_SKU_IDS_PROMISES)).flat()


    if (ctx.state.feedSettings!.removeOutOfStock) {
      const QUANTITY_PROMISES = skuIds.map(skuId => ctx.clients.Logistic.listInventoryBySku(skuId))
      const QUANTITY_RESPONSES = await Promise.all(QUANTITY_PROMISES);
      skuIds = skuIds.filter((_, index) => QUANTITY_RESPONSES[index].balance.some(b => b.totalQuantity - b.reservedQuantity > 0 || b.hasUnlimitedQuantity))
    }


    const HAS_PRICES_PROMISES = skuIds.map(skuId => ctx.clients.Vtex.hasPriceInSalesChannel(ctx.vtex.account, skuId, ctx.state.feedSettings!.salesPolicy))
    const HAS_PRICES_RESULTS = await Promise.all(HAS_PRICES_PROMISES);
    skuIds = skuIds.filter((_, index) => HAS_PRICES_RESULTS[index])

    const SKU_CONTEXT_PROMISES = skuIds.map(skuId => ctx.clients.Catalog.getSkuContext(skuId))
    const SKU_CONTEXT_RESPONSES = await Promise.all(SKU_CONTEXT_PROMISES);
    const skuContexts = SKU_CONTEXT_RESPONSES.filter((skuContext) => skuContext.IsActive && skuContext.SalesChannels.includes(Number.parseInt(ctx.state?.feedSettings?.salesPolicy ?? "1")))

    ctx.state.eligibleSkusContext = skuContexts
    await next()
  } catch (err) {
    ctx.state.logger.error(`[GET ELIGIBLE SKUS] - ${stringify(err)}`);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}