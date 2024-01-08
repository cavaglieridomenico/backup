//@ts-nocheck

import { InstanceOptions, IOContext, IOResponse, JanusClient} from "@vtex/api";
import { vtexKeyToken } from "../utils/constants";


export default class VtexAPI extends JanusClient {
    constructor(context: IOContext, options?: InstanceOptions)
    {
        options = {
          headers: {
            'X-VTEX-Use-Https': true,
            "X-VTEX-API-AppKey": vtexKeyToken[context.account].key,
            "X-VTEX-API-AppToken": vtexKeyToken[context.account].token
          },
          timeout: 20000
        }
        super(context, options)
    }

    public getSkuContext(skuId: string): Promise<IOResponse<any>> {
        return this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/"+skuId);
    }

    public async GetSKU(skuid: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await this.http.get('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuid);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }

    public getProduct(productId: string): Promise<IOResponse<any>> {
      return this.http.getRaw("/api/catalog/pvt/product/"+productId);
    }

    public getAssociatedSimilarCategories(productId: String): Promise<IOResponse<any>>{
      return this.http.getRaw("/api/catalog/pvt/product/"+productId+"/similarcategory");
  }

    public getPrice(skuId: string, ctx: Context): Promise<IOResponse<any>> {
      return this.http.getRaw("/"+ctx.vtex.account+"/pricing/prices/"+skuId);
    }

    public getSalePrice(skuId: string): Promise<IOResponse<any>> {
      return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:"+skuId);
    }

    public async getStock(skuId: number): Promise<IOResponse<any>>{
      return this.http.getRaw("/api/logistics/pvt/inventory/skus/"+skuId);
    }

    public async getStockBySellerName(skuId: number | string, scid: number | string, sellerName?: string|undefined): Promise<IOResponse<any>> {
      return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + scid)
        .then(res => {
          return sellerName ?
                  res.data[0]?.items[0]?.sellers.find((seller: any) => seller.sellerId == sellerName)?.commertialOffer?.AvailableQuantity :
                  res.data[0]?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity;
        });
    }

    public getSkuRangeByPage(page: number): Promise<IOResponse<any>>{
      return this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitids?page="+page+"&pagesize=1000");
    }

    public getAllPromo(): Promise<IOResponse<any>>{
      return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
    }

    public getPromoById(id: String): Promise<IOResponse<any>>{
        return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/"+id);
    }
}
