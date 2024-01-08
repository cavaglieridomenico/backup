import { IOClients } from '@vtex/api'
import Social from './Social'

// Public class that acts as a container for all clients.
export class Clients extends IOClients {

  public get Social() {
    return this.getOrSet('Social', Social)
  }

}

