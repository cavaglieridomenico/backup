import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Attachment extends JanusClient {
    // Define API routes
    private routes = {
        retrive: (acronym: string, documentId: string, field: string, fileName: string) => `/api/dataentities/${acronym}/documents/${documentId}/${field}/attachments/${fileName}`,
        save: (acronym: string, documentId: string, field: string) => `/api/dataentities/${acronym}/documents/${documentId}/${field}/attachments`
    }

    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                ContentType: 'multipart/form-data',
                VtexIdclientAutCookie: context.authToken,
            }
        })
    }

    // GET -> /api/dataentities/{acronym}/documents/{documentId}/{field}/attachments/{fileName}
    // Retrieve attachment document
    public retrieveAttachment(acronym: string, documentId: string, field: string, fileName: string) {
        return this.http.get(this.routes.retrive(acronym, documentId, field, fileName));
    }

    // POST -> /api/dataentities/acronym/documents
    // Save attachment
    public saveAttachment(acronym: string, documentId: string, field: string, data: any, contentType: string) {
        // Configure header
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data;' + contentType
            }
        }
        return this.http.post(this.routes.save(acronym, documentId, field), data, config);
    }
}
