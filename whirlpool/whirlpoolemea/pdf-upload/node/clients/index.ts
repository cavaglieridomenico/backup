import { IOClients } from '@vtex/api'
import VtexAPI from './VtexAPI'

export class Clients extends IOClients {
  public get VtexAPI() {
    return this.getOrSet('VtexAPI', VtexAPI)
  }
}
