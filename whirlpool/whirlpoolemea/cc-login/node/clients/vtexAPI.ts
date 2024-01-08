import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { Order } from '../typings/order'
import { maxRetry, maxWaitTime } from '../utils/constants'
import { wait } from '../utils/functions'

export default class VtexAPI extends JanusClient {


  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })
  }

  public async GetOrder(orderId: string, retry: number = 0): Promise<Order> {
    return new Promise<Order>((resolve, reject) => {
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
}
