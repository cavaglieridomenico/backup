import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export default class VtexApi extends JanusClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })
  }
  

}
