//@ts-nocheck

import { CacheLayer, ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { VtexAccount } from "../typings/configs";
import { AES256Decode } from "../utils/cryptography";
import { isValid } from "../utils/functions";

export default class VtexSeller extends ExternalClient{

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions){
    let sellerSettings: VtexAccount = JSON.parse(process.env.SELLERACC);
    options?.headers = {...options?.headers,...{
      "X-VTEX-API-AppKey": AES256Decode(sellerSettings.apiKey),
      "X-VTEX-API-AppToken": AES256Decode(sellerSettings.apiToken)
    }};
    super("http://portal.vtexcommercestable.com.br", context, options);
    this.cache = options && options?.memoryCache
  }

  public async GetSKUContext(skuid: string, sellerAccount: VtexAccount|undefined): Promise<any> {
    return new Promise<any>((resolve,reject) => {
      if(isValid(sellerAccount.name)){
        if(this.cache && this.cache?.has("sku-"+sellerAccount.name+"-"+skuid)){
          resolve(this.cache.get("sku-"+sellerAccount.name+"-"+skuid))
        }else{
          this.http.get("/api/catalog_system/pvt/sku/stockkeepingunitbyid/"+skuid+"?an="+sellerAccount.name, this.options)
          .then(res => {
            this.cache?.set("sku-"+sellerAccount.name+"-"+skuid, res);
            resolve(res)
          })
          .catch(err => reject(err))
        }
      }else{
        reject({response: {status: 500, data: "Seller not valid"}});
      }
    })
  }

}
