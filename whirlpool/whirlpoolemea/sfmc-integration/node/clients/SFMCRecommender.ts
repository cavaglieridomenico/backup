import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { SFMCSettings } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { wait } from "../utils/functions";
const fetch = require('node-fetch')

export default class SFMCRecommender extends ExternalClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = {
      ...options?.headers,
      ...{
        "Accept": "*/*",
        "X-VTEX-Use-Https": "true"
      }
    }
    super("", context, options);
  }

  /**
   * @deprecated SFMC Client is broken for unclear reasons
   * @param email string | undefined
   * @param locale string
   * @param retry number
   * @returns Promise\<any\>
   */
  public async getRecommendations(settings: SFMCSettings, email: string | undefined, locale: string, pathParam: string | undefined, retry: number = 0): Promise<any> {
    let query = "?locale=" + locale;
    query += (email ? ("&email=" + email) : ""); // email = undefined iff tradePolicy = O2P
    this.options!.baseURL = "https://" + settings.mid + ".recs.igodigital.com";
    pathParam = pathParam ? pathParam : settings.pathParam;
    return new Promise<any>((resolve, reject) => {
      this.http.get("/a/v2/" + settings.mid + "/" + pathParam + "/recommend.json" + query, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getRecommendations(settings, email, locale, pathParam, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    });
  }

  /**
   * @param email string | undefined
   * @param locale string
   * @param retry number
   * @returns Promise\<any\>
   */
  public async getEinsteinRecommendations(settings: SFMCSettings, email: string | undefined, locale: string, pathParam: string | undefined, retry: number = 0): Promise<any> {
    let query = "?locale=" + locale;
    query += (email ? ("&email=" + email) : ""); // email = undefined iff tradePolicy = O2P
    pathParam = pathParam ? pathParam : settings.pathParam;
    return new Promise<any>((resolve, reject) => {
      fetch(
        "http://" + settings.mid + ".recs.igodigital.com/a/v2/" + settings.mid + "/" + pathParam + "/recommend.json" + query,
        {
          method: "GET",
          headers: this.options?.headers
        }
      )
        .then(async (res: any) => {
          let body = await res.json();
          resolve(res.status == 200 ? resolve(body) : resolve([]))
        })
        .catch(async (err: any) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getEinsteinRecommendations(settings, email, locale, pathParam, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    });
  }
}
