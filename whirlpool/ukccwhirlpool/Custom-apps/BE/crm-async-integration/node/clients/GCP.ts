//@ts-nocheck

import { ExternalClient, InstanceOptions, IOContext} from "@vtex/api";
import { maxWaitTime, maxRetry } from "../utils/constants";
import { wait } from "../utils/mapper";
import { GoogleAuth, JWT} from "google-auth-library";
import { GCPPayload } from "../typings/GCP";

export default class GCP extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    let gcpHost = JSON.parse(process.env.CRM).gcpHost;
    super(gcpHost, context, {
      ...options,
      headers:{
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
    });
  }

  public async notify(obj: GCPPayload, token: string, retry: number = 0): Promise<any> {
    this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+token}};
    return new Promise<any>((resolve,reject) => {
      this.http.post("/trigger_flow", obj, this.options)
      .then(res => {
        resolve(res);
      })
      .catch(async(err) => {
        if(retry<maxRetry){
          await wait(maxWaitTime);
          return this.notify(obj, token, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        }else{
          reject({message: "gcp - notification failed -- details: "+(err.response?.data!=undefined?JSON.stringify(err.response.data):JSON.stringify(err)), status: err.response?.status!=undefined?err.response.status:500, ignore: false})
        }
      })
    });
  }
}

export async function getGCPClient(gcpAuth: GoogleAuth, retry: number = 0): Promise<any>{
  return new Promise<JWT | Object>((resolve,reject)=>{
    gcpAuth.getClient()
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime);
        return getGCPClient(gcpAuth, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "gcp - get client failed -- details: "+(err.response?.data!=undefined?JSON.stringify(err.response.data):JSON.stringify(err)), status: err.response?.status!=undefined?err.response.status:500, ignore: false})
      }
    })
  });
}

export async function getGCPAuthToken(ctx: Context, gcpClient: JWT, retry: number = 0): Promise<any>{
  return new Promise<string | Object>((resolve,reject)=>{
    gcpClient.fetchIdToken(ctx.state.appSettings.gcpTargetAudience)
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<maxRetry){
        await wait(maxWaitTime);
        return getGCPAuthToken(gcpClient, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: "gcp - get token failed -- details: "+(err.response?.data!=undefined?JSON.stringify(err.response.data):JSON.stringify(err)), status: err.response?.status!=undefined?err.response.status:500, ignore: false})
      }
    })
  });
}

