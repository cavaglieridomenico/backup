const fs = require('fs');
const https = require('https');
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { CNETWebAddress, maxRetry, maxWaitTime, sappo } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { stringify, wait } from "../utils/functions";
import { SAPPOSettings } from "../typings/config"
import { POStockNotification } from "../typings/sap-po";

export default class SAPPO extends ExternalClient {

  envPath: string
  sid: string

  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: SAPPOSettings = JSON.parse(process.env.WHSYN!)?.sappo;
    let host = (sappo as any)[appSettings.environment]?.host;
    let cert = (sappo as any)[appSettings.environment]?.cert;
    super(
      host,
      context,
      {
        ...options,
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        httpsAgent: new https.Agent(
          {
            pfx: fs.readFileSync(cert),
            passphrase: AES256Decode(appSettings.password)
          }
        )
      }
    );
    this.envPath = (sappo as any)[appSettings.environment]?.envPath;
    this.sid = AES256Decode(appSettings.sid);
  }

  public async callCNETWebApplication(payload: POStockNotification, retry: number = 0): Promise<any> {
    let endpoint = this.envPath + CNETWebAddress;
    payload.sid = this.sid;
    return new Promise<any>((resolve, reject) => {
      this.http.post(endpoint, payload, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.callCNETWebApplication(payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: "error while sending stock notifications to PO --payload: " + stringify(payload) + " --details " + stringify(err) });
          }
        })
    })
  }
}

