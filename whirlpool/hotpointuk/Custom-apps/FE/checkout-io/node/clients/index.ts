import { IOClients } from '@vtex/api'

import { Checkout } from './checkout'
import PaymentClient from './PaymentClient'
import VtexAPI from './vtexAPI'

export class Clients extends IOClients {
  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }
  public get paymentClient() {
    return this.getOrSet('paymentClient', PaymentClient)
  }
  public get vtexAPI() {
    return this.getOrSet('vtexAPI', VtexAPI)
  }
}
