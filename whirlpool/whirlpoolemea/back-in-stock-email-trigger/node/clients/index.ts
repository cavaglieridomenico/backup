import { IOClients } from '@vtex/api'
import Vtex from './Vtex';

export class Clients extends IOClients {
  public get Vtex() {
    return this.getOrSet("Vtex", Vtex);
  }
}
