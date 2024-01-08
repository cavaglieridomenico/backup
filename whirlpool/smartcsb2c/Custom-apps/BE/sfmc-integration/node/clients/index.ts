import { IOClients } from "@vtex/api";
import ApiConfig from "./sf.api";
import VtexApiConfig from "./vtex.api";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get sfmcAPI() {
    return this.getOrSet("sfmcAPI", ApiConfig)
  }

  public get vtexAPI() {
    return this.getOrSet("vtexAPI", VtexApiConfig)
  }
}
