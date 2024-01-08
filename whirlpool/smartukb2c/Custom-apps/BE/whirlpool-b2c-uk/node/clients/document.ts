import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Document extends JanusClient {
    // Define API routes
    private routes = {
        getDocumentById: (acronym: string, documentId: string) => `/api/dataentities/${acronym}/documents/${documentId}?_fields=_all`,
        createDocument: (acronym: string) => `/api/dataentities/${acronym}/documents`,
        searchDocuments: (acronym: string, fields: string) => `/api/dataentities/${acronym}/search?_fields=${fields}`,
        getAllSchemas: (acronym: string) => `/api/dataentities/${acronym}/schemas`,
        createSchema: (acronym: string, schemaName: string) => `/api/dataentities/${acronym}/schemas/${schemaName}`,
        createVTableApp: (appName: string, schemaName: string) => `/api/dataentities/vtable/documents/${appName}?_schema=${schemaName}`,
        scroll: (dataEntityName: string, query: string) => `/api/dataentities/${dataEntityName}/scroll${query}`,
        search: (dataEntityName: string, query: string) => `/api/dataentities/${dataEntityName}/search${query}`
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

    // GET -> /api/dataentities/acronym/documents/id
    // Get document
    public getDocument(acronym: string, documentId: string) {
        return this.http.get<Document>(this.routes.getDocumentById(acronym, documentId));
    }

    // POST -> /api/dataentities/acronym/documents
    // Create document
    public createDocument(acronym: string, data: object) {
        return this.http.post<Document>(this.routes.createDocument(acronym), data);
    }

    // GET -> /api/dataentities/acronym/search
    // Get all documents
    public getAllDocuments(acronym: string, fields: string) {
        return this.http.get<Document>(this.routes.searchDocuments(acronym, fields));
    }

    // GET -> /api/dataentities/acronym/schemas
    // Get all schemas
    public getAllSchemas(acronym: string) {
        return this.http.get<Document>(this.routes.getAllSchemas(acronym));
    }

    // PUT -> /api/dataentities/acronym/schemas/schemaName
    // Create schema
    public createSchema(acronym: string, schemaName: string, data: object) {
        return this.http.put<Document>(this.routes.createSchema(acronym, schemaName), data);
    }

    // POST -> /api/dataentities/vtable/documents/:appName
    // Create VTable app
    public createVTableApp(appName: string, schemaName: string, data: object) {
        return this.http.put(this.routes.createVTableApp(appName, schemaName), data);
    }

    // GET -> /api/dataentities/${dataEntityName}/scroll${query}
    // Scroll documents
    public scrollDocuments(dataEntityName: string, query: string) {
        return this.http.getRaw(this.routes.scroll(dataEntityName, query));
    }

    // GET -> /api/dataentities/${dataEntityName}/search${query}
    // Search documents
    public async searchDocuments(dataEntityName: string, query: string, from: number, to: number) {
        const config = {
            headers: {
                'REST-Range': `resources=${from}-${to}`
            }
        }
        return this.http.getRaw(this.routes.search(dataEntityName, query), config);
    }
}
