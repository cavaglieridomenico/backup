import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class TradePolicy extends JanusClient {
    // Define API routes
    private routes = {
        getTradePolicyProductId: (productId: number) => `/api/catalog/pvt/product/${productId}/salespolicy`
    }

    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json',
                VtexIdclientAutCookie: context.authToken
            },
        })
    }

    // GET -> /api/catalog/pvt/product/${productId}/salespolicy
    // Get trade policy by product ID
    public getTradePolicyProductId(productId: number) {
        return this.http.get(this.routes.getTradePolicyProductId(productId));
    }
}
