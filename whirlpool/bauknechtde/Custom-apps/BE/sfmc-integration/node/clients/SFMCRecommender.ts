//@ts-nocheck

import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { SFMCSettings } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { wait } from "../utils/functions";
const fetch = require('node-fetch')

export default class SFMCRecommender extends ExternalClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    options?.headers = {...options?.headers, ...{"Accept": "*/*", "Content-Type": "application/json"}};
    super("", context, options);
  }

  public async getRecommendations(email: string, locale: string, sfmcData: SFMCSettings, retry: number = 0): Promise<any> {
    this.options?.baseURL = "https://"+sfmcData.mid+".recs.igodigital.com";
    let query = email==undefined?"":"?email="+email+"&locale="+locale; // email = undefined iff tradePolicy = O2P
    return new Promise<any>((resolve,reject) => {
      this.http.get("/a/v2/"+sfmcData.mid+"/"+sfmcData.pathParam+"/recommend.json"+query, this.options)
      .then(res => resolve(res))
      .catch(async(err) => {
        if(retry<maxRetries){
          await wait(maxTime);
          return this.getRecommendations(email, locale, sfmcData, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        }else{
          reject(err);
        }
      })
    });
  }
}

// SFMCRecommender is broken for unclear reasons, so it has been replaced by node-fetch direct call

export async function getEinsteinRecommendations(email: string, locale: string, sfmcData: SFMCSettings, retry: number = 0): Promise<any> {
  let query = email==undefined?"":"?email="+email+"&locale="+locale; // email = undefined iff tradePolicy = O2P
  return new Promise<any>((resolve,reject) => {
    fetch("https://"+sfmcData.mid+".recs.igodigital.com/a/v2/"+sfmcData.mid+"/"+sfmcData.pathParam+"/recommend.json"+query)
    .then(async(res) => {
      let body = await res.json();
      resolve(res.status==200?resolve(body):resolve([]))
    })
    .catch(async(err) => {
      if(retry<maxRetries){
        await wait(maxTime);
        return getEinsteinRecommendations(email, locale, sfmcData, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject(err);
      }
    })
  });
}
