import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'
import { Collection, CollectionProducts, SearchCollection } from '../utils/typing';

export default class Collections extends JanusClient {
    // Define API routes
    private routes = {
        getCollection: (collectionId: number) => `/api/catalog/pvt/collection/${collectionId}`,
        createCollection: () => `/api/catalog/pvt/collection/`,
        updateCollection: (collectionId: number) => `/api/catalog/pvt/collection/${collectionId}`,
        searchCollection: (searchTerm: string) => `/api/catalog_system/pvt/collection/search/${searchTerm}`,
        getProducts: (collectionId: number) => `/api/catalog/pvt/collection/${collectionId}/products?page=1&pageSize=500&Active=true&Visible=true`
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

    // GET -> /api/catalog/pvt/collection/${collectionId}
    // Get collection by ID
    public getCollectionById(collectionId: number) {
        return this.http.get<Collection>(this.routes.getCollection(collectionId));
    }

    // GET -> /api/catalog_system/pvt/collection/search/${searchTerm}
    // Search collection by searchTerm
    public searchCollection(searchTerm: string) {
        return this.http.get<SearchCollection>(this.routes.searchCollection(searchTerm));
    }

    // GET -> /api/catalog/pvt/collection/${collectionId}
    // Get collection's products by ID
    public getCollectionProducts(collectionId: number) {
        return this.http.get<CollectionProducts>(this.routes.getProducts(collectionId));
    }

    // POST -> /api/catalog/pvt/collection/
    // Create collection
    public createCollection(data: object) {
        return this.http.post<Collection>(this.routes.createCollection(), data);
    }

    // PUT -> /api/catalog/pvt/collection/${collectionId}
    // Update collection by ID
    public updateCollection(collectionId: number, data: object) {
        return this.http.put<Collection>(this.routes.updateCollection(collectionId), data);
    }
}
