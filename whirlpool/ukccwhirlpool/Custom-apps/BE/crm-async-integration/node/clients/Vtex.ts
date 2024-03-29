//@ts-nocheck

import {InstanceOptions, IOContext, IOResponse, JanusClient} from "@vtex/api";
import { Order } from "../typings/Order";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { getCircularReplacer, wait } from "../utils/mapper";

export default class Vtex extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    options?.headers = {...options?.headers,...{VtexIdclientAutCookie: context.authToken}}
    super(context, options)
  }

  public async getAuthenticatedUser(authToken: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/vtexid/pub/authenticated/user?authToken="+authToken);
  }

  public async getOrder(orderId: string, retry: number = 0): Promise<IOResponse<Order>> {
    return new Promise<IOResponse<Order>>((resolve, reject) => {
      this.http.getRaw("/api/oms/pvt/orders/"+orderId)
        .then(res => resolve(res))
        .catch(async(err) => {
          if(retry<maxRetry){
            await wait(maxWaitTime);
            return this.getOrder(orderId, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }else{
            reject({message: "error while getting order data --details: "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())});
          }
        })
    })
  }
}
