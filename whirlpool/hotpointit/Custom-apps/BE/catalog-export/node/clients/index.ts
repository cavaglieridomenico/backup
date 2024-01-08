//@ts-nocheck

import { IOClients } from '@vtex/api'
import VtexAPI from './VtexAPI';
import VtexSeller from './VtexSeller'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get Vtex (){
    return this.getOrSet("VtexAPI", VtexAPI);
  }
  public get VtexSeller(){
    return this.getOrSet('VtexSeller', VtexSeller)
  }
}
