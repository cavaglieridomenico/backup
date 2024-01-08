import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'

export default class Specification extends JanusClient {

    // Define API routes
    private routes = {
        specification: () => `/api/catalog/pvt/specification`,
        specificationField: () => `/api/catalog_system/pvt/specification/field`,
        specificationFieldValue: () => `/api/catalog_system/pvt/specification/fieldValue`,
        specificationValue: () => `/api/catalog/pvt/specificationvalue`,
        specificationGroup: () => `/api/catalog_system/pvt/specification/group`,
        updateSpecificationGroup: (groupId: string) => `/api/catalog/pvt/specificationgroup/${groupId}`
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

    // SPECIFICATION
    // POST -> /api/catalog/pvt/specification
    // Create specification
    public createSpecification(data: object) {
        return this.http.post(this.routes.specification(), data);
    }

    // SPECIFICATION FIELD
    // POST -> /api/catalog_system/pvt/specification/field
    // Create specification field
    public createSpecificationField(data: object) {
        return this.http.post(this.routes.specificationField(), data);
    }

    // SPECIFICATION FIELD VALUE
    // POST -> /api/catalog_system/pvt/specification/fieldValue
    // Create specification field value
    public createSpecificationFieldValue(data: object) {
        return this.http.post(this.routes.specificationFieldValue(), data);
    }

    // SPECIFICATION VALUE
    // POST -> /api/catalog/pvt/specificationvalue
    // Create specification value
    public createSpecificationValue(data: object) {
        return this.http.post(this.routes.specificationValue(), data);
    }

    // SPECIFICATION GROUP
    // POST -> /api/catalog_system/pvt/specification/group
    // Create specification group
    public createSpecificationGroup(data: object) {
        return this.http.post(this.routes.specificationGroup(), data);
    }

    // PUT -> /api/catalog_system/pvt/specification/group
    // Update specification group
    public updateSpecificationGroup(groupId: string, data: object) {
        return this.http.put(this.routes.updateSpecificationGroup(groupId), data);
    }
}
