import {  CacheLayer, InstanceOptions, IOContext, JanusClient } from "@vtex/api"
import FormData from "form-data"


export default class VtexAPI extends JanusClient {

  cache?: CacheLayer<string, any>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.authToken
      }
    })

    this.cache = options && options?.memoryCache
  }


  public async UploadFile(idEntity: string, area: string, body: any, extension: string): Promise<any> {
    const form = new FormData()
    form.append("", body, `${idEntity}_feed_${area}.${extension}`)
    return this.http.post(`/api/dataentities/AT/documents/${idEntity}/file/attachments`, form, {
      headers: form.getHeaders(),
    })
  }


}
