import { CacheLayer, InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { Order } from '../typings/Order';
import { vtexCredentials } from '../utils/constants';

export default class VtexAPI extends JanusClient {

  memoryCache? : CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        ...vtexCredentials[context.account]
      }
    })

    this.memoryCache = options && options?.memoryCache
  }

  public async GetOrder(orderid: string): Promise<Order> {
    return this.http.get('/api/oms/pvt/orders/'+ orderid)
  }

}
