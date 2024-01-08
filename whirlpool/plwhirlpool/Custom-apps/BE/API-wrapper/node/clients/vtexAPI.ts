import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from '@vtex/api'
import { vtexCredentials } from '../utils/constants';

export default class VtexAPI extends JanusClient {

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        ...vtexCredentials[context.account],
        VtexIdclientAutCookie: context.authToken
      }
    })

    this.cache = options && options?.memoryCache
  }

  public async GetSKU(skuid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("sku-" + skuid)) {
        resolve(this.cache?.get("sku-" + skuid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuid)
          this.cache?.set("sku-" + skuid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetOrder(orderid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has(orderid)) {
        resolve(this.cache?.get(orderid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get('/api/oms/pvt/orders/' + orderid)
          this.cache?.set(orderid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetProductSpecification(productid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("spec-" + productid)) {
        resolve(this.cache?.get("spec-" + productid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get(`/api/catalog_system/pvt/products/${productid}/specification`)
          this.cache?.set("spec-" + productid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetCategory(categoryid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("category-" + categoryid)) {
        resolve(this.cache?.get("category-" + categoryid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get('/api/catalog/pvt/category/' + categoryid)
          this.cache?.set("category-" + categoryid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetCateogryTree(levels: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("categorylevels-" + levels)) {
        resolve(this.cache?.get("categorylevels-" + levels))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get('/api/catalog_system/pub/category/tree/' + levels)
          this.cache?.set("categorylevels-" + levels, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetUserOrders(userEmail: string): Promise<any> {
    return this.http.get(`/api/oms/pvt/orders?q=${encodeURIComponent(userEmail)}&page=1&per_page=1`)
  }

  public async GetProduct(productid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache?.has("product" + productid)) {
        resolve(this.cache?.get("product" + productid))
        //console.log("cache hit");
      } else {
        this.http.get(`/api/catalog/pvt/product/${productid}`)
          .then(res => {
            this.cache?.set("product" + productid, res);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          })
      }
    })
  }

  public async GetProductByRefId(refid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has(refid)) {
        resolve(this.cache?.get(refid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get(`/api/catalog_system/pvt/products/productgetbyrefid/${refid}`)
          this.cache?.set(refid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetBrands(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("brands")) {
        resolve(this.cache?.get("brands"))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get(`/api/catalog_system/pvt/brand/list`)
          this.cache?.set("brands", res, 6 * 1000 * 60 * 60)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GePromotions(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("promotions")) {
        console.log("cache hit")
        resolve(this.cache?.get("promotions"))
      } else {
        try {
          let res = await this.http.get(`/api/rnb/pvt/benefits/calculatorconfiguration`)
          this.cache?.set("promotions", res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  ////////////////////////// dont'use cache for the following calls ///////////////////////////////////

  public async getAllPromotions(): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
  }

  public async getPromotionById(id: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/" + id);
  }

  public async getProductsByCollectionId(collectionId: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog/pvt/collection/" + collectionId + "/products?pageSize=10000");
  }

  public async getStock(skuId: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/logistics/pvt/inventory/skus/" + skuId);
  }

  public async getPrice(ctx: Context, skuId: number, salesChannel: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId + "/fixed/" + salesChannel);
  }

  public async getMarketPrice(skuId: number, salesChannel: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + salesChannel);
  }

  public async getCoupons(): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/coupon");
  }

  public async getOrdersByEmail(email: string, page: number, per_page: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/oms/pvt/orders?q=" + encodeURIComponent(email) + "&page=" + page + "&per_page=" + per_page);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  public async GetSpecificationFields(specId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has("spec-values-" + specId)) {
        console.log("cache hit")
        resolve(this.cache?.get("spec-values-" + specId))
      } else {
        try {
          let res = await this.http.get(`/api/catalog_system/pub/specification/fieldGet/${specId}`)
          this.cache?.set("spec-values-" + specId, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  public async GetUserFidelity(userEmail: string, page = 1, perPage = 1): Promise<any> {
    return this.http.get(`/api/oms/pvt/orders?q=${encodeURIComponent(userEmail)}&f_status=invoiced&orderBy=creationDate,desc&page=${page}&per_page=${perPage}`)
  }

}
//ready-for-handling