import { CacheLayer, CacheType, InstanceOptions, IOContext, JanusClient } from "@vtex/api";
import { Order } from "../typings/order";
import { ProductSpecification } from "../typings/productSpecification";
import { Sku, SkuNotFound } from "../typings/sku";
import { Stock, StockReservation, StockReservationRes, StockReservations, StockWithDispatchedReservations, UpdateStockReq, UpdateStockReservationReq, UpdateStockReservationRes } from "../typings/stock";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { normalizeQuantity, stringify, wait } from "../utils/functions";

export default class VtexSeller extends JanusClient {

  memoryCache: CacheLayer<string, any> | undefined

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = { ...options?.headers, ...{ VtexIdclientAutCookie: context.authToken } };
    super(context, options);
    this.memoryCache = options && options!.memoryCache;
  }

  public async getOrder(orderId: string, retry: number = 0): Promise<Order> {
    return new Promise<Order>((resolve, reject) => {
      if (this.memoryCache?.has("order-" + orderId)) {
        resolve(this.memoryCache.get("order-" + orderId));
      } else {
        this.http.get("/api/oms/pvt/orders/" + orderId)
          .then(res => {
            this.memoryCache?.set("order-" + orderId, res);
            resolve(res);
          })
          .catch(async (err) => {
            if (retry < maxRetry) {
              await wait(1500);
              return this.getOrder(orderId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: "error while retrieving order data (orderId: " + orderId + ") --details: " + stringify(err) });
            }
          })
      }
    })
  }

  public async getStock(skuId: string, inStockWarehouseId: string, retry: number = 0): Promise<Stock> {
    return new Promise<Stock>(async (resolve, reject) => {
      try {
        let [stockData, inStockData]: [Stock, StockWithDispatchedReservations] = await Promise.all(
          [
            this.http.get("/api/logistics/pvt/inventory/skus/" + skuId, { cacheable: CacheType.None }),
            this.http.get("/api/logistics/pvt/inventory/items/" + skuId + "/warehouses/" + inStockWarehouseId + "/dispatched", { cacheable: CacheType.None })
          ]
        );
        let inStock = stockData.balance.find(b => b.warehouseId == inStockWarehouseId);
        if (inStock!.reservedQuantity > 0) {
          let dispatchedReservations = normalizeQuantity(inStockData.dispatchedReservationsQuantity);
          inStock!.reservedQuantity -= dispatchedReservations;
          inStock!.totalQuantity -= dispatchedReservations;
        }
        resolve(stockData);
      } catch (err) {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return this.getStock(skuId, inStockWarehouseId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ msg: "error while retrieving stock data (skuId: " + skuId + ") --details: " + stringify(err) });
        }
      }
    })
  }

  public async updateStock(skuId: string, warehouseId: string, payload: UpdateStockReq, retry: number = 0): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.put("/api/logistics/pvt/inventory/skus/" + skuId + "/warehouses/" + warehouseId, payload)
        .then((res: any) => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.updateStock(skuId, warehouseId, payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: "error while updating stock data (skuId: " + skuId + ") --payload: " + stringify(payload) + " --details: " + stringify(err) });
          }
        })
    })
  }

  public async updateProductSpecification(productId: string, productSpecification: ProductSpecification[], retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post("/api/catalog_system/pvt/products/" + productId + "/specification", productSpecification)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.updateProductSpecification(productId, productSpecification, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ msg: "Error while updating the product specification \"" + productSpecification[0]?.Name + "\" for the product " + productId + " (new value: \"" + productSpecification[0]?.Value[0] + "\") --details: " + stringify(err) })
          }
        })
    })
  }

  public async getStockReservations(skuId: string, warehouseId: string, response: StockReservation[] = [], pageSize: number = 100, page: number = 1, retry: number = 0): Promise<StockReservationRes> {
    return new Promise<StockReservationRes>((resolve, reject) => {
      this.http.get("/api/logistics/pvt/inventory/reservations/" + warehouseId + "/" + skuId + "?perPage=" + pageSize + "&page=" + page, { cacheable: CacheType.None })
        .then((res: StockReservations) => {
          response = response.concat(res.items);
          if (res.paging.page >= res.paging.pages) {
            resolve({ skuId: skuId, reservationList: response });
          } else {
            return this.getStockReservations(skuId, warehouseId, response, pageSize, page + 1, retry).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }
          return;
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getStockReservations(skuId, warehouseId, response, pageSize, page, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ msg: "Error while retrieving stock reservations (sku Id: " + skuId + ", warehouseId: " + warehouseId + ") --details: " + stringify(err) })
          }
        })
    })
  }

  public async createStockReservation(payload: UpdateStockReservationReq, retry: number = 0): Promise<UpdateStockReservationRes> {
    return new Promise<UpdateStockReservationRes>((resolve, reject) => {
      this.http.post("/api/logistics/pvt/inventory/reservations", payload)
        .then((res: UpdateStockReservationRes | any) => {
          if (res.IsSucess) {
            resolve(res);
          } else {
            if (retry < maxRetry) {
              return this.createStockReservation(payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            } else {
              reject({ msg: "Error while creating stock reservations --payload: " + stringify(payload) + " --details: " + stringify(res) })
            }
          }
          return;
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.createStockReservation(payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: "Error while creating stock reservations --payload: " + stringify(payload) + " --details: " + stringify(err) })
          }
        })
    })
  }

  public async cancelStockReservation(reservationId: string, retry: number = 0): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post("/api/logistics/pvt/inventory/reservations/" + reservationId + "/cancel")
        .then((res: any) => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.cancelStockReservation(reservationId, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: "Error while cancelling the reservation " + reservationId + " --details: " + stringify(err) });
          }
        })
    })
  }

  public async getSkuByRefId(refId: string, resolveIfNotFound: boolean = false, retry: number = 0): Promise<Sku | SkuNotFound> {
    return new Promise<Sku | SkuNotFound>((resolve, reject) => {
      if (this.memoryCache?.has("sku-" + refId)) {
        resolve(this.memoryCache.get("sku-" + refId));
      } else {
        this.http.get("/api/catalog/pvt/stockkeepingunit?refId=" + refId)
          .then(res => {
            this.memoryCache?.set("sku-" + refId, res);
            resolve(res);
          })
          .catch(async (err) => {
            if (err.response?.status == 404 && resolveIfNotFound) {
              resolve({ RefId: refId, NotFound: true });
            } else {
              if (retry < maxRetry) {
                await wait(maxWaitTime);
                return this.getSkuByRefId(refId, resolveIfNotFound, retry + 1).then((res0: any) => resolve(res0)).catch(err0 => reject(err0));
              } else {
                reject({ msg: "Errore while retrieving sku data (refId: " + refId + ") --details: " + stringify(err) });
              }
            }
          })
      }
    })
  }

}
