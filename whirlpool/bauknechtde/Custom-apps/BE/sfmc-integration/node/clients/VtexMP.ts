//@ts-nocheck

import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient, LRUCache } from "@vtex/api";
import { DGFields, maxRetries, maxTime } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { isValid, wait } from "../utils/functions";
import { CustomApps, DGRecord, ProfileCustomFields, TradePolicy, UserInfo } from "../typings/types"
import { AppSettings, PremiumProducts } from "../typings/config";

let externalCache: CacheLayer<string, any> = new LRUCache<string, any>({ max: 5000, maxSize: 5000, ttl: 1000 * 60 * 8 });

export default class VtexMP extends JanusClient {

  memoryCache?: CacheLayer<string, any>
  constructor(context: IOContext, options?: InstanceOptions) {
    let appData: AppSettings = JSON.parse(process.env.SFMC);
    options?.headers =
    {
      ...options?.headers,
      ...{
        "X-VTEX-API-AppKey": AES256Decode(appData.vtex.mpAppKey),
        "X-VTEX-API-AppToken": AES256Decode(appData.vtex.mpAppToken)
      }
    };
    super(context, options);
    this.memoryCache = options && options?.memoryCache;
  }

  public async getOrder(orderId: string, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has("order-" + orderId)) {
        resolve(this.memoryCache?.get("order-" + orderId))
      } else {
        this.http.getRaw("/api/oms/pvt/orders/" + orderId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("order-" + orderId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getOrder(orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ message: "error while retrieving order data --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
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
            reject({ message: "error while retrieving user orders --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
          }
        })
    });
  }

  public async getSkuContext(skuId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has("skuContext-" + skuId)) {
        resolve(this.memoryCache?.get("skuContext-" + skuId))
      } else {
        this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("skuContext-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getSkuContext(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ message: "error while retrieving sku (" + skuId + ") context data --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
            }
          })
      }
    });
  }

  public async getCategory(categoryId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has("category-" + categoryId)) {
        resolve(this.memoryCache?.get("category-" + categoryId))
      } else {
        this.http.getRaw("/api/catalog/pvt/category/" + categoryId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("category-" + categoryId, res);
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
      if (this.memoryCache?.has("product-" + productId)) {
        resolve(this.memoryCache?.get("product-" + productId))
      } else {
        this.http.getRaw("/api/catalog/pvt/product/" + productId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("product-" + productId, res);
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

  public async getPrice(ctx: Context, skuId: any, tradePolicy: any, retry: number = 0): Promise<IOResponse<any>> {
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

  public async getImages(skuId: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      if (this.memoryCache?.has("skuImages-" + skuId)) {
        resolve(this.memoryCache?.get("skuImages-" + skuId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/" + skuId + "/file")
          .then(res => {
            resolve(res);
            this.memoryCache?.set("skuImages-" + skuId, res);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return this.getImages(skuId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ status: err.response?.status != undefined ? err.response.status : 500, message: "error while retrieving sku (" + skuId + ") images --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
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

  public async createCoupons(couponSettings: PremiumProducts, quantity: number, retry: number = 0): Promise<any> {
    if (quantity == 0) {
      return [];
    }
    return new Promise<any>((resolve, reject) => {
      let payload = {
        utmSource: couponSettings.sourceCampaign,
        utmCampaign: null,
        couponCode: couponSettings.couponPrefix,
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
            reject({ message: "error while generating coupons --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
          }
        })
    });
  }

  public async getAuthenticatedUser(authToken: string, retry: number = 0): Promise<IOResponse<any>> {
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
      if (this.memoryCache?.has("skuByRefId-" + refId)) {
        resolve(this.memoryCache?.get("skuByRefId-" + refId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit?refId=" + refId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("skuByRefId-" + refId, res);
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
      if (this.memoryCache?.has("skuCompl-" + skuId)) {
        resolve(this.memoryCache?.get("skuCompl-" + skuId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/" + skuId + "/complement")
          .then(res => {
            resolve(res);
            this.memoryCache?.set("skuCompl-" + skuId, res);
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
      if (this.memoryCache?.has("sku-" + skuId)) {
        resolve(this.memoryCache?.get("sku-" + skuId))
      } else {
        this.http.getRaw("/api/catalog/pvt/stockkeepingunit/" + skuId)
          .then(res => {
            resolve(res);
            this.memoryCache?.set("sku-" + skuId, res);
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
}

export async function getUserInfoByParam(ctx: Context, param: string, paramValue: string, retry: number = 0): Promise<UserInfo> {
  return new Promise<UserInfo>(async (resolve, reject) => {
    if (ctx.state.appSettings.vtex.checkoutAsGuest) {
      let res: UserInfo = {
        email: ctx.state.orderData.customData?.customApps?.find(f => f.id == CustomApps.PROFILE)?.fields[ProfileCustomFields.email] | "",
        tradePolicy: TradePolicy.O2P
      }
      if (res.email == 0 || res.email == null || res.email == "" || res.email == undefined) {
        var email;
        await ctx.clients.masterdata.searchDocuments({ dataEntity: "CL", fields: ["id", "email", "userType"], where: param + "=" + paramValue, pagination: { page: 1, pageSize: 100 } })
          .then(async (res) => {
            console.log("res: " + JSON.stringify(res))
            if (res.length > 0) {
              email = res[0].email
              //resolve(response);
            } else {
              if (retry < maxRetries) {
                await wait(maxTime);
                return getUserInfoByParam(ctx, param, paramValue, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
              } else {
                reject({ message: "error while retrieving user info --details: " + param + " " + paramValue + " not found" });
              }
            }
          })
          .catch(async (err) => {
            console.log("err: " + JSON.stringify(err))
            /* if(retry<maxRetries){
              await wait(maxTime);
              return getUserInfoByParam(ctx, param, paramValue, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
            }else{
              reject({message: "error while retrieving user info --details: "+JSON.stringify(err.response?.data!=undefined?err.response.data:err)});
            } */
          })
        res.email = email;
      }
      console.log("res dopo: ", res);
      resolve(res);
    } else {
      if (externalCache?.has("userInfo-" + paramValue)) {
        resolve(externalCache?.get("userInfo-" + paramValue));
      } else {
        ctx.clients.masterdata.searchDocuments({ dataEntity: "CL", fields: ["id", "email", "userType"], where: param + "=" + paramValue, pagination: { page: 1, pageSize: 100 } })
          .then(async (res) => {
            if (res.length > 0) {
              let response: UserInfo = {
                email: res[0].email,
                tradePolicy: isValid(res[0].userType) ? res[0].userType : TradePolicy.O2P
              }
              resolve(response);
              externalCache?.set("userInfo-" + paramValue, response);
            } else {
              if (retry < maxRetries) {
                await wait(maxTime);
                return getUserInfoByParam(ctx, param, paramValue, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
              } else {
                reject({ message: "error while retrieving user info --details: " + param + " " + paramValue + " not found" });
              }
            }
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return getUserInfoByParam(ctx, param, paramValue, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
            } else {
              reject({ message: "error while retrieving user info --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
            }
          })
      }
    }
  });
}

export async function getTradePolicyByEmail(ctx: Context, email: string, retry: number = 0): Pomise<string> {
  return new Promise<any>((resolve, reject) => {
    if (externalCache?.has("userTradePolicy-" + email)) {
      resolve(externalCache?.get("userTradePolicy-" + email));
    } else {
      if (isValid(email)) {
        ctx.clients.masterdata.searchDocuments({ dataEntity: "CL", fields: ["userType"], where: "email=" + email, pagination: { page: 1, pageSize: 100 } })
          .then(res => {
            let tradePolicy = TradePolicy.O2P;
            if (isValid(res[0]?.userType)) {
              tradePolicy = res[0].userType;
            }
            resolve(tradePolicy);
            externalCache?.set("userTradePolicy-" + email, tradePolicy);
          })
          .catch(async (err) => {
            if (retry < maxRetries) {
              await wait(maxTime);
              return getTradePolicyByEmail(ctx, email, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
            } else {
              reject({ message: "error while retrieving user's trade policy --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
            }
          })
      } else {
        resolve(TradePolicy.O2P);
      }
    }
  });
}

export async function isServedZipCode(ctx: Context, zip: string, retry: number = 0): Promise<Boolean> {
  return new Promise<Boolean>((resolve, reject) => {
    if (externalCache?.has("zipCode-" + zip)) {
      resolve(externalCache?.get("zipCode-" + zip));
    } else {
      ctx.clients.masterdata.searchDocuments({ dataEntity: "ZI", fields: ["zipCode"], where: "zipCode=" + zip, pagination: { page: 1, pageSize: 1000 } })
        .then(res => {
          let found = false;
          if (res.length > 0) {
            found = true;
          }
          resolve(found)
          externalCache?.set("zipCode-" + zip, found);
        })
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return isServedZipCode(ctx, zip, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ message: "error while retrieving zip codes --details: " + JSON.stringify(err.response?.data != undefined ? err.response.data : err) });
          }
        });
    }
  });
}

export async function getDnGLinks(ctx: Context, expectedDnGLinks: number, retry: number = 0): Promise<DGRecord[]> {
  return new Promise<DGRecord[]>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: ctx.state.appSettings.vtex.dngSettings?.mdName, fields: DGFields, where: "orderId=" + ctx.state.orderData.orderId, pagination: { page: 1, pageSize: 100 } })
      .then(async (res) => {
        if (res.length == expectedDnGLinks) {
          resolve(res.length == 0 ? [] : res);
        } else {
          if (retry < maxRetries) {
            await wait(maxTime);
            return getDnGLinks(ctx, expectedDnGLinks, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            resolve(res.length == 0 ? [] : res);
          }
        }
      })
      .catch(async (err) => {
        if (retry < maxRetries) {
          await wait(maxTime);
          return getDnGLinks(ctx, expectedDnGLinks, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
        } else {
          resolve([]);
        }
      })
  })
}
