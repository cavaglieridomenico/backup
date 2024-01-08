import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { SFMCSettings } from "../typings/config";
import { AuthCredentials } from "../typings/types";
import { maxRetries, maxTime } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { stringify, wait } from "../utils/functions";

export default class SFMCAuth extends ExternalClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = {
      ...options?.headers,
      ...{
        "Accept": "*/*",
        "Content-Type": "application/json",
        "X-VTEX-Use-Https": "true"
      }
    };
    super("http://mcw785xyskn2jrl9kbr-hjtx1w88.auth.marketingcloudapis.com", context, options);
  }

  public async getAccessToken(settings: SFMCSettings, retry: number = 0): Promise<any> {
    let credentials: AuthCredentials = {
      grant_type: "client_credentials",
      client_id: AES256Decode(settings.clientId),
      client_secret: AES256Decode(settings.clientSecret)
    }
    return new Promise<any>((resolve, reject) => {
      this.http.post("/v2/token", credentials, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getAccessToken(settings, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: "get access token failed --err: " + stringify(err) });
          }
        })
    });
  }

}

