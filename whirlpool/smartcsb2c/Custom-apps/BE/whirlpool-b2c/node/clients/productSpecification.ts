import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { ProductSpecification } from '@vtex/clients'


export default class ProductSpecificationClass extends JanusClient {
    // Define API routes
    private routes = {
        get: (productId: number) => `/api/catalog_system/pvt/products/${productId}/specification`,
        update: (productId: number) => `/api/catalog_system/pvt/products/${productId}/specification`,
        create: (productId: number) => `/api/catalog/pvt/product/${productId}/specification`,
        deleteAll: (productId: number) => `/api/catalog/pvt/product/${productId}/specification`,
        delete: (productId: number, specificationId: number) => `/api/catalog/pvt/product/${productId}/specification/${specificationId}`
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

    // GET -> /api/catalog_system/pvt/products/productId/specification
    // Get product specification
    public getProductSpecification(productId: number) {
        return this.http.get<ProductSpecification[]>(this.routes.get(productId));
    }

    // POST -> /api/catalog_system/pvt/products/productId/specification
    // Update product specification
    public updateProductSpecification(productId: number, data: object) {
        return this.http.post<ProductSpecification[]>(this.routes.update(productId), data);
    }

    // POST -> /api/catalog_system/pvt/products/productId/specification
    // Create product specification
    public createProductSpecification(productId: number, data: object) {
        return this.http.post<ProductSpecification[]>(this.routes.create(productId), data);
    }

    // DELETE -> /api/catalog_system/pvt/products/productId/specification
    // Delete all product specifications
    public deleteAllProductSpecifications(productId: number) {
        return this.http.delete(this.routes.deleteAll(productId));
    }

    // DELETE -> /api/catalog/pvt/product/productId/specification/specificationId
    // Delete product specification by ID
    public deleteProductSpecification(productId: number, specificationId: number) {
        return this.http.delete(this.routes.delete(productId, specificationId));
    }
}
