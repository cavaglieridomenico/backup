import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import FormData from 'form-data'

export default class VtexAPI extends JanusClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                ...options?.headers,
                ...(context.authToken
                    ? { VtexIdclientAutCookie: context.authToken }
                    : null),
                'x-vtex-user-agent': context.userAgent,
            }
        })

    }

    public async GetLoggedUser(token: string): Promise<any> {
        return this.http.get("/api/vtexid/pub/authenticated/user?authToken=" + token);
    }

    public async UploadFile(id: string, field: string, body: any, extension: string): Promise<any> {
        let form = new FormData()
        form.append("", body, `OrderReportPL_${id}.${extension}`)
        return this.http.post(`/api/dataentities/OR/documents/${id}/${field}/attachments`, form, {
            headers: form.getHeaders()
        })
    }
}   