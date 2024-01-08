import { InstanceOptions, IOContext, JanusClient } from "@vtex/api"
import { Product } from "@vtex/clients"


interface ProductSkus {
    data: object;
    range: object;
}


export default class Products extends JanusClient {
    // Different routes for the requests
    private routes = {
        getProductAndSkuIds: (categoryId: number, _from: number, _to: number) => `/api/catalog_system/pvt/products/GetProductAndSkuIds?categoryId=${categoryId}&_from=${_from}&_to=${_to}`,
        getProductbyID: (id: number) => `/api/catalog/pvt/product/${id}`,
        createProduct: () => `/api/catalog/pvt/product`,
        updateProduct: (id: number) => `/api/catalog/pvt/product/${id}`
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


    // GET -> /api/catalog_system/pvt/products/GetProductAndSkuIds?categoryId=${categoryId}&_from=${_from}&_to=${_to}
    // Get products and SKU IDs by category ID
    public getProductandSkuIds(categoryId: number, _from: number, _to: number) {
        return this.http.get<ProductSkus>(this.routes.getProductAndSkuIds(categoryId, _from, _to));
    }

    // GET -> /api/catalog/pvt/product/:id
    // Get product by ID
    public getProductbyID(id: number) {
        return this.http.get<Product>(this.routes.getProductbyID(id));
    }

    // POST -> /api/catalog/pvt/product
    // Create new product
    public createProduct(data: object) {
        return this.http.post<Product>(this.routes.createProduct(), data);
    }

    // PUT -> /api/catalog/pvt/product/:id
    // Update existing product
    public updateProduct(id: number, data: object) {
        return this.http.put(this.routes.updateProduct(id), data);
    }
}
