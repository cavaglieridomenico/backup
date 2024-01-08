//@ts-nocheck

import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from '@vtex/api'
import { Order } from '../typings/order';
import { ProductSpecificationResponse } from '../typings/types';
import { maxRetry, maxWaitTime } from '../utils/constants';
import { getCircularReplacer, wait } from '../utils/functions';

export default class Vtex extends JanusClient {
  memoryCache?: CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {
    options?.headers = { ...options?.headers, ...{ VtexIdclientAutCookie: context.authToken } }
    super(context, options);
    this.memoryCache = options && options.memoryCache
  }

  public async getOrder(orderId: string, retry: number = 0): Promise<Order> {
    return new Promise<Order>((resolve,reject) => {
      this.http.get("/api/oms/pvt/orders/"+orderId)
          .then(res => resolve(res))
          .catch(async(err) => {
            if(retry<maxRetry){
              await wait(maxWaitTime);
              return this.getOrder(orderId, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            }else{
              reject({message: "error while retrieving the order "+orderId+" --details "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())})
            }
          })
    })
  }

  public async getProductSpecifications(productId: string, retry: number = 0): Promise<IOResponse<ProductSpecificationResponse>> {
    return new Promise<IOResponse<ProductSpecificationResponse>>((resolve,reject) => {
      if(this.memoryCache?.has("product-"+productId)){
        resolve(this.memoryCache.get("product-"+productId));
      }else{
        this.http.getRaw("/api/catalog_system/pvt/products/"+productId+"/specification")
          .then(res => {
            this.memoryCache?.set("product-"+productId, {id: productId, data: res.data});
            resolve({id: productId, data: res.data});
          })
          .catch(async(err) => {
            if(retry<maxRetry){
              await wait(maxWaitTime);
              return this.getProductSpecifications(productId, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            }else{
              reject({message: "error while retrieving the product specifications for the product "+productId+" --details "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())})
            }
          })
      }
    })
  }

}
