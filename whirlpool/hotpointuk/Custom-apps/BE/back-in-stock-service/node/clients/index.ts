import { IOClients } from '@vtex/api'
import VtexApi from '../clients/VtexApi';
import SearchGraphQL from "./SearchGraphql";

export class Clients extends IOClients {
  public get VtexApi() {
    return this.getOrSet("VtexApi", VtexApi);
  }

  public get SearchGraphQL() {
    return this.getOrSet('SearchGraphQL', SearchGraphQL)
  }
}
