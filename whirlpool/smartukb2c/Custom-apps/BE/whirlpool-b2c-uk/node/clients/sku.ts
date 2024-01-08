import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { SKU } from '@vtex/clients'


export default class Sku extends JanusClient {
    // Define API routes
    private routes = {
        // SKU API (https://developers.vtex.com/vtex-developer-docs/reference/catalog-api-sku) //
        getSkuIds: (page: number, page_size: number) => `/api/catalog_system/pvt/sku/stockkeepingunitids?page=${page}&pagesize=${page_size}`,
        getSku: (skuId: number) => `/api/catalog/pvt/stockkeepingunit/${skuId}`,
        getSkuByRefId: (refId: string) => `/api/catalog/pvt/stockkeepingunit?refId=${refId}`,
        getByProductId: (productId: number) => `/api/catalog_system/pvt/sku/stockkeepingunitByProductId/${productId}`,
        postSku: () => `/api/catalog/pvt/stockkeepingunit`,
        putSku: (skuId: number) => `/api/catalog/pvt/stockkeepingunit/${skuId}`,
        // SKU FILE API (https://developers.vtex.com/vtex-developer-docs/reference/catalog-api-sku-file) //
        getSkuFile: (skuId: number) => `/api/catalog/pvt/stockkeepingunit/${skuId}/file`,
        postSkuFile: (skuId: number) => `/api/catalog/pvt/stockkeepingunit/${skuId}/file`,
        putSkuFile: (skuId: number, skuFileId: number) => `/api/catalog/pvt/stockkeepingunit/${skuId}/file/${skuFileId}`,
        // SKU complement API
        getSkuComplementById: (skuId: number) => `/api/catalog/pvt/stockkeepingunit/${skuId}/complement`,
        createSkuComplement: () => `/api/catalog/pvt/skucomplement`
    }

    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json',
                VtexIdclientAutCookie: context.authToken
            }
        });
    }

    // SKU API //

    // GET -> /api/catalog_system/pvt/sku/stockkeepingunitids?page={page}&pagesize={page_size}
    // Get SKU ids
    public getSkuIds(page: number, page_size: number) {
        return this.http.get<number[]>(this.routes.getSkuIds(page, page_size));
    }

    // GET -> /api/catalog/pvt/stockkeepingunit/:skuId
    // Get SKU by id
    public getSku(skuId: number) {
        return this.http.get<SKU>(this.routes.getSku(skuId));
    }

    public async getSkuByRefId(refId: string) {
        return await this.http.get<SKU>(this.routes.getSkuByRefId(refId));
    }

    // GET -> /api/catalog_system/pvt/sku/stockkeepingunitByProductId/:productId
    // Get all the SKUs of a product using its ID
    public getSkusByProductId(productId: number) {
        return this.http.get<SKU[]>(this.routes.getByProductId(productId));
    }

    // POST -> /api/catalog/pvt/stockkeepingunit
    // Create SKU
    public createSku(data: SKU) {
        return this.http.post<SKU>(this.routes.postSku(), data);
    }

    // PUT -> /api/catalog/pvt/stockkeepingunit/:skuId
    // Update SKU
    public updateSku(skuId: number, data: object) {
        return this.http.put<SKU>(this.routes.putSku(skuId), data);
    }



    // SKU FILE API //

    // GET -> /api/catalog/pvt/stockkeepingunit/:skuId/file
    // Create SKU file
    public getSkuFile(skuId: number) {
        return this.http.get<SKU>(this.routes.getSkuFile(skuId));
    }

    // POST -> /api/catalog/pvt/stockkeepingunit/:skuId/file
    // Create SKU file
    public createSkuFile(skuId: number, data: object) {
        return this.http.post<SKU>(this.routes.postSkuFile(skuId), data);
    }

    // PUT -> /api/catalog/pvt/stockkeepingunit/:skuId/file/:skuFileId
    // Update SKU file
    public updateSkuFile(skuId: number, skuFileId: number, data: object) {
        return this.http.put<SKU>(this.routes.putSkuFile(skuId, skuFileId), data);
    }



    // SKU COMPLEMENT API //

    // GET -> /api/catalog/pvt/stockkeepingunit/:skuId/complement
    // Get SKU complement by SKU ID
    public getSkuComplementById(skuId: number) {
        return this.http.get(this.routes.getSkuComplementById(skuId));
    }

    // POST -> /api/catalog/pvt/skucomplement
    // Create SKU complement
    public createSkuComplement(data: object) {
        return this.http.post(this.routes.createSkuComplement(), data);
    }
}
