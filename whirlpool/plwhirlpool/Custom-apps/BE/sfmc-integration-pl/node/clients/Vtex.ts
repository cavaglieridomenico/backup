//@ts-nocheck

import {CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient, LRUCache} from "@vtex/api";
import { resolve } from "dns";
import { reject } from "ramda";
import { keyToken } from "../utils/constants";

export default class VtexApi extends JanusClient {
  memoryCache? : CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {
      options?.headers = {
          "X-VTEX-Use-Https": true,
          "X-VTEX-API-AppKey": keyToken[context.account].key,
          "X-VTEX-API-AppToken": keyToken[context.account].token
      }
      super(context, options)
      this.memoryCache = options && options?.memoryCache
  }

  public async getOrder(orderId: any): Promise<IOResponse<any>> {
      return this.http.getRaw("/api/oms/pvt/orders/"+orderId);
  }

  public async getEmail(userId: any): Promise<IOResponse<any>> {
      return await this.http.getRaw("/api/dataentities/CL/search?_fields=email&_where=userId="+userId);
  }

  public async getSkuContext(skuId: any): Promise<IOResponse<any>> {
    return new Promise<any>((resolve,reject) => {
      if(this.memoryCache?.has("skuContext"+skuId)){
        resolve(this.memoryCache?.get("skuContext"+skuId))
      }else{
        this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/"+skuId)
        .then(res => {
          resolve(res);
          this.memoryCache?.set("skuContext"+skuId,res);
        })
        .catch(err => {
          reject(err);
        })
      }
    });
  }

  public async getCategory(categoryId: any): Promise<IOResponse<any>> {
    return new Promise<any>((resolve,reject) => {
      if(this.memoryCache?.has("category"+categoryId)){
        resolve(this.memoryCache?.get("category"+categoryId))
      }else{
        this.http.getRaw("/api/catalog/pvt/category/"+categoryId)
        .then(res => {
          resolve(res);
          this.memoryCache?.set("category"+categoryId,res);
        })
        .catch(err => {
          reject(err);
        })
      }
    });
  }

  public async getStock(skuId: number): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/logistics/pvt/inventory/skus/"+skuId);
  }

  public async getProduct(productId: any): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog/pvt/product/"+productId);
  }

  public async getPrice(skuId: any, ctx: Context): Promise<IOResponse<any>> {
    return this.http.getRaw("/"+ctx.vtex.account+"/pricing/prices/"+skuId+"/fixed/1");
  }

  public async getImages(skuId: any): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog/pvt/stockkeepingunit/"+skuId+"/file");
}

  public async getMarketPrice(skuId: any): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:"+skuId);
  }

  public async createCoupons(quantity: number): Promise<[]> {
    return quantity==0?[]:this.http.post("/api/rnb/pvt/coupons?quantity="+quantity,
      {
        "utmSource": "PremiumCoupon",
        "utmCampaign": null,
        "couponCode": "PR",
        "isArchived": false,
        "maxItemsPerClient": 1,
        "expirationIntervalPerUse": null
      }
    );
  }

  public async getSpecificationByProductId(productId: any): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/catalog_system/pvt/products/"+productId+"/specification");
  }

  public async getAuthenticatedUser(authToken: string): Promise<IOResponse<any>> {
    return this.http.getRaw("/api/vtexid/pub/authenticated/user?authToken="+authToken);
  }

  public async getSkuRangeByPage(page: number): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitids?page="+page+"&pagesize=1000");
  }

  public async getSkuByRefId(refId: string): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/catalog/pvt/stockkeepingunit?refId="+refId);
  }

  public async getSkuComplementBySkuId(skuId: string): Promise<IOResponse<any>>{
    return this.http.getRaw("/api/catalog/pvt/stockkeepingunit/"+skuId+"/complement");
  }

  public async getSkuBySkuId(skuId: string): Promise<IOResponse<any>>{
    return new Promise<any>((resolve,reject) => {
      if(this.memoryCache?.has("sku"+skuId)){
        resolve(this.memoryCache?.get("sku"+skuId))
      }else{
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/"+skuId)
        .then(res => {
          resolve(res);
          this.memoryCache?.set("sku"+skuId,res);
        })
        .catch(err => {
          reject(err);
        })
      }
    });
  }
}
