import { IOClients } from '@vtex/api';
import SAPPO from './SAPPO';
import OrderFormClient from './OrderForm';
import Vtex from './Vtex';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get SAPPO() {
    return this.getOrSet("SAPPO", SAPPO);
  }

  public get Vtex() {
    return this.getOrSet("Vtex", Vtex);
  }

  public get OrderForm() {
    return this.getOrSet("OrderFormClient", OrderFormClient);
  }
}
