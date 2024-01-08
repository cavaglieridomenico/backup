import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class Social extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("", context, options)
  }

  public async GetAccessToken(endpoint: string, method: "GET" | "POST", clientID: string, clientSecret: string, redirectUri: string, authCode: string): Promise<any> {
    switch (method) {
      case 'GET':
        return this.http.get(`${endpoint}?client_id=${clientID}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${authCode}&grant_type=authorization_code`)
      case 'POST':
        return this.http.post(endpoint, {
          code: authCode,
          client_id: clientID,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
    }
  }

  public async GetUserInfo(endpoint: string, accessToken: string, authType: "Header" | "Query"): Promise<any> {
    switch (authType) {
      case "Header":
        return this.http.get(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      case "Query":
        return this.http.get(`${endpoint}${endpoint.includes('?') ? '&' : '?'}access_token=${accessToken}`)
    }
  }

}
