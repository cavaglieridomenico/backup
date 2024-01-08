import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'
import { ProductSearch } from '../utils/typing'

export default class SearchClient extends JanusClient {
    // Define API routes
    private routes = {
        productSearch: (search: string) => `/api/catalog_system/pub/products/search/${search}`,
        productSearchFiltered: (ids: string, salesChannel: number) => `/api/catalog_system/pub/products/search?fq=C:/${ids}/&_from=0&_to=49&sc=${salesChannel}`,
        productSearchFilteredByProductId: (productId: string) => `/api/catalog_system/pub/products/search?fq=productId:${productId}`,
        productSearchFilteredBySpecification: (specificationId: number, specificationValue: string, salesChannel: number) => `/api/catalog_system/pub/products/search?fq=specificationFilter_${specificationId}:${specificationValue}&sc=${salesChannel}`,
        productSearchFilteredByCollection: (productClusterId: number, from: number, to: number) => `/api/catalog_system/pub/products/search?fq=productClusterIds:${productClusterId}&_from=${from}&_to=${to}`,
        productsSearchFilteredBySpecification: (specificationId: number, specificationValues: Array<string>, from: number, to: number, salesChannel: number) => `/api/catalog_system/pub/products/search?${specificationValues.map(specificationValue => `fq=specificationFilter_${specificationId}:${specificationValue}`).join('&')}&_from=${from}&_to=${to}&sc=${salesChannel}`,
        productsSearchFilteredByReference: (refIds: Array<string>, from: number, to: number, salesChannel: number) => `/api/catalog_system/pub/products/search?${refIds.map(id => `fq=alternateIds_RefId:${id}`).join('&')}&_from=${from}&_to=${to}&sc=${salesChannel}`
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

    // GET -> /api/catalog_system/pub/products/search/${search}
    // Filter products by search
    public async searchProduct(search: string) {
        return this.http.getRaw(this.routes.productSearch(search));
    }

    // GET -> /api/catalog_system/pub/products/search?fq=C:/{id1}/{id2}/{id3}/...
    // Filter products by category tree IDs
    public async searchFilteredProducts(ids: string, salesChannel: number) {
        return this.http.getRaw(this.routes.productSearchFiltered(ids, salesChannel));
    }

    // GET -> /api/catalog_system/pub/products/search?fq=productId:${productId}
    // Filter products by ID
    public searchProductById(productId: string) {
        return this.http.get<ProductSearch[]>(this.routes.productSearchFilteredByProductId(productId));
    }

    // GET -> /api/catalog_system/pub/products/search?fq=specificationFilter_${specificationId}:${specificationValue}
    // Filter products by Specification
    public searchProductBySpecification(specificationId: number, specificationValue: string, salesChannel: number) {
        return this.http.get<ProductSearch[]>(this.routes.productSearchFilteredBySpecification(specificationId, specificationValue, salesChannel));
    }

    // GET -> /api/catalog_system/pub/products/search?fq=productClusterIds:${productClusterId}
    // Filter products by collection
    public searchProductByCollection(productClusterId: number, from: number, to: number) {
        return this.http.getRaw<ProductSearch[]>(this.routes.productSearchFilteredByCollection(productClusterId, from, to));
    }

    // GET -> /api/catalog_system/pub/products/search?[fq=specificationFilter_${specificationId}:${specificationValue}]&_from=${from}&_to=${to}&sc=${salesChannel}
    // Filter products by collection
    public searchProductsBySpecification(specificationId: number, specificationValues: Array<string>, from: number, to: number, salesChannel: number) {
        return this.http.getRaw<ProductSearch[]>(this.routes.productsSearchFilteredBySpecification(specificationId, specificationValues, from, to, salesChannel));
    }

    // GET -> /api/catalog_system/pub/products/search?fq=productClusterIds:${productClusterId}
    // Filter products by collection
    public searchProductsByReference(refIds: Array<string>, from: number, to: number, salesChannel: number) {
        return this.http.getRaw<ProductSearch[]>(this.routes.productsSearchFilteredByReference(refIds, from, to, salesChannel));
    }
}
