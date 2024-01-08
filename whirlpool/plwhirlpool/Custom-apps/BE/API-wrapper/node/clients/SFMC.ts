import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
import { sfmcApiKey, sfmcMID } from '../utils/constants'

export default class SFMC extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`https://${sfmcMID}.recs.igodigital.com`, context, options)
  }

  public async Recommendations(user: string): Promise<any> {
    return this.http.get(`/a/v2/${sfmcMID}/product_it_wh/recommend.json?email=${user}&locale=it-IT`, {
      headers: {
        'Api-key': sfmcApiKey
      }
    })
  }

}
