import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'
import { CategoryTreeResponse } from "@vtex/clients/build"

export default class Category extends JanusClient {
    // Define API routes
    private routes = {
        getCategoryById: (categoryId: string) => `/api/catalog/pvt/category/${categoryId}`,
        createCategory: () => `/api/catalog/pvt/category`,
        updateCategory: (categoryId: string) => `/api/catalog/pvt/category/${categoryId}`,
        getCategoryTree: (categoryLevels: string) => `/api/catalog_system/pub/category/tree/${categoryLevels}`
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

    // GET -> /api/catalog_system/pvt/category/:categoryId
    // Get category by ID
    public getCategoryById(categoryId: string) {
        return this.http.get(this.routes.getCategoryById(categoryId));
    }

    // POST -> /api/catalog/pvt/category
    // Create category
    public createCategory(data: object) {
        return this.http.post(this.routes.createCategory(), data);
    }

    // PUT -> /api/catalog/pvt/category/:categoryId
    // Update category
    public updateCategory(categoryId: string, data: object) {
        return this.http.put(this.routes.updateCategory(categoryId), data);
    }

    // GET -> /api/catalog_system/pub/category/tree/:categoryLevels
    // Get category tree
    public getCategoryTree(categoryLevels: string) {
        return this.http.get<CategoryTreeResponse[]>(this.routes.getCategoryTree(categoryLevels));
    }
}
