import { CacheLayer, InstanceOptions, IOContext, JanusClient } from "@vtex/api";
import { SessionResponse } from "../typing/session";
import { GetSkuByRefIdRes, GetSkuContextRes, SkuFile } from "../typing/sku";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions";

export default class Vtex extends JanusClient {

  memoryCache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = { ...options!.headers, ...{ VtexIdclientAutCookie: context.authToken } };
    super(context, options);
    this.memoryCache = options && options?.memoryCache;
  }

  public async getSkuByRefId(refId: string, retry: number = 0): Promise<GetSkuByRefIdRes> {
    return new Promise<GetSkuByRefIdRes>((resolve, reject) => {
      if (this.memoryCache?.has("sku-" + refId)) {
        resolve(this.memoryCache?.get("sku-" + refId))
      } else {
        this.http.get("/api/catalog/pvt/stockkeepingunit?refId=" + refId, this.options)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("sku-" + refId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetry) {
              await wait(maxWaitTime);
              return this.getSkuByRefId(refId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: "error while retrieving sku data (refId: " + refId + ") --details: " + stringify(err) });
            }
          })
      }
    });
  }

  public async getSkuContext(skuId: number, retry: number = 0): Promise<GetSkuContextRes> {
    return new Promise<GetSkuContextRes>((resolve, reject) => {
      if (this.memoryCache?.has("skuContext-" + skuId)) {
        resolve(this.memoryCache?.get("skuContext-" + skuId))
      } else {
        this.http.get("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuId, this.options)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("skuContext-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetry) {
              await wait(maxWaitTime);
              return this.getSkuContext(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: "error while retrieving sku context (skuId: " + skuId + ") --details: " + stringify(err) });
            }
          })
      }
    });
  }

  public async getSkuImages(skuId: number, retry: number = 0): Promise<SkuFile[]> {
    return new Promise<SkuFile[]>((resolve, reject) => {
      if (this.memoryCache?.has("skuImages-" + skuId)) {
        resolve(this.memoryCache?.get("skuImages-" + skuId))
      } else {
        this.http.get("/api/catalog/pvt/stockkeepingunit/" + skuId + "/file", this.options)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("skuImages-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetry) {
              await wait(maxWaitTime);
              return this.getSkuImages(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: "error while retrieving sku images (skuId: " + skuId + ") --details: " + stringify(err) });
            }
          })
      }
    });
  }

  public async getSession(cookiename: string, cookie: string | undefined, retry: number = 0): Promise<SessionResponse> {
    return new Promise<SessionResponse>((resolve, reject) => {
      if (cookie) {
        this.options!.headers!["Cookie"] = cookiename + "=" + cookie + ";";
      }
      this.http.get("/api/sessions?items=*", this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getSession(cookiename, cookie, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: "error while retrieving user session --details: " + stringify(err) });
          }
        })
    })
  }

}
