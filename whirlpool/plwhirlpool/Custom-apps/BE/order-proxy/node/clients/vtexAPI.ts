import { JanusClient, IOContext, InstanceOptions, IOResponse } from "@vtex/api"

export default class VtexApi extends JanusClient {
  // memoryCache?: CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context,
      {
        ...options,
        headers: {
          ...options?.headers,
          VtexIdclientAutCookie: context.authToken
        }
      })
  }

  public async getOrder(orderId: string): Promise<IOResponse<any>> {
    return this.http.getRaw(`/api/oms/pvt/orders/${orderId}`)
  }
}
