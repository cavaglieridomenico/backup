//@ts-ignore
//@ts-nocheck

import { CacheLayer, InstanceOptions, IOContext, IOResponse, JanusClient, LRUCache } from "@vtex/api";
import { resolve } from "dns";
import { reject } from "ramda";

export default class VtexApiConfig extends JanusClient {
    memoryCache?: CacheLayer<string, any>
    constructor(context: IOContext, options?: InstanceOptions) {
        if (options == undefined)
            options = {};

        options.headers = {
            'X-VTEX-Use-Https': JSON.parse(process.env.TEST + "").XVTEXUseHttps,
            "X-VTEX-API-AppKey": JSON.parse(process.env.TEST + "").XVTEXAPIAppKey,
            "X-VTEX-API-AppToken": JSON.parse(process.env.TEST + "").XVTEXAPIAppToken
        }
        super(context, options)

        this.memoryCache = options && options?.memoryCache
    }

    public async getOrder(orderId: string): Promise<IOResponse<string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http.getRaw('/api/oms/pvt/orders/' + orderId)
                response = response.data
                while (response.shippingData.logisticsInfo[0].deliveryWindow == undefined &&
                    (response.shippingData.logisticsInfo[0].shippingEstimateDate == undefined || response.shippingData.logisticsInfo[0].shippingEstimateDate.indexOf("1970-01-01") >= 0) &&
                    response.shippingData.logisticsInfo[0].shippingEstimate == undefined) {
                    response = await this.http.getRaw('/api/oms/pvt/orders/' + orderId)
                    response = response.data
                }
                resolve(response)
            } catch (err) {
                if (doRetry(err)) { this.getOrder(orderId) }
            }
        })
    }

    public async getEmail(userId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw('/api/dataentities/CL/search?_fields=email&_where=userId=' + userId))
            } catch (err) {
                if (doRetry(err)) { this.getEmail(userId) }
            }
        })
    }

    public async getProductSkuAlternative(skuId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuId))
            } catch (err) {
                if (doRetry(err)) { this.getProductSkuAlternative(skuId) }
            }
        })
    }

    public async getProductSku(productId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw('/api/catalog_system/pvt/sku/stockkeepingunitByProductId/' + productId))
            } catch (err) {
                if (doRetry(err)) { this.getProductSku(productId) }
            }
        })
    }

    public async getCategory(categoryId: string): Promise<IOResponse<string>> {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.memoryCache?.has(categoryId)) {
                    resolve(this.memoryCache.get(categoryId))
                } else {
                    let result = await this.http.getRaw('/api/catalog/pvt/category/' + categoryId)
                    this.memoryCache?.set(categoryId, result)
                    resolve(result)
                }
            } catch (err) {
                if (doRetry(err)) { setTimeout(this.getCategory(categoryId), 100) }
            }
        })
    }

    public async getProductSingle(productId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw('/api/catalog/pvt/product/' + productId))
            } catch (err) {
                if (doRetry(err)) { this.getProductSingle(productId) }
            }
        })
    }

    public async getPrice(skuId: string, ctx: Context): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw(`/${ctx.vtex.account}/pricing/prices/${skuId}/fixed/1`))
            } catch (err) {
                if (doRetry(err)) this.getPrice(skuId, ctx)
            }
        })
    }

    public async getWarehouses(): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw(`/api/logistics/pvt/configuration/warehouses`))
            } catch (err) {
                if (doRetry(err)) { this.getWarehouses() }
            }
        })
    }

    public async getInventory(skuId: string, warehousesId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw(`/api/logistics/pvt/inventory/items/${skuId}/warehouses/${warehousesId}/dispatched`))
            } catch (err) {
                if (doRetry(err)) { this.getInventory(skuId, warehousesId) }
            }
        })
    }

    public async getInventoryBySellerName(skuId: string, sellerName: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId)
                    .then(res => {
                        resolve(sellerName ?
                            res.data[0]?.items[0]?.sellers.find((seller: any) => seller.sellerId == sellerName)?.commertialOffer?.AvailableQuantity :
                            res.data[0]?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity);
                    });
            } catch (err) {
                if (doRetry(err)) { this.getInventoryBySellerName(skuId, sellerName) }
            }
        })
    }

    public async getInventoryBySellerName(skuId: string, sellerName: string): Promise<IOResponse<string>> {
        return new Promise((resolve , reject) => {
            try{
                this.http.getRaw("/api/catalog_system/pub/products/search?fq=skuId:" + skuId)
                    .then(res => {
                        resolve (
                                    sellerName ?
                                    (
                                        res.data[0]?.items[0]?.sellers.find((seller: any) => seller.sellerId == sellerName) ?
                                        res.data[0]?.items[0]?.sellers.find((seller: any) => seller.sellerId == sellerName).commertialOffer?.AvailableQuantity :
                                        res.data[0]?.items[0]?.sellers.find((seller: any) => seller.sellerId == "1").commertialOffer?.AvailableQuantity
                                    ) :
                                    res.data[0]?.items[0]?.sellers.find((seller: any) => seller.sellerId == "1").commertialOffer?.AvailableQuantity
                                );
                    });
            }catch(err){
                if( doRetry(err) ){ this.getInventoryBySellerName(skuId, sellerName) }
            }
        })
    }

    public async getProductTradePolicy(productId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw(`/api/catalog/pvt/product/${productId}/salespolicy`))
            } catch (err) {
                if (doRetry(err)) { this.getProductTradePolicy(productId) }
            }
        })
    }
    public async getImagesMain(skuId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw(`/api/catalog/pvt/stockkeepingunit/${skuId}/file`))
            } catch (err) {
                if (doRetry(err)) { this.getImagesMain(skuId) }
            }
        })
    }

    public async getMarketPrice(productId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw("/api/catalog_system/pub/products/search?fq=productId:" + productId))
            } catch (err) {
                if (doRetry(err)) { this.getMarketPrice(productId) }
            }
        })
    }

    public async createmulipleCoupon(quantity: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                resolve(
                    this.http.post(`/api/rnb/pvt/coupons?quantity=` + quantity,
                        {
                            "utmSource": "PremiumCoupon",
                            "utmCampaign": null,
                            "couponCode": "PR",
                            "isArchived": false,
                            "maxItemsPerClient": 1,
                            "expirationIntervalPerUse": null
                        }
                    )
                )
            } catch (err) {
                if (doRetry(err)) { this.createmulipleCoupon(quantity) }
            }
        })
    }

    public async getSpecification(productId: string): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw(`/api/catalog_system/pvt/products/${productId}/specification`))
            } catch (err) {
                if (doRetry(err)) { this.getSpecification(productId) }
            }
        })
    }

    public async getComplementsBySkuAndType(skuId: string, type: number): Promise<IOResponse<string>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.http.getRaw(`/api/catalog_system/pvt/sku/complements/${skuId}/${type}`))
            } catch (err) {
                if (doRetry(err)) { this.getComplementsBySkuAndType(skuId, type) }
            }
        })
    }

    public getAllPromo(): Promise<IOResponse<any>> {
        return this.http.getRaw("/api/rnb/pvt/benefits/calculatorconfiguration");
    }

    public getPromoById(id: String): Promise<IOResponse<any>> {
        return this.http.getRaw("/api/rnb/pvt/calculatorconfiguration/" + id);
    }

    /**
     * @param authToken authentication cookie
     * @returns 
     * Used by Recommendated product 
     */
    public async getAuthenticatedUser(authToken: string): Promise<IOResponse<any>> {
        return this.http.getRaw("/api/vtexid/pub/authenticated/user?authToken=" + authToken);
    }


    /**
     * @param refId 
     * @returns 
     * Used by Recommendated product 
     */
    public getSkuByRefId(refId: string): Promise<IOResponse<any>> {
        return this.http.getRaw("/api/catalog/pvt/stockkeepingunit?refId=" + refId);
    }
}

function doRetry(err: any): boolean {
    return (
        ((err.status != undefined && err.status == 429) || (err.response != undefined && err.response.status == 429)) ||
        (err.status == undefined && (err.response == undefined || err.response.status == undefined)) || (err.code === 'ETIMEDOUT') ||
        (err.code === 'ECONNRESET') || (err.code === 'ECONNABORTED') ||
        ((err.status != undefined && err.status >= 500) || (err.response != undefined && err.response.status >= 500))
    )
}
