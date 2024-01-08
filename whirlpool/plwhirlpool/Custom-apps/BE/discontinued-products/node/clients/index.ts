import { IOClients } from '@vtex/api'
import Rewriter from './Rewriter'
import vtexAPI from './vtexAPI'
// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get vtexAPI() {
    return this.getOrSet('vtexAPI', vtexAPI)
  }

  public get Rewriter() {
    return this.getOrSet('Rewriter', Rewriter)
  }

}
