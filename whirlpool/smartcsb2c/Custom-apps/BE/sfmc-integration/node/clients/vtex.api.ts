import { InstanceOptions, IOContext, IOResponse, JanusClient } from "@vtex/api";

export default class VtexApiConfig extends JanusClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        if (options === undefined)
            options = {};

        options.headers = {
            'X-VTEX-Use-Https': JSON.parse(`${process.env.TEST}`).XVTEXUseHttps,
            'X-VTEX-API-AppKey': JSON.parse(`${process.env.TEST}`).XVTEXAPIAppKey,
            'X-VTEX-API-AppToken': JSON.parse(`${process.env.TEST}`).XVTEXAPIAppToken
        }
        super(context, options)
    }

    public async getOrder(orderId: string): Promise<IOResponse<string>> {
        return this.http.getRaw(`/api/oms/pvt/orders/${orderId}`);
    }

    public async getEmail(userId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/dataentities/CL/search?_fields=email&_where=userId=' + userId);
    }

    public getProductSkuAlternative(skuId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuId);
    }

    public getImagesMain(skuId: string): Promise<IOResponse<string>> {
        return this.http.getRaw(`/api/catalog/pvt/stockkeepingunit/${skuId}/file`);
    }

    // Get language
    /*public async getLanguage(orderFormId: string) {
        const data = await this.http.get(`/api/checkout/pub/orderForm/${orderFormId}`);
        const language: string = data.clientPreferencesData.locale.split('-')[0];
        return language;
    }*/
    public async getLanguage(userId: string) {
        console.log("UserId: " + userId)
        const data = await this.http.get(`/api/dataentities/CL/search?_fields=localeDefault&_where=userId=` + userId);
        const language: string = (data[0].localeDefault !== null && data[0].localeDefault !== 'null') ? data[0].localeDefault.split('-')[0] : 'de';
        return language;
    }
}
