import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { DecryptKey } from '../utils/decryptKey'

export default class WorldpayAPI extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(process.env.WP_URL + '', context, options)
    //super('https://secure-test.worldpay.com', context, options)
  }

  public async PaymentService(body: string): Promise<string> {
    return this.http.post('/jsp/merchant/xml/paymentService.jsp', body, {
      headers: {
        "Content-Type": "text/xml"
      },
      auth: {
        username: process.env.WP_USERNAME + '',
        password: DecryptKey(process.env.WP_PASSWORD + '')
      }
    })
  }

}
