import { IOClients } from '@vtex/api'
import VtexAPI from './vtexAPI'
import WorldpayAPI from './worldpayAPI'
import XipayAPI from './xipay'


// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get worldpayAPI() {
    return this.getOrSet('worldpayAPI', WorldpayAPI)
  }

  public get vtexAPI() {
    return this.getOrSet('vtexAPI', VtexAPI)
  }

  public get xipayAPI() {
    return this.getOrSet('xipayAPI', XipayAPI)
  }
}
