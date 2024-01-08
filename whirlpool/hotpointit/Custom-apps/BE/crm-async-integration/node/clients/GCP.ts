//@ts-nocheck

import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { maxWaitTime, maxRetry } from "../utils/constants";
import { wait } from "../utils/mapper";
import { GoogleAuth, JWT } from "google-auth-library"
import { AppSettings, GCPAuthType } from "../typings/config";
import { AES256Decode } from "../utils/cryptography";
import { stringify } from "../utils/functions";

export default class GcpAPI extends ExternalClient {

    private googleAuth: GoogleAuth
    private targetAudience: string
    private gcpAuthType: string

    constructor(context: IOContext, options?: InstanceOptions) {
      let appSettings: AppSettings = JSON.parse(process.env.CRM);
      options?.headers = {
        ...options?.headers,
        ...{
          "Accept": "*/*",
          "Content-Type": "application/json",
          "X-VTEX-Use-Https": "true"
        }
      }
      super(appSettings.gcpHost, context, options);
      if(appSettings.gcpAuthType==GCPAuthType.BASIC){
        this.options?.headers = {
          ...this.options?.headers,
          ...{
            "Authorization": "Basic "+Buffer.from(appSettings.gcpClientEmail+":"+AES256Decode(appSettings.gcpPrivateKey), "ascii").toString("base64")
          }
        }
      }else{
        this.googleAuth = new GoogleAuth({
          projectId: appSettings.gcpProjectId,
          credentials: {
            client_email: appSettings.gcpClientEmail,
            private_key: AES256Decode(appSettings.gcpPrivateKey)
          }
        });
        this.targetAudience = appSettings.gcpTargetAudience;
      }
      this.gcpAuthType = appSettings.gcpAuthType;
    }

    private async getGCPClient(retry: number = 0): Promise<JWT>{
      return new Promise<JWT>((resolve,reject)=>{
        this.googleAuth.getClient()
        .then(res => resolve(res))
        .catch(async(err) => {
          if(retry<maxRetry){
            await wait(maxWaitTime);
            return getGCPClient(retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }else{
            reject({message: "gcp - get client failed -- details: "+stringify(err), status: 500, ignore: false})
          }
        })
      });
    }

    private async getGCPAuthToken(gcpClient: JWT, retry: number = 0): Promise<string>{
      return new Promise<string>((resolve,reject)=>{
        gcpClient.fetchIdToken(this.targetAudience)
        .then(res => resolve(res))
        .catch(async(err) => {
          if(retry<maxRetry){
            await wait(maxWaitTime);
            return getGCPAuthToken(gcpClient, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }else{
            reject({message: "gcp - get token failed -- details: "+stringify(err), status: 500, ignore: false})
          }
        })
      });
    }

    private async notifyWithRetry(obj: any, retry: number = 0): Promise<any> {
      return new Promise<any>((resolve,reject) => {
        this.http.post("/trigger_flow", obj, this.options)
        .then(res => resolve(res))
        .catch(async(err) => {
          if(retry<=maxRetry){
            await wait(maxWaitTime);
            return this.notifyWithRetry(obj, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }else{
            reject({message: "gcp - notification failed -- details: "+stringify(err) , status: 500, ignore: false})
          }
        })
      });
    }

    public async notify(obj: any): Promise<any> {
      return new Promise<any>(async (resolve,reject) => {
        try{
          if(this.gcpAuthType==GCPAuthType.BEARER){
            let client = await this.getGCPClient();
            let token = await this.getGCPAuthToken(client);
            this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+token}};
          }
          await this.notifyWithRetry(obj);
          resolve(true);
        }catch(err){
          reject(err);
        }
      });
    }
}

