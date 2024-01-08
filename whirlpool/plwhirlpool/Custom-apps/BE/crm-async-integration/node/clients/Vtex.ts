//@ts-nocheck

import {InstanceOptions, IOContext, IOResponse, JanusClient} from "@vtex/api";

export default class VtexApi extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
      options?.headers = {...options?.headers,...{VtexIdclientAutCookie: context.authToken}} // not really needed
      super(context, options)
  }

  public async getAuthenticatedUser(authToken: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/vtexid/pub/authenticated/user?authToken="+authToken);
  }
}
