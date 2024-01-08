import { IOClients } from "@vtex/api";
import DnG from "./DnG";
import Vtex from "./Vtex";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get DnG() {
    return this.getOrSet('DnG', DnG)
  }

  public get Vtex() {
    return this.getOrSet('Vtex', Vtex)
  }

}

