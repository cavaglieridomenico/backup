import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient } from "@vtex/api";
import { DGFields, maxRetries, maxTime } from "../utils/constants";
import { isValid, stringify, wait } from "../utils/functions";
import { CustomApps, DGRecord, ProfileCustomFields, TradePolicy, UserInfo } from "../typings/types"
import { PremiumProducts } from "../typings/config";
import { AES256Decode } from "../utils/cryptography";

export default class VtexMP extends JanusClient {

  private memoryCache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    let settings: { key: string, token: string } = JSON.parse(process.env[`${context.account}-MKTPLACE`]!);
    options!.headers =
    {
      ...options?.headers,
      ...{
        //VtexIdclientAutCookie: context.authToken // => not enough for the API call getMarketPrice() on CC
        "X-VTEX-API-AppKey": AES256Decode(settings.key),
        "X-VTEX-API-AppToken": AES256Decode(settings.token)
      }
    };
    super(context, options);
    this.memoryCache = options && options?.memoryCache;
  }

  public async getOrder(orderId: string, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-order-" + orderId)) {
        resolve(this.memoryCache?.get(this.context.account + "-order-" + orderId))
      } else {
        this.http.getRaw("/api/oms/pvt/orders/" + orderId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-order-" + orderId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime * 4);
              return this.getOrder(orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ message: "error while retrieving order data --details: " + stringify(err.response?.data ? err.response.data : err) });
            }
          })
      }
    });
  }

  public async getOrdersByEmail(email: string, page: number, per_page: number, orderId: string, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.getRaw("/api/oms/pvt/orders?q=" + email + "&page=" + page + "&per_page=" + per_page + "&orderId=" + orderId)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getOrdersByEmail(email, page, per_page, orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: "error while retrieving user orders --details: " + stringify(err.response?.data ? err.response.data : err) });
          }
        })
    });
  }

  public async getSkuContext(skuId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-skuContext-" + skuId)) {
        resolve(this.memoryCache?.get(this.context.account + "-skuContext-" + skuId))
      } else {
        this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-skuContext-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getSkuContext(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ message: "error while retrieving sku (" + skuId + ") context data --details: " + stringify(err.response?.data ? err.response.data : err) });
            }
          })
      }
    });
  }

  public async getCategory(categoryId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-category-" + categoryId)) {
        resolve(this.memoryCache?.get(this.context.account + "-category-" + categoryId))
      } else {
        this.http.getRaw("/api/catalog/pvt/category/" + categoryId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-category-" + categoryId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getCategory(categoryId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    });
  }

  public async getStock(skuId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.getRaw("/api/logistics/pvt/inventory/skus/" + skuId)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getStock(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    });
  }

  public async getProduct(productId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-product-" + productId)) {
        resolve(this.memoryCache?.get(this.context.account + "-product-" + productId))
      } else {
        this.http.getRaw("/api/catalog/pvt/product/" + productId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-product-" + productId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getProduct(productId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    });
  }

  public async getPrice(ctx: Context | DropPriceAlertContext, skuId: any, tradePolicy: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.getRaw("/" + ctx.vtex.account + "/pricing/prices/" + skuId + "/fixed/" + tradePolicy)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getPrice(ctx, skuId, tradePolicy, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    });
  }

  public getSpecGroupByCategory(categoryId: string, retry: number = 0): Promise<IOResponse<string>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.getRaw('/api/catalog_system/pvt/specification/groupbycategory/' + categoryId)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getSpecGroupByCategory(categoryId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    });
  }

  public async getImages(skuId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-skuImages-" + skuId)) {
        resolve(this.memoryCache?.get(this.context.account + "-skuImages-" + skuId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/" + skuId + "/file")
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-skuImages-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getImages(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ status: err.response?.status ? err.response.status : 500, message: "error while retrieving sku (" + skuId + ") images --details: " + stringify(err.response?.data ? err.response.data : err) });
            }
          })
      }
    });
  }

  public async getMarketPrice(skuId: any, tradePolicy: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId + "&sc=" + tradePolicy)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getMarketPrice(skuId, tradePolicy, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    });
  }

  public async createCoupons(couponSettings: PremiumProducts | undefined, quantity: number, retry: number = 0): Promise<any> {
    if (quantity == 0) {
      return [];
    }
    return new Promise<any>((resolve, reject) => {
      let payload = {
        utmSource: couponSettings!.sourceCampaign,
        utmCampaign: null,
        couponCode: couponSettings!.couponPrefix,
        isArchived: false,
        maxItemsPerClient: 1,
        expirationIntervalPerUse: null
      }
      this.http.post("/api/rnb/pvt/coupons?quantity=" + quantity, payload)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.createCoupons(couponSettings, quantity, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: "error while generating coupons --details: " + stringify(err.response?.data ? err.response.data : err) });
          }
        })
    });
  }

  public async getAuthenticatedUser(authToken: string | undefined, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.getRaw("/api/vtexid/pub/authenticated/user?authToken=" + authToken)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getAuthenticatedUser(authToken, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    });
  }

  public async getSkuByRefId(refId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-skuByRefId-" + refId)) {
        resolve(this.memoryCache?.get(this.context.account + "-skuByRefId-" + refId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit?refId=" + refId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-skuByRefId-" + refId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getSkuByRefId(refId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    });
  }

  public async getSkuComplementBySkuId(skuId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-skuCompl-" + skuId)) {
        resolve(this.memoryCache?.get(this.context.account + "-skuCompl-" + skuId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/" + skuId + "/complement")
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-skuCompl-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getSkuComplementBySkuId(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    });
  }

  public async getSkuBySkuId(skuId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-sku-" + skuId)) {
        resolve(this.memoryCache?.get(this.context.account + "-sku-" + skuId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/" + skuId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set(this.context.account + "-sku-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getSkuBySkuId(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject(err);
            }
          })
      }
    });
  }

  public async getUserInfoByParam(ctx: Context | StatusChangeContext, param: string, paramValue: string, retry: number = 0): Promise<UserInfo> {
    return new Promise<UserInfo>((resolve, reject) => {
      if (ctx.state.appSettings.vtex.checkoutAsGuest) {
        let res: UserInfo = {
          email: ctx.state.orderData.customData?.customApps?.find((f: any) => f.id == CustomApps.PROFILE)?.fields[ProfileCustomFields.email],
          tradePolicy: TradePolicy.O2P
        }
        resolve(res);
      } else {
        if (this.memoryCache?.has(this.context.account + "-userInfo-" + paramValue)) {
          resolve(this.memoryCache?.get(this.context.account + "-userInfo-" + paramValue));
        } else {
          ctx.clients.masterdata.searchDocuments({ dataEntity: "CL", fields: ["id", "email", "userType"], where: param + "=" + paramValue, pagination: { page: 1, pageSize: 100 } })
            .then(async (res: any[]) => {
              if (res.length > 0) {
                let response: UserInfo = {
                  email: res[0].email,
                  tradePolicy: isValid(res[0].userType) ? res[0].userType : TradePolicy.O2P
                }
                resolve(response);
                this.memoryCache?.set(this.context.account + "-userInfo-" + paramValue, response);
              } else {
                if (retry < maxRetries) {
                  await wait(maxTime);
                  return this.getUserInfoByParam(ctx, param, paramValue, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
                } else {
                  reject({ message: "error while retrieving user info --details: " + param + " " + paramValue + " not found" });
                }
              }
            })
            .catch(async (err) => {
              if (retry < maxRetries) {
                await wait(maxTime);
                return this.getUserInfoByParam(ctx, param, paramValue, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
              } else {
                reject({ message: "error while retrieving user info --details: " + stringify(err.response?.data ? err.response.data : err) });
              }
            })
        }
      }
    });
  }

  public async isServedZipCode(ctx: Context | StatusChangeContext, zip: string, retry: number = 0): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      if (this.memoryCache?.has(this.context.account + "-zipCode-" + zip)) {
        resolve(this.memoryCache?.get(this.context.account + "-zipCode-" + zip));
      } else {
        ctx.clients.masterdata.searchDocuments({ dataEntity: "ZI", fields: ["zipCode"], where: "zipCode=" + zip, pagination: { page: 1, pageSize: 1000 } })
          .then(res => {
            let found = false;
            if (res.length > 0) {
              found = true;
            }
            resolve(found)
            this.memoryCache?.set(this.context.account + "-zipCode-" + zip, found);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.isServedZipCode(ctx, zip, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
            } else {
              reject({ message: "error while retrieving zip codes --details: " + stringify(err.response?.data ? err.response.data : err) });
            }
          });
      }
    });
  }

  public async getDnGLinks(ctx: Context | StatusChangeContext, expectedDnGLinks: number, retry: number = 0): Promise<DGRecord[]> {
    return new Promise<DGRecord[]>((resolve, reject) => {
      ctx.clients.masterdata.searchDocuments({ dataEntity: ctx.state.appSettings.vtex.dngSettings?.mdName as string, fields: DGFields, where: "orderId=" + ctx.state.orderData.orderId, pagination: { page: 1, pageSize: 100 } })
        .then(async (res: any[]) => {
          if (res.length == expectedDnGLinks) {
            resolve(res.length == 0 ? [] : res);
          } else {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getDnGLinks(ctx, expectedDnGLinks, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
            } else {
              resolve(res.length == 0 ? [] : res);
            }
          }
        })
        .catch(async () => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getDnGLinks(ctx, expectedDnGLinks, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            resolve([]);
          }
        })
    })
  }
}
