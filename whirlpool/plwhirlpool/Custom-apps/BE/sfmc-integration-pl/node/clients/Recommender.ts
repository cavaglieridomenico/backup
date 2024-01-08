//@ts-nocheck

import {ExternalClient, InstanceOptions, IOContext, IOResponse} from "@vtex/api";


export default class RecommenderAPI extends ExternalClient {
  constructor(context: IOContext, options: InstanceOptions) {
    let mid = JSON.parse(process.env.SFMC).mid;
    let apiKey = JSON.parse(process.env.SFMC).recommendationKey;
    super("https://"+mid+".recs.igodigital.com", context, {
      ...options,
      headers:{
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Api-key": apiKey
      }
    });
  }

  public async getRecommendations(email: string): Promise<any> {
    let mid = JSON.parse(process.env.SFMC).mid;
    // PL_WHP locale e Pdp_pl
    let query = email==undefined?"":"?email="+email+"&locale=pl-PL";
    return this.http.get("/a/v2/"+mid+"/Pdp_pl/recommend.json"+query, this.options);
  }
}

