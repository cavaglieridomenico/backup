import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { MPSettings } from "../typings/config";
import { MPNotification } from "../typings/mp";
import { maxRetry, maxWaitTime, MPNotificationEndpoint, MPNotificationMethod } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { DigestAuth } from "../utils/DigestAuth";
import { stringify, wait } from "../utils/functions";

export default class VtexMP extends ExternalClient {

  mpSettings: MPSettings
  digestAuth: DigestAuth

  constructor(context: IOContext, options?: InstanceOptions) {
    let mpSettings: MPSettings = JSON.parse(process.env.WHSYN!)?.vtex?.mp;
    mpSettings.psw = AES256Decode(mpSettings.psw);
    super("http://" + context.workspace + "--" + mpSettings.accountName + ".myvtex.com", context, options);
    this.mpSettings = mpSettings;
    this.digestAuth = new DigestAuth();
  }

  public async sentNotification(payload: MPNotification[], retry: number = 0): Promise<any> {
    let nonce = this.digestAuth.randomNonce();
    let digest = this.digestAuth.computeDigest(this.mpSettings.username, this.mpSettings.psw, this.mpSettings.realm, MPNotificationMethod, MPNotificationEndpoint, nonce, this.mpSettings.hashAlgorithm);
    this.options!.headers = {
      ...this.options?.headers,
      ...{
        Authorization: 'Digest username="' + this.mpSettings.username + '", ' +
          'realm="' + this.mpSettings.realm + '", ' +
          'nonce="' + nonce + '", ' +
          'uri="' + MPNotificationEndpoint + '", ' +
          'algorithm="' + this.mpSettings.hashAlgorithm + '", ' +
          'response="' + digest + '"'
      }
    }
    return new Promise<any>((resolve, reject) => {
      this.http.post(MPNotificationEndpoint, payload, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.sentNotification(payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ msg: "Error while sending stock notifications to MP --payload: " + stringify(payload) + " --details: " + stringify(err) });
          }
        })
    })
  }

}
