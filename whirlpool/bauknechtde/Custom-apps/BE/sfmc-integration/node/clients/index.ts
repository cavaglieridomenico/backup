import { IOClients } from "@vtex/api";
import SFMCAuth from "./SFMCAuth";
import SFMCRecommender from "./SFMCRecommender";
import SFMCRest from "./SFMCRest";
import VtexMP from "./VtexMP";
import VtexSeller from "./VtexSeller";
import SearchGraphQL from "./SearchGraphql";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get SFMCAuth (){
    return this.getOrSet("SFMCAuth", SFMCAuth);
  }

  public get SFMCRest (){
    return this.getOrSet("SFMCRest", SFMCRest);
  }

  public get SFMCRecommender (){
    return this.getOrSet("SFMCRecommender", SFMCRecommender);
  }

  public get VtexMP (){
    return this.getOrSet("VtexMP", VtexMP);
  }

  public get VtexSeller (){
    return this.getOrSet("VtexSeller", VtexSeller);
  }

  public get SearchGraphQL() {
    return this.getOrSet('SearchGraphQL', SearchGraphQL)
  }

}
