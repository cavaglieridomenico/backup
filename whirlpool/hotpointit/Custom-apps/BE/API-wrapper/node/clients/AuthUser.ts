import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class AuthUser extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("https://vtexid.vtex.com.br", context, {
      ...options,
      headers: {
        ...(options && options.headers),
        'Proxy-Authorization': context.authToken
      }
    })
  }

  public async GetLoggedUser(idtoken?: string): Promise<any> {
    return this.http.get('/api/vtexid/pub/authenticated/user?authToken=' + idtoken)
  }

}
