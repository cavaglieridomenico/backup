import { IOClients } from "@vtex/api"

import { Checkout } from "./checkout"
import CheckoutGraphQL from "./CheckoutGraphQL"
import CronJob from "./CronJob"
import PaymentClient from "./PaymentClient"
import Vtex from "./Vtex"

export class Clients extends IOClients {

  public get checkout() {
    return this.getOrSet("checkout", Checkout)
  }

  public get paymentClient() {
    return this.getOrSet("paymentClient", PaymentClient)
  }

  public get checkoutGraphQL() {
    return this.getOrSet("checkoutGraphQL", CheckoutGraphQL)
  }

  public get Vtex() {
    return this.getOrSet("Vtex", Vtex);
  }

  public get CronJob() {
    return this.getOrSet('CronJob', CronJob)
  }
}
