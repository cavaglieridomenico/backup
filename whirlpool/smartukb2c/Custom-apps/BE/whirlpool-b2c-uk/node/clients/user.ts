import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class User extends JanusClient {

    // Define masterdata's data entity name
    private dataEntityName: string = 'CL';

    // Define API routes
    private routes = {
        registerUser: (dataEntityName: string) => `/api/dataentities/${dataEntityName}/documents`,
        getUserDocumentIdByEmail: (dataEntityName: string, email: string) => `/api/dataentities/${dataEntityName}/search?_fields=id&_where=email=${email}`
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

    // POST -> /api/dataentities/acronym/documents
    // Register user
    public registerUser(data: object) {
        return this.http.post<Document>(this.routes.registerUser(this.dataEntityName), data);
    }

    // GET -> /api/dataentities/acronym/search?_fields=id&_where=email=email
    // Get user document id by email
    public getUserDocumentIdByEmail(email: string) {
        return this.http.getRaw(this.routes.getUserDocumentIdByEmail(this.dataEntityName, email));
    }
}
