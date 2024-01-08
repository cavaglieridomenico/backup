import {InstanceOptions, IOContext, IOResponse, JanusClient} from "@vtex/api";


export default class VtexApiConfig extends JanusClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        if (options == undefined)
            options = {};
        options.headers = {
            'X-VTEX-Use-Https': 'true',
            "X-VTEX-API-AppKey": "vtexappkey-itwhirlpoolqa-SETTVR",
            "X-VTEX-API-AppToken": "IZQLNOEVVJGXTAQPMNBMQWOGJYLYVWHEEHMCHEBQAJYMMTBSCPLWNBILLJBPCFAYCBSLOOIHMKMGYBUPWTWGLKQDZARXCMNUJZJKAPENGDKCOBMJPLSJITNRKPMNXLFZ"
        }
        super(context, options)
    }

    public async getOrder(orderId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/oms/pvt/orders/' + orderId);
    }

    public async getEmail(userId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/dataentities/CL/search?_fields=email&_where=userId=' + userId);
    }

    public getProductSkuAlternative(skuId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + skuId);
    }

    public getProductSku(productId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/catalog_system/pvt/sku/stockkeepingunitByProductId/' + productId);
    }

    public getCategory(categoryId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/catalog/pvt/category/' + categoryId);
    }

    public getProductSingle(productId: string): Promise<IOResponse<string>> {
        return this.http.getRaw('/api/catalog/pvt/product/' + productId);
    }

    public getPrice(skuId: string, ctx: Context): Promise<IOResponse<string>> {
        return this.http.getRaw(`/${ctx.vtex.account}/pricing/prices/${skuId}/fixed/1`);
    }

    public getInventory(skuId: string, warehousesId: string): Promise<IOResponse<string>> {
        return this.http.getRaw(`/api/logistics/pvt/inventory/items/${skuId}/warehouses/${warehousesId}/dispatched`);
    }
    public getProductTradePolicy(productId: string): Promise<IOResponse<string>> {
        return this.http.getRaw(`/api/catalog/pvt/product/${productId}/salespolicy`);
    }
    public getImagesMain(skuId: string): Promise<IOResponse<string>> {
        return this.http.getRaw(`/api/catalog/pvt/stockkeepingunit/${skuId}/file`);
    }
}
