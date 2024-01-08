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

  public async getSkuByRefId(refId: string): Promise<any> {
    return await this.http.get("/api/catalog/pvt/stockkeepingunit?refId=" + refId)
  }

  public async getSkuContext(skuId: number): Promise<any> {
    return await this.http.get("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuId)
  }

}
