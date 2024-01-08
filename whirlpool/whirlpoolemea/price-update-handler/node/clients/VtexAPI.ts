import { InstanceOptions, IOContext, JanusClient } from "@vtex/api"
import { PriceCallInterface } from "../typings/interface"


export default class VtexAPI extends JanusClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })
  }


  public async getPriceBySkuId(idSku: string, account: string): Promise<PriceCallInterface[]> {
    const { fixedPrices } = await this.http.get(`https://api.vtex.com/${account}/pricing/prices/${idSku}`)
    return fixedPrices //array of object with the price of each tradePolicy
  }

  public async get12nc(idSku: string): Promise<string> {
    const { ProductRefId } = await this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${idSku}`)
    return ProductRefId //12NC
  }


}
