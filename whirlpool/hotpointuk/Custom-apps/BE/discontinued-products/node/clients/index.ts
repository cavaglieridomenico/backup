import { IOClients } from '@vtex/api'
import Rewriter from './Rewriter'
import vtexAPI from './vtexAPI'

export class Clients extends IOClients {

  public get vtexAPI() {
    return this.getOrSet('vtexAPI', vtexAPI)
  }

  public get Rewriter() {
    return this.getOrSet('Rewriter', Rewriter)
  }

}
