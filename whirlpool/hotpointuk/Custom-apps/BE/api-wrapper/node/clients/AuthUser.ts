import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class AuthUser extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("https://vtexid.vtex.com.br", context, {
      ...options,
      headers: {
        ...(options && options.headers),
        'Proxy-Authorization': context.authToken
        //VtexIdclientAutCookie: context.storeUserAuthToken?context.storeUserAuthToken:""
      }
    })
  }

  public async GetLoggedUser(idtoken: string | undefined): Promise<any> {
    return idtoken ? this.http.get('/api/vtexid/pub/authenticated/user?authToken=' + idtoken) : undefined
  }

}
