import { IOClients } from '@vtex/api'
import Rewriter from './Rewriter'
// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get Rewriter() {
    return this.getOrSet('Rewriter', Rewriter)
  }

}
