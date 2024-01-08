//@ts-nocheck

import { IOClients } from '@vtex/api'
import VtexApi from './Vtex';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get Vtex (){
    return this.getOrSet("VtexApi", VtexApi);
  }
}
