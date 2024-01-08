import { IOClients } from '@vtex/api'
import VtexApi from '../clients/VtexApi';


export class Clients extends IOClients {
  public get VtexApi() {
    return this.getOrSet("VtexApi", VtexApi);
  }
}
