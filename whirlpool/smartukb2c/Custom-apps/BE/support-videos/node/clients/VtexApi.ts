import { CacheLayer, InstanceOptions, IOContext, JanusClient } from '@vtex/api'

export default class VtexAPI extends JanusClient {
  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })
    this.cache = options && options?.memoryCache
  }

  public async getCategoryIdByProductId(productId: number): Promise<any> {
    let responseBody = await this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${productId}`).catch(err => console.error(err));
    let categoryIds = (responseBody).ProductCategoryIds
    return categoryIds;
  }
}