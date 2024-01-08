import { IOClients } from '@vtex/api'
import AuthUser from './AuthUser'
import VtexAPI from './vtexAPI'


// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get AuthUser() {
    return this.getOrSet('AuthUser', AuthUser)
  }

  public get vtexAPI() {
    return this.getOrSet('vtexAPI', VtexAPI)
  }
}