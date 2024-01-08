import { IOClients } from '@vtex/api';
import SAPPO from './SAPPO';
import VtexSeller from './VtexSeller';
import VtexMP from './VtexMP';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get SAPPO() {
    return this.getOrSet("SAPPO", SAPPO);
  }

  public get VtexSeller() {
    return this.getOrSet("VtexSeller", VtexSeller);
  }

  public get VtexMP() {
    return this.getOrSet("VtexMP", VtexMP);
  }

}
