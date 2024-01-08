//@ts-nocheck

import { IOClients } from "@vtex/api";
import VtexAPI from "./Vtex";
import SfmcAPI from "./Sfmc";
import RecommenderAPI from "./Recommender";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get Vtex (){
    return this.getOrSet("VtexApi", VtexAPI);
  }

  public get SFMC (){
    return this.getOrSet("SfmcAPI", SfmcAPI);
  }

  public get Recommender (){
    return this.getOrSet("RecommenderAPI", RecommenderAPI);
  }
}
