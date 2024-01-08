import { ACCOUNT, CacheLayer, InstanceOptions, JanusClient } from '@vtex/api'
import { IOContext } from '@vtex/api/lib/service/worker/runtime/typings';


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
  
  public async getAccount(): Promise<any> {
    return ACCOUNT;
  }

  public async getSkuIdByRefId(refId: string): Promise<any> {
    let responseBody = await this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitidbyrefid/${refId}`).catch(err => console.error(err));
    let skuId = (responseBody).skuId
    return skuId;
  }
  public async getCategoryIdByRefId(refId: string): Promise<any> {
    let responseBody = await this.http.get(`/api/catalog_system/pvt/products/productgetbyrefid/${refId}`).catch(err => console.error(err));
    let categoryId = (responseBody).CategoryId;
    return categoryId;
  }
  public async getCategoryNameById(categoryId: number): Promise<any> {
    let responseBody = await this.http.get(`/api/catalog/pvt/category/${categoryId}`).catch(err => console.error(err));
    let categoryName = (responseBody).Name
    return categoryName;
  }

  public async getCategoryContextById(categoryId: number): Promise<any> {
    let responseBody = await this.http.get(`/api/catalog/pvt/category/${categoryId}`).catch(err => console.error(err));
    return responseBody;
  }

  public async getSkuContextByRefId(refId: string): Promise<any> {
    let responseBody = await this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitbyalternateId/${refId}`).catch(err => console.error(err));
    return responseBody;
  }

  public async getProductContextByRefId(refId: string): Promise<any> {
    let responseBody = await this.http.get(`/api/catalog_system/pvt/products/productgetbyrefid/${refId}`).catch(err => console.error(err));
    return responseBody;
  }
  
}