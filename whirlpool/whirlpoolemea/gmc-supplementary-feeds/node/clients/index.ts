import { IOClients } from '@vtex/api'
import { Catalog, Logistics } from "@vtex/clients";
import Vtex from './Vtex'
import CronJob from './CronJob';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get Vtex() {
    return this.getOrSet('Vtex', Vtex)
  }

  public get Catalog() {
    return this.getOrSet('Catalog', Catalog)
  }

  public get Logistic() {
    return this.getOrSet('Logistic', Logistics)
  }

  public get CronJob() {
    return this.getOrSet('CronJob', CronJob)
  }
}
