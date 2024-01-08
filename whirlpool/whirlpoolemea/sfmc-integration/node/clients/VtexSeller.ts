import { CacheLayer, ExternalClient, InstanceOptions, IOContext, IOResponse } from "@vtex/api";
import { SellerAccount } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { wait } from "../utils/functions";

export default class VtexSeller extends ExternalClient {

  private memoryCache?: CacheLayer<string, any>
  private settings: SellerAccount


  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: SellerAccount = JSON.parse(process.env[`${context.account}-SELLER`]!);
    options!.headers =
    {
      ...options?.headers,
      ...{
        "X-VTEX-API-AppKey": AES256Decode(appSettings.apiKey),
        "X-VTEX-API-AppToken": AES256Decode(appSettings.apiToken)
      }
    };
    super("http://portal.vtexcommercestable.com.br", context, options);
    this.memoryCache = options && options?.memoryCache;
    this.settings = appSettings;
  }

  public async GetSKUContext(skuid: string, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has("sku-" + this.settings.name + "-" + skuid)) {
        resolve(this.memoryCache.get("sku-" + this.settings.name + "-" + skuid))
      } else {
        this.http.get("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuid + "?an=" + this.settings.name, this.options)
          .then(res => {
            this.memoryCache?.set("sku-" + this.settings.name + "-" + skuid, res);
            resolve(res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.GetSKUContext(skuid, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    })
  }

}
