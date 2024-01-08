import { IOClients } from '@vtex/api'
import VtexAPI from './VtexAPI';
export class Clients extends IOClients {
  public get Vtex (){
    return this.getOrSet("VtexAPI", VtexAPI);
  }
}
