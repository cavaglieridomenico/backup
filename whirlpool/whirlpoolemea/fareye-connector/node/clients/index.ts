import { IOClients } from '@vtex/api';
import OrderFormClient from './OrderForm';
import Vtex from './Vtex';
import FarEyeAPI from './FarEye';
import MPS_API from './MP_Sync';
import Cron from './Cron';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get Vtex() {
    return this.getOrSet("Vtex", Vtex);
  }

  public get OrderForm() {
    return this.getOrSet("OrderFormClient", OrderFormClient);
  }

  public get FarEye() {
    return this.getOrSet("FarEyeAPI", FarEyeAPI)
  }

  public get MP_Sync() {
    return this.getOrSet("MPS_API", MPS_API)
  }

  public get Cron() {
    return this.getOrSet("Cron", Cron);
  }
}
