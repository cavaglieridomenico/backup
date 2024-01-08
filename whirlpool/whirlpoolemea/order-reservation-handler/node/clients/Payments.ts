import { InstanceOptions, IOContext, ExternalClient } from "@vtex/api";


export default class Transaction extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`https://${context.account}.vtexpayments.com.br`, context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public async CancelTransaction(transactionId: string, price: number) {
    return await this.http.post(`/api/pvt/transactions/${transactionId}/cancellation-request`, {
      value: price
    })

  }

  public async TransactionDetails(transactionId: string) {
    return new Promise<any>((resolve, reject) => {
      this.http.get(`api/pvt/transactions/${transactionId}`)
        .then(res => resolve(res))
        .catch(res => reject(res))
    })
  }
}
