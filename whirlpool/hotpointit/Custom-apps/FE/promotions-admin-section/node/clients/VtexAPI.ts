import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export default class VtexAPI extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.adminUserAuthToken || ""
      }
    })

  }

  public GetPromotionsList(): Promise<any> {
    return this.http.get("/api/rnb/pvt/benefits/calculatorconfiguration");
  }

  public async GetPromotionDetails(id: string): Promise<any> {
    return this.http.get(`/api/rnb/pvt/calculatorconfiguration/${id}`)
  }

  public async GetCoupons(query: string): Promise<any> {
    return this.http.get(`/api/rnb/pvt/coupon?utm_source=${query}`)
  }

}
