import { CacheLayer, InstanceOptions, IOContext, JanusClient } from "@vtex/api"
import { Product } from "@vtex/api/lib/clients/apps/catalogGraphQL/product";


export default class Products extends JanusClient {
    // Different routes for the requests
    private routes = {
        getProductbyID: (id: number) => `/api/catalog/pvt/product/${id}`,
        updateProduct: (id: number) => `/api/catalog/pvt/product/${id}`

    }

    cache?: CacheLayer<string, any>
    
    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json',
                VtexIdclientAutCookie: context.authToken
            }
        });
        this.cache = options && options?.memoryCache
    }

    // GET -> /api/catalog/pvt/product/:id
    // Get product by ID
    public getProductbyID(id: number) {
        return this.http.get<Product>(this.routes.getProductbyID(id));
    }

    // PUT -> /api/catalog/pvt/product/:id
    // Update existing product
    public updateProduct(id: number, data: object) {
        return this.http.put(this.routes.updateProduct(id), data);
    }

}
