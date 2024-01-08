//@ts-nocheck

import {CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient} from "@vtex/api";

export default class VtexApi extends JanusClient {

  memoryCache? : CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {
      options?.headers = {...options.headers,...{VtexIdclientAutCookie: context.authToken}}
      super(context, options)
      this.memoryCache = options && options?.memoryCache
  }

  public async getSkuByRefId(refId: string): Promise<IOResponse<any>> {
    return new Promise<any>((resolve,reject) => {
      if(this.memoryCache?.has("sku-"+refId)){
        resolve(this.memoryCache?.get("sku-"+refId))
      }else{
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit?refId="+refId)
        .then(res => {
          resolve(res);
          this.memoryCache?.set("sku-"+refId,res);
        })
        .catch(err => {
          reject({message:"error while retrieving sku data --details: "+(err.response?.data!=undefined?err.response.data:JSON.stringify(err))})
        })
      }
    });
  }

  public async getSkuContext(skuId: number): Promise<IOResponse<any>> {
    return new Promise<any>((resolve,reject) => {
      if(this.memoryCache?.has("skuContext-"+skuId)){
        resolve(this.memoryCache?.get("skuContext-"+skuId))
      }else{
        this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/"+skuId)
        .then(res => {
          resolve(res);
          this.memoryCache?.set("skuContext-"+skuId,res);
        })
        .catch(err => {
          reject({message:"error while retrieving sku context --details: "+(err.response?.data!=undefined?err.response.data:JSON.stringify(err))})
        })
      }
    });
  }

  public async getImages(skuId: number): Promise<IOResponse<any>> {
    return new Promise<any>((resolve,reject) => {
      if(this.memoryCache?.has("skuImages-"+skuId)){
        resolve(this.memoryCache?.get("skuImages-"+skuId))
      }else{
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/"+skuId+"/file")
        .then(res => {
          resolve(res);
          this.memoryCache?.set("skuImages-"+skuId,res);
        })
        .catch(err => {
          reject({message:"error while retrieving sku images --details: "+(err.response?.data!=undefined?err.response.data:JSON.stringify(err))})
        })
      }
    });
  }

}
