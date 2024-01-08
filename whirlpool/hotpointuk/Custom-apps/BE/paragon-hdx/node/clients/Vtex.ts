import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from "@vtex/api";
import { Order } from "../typings/order";
import { SkuContext } from "../typings/types";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions";

export default class Vtex extends JanusClient {

  memoryCache?: CacheLayer<string, any>

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
        this.http.getRaw(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`)
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
      this.http.get(`/api/oms/pvt/orders/${orderId}`)
        .then(res => {
          resolve(res);
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(1500);
            return this.getOrder(orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while retrieving order data --details: ${stringify(err)}` });
          }
        })
    })
  }

}
