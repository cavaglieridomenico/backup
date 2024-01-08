import { CacheLayer, InstanceOptions, IOContext, JanusClient } from '@vtex/api'


export default class VtexAPI extends JanusClient {


  cache?: CacheLayer<string, any>
  memoryCache: any

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
  public async GetOrder(orderid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.cache && this.cache?.has(orderid)) {
        resolve(this.cache?.get(orderid))
      } else {
        try {
          let res = await this.http.get('/api/oms/pvt/orders/' + orderid + "-01")
          this.cache?.set(orderid, res)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }
}