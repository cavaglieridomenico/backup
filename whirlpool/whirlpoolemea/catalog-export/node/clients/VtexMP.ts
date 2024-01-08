//@ts-nocheck

import { InstanceOptions, IOContext, IOResponse, JanusClient, CacheLayer } from "@vtex/api";
import { AppSettings } from "../types/typing";
import { AES256Decode } from "../utils/cryptography";
import { getCacheKey } from '../utils/CommonFunctions'


export default class VtexMP extends JanusClient {
  cache?: CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {

    let appSettings: AppSettings = JSON.parse(process.env.CE);

    options.headers = {
      ...options.headers,
      ...{
        "X-VTEX-API-AppKey": AES256Decode(appSettings.mp.apiKey),
        "X-VTEX-API-AppToken": AES256Decode(appSettings.mp.apiToken)
      },
    }
    super(context, options);
    this.cache = options && options?.memoryCache;

  }

  public async getSkuContext(skuId: string): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>(async (resolve, reject) => {
      const cacheKey = getCacheKey(this.context.account, "skuContext", skuId)
      if (this.cache?.has(cacheKey)) {
        const res = this.cache?.get(cacheKey)
        resolve(res)
      }
      this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuId)
        .then(res => {
          this.cache?.set(cacheKey, res);
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  public async getProduct(productId: string): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>(async (resolve, reject) => {
      const cacheKey = getCacheKey(this.context.account, "product", productId)
      if (await this.cache?.has(cacheKey)) {
        const res = await this.cache?.get(cacheKey)
        resolve(res)
      }
      this.http.getRaw("/api/catalog/pvt/product/" + productId)
        .then(res => {
          this.cache?.set(cacheKey, res);
          resolve(res)
        })
        .catch(err => reject(err))

    })
  }

  public async getAssociatedSimilarCategories(productId: String): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>(async (resolve, reject) => {
      const cacheKey = getCacheKey(this.context.account, "similarCategories", productId)
      if (await this.cache?.has(cacheKey)) {
        const res = await this.cache?.get(cacheKey)
        resolve(res)
      }
      this.http.getRaw("/api/catalog/pvt/product/" + productId + "/similarcategory")
        .then(res => {
          this.cache?.set(cacheKey, res);
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  public async getPrice(skuId: string, ctx: Context): Promise<IOResponse<any>> {
    return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId);
  }

  public async getMarketPriceSc(skuId: string, tradePolicy: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + tradePolicy);
  }
  public async getMarketPrice(skuId: string, tradePolicy: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId);
  }

  public async getStock(skuId: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/logistics/pvt/inventory/skus/" + skuId);
  }

  public async getSkuRangeByPage(page: number): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>(async (resolve, reject) => {
      const cacheKey = getCacheKey(this.context.account, "skuRange", page)
      if (await this.cache?.has(cacheKey)) {
        const res = await this.cache?.get(cacheKey)
        resolve(res)
      }
      this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitids?page=" + page + "&pagesize=1000")
        .then(res => {
          this.cache?.set(cacheKey, res);
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  public async getAllPromo(): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
  }

  public async getPromoById(id: String): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/" + id);
  }

  public async getSalesChannelList(): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>(async (resolve, reject) => {
      const cacheKey = getCacheKey(this.context.account, "salesChannels")
      if (await this.cache?.has(cacheKey)) {
        const res = await this.cache?.get(cacheKey)
        resolve(res)
      }
      this.http.getRaw("/api/catalog_system/pvt/saleschannel/list")
        .then(res => {
          this.cache?.set(cacheKey, res);
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  public async getSkuComplement(skuId: string): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>(async (resolve, reject) => {
      const cacheKey = getCacheKey(this.context.account, "skuComplement", skuId)
      if (await this.cache?.has(cacheKey)) {
        const res = await this.cache?.get(cacheKey)
        resolve(res)
      }
      this.http.getRaw("/api/catalog/pvt/stockkeepingunit/" + skuId + "/complement")
        .then(res => {
          this.cache?.set(cacheKey, res);
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  public async getProductsByCollectionId(collectionId: string): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>(async (resolve, reject) => {
      const cacheKey = getCacheKey(this.context.account, "collection", collectionId)
      if (await this.cache?.has(cacheKey)) {
        const res = await this.cache?.get(cacheKey)
        resolve(res)
      }
      this.http.getRaw("/api/catalog/pvt/collection/" + collectionId + "/products?pageSize=1000")
        .then(res => {
          this.memoryCache?.set(cacheKey, res);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }
}
