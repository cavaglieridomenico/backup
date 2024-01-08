import { IOClients } from "@vtex/api";
import Product from "./product";

export class Clients extends IOClients {
    public get product() {
        return this.getOrSet('product', Product)
      }
}
