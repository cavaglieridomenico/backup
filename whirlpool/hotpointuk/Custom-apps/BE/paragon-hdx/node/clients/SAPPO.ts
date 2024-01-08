const fs = require('fs');
const https = require('https');
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { HDXWebAppAddress, maxRetry, maxWaitTime, sappo } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { stringify, wait } from "../utils/functions";

export default class SAPPO extends ExternalClient {

  private envPath: string

  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: { environment: string, password: string } = JSON.parse(process.env.PO!);
    let host = (sappo as any)[appSettings.environment]?.host;
    let cert = (sappo as any)[appSettings.environment]?.cert;
    super(host, context, {
      ...options,
      headers: {
        "Accept": "*/*",
        "Content-Type": "text/xml"
      },
      httpsAgent: new https.Agent({
        pfx: fs.readFileSync(cert),
        passphrase: AES256Decode(appSettings.password)
      })
    });
    this.envPath = (sappo as any)[appSettings.environment]?.envPath;
  }

  public async callHDXWebApplication(paylaod: string, callReferenceCode: string, retry: number = 0): Promise<string> {
    let endpoint = this.envPath + HDXWebAppAddress;
    return new Promise<string>((resolve, reject) => {
      this.http.post(endpoint, paylaod, this.options)
        .then((res: any) => {
          if (res.includes(callReferenceCode) && !res.includes("<Error")) {
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.callHDXWebApplication(paylaod, callReferenceCode, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: `error while communicating with HDX --details: ${stringify(err)}` });
          }
        })
    })
  }
}

