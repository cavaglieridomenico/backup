import { IOClients } from '@vtex/api';
import  VtexAPI  from './VtexApi'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get vtexAPI() {
        return this.getOrSet('VtexAPI', VtexAPI)
      }
}
