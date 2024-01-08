import { IOClients } from '@vtex/api'
import VtexAPI from './vtexAPI'
import CronJob from './CronJob'
import Transaction from './Payments'
// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get vtexAPI() {
    return this.getOrSet('vtexAPI', VtexAPI)
  }

  public get CronJob() {
    return this.getOrSet('CronJob', CronJob)
  }

  public get Payments() {
    return this.getOrSet('Transaction', Transaction)
  }
}
