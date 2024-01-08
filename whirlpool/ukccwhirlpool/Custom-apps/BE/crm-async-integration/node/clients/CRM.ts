//@ts-nocheck

const fs = require('fs');
const https = require('https');
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { CRMGetAccount, SAPPOGetAccount } from "../typings/CRMGetAccount";
import { crm, maxRetry, maxWaitTime, sappo } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { wait } from "../utils/mapper";

export default class CRM extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
      let appSettings = JSON.parse(process.env.CRM);
      let host = appSettings.useSapPo ? sappo[appSettings.crmEnvironment]?.host : crm[appSettings.crmEnvironment]?.host;
      let cert = appSettings.useSapPo ? sappo[appSettings.crmEnvironment]?.cert : crm[appSettings.crmEnvironment]?.cert;
      super(host, context, {
        ...options,
        headers:{
          "Accept": "*/*",
          "Content-Type": "text/xml"
        },
        httpsAgent: new https.Agent({
          pfx: fs.readFileSync(cert),
          passphrase: AES256Decode(appSettings.crmPassword)
        })
      });
    }

    public async getAccount(crmBpId: string): Promise<any> {
      let appSettings = JSON.parse(process.env.CRM);
      let paylaod = appSettings.useSapPo ? SAPPOGetAccount : CRMGetAccount;
      paylaod = paylaod.replace(/\$crmBpId/g, crmBpId);
      let endpoint = appSettings.useSapPo ? sappo[appSettings.crmEnvironment]?.getAccountEndpoint : crm[appSettings.crmEnvironment]?.getAccountEndpoint;
      return this.http.post(endpoint, paylaod, this.options);
    }

    public async createUpdateAccount(paylaod: string, retry: number = 0): Promise<any> {
      let appSettings = JSON.parse(process.env.CRM);
      let endpoint = appSettings.useSapPo ? sappo[appSettings.crmEnvironment]?.createUpdateAccountEndpoint : crm[appSettings.crmEnvironment]?.createUpdateAccountEndpoint;
      return new Promise<any>((resolve, reject) => {
        this.http.post(endpoint, paylaod, this.options)
            .then(res => resolve(res))
            .catch(async(err) => {
              if(retry<maxRetry){
                await wait(maxWaitTime);
                return this.createUpdateAccount(paylaod, retry+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
              }else{
                reject(err);
              }
            })
      })
    }
}

