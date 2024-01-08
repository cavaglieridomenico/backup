//@ts-nocheck

import { keyToken } from "../utils/constants";
import { IOResponse , InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export default class VtexApi extends JanusClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        options?.headers = {
            "X-VTEX-Use-Https": true,
            "X-VTEX-API-AppKey": keyToken[context.account].key,
            "X-VTEX-API-AppToken": keyToken[context.account].token
        }
        super(context, options)
    }

    public async getSkuIds() : Promise<IOResponse<any>>{
        return this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitids?page=1&pagesize=1000");
    }

    public async getProductId(skuId: any) : Promise<IOResponse<any>>{
        return this.http.getRaw("/api/catalog_system/pvt/sku/stockkeepingunitbyid/" + skuId)
    }

    public async updateSpecification(additionalServicesSpecification : [{Value:string[], Name:string}], productId: any): Promise<void>{
        this.http.postRaw("/api/catalog_system/pvt/products/" + productId + "/specification", additionalServicesSpecification)
    }
}