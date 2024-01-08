import { IOClients } from '@vtex/api';
import VtexAPI from './vtexAPI';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  private _masterdata: any;
  public get masterdata(): any {
    return this._masterdata;
  }
  public set masterdata(value: any) {
    this._masterdata = value;
  }
    public get vtexAPI() {
        return this.getOrSet('VtexAPI', VtexAPI)
      }
}
