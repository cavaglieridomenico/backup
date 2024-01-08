import { IOClients } from '@vtex/api'
import AlmaClient from './AlmaClient'
import VtexAPI from './vtexAPI'
export class Clients extends IOClients {
  public get AlmaClient() {
    return this.getOrSet("AlmaClient", AlmaClient)
  }

  public get vtexAPI() {
    return this.getOrSet('vtexAPI', VtexAPI)
  }


}