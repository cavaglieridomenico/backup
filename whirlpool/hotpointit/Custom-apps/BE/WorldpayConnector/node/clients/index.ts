import { IOClients } from '@vtex/api'
import NotificationForwarder from './NotificationForwarder'
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

  public get notificationForwarder() {
    return this.getOrSet('notificationForwarder', NotificationForwarder)
  }

  public get xipayAPI() {
    return this.getOrSet('xipayAPI', XipayAPI)
  }
}
