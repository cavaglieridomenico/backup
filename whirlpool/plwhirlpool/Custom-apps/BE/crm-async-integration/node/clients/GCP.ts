//@ts-nocheck

import { ExternalClient, InstanceOptions, IOContext} from "@vtex/api";
import { maxWaitTime, maxRetry } from "../utils/constants";
import { wait } from "../utils/mapper";
import { GoogleAuth, JWT} from "google-auth-library";

export default class GcpAPI extends ExternalClient {
  constructor(context: IOContext, options: InstanceOptions) {
    let gcpHost = JSON.parse(process.env.CRM).gcpHost;
    super(gcpHost, context, {
      ...options,
      headers:{
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
    });
  }

  public async notify(obj: Object, token: string, retry: number): Promise<any> {
    this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+token}};
    return new Promise<any>((resolve,reject) => {
      this.http.post("/trigger_flow", obj, this.options)
      .then(res => {
        resolve(res);
      })
      .catch(async(err) => {
        if(retry<=maxRetry){
          await wait(maxWaitTime);
          return this.notify(obj,token,retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        }else{
          reject({message: err.response?.data!=undefined?("gcp - notification failed -- details: "+err.response.data):"gcp - notification failed" , status: err.response?.status!=undefined?err.response.status:500, ignore: false})
        }
      })
    });
  }
}

export async function getGCPClient(gcpAuth: GoogleAuth, retry: number): Promise<JWT | Object>{
  return new Promise<JWT | Object>((resolve,reject)=>{
    gcpAuth.getClient()
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<=maxRetry){
        await wait(maxWaitTime);
        return getGCPClient(gcpAuth,retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: err.response?.data!=undefined?"gcp - get client failed -- details: "+err.response.data:"gcp - get client failed", status: err.response?.status!=undefined?err.response.status:500, ignore: false})
      }
    })
  });
}

export async function getGCPAuthToken(gcpClient: JWT, retry: number): Promise<string | Object>{
  return new Promise<string | Object>((resolve,reject)=>{
    gcpClient.fetchIdToken(JSON.parse(process.env.CRM).gcpTargetAudience)
    .then(res => {
      resolve(res);
    })
    .catch(async(err) => {
      if(retry<=maxRetry){
        await wait(maxWaitTime);
        return getGCPAuthToken(gcpClient,retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }else{
        reject({message: err.response?.data!=undefined?"gcp - get token failed -- details: "+err.response.data:"gcp - get token failed", status: err.response?.status!=undefined?err.response.status:500, ignore: false})
      }
    })
  });
}

