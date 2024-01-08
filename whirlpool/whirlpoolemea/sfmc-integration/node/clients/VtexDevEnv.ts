import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { GCPSettings } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions";

export default class VtexDevEnv extends ExternalClient {

  private ws: string

  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: GCPSettings = JSON.parse(process.env[`${context.account}-GCP`]!);
    super(`http://${appSettings.wsName}--${context.account}.myvtex.com`, context, options);
    this.ws = appSettings.wsName!;
  }

  public async redirectPOSTRequestToWS(url: string, payload: any, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(url, payload, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.redirectPOSTRequestToWS(url, payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `error while redirecting request ${url} to the ws ${this.ws} --payload: ${JSON.stringify(payload)} --err: ${stringify(err)}` });
          }
        })
    })
  }

}
