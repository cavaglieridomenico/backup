import { IOClients } from '@vtex/api'
import VtexAPI from './VtexAPI'
import GCP from './GcpAPI'

export class Clients extends IOClients {
  public get VtexAPI() {
    return this.getOrSet('VtexAPI', VtexAPI)
  }

  public get GCP() {
    return this.getOrSet('GCP', GCP)
  }

}
