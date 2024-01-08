import { JanusClient, InstanceOptions, IOContext, CacheLayer } from '@vtex/api'

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

public getProductSpecifications = async (productId: string) => {
  return new Promise(async (resolve, reject) => {
    if (this.cache && this.cache?.has("spec-" + productId)) {
      resolve(this.cache?.get("spec-" + productId));
      console.log("cache hit");
    } else {
      try {
        let res = await this.http.get(`/api/catalog_system/pvt/products/${productId}/specification`);
        this.cache?.set("spec-" + productId, res);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    }
  })
}

}
