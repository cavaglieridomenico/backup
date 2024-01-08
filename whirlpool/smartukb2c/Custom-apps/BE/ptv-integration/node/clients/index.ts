import { IOClients } from '@vtex/api'

import PTV from './PTV'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get PTV() {
    return this.getOrSet('PTV', PTV)
  }
}
