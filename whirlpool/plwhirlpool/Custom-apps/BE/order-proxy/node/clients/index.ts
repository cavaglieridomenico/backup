import { IOClients } from '@vtex/api'

import vtexAPI from './vtexAPI'
import Status from './status'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get status() {
    return this.getOrSet('status', Status)
  }

  public get vtexAPI() {
    return this.getOrSet('vtexAPI', vtexAPI)
  }
}