//@ts-nocheck

import { IOClients } from '@vtex/api'
import CRM from './CRM';
import GCP from './GCP';
import Vtex from './Vtex';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get CRM (){
    return this.getOrSet("CRM", CRM);
  }

  public get GCP (){
    return this.getOrSet("GCP", GCP);
  }

  public get Vtex (){
    return this.getOrSet("Vtex", Vtex);
  }
}
