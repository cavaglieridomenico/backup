//@ts-nocheck

import { CacheLayer, ExternalClient, InstanceOptions, IOContext, IOResponse } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { isValid, wait } from "../utils/functions";

export default class VtexSeller extends ExternalClient {

  memoryCache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
      let appData: AppSettings = JSON.parse(process.env.SFMC);
      options?.headers =
        {
          ...options?.headers,
          ...{
            "X-VTEX-API-AppKey": AES256Decode(appData.vtex.sellerAccount?.apiKey),
            "X-VTEX-API-AppToken": AES256Decode(appData.vtex.sellerAccount?.apiToken)
          }
        };
      super("http://portal.vtexcommercestable.com.br", context, options);
      this.memoryCache = options && options?.memoryCache;
  }

  public async GetSKUContext(skuid: string, sellerAccount: string, retry?: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve,reject) => {
      if(isValid(sellerAccount)){
        if(this.memoryCache?.has("sku-"+sellerAccount+"-"+skuid)){
          resolve(this.memoryCache.get("sku-"+sellerAccount+"-"+skuid))
        }else{
          this.http.get("/api/catalog_system/pvt/sku/stockkeepingunitbyid/"+skuid+"?an="+sellerAccount, this.options)
          .then(res => {
            this.memoryCache?.set("sku-"+sellerAccount+"-"+skuid, res);
            resolve(res);
          })
          .catch(async(err) => {
            if(retry<maxRetries){
              await wait(maxTime);
              return this.GetSKUContext(skuid, sellerAccount, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            }else{
              reject(err);
            }
          })
        }
      }else{
        reject({message: "error while retrieving sku ("+skuId+") context data --details: seller not valid"});
      }
    })
  }

}
