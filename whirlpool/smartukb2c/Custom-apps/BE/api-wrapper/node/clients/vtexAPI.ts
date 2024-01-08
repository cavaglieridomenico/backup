import { CacheLayer, InstanceOptions, IOContext, JanusClient } from '@vtex/api'

export default class VtexAPI extends JanusClient {

    cache?: CacheLayer<string, any>
  
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
}