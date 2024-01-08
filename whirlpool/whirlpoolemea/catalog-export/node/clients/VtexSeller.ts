//@ts-nocheck

import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { AppSettings } from "../types/typing";
import { AES256Decode } from "../utils/cryptography";
import { getCacheKey } from '../utils/CommonFunctions'


export default class VtexSeller extends ExternalClient {
  cache?: CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: AppSettings = JSON.parse(process.env.CE);
    options?.headers = {
      ...options?.headers, ...{
        "X-VTEX-API-AppKey": AES256Decode(appSettings.seller?.apiKey),
        "X-VTEX-API-AppToken": AES256Decode(appSettings.seller?.apiToken)
      }
    }
    super("http://portal.vtexcommercestable.com.br", context, options);
    this.cache = options && options?.memoryCache;
  }

  public async getSKUContext(skuid: string, sellerAccount: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (isValid(sellerAccount)) {
        const cacheKey = getCacheKey(this.context.account, "sku", sellerAccount, skuid)
        if (await this.cache?.has(cacheKey)) {
          console.log("cache-hit");
          const res = await this.cache?.get(cacheKey)
          resolve(res)
        }
        this.http.get("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuid + "?an=" + sellerAccount, this.options)
          .then(res => {
            this.memoryCache?.set(cacheKey, res);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          })

      } else {
        reject({ message: "error while retrieving sku (" + skuId + ") context data --details: seller not valid" });
      }
    })
  }

}

function isValid(data: any): boolean {
  return data != undefined && data != null && data != "undefined" && data != "null" && data != "" && data != " " && data != "-" && data != "_";
}
