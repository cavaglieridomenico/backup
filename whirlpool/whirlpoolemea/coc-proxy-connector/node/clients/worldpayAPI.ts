import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class WorldpayAPI extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(process.env[`${context.account}-WP_URL`] + '', context, options)
  }

  public async PaymentService(body: string, username: string, password: string): Promise<IOResponse<any>> {
    return this.http.postRaw('/jsp/merchant/xml/paymentService.jsp', body, {
      headers: {
        "Content-Type": "text/xml"
      },
      auth: {
        username: username,
        password: password
      }
    })
  }
}
