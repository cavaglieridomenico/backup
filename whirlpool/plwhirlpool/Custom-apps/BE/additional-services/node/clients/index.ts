//@ts-nocheck

import { IOClients } from "@vtex/api";
import VtexApiConfig from "./Vtex"

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get vtexAPI(){
      return this.getOrSet('vtexAPI', VtexApiConfig)
    }
}