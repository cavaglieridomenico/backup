//@ts-nocheck

import { InstanceOptions, IOContext, IOResponse, JanusClient, CacheLayer} from "@vtex/api";
import { vtexKeyToken } from "../utils/constants";


export default class VtexAPI extends JanusClient {
  cache?: CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions){
    options.headers = {
      ...options.headers,
      ...{
        "X-VTEX-API-AppKey": vtexKeyToken[context.account].key,
        "X-VTEX-API-AppToken": vtexKeyToken[context.account].token
      },
    }
    super(context, options);
    this.cache = options && options?.memoryCache;
  }

  public async getSkuContext(skuId: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/"+skuId);
  }

  public async getProduct(productId: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog/pvt/product/"+productId);
  }

  public async getAssociatedSimilarCategories(productId: String): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/catalog/pvt/product/"+productId+"/similarcategory");
  }

  public async getPrice(skuId: string, ctx: Context): Promise<IOResponse<any>> {
    return this.http.getRaw("/"+ctx.vtex.account+"/pricing/prices/"+skuId);
  }

  public async getMarketPrice(skuId: string, tradePolicy: number): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:"+skuId+"&sc="+tradePolicy);
  }

  public async getStock(skuId: number): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/logistics/pvt/inventory/skus/"+skuId);
  }

  public async getSkuRangeByPage(page: number): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitids?page="+page+"&pagesize=1000");
  }

  public async getAllPromo(): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
  }

  public async getPromoById(id: String): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/"+id);
  }

  public async getSalesChannelList(): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/catalog_system/pvt/saleschannel/list");
  }

  public async getSkuComplement(skuId: string): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/catalog/pvt/stockkeepingunit/"+skuId+"/complement");
  }

  public async getProductsByCollectionId(collectionId: string): Promise<IOResponse<any>> {
    return new Promise<any>((resolve,reject) => {
      if(this.memoryCache?.has("collection-"+collectionId)){
        resolve(this.memoryCache?.get("collection-"+collectionId))
      }else{
        this.http.getRaw("/api/catalog/pvt/collection/"+collectionId+"/products?pageSize=1000")
        .then(res => {
          resolve(res);
          this.memoryCache?.set("collection-"+collectionId,res);
        })
        .catch(err => {
          reject(err);
        })
      }
    });
  }
}
