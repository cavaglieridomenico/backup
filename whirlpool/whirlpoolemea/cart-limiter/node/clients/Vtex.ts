import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from "@vtex/api";
import { UpdateCartItemsReq } from "../typings/cart";
import { Order } from "../typings/order";
import { OrderForm } from "../typings/orderForm";
import { SkuContext } from "../typings/sku";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions";

export default class Vtex extends JanusClient {

  private memoryCache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = { ...options?.headers, ...{ VtexIdclientAutCookie: context.authToken } }
    super(context, options);
    this.memoryCache = options && options?.memoryCache;
  }

  public async getSkuContext(skuId: any, retry: number = 0): Promise<IOResponse<SkuContext>> {
    return new Promise<IOResponse<SkuContext>>((resolve, reject) => {
      if (this.memoryCache?.has("skuContext-" + skuId)) {
        resolve(this.memoryCache.get("skuContext-" + skuId))
      } else {
        this.http.getRaw(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`, this.options)
          .then(res => {
            this.memoryCache?.set("skuContext-" + skuId, res.data);
            resolve(res.data);
          })
          .catch(async (err) => {
            if (retry < maxRetry) {
              await wait(maxWaitTime);
              return this.getSkuContext(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
            } else {
              reject({ msg: `error while retrieving sku context (skuId: ${skuId}) --details: ${stringify(err)}` })
            }
          })
      }
    })
  }

  public async getOrder(orderId: string, retry: number = 0): Promise<Order> {
    return new Promise<Order>((resolve, reject) => {
      this.http.get(`/api/oms/pvt/orders/${orderId}`, this.options)
        .then(res => {
          resolve(res);
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(1500);
            return this.getOrder(orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while retrieving order data (orderId: ${orderId}) --details: ${stringify(err)}` });
          }
        })
    })
  }

  public async getCart(orderFormId: any, retry: number = 0): Promise<OrderForm> {
    return new Promise<OrderForm>((resolve, reject) => {
      this.http.get(`/api/checkout/pub/orderForm/${orderFormId}`, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getCart(orderFormId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while retrieving cart data (orderFormId: ${orderFormId}) --details: ${stringify(err)}` });
          }
        })
    })
  }

  public async updateCartItems(orderFormId: any, cartData: UpdateCartItemsReq, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/items/update`, cartData, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.updateCartItems(orderFormId, cartData, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while updating cart items (orderFormId: ${orderFormId}) --details: ${stringify(err)}` });
          }
        })
    })
  }

  public async getLoggedUser(token: string, retry: number = 0): Promise<{ user: string }> {
    return new Promise<{ user: string }>((resolve, reject) => {
      this.http.get(`/api/vtexid/pub/authenticated/user?authToken=${token}`, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getLoggedUser(token, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while retrieving data about the logged user --details: ${stringify(err)}` });
          }
        })
    })
  }

}
