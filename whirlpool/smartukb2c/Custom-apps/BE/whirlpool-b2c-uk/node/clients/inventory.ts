import { InstanceOptions, IOContext, JanusClient } from "@vtex/api"

export default class Inventory extends JanusClient {
    // Define API routes
    private routes = {
        updateInventory: (skuId: string, warehouseId: string) => `/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`
    }

    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json',
                "X-VTEX-API-APPKEY": JSON.parse(`${process.env.SETTINGS}`).X_VTEX_API_APPKEY,
                "X-VTEX-API-APPTOKEN": JSON.parse(`${process.env.SETTINGS}`).X_VTEX_API_APPTOKEN
            },
        })
    }

    // PUT -> /api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}
    // Update inventory by sku and warehouse
    public updateInventory(skuId: string, warehouseId: string, data: object) {
        return this.http.put<Inventory>(this.routes.updateInventory(skuId, warehouseId), data)
    }
}
