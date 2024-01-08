//@ts-nocheck

import { ExternalClient, IOContext, InstanceOptions } from "@vtex/api"
import { AppSettings } from "../typings/config"
import { DnGPayload } from "../typings/DnGPayload";
import { maxRetry, maxWaitTime } from "../utils/constants";
import { AES256Decode, base64Encode } from "../utils/cryptography";
import { getCircularReplacer, wait } from "../utils/functions";

export default class DnG extends ExternalClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: AppSettings = JSON.parse(process.env.DnG);
    super("https://"+appSettings.dng.hostname, context, options)
  }

  public async getToken(retry: number = 0): Promise<string> {
    let appSettings: AppSettings = JSON.parse(process.env.DnG);
    let password = AES256Decode(appSettings.dng.password);
    this.options?.headers = {
      ...this.options?.headers,
      ...{
        Authorization: "Basic "+base64Encode(appSettings.dng.username+":"+password)
      }
    }
    return new Promise<string>((resolve,reject) => {
      this.http.get("/api/Api/PreRegister/GetToken", this.options)
          .then(res => resolve(res))
          .catch(async(err) => {
            if(retry<maxRetry){
              await wait(maxWaitTime);
              return this.getToken(retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            }else{
              reject({message: "error while retrieving the authentication token --details "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())})
            }
          })
    })
  }

  public async sendOrderData(orderData: DnGPayload, token: string, retry: number = 0): Promise<string>{
    this.options?.headers = {
      ...this.options?.headers,
      ...{
        TokenAuth: token
      }
    }
    return new Promise<string>((resolve,reject) => {
      this.http.post("/api/Api/PreRegister/Add", orderData, this.options)
          .then(res => resolve(res))
          .catch(async(err) => {
            if(retry<maxRetry){
              await wait(maxWaitTime);
              return this.sendOrderData(orderData, token, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
            }else{
              reject({message: "error while sending order data to DnG --details "+JSON.stringify(err.response?.data ? err.response.data : err, getCircularReplacer())})
            }
          })
    })
  }

}
