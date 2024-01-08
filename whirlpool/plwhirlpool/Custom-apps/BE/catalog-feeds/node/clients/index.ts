import { IOClients } from '@vtex/api'
import SearchGraphQL from './SearchGraphQL'
import vtexAPI from './vtexAPI'



// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get vtexAPI() {
    return this.getOrSet('vtexAPI', vtexAPI)
  }

  public get searchGraphQL() {
    return this.getOrSet('searchGraphQL', SearchGraphQL)
  }


}
