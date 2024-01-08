import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
import { Order } from '../typings/Order';

export default class NotificationForwarder extends ExternalClient {

  configs?: {
    account: string,
    appkey: string,
    apptoken: string
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  public async ForwardNotification(body: string): Promise<Order> {
    return this.http.post(`https://${this.configs?.account}.myvtex.com/_v/api/connectors/worldpay/notification`, body, {
      headers: {
        'X-VTEX-API-AppKey': this.configs?.appkey,
        'X-VTEX-API-AppToken': this.configs?.apptoken
      }
    })
  }

}
