import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'

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

  public async GetSKU(skuid: number): Promise<any> {
    return this.http.get('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuid)
  }

  public async GetSkuList(page = 1): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let res: any[] = await this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitids?page=${page}&pagesize=1000`)
        if (res.length >= 1000) {
          res = res.concat(await this.GetSkuList(page + 1))
        }
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }

  public async GetCategories(): Promise<any[]> {
    return this.http.get('/api/catalog_system/pub/category/tree/5')
  }

}
