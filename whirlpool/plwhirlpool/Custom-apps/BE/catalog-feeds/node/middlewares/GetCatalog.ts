import { CachedProducts } from "../typings/productDetails";
import { ConvertToMillis, GetAppSettings } from "../utils/commonFunctions";
import { VbaseConfig } from "../utils/constants";

export async function GetCatalog(ctx: Context, next: () => Promise<any>) {

  const { clients: { vbase, searchGraphQL } } = ctx
  ctx.state.settings = await GetAppSettings(ctx)

  const cachedCatalog: any = await vbase.getJSON<CachedProducts>(VbaseConfig.catalogBucket, VbaseConfig.productsFile, true).catch(() => null)

  if (cachedCatalog != null && isValidCache(ctx.state.settings.cachePeriod, cachedCatalog.timestamp)) { //valid vbase cache
    ctx.state.products = cachedCatalog.products
    await next()
  } else { //invalid cache
    try {
      const products = await searchGraphQL.ProductsByCollection(ctx.state.settings.collectionId);
      ctx.state.products = products.filter((p: any) => p != undefined)
      vbase.saveJSON<CachedProducts>(VbaseConfig.catalogBucket, VbaseConfig.productsFile, {
        products: ctx.state.products,
        timestamp: Date.now()
      }).catch(err => {
        ctx.vtex.logger.error("[GetCatalog] - failed to save on vbase")
        ctx.vtex.logger.debug(err)
      })
      await next()
    } catch (err) {
      ctx.vtex.logger.error("[GetCatalog] - failed to retrieve products")
      ctx.vtex.logger.debug(err)
    }
  }
}

const isValidCache = (cachePeriod: number, cacheTimeStamp?: number) => cacheTimeStamp ? Date.now() < (cacheTimeStamp + ConvertToMillis(cachePeriod, 'minutes')) : false
