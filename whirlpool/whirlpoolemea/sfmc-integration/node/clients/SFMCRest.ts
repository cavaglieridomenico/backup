import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { maxRetries, maxTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions"

export default class SFMCRest extends ExternalClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = {
      ...options?.headers,
      ...{
        "Accept": "*/*",
        "Content-Type": "application/json",
        "X-VTEX-Use-Https": "true"
      }
    };
    super("http://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com", context, options);
  }

  public async sendOrderDetails(orderData: any, templateKey: string, accessToken: string, retry: number = 0): Promise<any> {
    this.options!.headers = { ...this.options?.headers, ...{ "Authorization": "Bearer " + accessToken } };
    return new Promise<any>((resolve, reject) => {
      this.http.post("/hub/v1/dataevents/key:" + templateKey + "/rowset", orderData, this.options)
        .then(() => resolve({ message: "order details sent --payload: " + stringify(orderData) }))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.sendOrderDetails(orderData, templateKey, accessToken, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: "order details sending failed --err: " + stringify(err) + " --payload: " + stringify(orderData) });
          }
        })
    });
  }

  public async triggerEmail(payload: any, templateKey: string, accessToken: string, retry: number = 0): Promise<any> {
    this.options!.headers = { ...this.options?.headers, ...{ "Authorization": "Bearer " + accessToken } };
    return new Promise<any>((resolve, reject) => {

      this.http.post("/messaging/v1/messageDefinitionSends/key:" + templateKey + "/send", payload, this.options)
        .then((res: any) => {
          if (res.responses[0]?.hasErrors == false) {
            resolve({ message: "email sent --payload: " + stringify(payload) });
          } else {
            reject({ message: "email sending failed --err: " + stringify(res) + " --payload: " + stringify(payload) });
          }
        })
        .catch(async (err) => {
          console.log(err?.response, 'err.response.data')
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.triggerEmail(payload, templateKey, accessToken, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: "email sending failed --err: " + stringify(err) + " --payload: " + stringify(payload) });
          }
        })
    });
  }

  public async triggerEvent(payload: any, accessToken: string, retry: number = 0): Promise<any> {
    this.options!.headers = { ...this.options?.headers, ...{ "Authorization": "Bearer " + accessToken } };
    return new Promise<any>((resolve, reject) => {
      this.http.post("/interaction/v1/events", payload, this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.triggerEvent(payload, accessToken, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: "event triggering failed --err: " + stringify(err) + " --payload: " + stringify(payload) });
          }
        })
    });
  }
}

