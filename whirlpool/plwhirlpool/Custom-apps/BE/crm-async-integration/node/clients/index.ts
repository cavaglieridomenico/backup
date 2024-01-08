//@ts-nocheck

import { IOClients } from '@vtex/api'
import CrmAPI from './CRM';
import SapPoAPI from './SAP_PO';
import VtexApi from './Vtex';
import GcpAPI from './GCP';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get CRM (){
    return this.getOrSet("CrmAPI", CrmAPI);
  }

  public get SAPPO (){
    return this.getOrSet("SapPoAPI", SapPoAPI);
  }

  public get GCP (){
    return this.getOrSet("GcpAPI", GcpAPI);
  }

  public get Vtex (){
    return this.getOrSet("VtexApi", VtexApi);
  }
}
