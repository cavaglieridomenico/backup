import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from '@vtex/api'
import { maxRetry, maxWaitTime } from '../utils/constants'
import { wait } from '../utils/functions'
import { Stock } from '../typings/types'
import FormData from "form-data"



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

  public async GetSKU(skuid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has(skuid)) {
        resolve(this.cache?.get(skuid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuid)
          this.cache?.set(skuid, res)
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
      if (this.cache && this.cache?.has(categoryid)) {
        resolve(this.cache?.get(categoryid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get('/api/catalog/pvt/category/' + categoryid)
          this.cache?.set(categoryid, res)
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
    return this.http.get(`/api/oms/pvt/orders?q=${userEmail}&page=1&per_page=1`)
  }

  public async GetProduct(productid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has(productid)) {
        resolve(this.cache?.get(productid))
        console.log("cache hit")
      } else {
        try {
          let res = await this.http.get(`/api/catalog/pvt/product/${productid}`)
          this.cache?.set(productid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
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

  ////////////////////////// dont'use cache for the following 3 calls ///////////////////////////////////

  public async getAllPromotions(): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
  }

  public async getPromotionById(id: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/" + id);
  }

  public async getProductsByCollectionId(collectionId: string, page: number = 1): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog/pvt/collection/" + collectionId + "/products?pageSize=10000&page=" + page);
  }

  // public async getStock(skuId: number | string): Promise<IOResponse<any>> {
  //   return this.http.getRaw("/api/logistics/pvt/inventory/skus/" + skuId);
  // }


  public async getStock(skuId: string, retry: number = 0): Promise<Stock> {

    return new Promise<Stock>((resolve, reject) => {
      this.http.getRaw("/api/logistics/pvt/inventory/skus/" + skuId)
        .then((res: any) => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getStock(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ msg: "Error while retrieving warehouse data for the sku " + skuId + "--details: " + JSON.stringify(err.response?.data ? err.response.data : err) })
          }
        })
    })
  }

  public async getStockBySellerName(skuId: number | string, scid: number | string, sellerName?: string | undefined): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + scid)
      .then(res => {
        return sellerName ?
          res.data[0]?.items[0]?.sellers.find((seller: any) => seller.sellerId == sellerName)?.commertialOffer?.AvailableQuantity :
          res.data[0]?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity;
      });
  }


  public async getPrice(ctx: Context, skuId: number, salesChannel: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId + "/fixed/" + salesChannel);
  }

  public async getPrices(ctx: Context, skuId: number | string): Promise<IOResponse<any>> {
    return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId);
  }

  public async getFixedPrice(ctx: Context, skuId: number | string, salesChannel: number = 1): Promise<IOResponse<any>> {
    return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId + "/fixed/" + salesChannel);
  }

  public async getMarketPrice(skuId: number | string, salesChannel: number = 1): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + salesChannel);
  }

  public async getCoupons(): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/coupon");
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

  public async getOrdersByEmail(email: string, page: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/oms/pvt/orders?q=" + email + "&page=" + page + "&per_page=1000");
  }

  public async GetUserFidelity(userEmail: string, page = 1, perPage = 1): Promise<any> {
    return this.http.get(`/api/oms/pvt/orders?q=${userEmail}&f_status=invoiced&orderBy=creationDate,desc&page=${page}&per_page=${perPage}`)
  }

  public async UploadFile(idEntity: string, body: any, filename: string): Promise<any> {
    const form = new FormData()
    form.append("image", body, filename) //originalfileName
    console.log("UPDLOAD FILE", form.append);
    return this.http.post(`/api/dataentities/MD/documents/${idEntity}/image/attachments`, form, {
      headers: form.getHeaders(),
    })
  }
}


