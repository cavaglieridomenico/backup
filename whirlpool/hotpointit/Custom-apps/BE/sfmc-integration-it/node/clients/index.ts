//@ts-nocheck

import { IOClients } from "@vtex/api";
import VtexAPI from "./vtex.Api.Config";
import SfmcAPI from "./SFMC";
import RecommenderAPI from "./Recommender";
import SearchGraphQL from "./SearchGraphql";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get Vtex (){
    return this.getOrSet("VtexApi", VtexAPI);
  }

  public get SfmcAPI(){
    return this.getOrSet("SfmcAPI", SfmcAPI)
  }

  public get Recommender (){
    return this.getOrSet("RecommenderAPI", RecommenderAPI);
  }

  public get SearchGraphQL() {
    return this.getOrSet('SearchGraphQL', SearchGraphQL)
  }

}
