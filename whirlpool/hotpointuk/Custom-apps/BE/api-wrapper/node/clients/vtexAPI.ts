//@ts-nocheck

import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from '@vtex/api'
import { ProductSpecification, Stock, StockUpdate } from '../typings/types';
import { maxRetry, maxWaitTime } from '../utils/constants';
import { isValid, wait } from '../utils/functions';

export default class VtexAPI extends JanusClient {

  memoryCache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    options?.headers = { ...options?.headers, ...{ VtexIdclientAutCookie: context.authToken } };
    super(context, options);
    this.memoryCache = options && options.memoryCache;
    context.logger.info({
      action: "Account Context",
      description: context.account
    })
  }

  public async GetSKU(skuid: string, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.memoryCache?.has("skuContext-" + skuid)) {
        const cache = this.memoryCache.get("skuContext-" + skuid)
        this.context.logger.info({
          action: "Cache Context",
          description: cache.ImageUrl.toString()
        })
        resolve(this.memoryCache.get("skuContext-" + skuid));
      } else {
        this.http.get('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuid)
          .then(res => {
            this.memoryCache?.set("skuContext-" + skuid, res);
            resolve(res);
          })
          .catch(async (err) => {
            if (retry < maxRetry) {
              await wait(200);
              return this.GetSKU(skuid, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    })
  }

  public async GetOrder(orderId: string, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get('/api/oms/pvt/orders/' + orderId)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.GetOrder(orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    })
  }

  public async GetProductSpecification(productid: string): Promise<any> {
    return this.http.get(`/api/catalog_system/pvt/products/${productid}/specification`)
  }

  public async GetCategory(categoryid: string, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.memoryCache?.has("category-" + categoryid)) {
        resolve(this.memoryCache.get("category-" + categoryid));
      } else {
        this.http.get('/api/catalog/pvt/category/' + categoryid)
          .then(res => {
            this.memoryCache?.set("category-" + categoryid, res);
            resolve(res);
          })
          .catch(async (err) => {
            if (retry < maxRetry) {
              await wait(200);
              return this.GetCategory(categoryid, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    })
  }

  public async GetUserOrders(userEmail: string): Promise<any> {
    return this.http.get(`/api/oms/pvt/orders?q=${userEmail}&page=1&per_page=1`)
  }

  public async GetProduct(productid: string): Promise<any> {
    return this.http.get(`/api/catalog/pvt/product/${productid}`)
  }

  public async GetProductByRefId(refid: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(`/api/catalog_system/pvt/products/productgetbyrefid/${refid}`)
        .then(res => {
          if (isValid(res)) {
            resolve(res);
          } else {
            if (!refid.includes("-WER")) {
              return this.GetProductByRefId(refid + "-WER").then(res0 => resolve(res0)).catch(err0 => reject(err0))
            } else {
              reject({ response: { status: 500, data: "No data found for the refid " + refid } })
            }
          }
        })
        .catch(err => reject(err))
    })
  }

  public async GetBrands(): Promise<any> {
    return this.http.get(`/api/catalog_system/pvt/brand/list`)
  }

  public async getStock(skuId: string, retry: number = 0): Promise<Stock> {
    return new Promise<Stock>((resolve, reject) => {
      this.http.getRaw("/api/logistics/pvt/inventory/skus/" + skuId)
        .then(res => resolve(res.data))
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

  public async updateStock(skuId: string, warehouseId: string, payload: StockUpdate, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.putRaw("/api/logistics/pvt/inventory/skus/" + skuId + "/warehouses/" + warehouseId, payload)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.updateStock(skuId, warehouseId, payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ msg: "Error while updating warehouse data for the sku " + skuId + "--details: " + JSON.stringify(err.response?.data ? err.response.data : err) })
          }
        })
    })
  }

  public async updateProductSpecification(productId: string, productionSpecification: ProductSpecification[], retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.postRaw("/api/catalog_system/pvt/products/" + productId + "/specification", productionSpecification)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.updateProductSpecification(productId, productionSpecification, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ msg: "Error while updating the product specification \"" + productionSpecification[0]?.Name + "\" for the product " + productId + " --details " + JSON.stringify(err.response?.data ? err.response.data : err) })
          }
        })
    })
  }


  public async getPrices(ctx: Context, skuId: number | string): Promise<IOResponse<any>> {
    return this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId);
  }


  public async getMarketPrice(skuId: number, salesChannel: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + salesChannel);
  }

  public async getAllPromotions(): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
  }


  public async getPromotionById(id: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/" + id);
  }


  public async getProductsByCollectionId(collectionId: string, page: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog/pvt/collection/" + collectionId + "/products?pageSize=10000&page=" + page);
  }

}
