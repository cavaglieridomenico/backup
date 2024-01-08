import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { Order } from '../typings/Order';

export default class VtexAPI extends JanusClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken,
        'Proxy-Authorization': context.authToken
      }
    })
  }

  public async GetOrder(orderid: string): Promise<Order> {
    return this.http.get('/api/oms/pvt/orders/' + orderid)
  }

}
