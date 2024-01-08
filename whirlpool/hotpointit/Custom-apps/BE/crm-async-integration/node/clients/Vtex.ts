//@ts-nocheck

import {CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient, LRUCache} from "@vtex/api";
import { resolve } from "dns";
import { reject } from "ramda";

export default class VtexApi extends JanusClient {
  private memoryCache? : CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {
      options!.headers = {
          ...options.headers,
          ...{
            VtexIdclientAutCookie: context
          }
      }
      super(context, options)
      this.memoryCache = options && options?.memoryCache
  }

  /**
   * Get user info througt his authentication token
   * @param authToken authentication token (value of cookie)
   * @returns user info
   */
  public async getAuthenticatedUser(authToken: string): Promise<IOResponse<any>> {
      return this.http.getRaw("/api/vtexid/pub/authenticated/user?authToken="+authToken);
  }
}
