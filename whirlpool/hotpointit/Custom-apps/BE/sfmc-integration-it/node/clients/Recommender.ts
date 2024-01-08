//@ts-nocheck

import {ExternalClient, InstanceOptions, IOContext, IOResponse} from "@vtex/api";


export default class RecommenderAPI extends ExternalClient {
  constructor(context: IOContext, options: InstanceOptions) {
    let mid = JSON.parse(process.env.TEST).mid;

    let apiKey = JSON.parse(process.env.TEST).recommendationKey;
    super("https://"+mid+".recs.igodigital.com", context, {
      ...options,
      headers:{
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Api-key": apiKey
      }
    });
  }
  
  /**
   * 
   * @param email  
   * @param pagetype could be pdp (deafault) - search - thankyou - home - cart
   * @returns json object
   */
  public async getRecommendations(email: string, pagetype: any): Promise<any> {

    let mid = JSON.parse(process.env.TEST).mid;
    let query = email==undefined?"":"?email="+email+"&locale=it-IT";
    let pgtype = "";

    if(pagetype == undefined || pagetype == ""){ 
      pgtype = "Pdp"
    }else{
      pgtype = pagetype.trim().replace(/^./, pagetype[0].toUpperCase());
    }
    
    return this.http.get("/a/v2/"+mid+"/"+pgtype+"_it/recommend.json"+query, this.options);
  }
}