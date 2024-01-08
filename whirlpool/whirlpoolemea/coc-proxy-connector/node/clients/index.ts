import { IOClients } from '@vtex/api'

import WorldpayAPI from './worldpayAPI'
import CronJob from './CronJob'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get worldpayAPI() {
    return this.getOrSet('worldpayAPI', WorldpayAPI)
  }
  public get CronJob() {
    return this.getOrSet('CronJob', CronJob)
  }
}
