//@ts-nocheck

import { IOClients } from '@vtex/api'
import VtexMP from './VtexMP';
import VtexSeller from './VtexSeller';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get VtexMP (){
    return this.getOrSet("VtexMP", VtexMP);
  }

  public get VtexSeller (){
    return this.getOrSet("VtexSeller", VtexSeller);
  }
}
