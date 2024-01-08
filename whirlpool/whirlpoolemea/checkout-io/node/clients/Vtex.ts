import { CacheLayer, InstanceOptions, IOContext, JanusClient } from "@vtex/api";
import { getCacheKey } from "../utils/functions";
export default class Vtex extends JanusClient {
  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options);
    this.options!.headers = {
      ...this.options?.headers,
      ...{
        VtexIdclientAutCookie: this.context.authToken
      }
    }
    this.cache = options && options.memoryCache;
  }

  public getProductSpecifications = (productId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cacheKey = getCacheKey(this.context.account, "spec", productId)
        if (await this.cache?.has(cacheKey)) {
          const res = await this.cache?.get(cacheKey)
          resolve(res)
        }
        let res = await this.http.get(`/api/catalog_system/pvt/products/${productId}/specification`, this.options);
        await this.cache?.set(cacheKey, res);

        resolve(res);
      } catch (err) {
        //console.error(err)
        reject(err);
      }
    })
  }

}
