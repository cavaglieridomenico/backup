import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { CancelSlotPayload, GetSlotPayload, ReserveSlotPayload } from "../typings/fareye";
import { stringify, wait } from "../utils/functions";
import { FarEye_Settings } from "../typings/config";
import { AES256Decode } from "../utils/cryptography";

export default class FarEyeAPI extends ExternalClient {

  private MAX_TIME: number;
  private MAX_RETRY: number;
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private isAuthEnabled: boolean;
  private staticToken: string | undefined;
  private GetSlot_Endpoint: string
  private CancelSlot_Endpoint: string
  private ReserveSlot_Endpoint: string

  constructor(context: IOContext, options?: InstanceOptions) {
    let settings: FarEye_Settings = JSON.parse(process.env[`${context.account}-FarEye`]!)
    options!.headers = {
      ...options!.headers,
      ...{
        "Content-Type": "application/json",
        "Accept": "*/*",
        "X-VTEX-Use-Https": "true"
      }
    }
    super(settings.Host, context, options);
    this.MAX_TIME = 250;
    this.MAX_RETRY = 5;
    this.clientId = settings.ClientId;
    this.clientSecret = settings.ClientSecret;
    this.isAuthEnabled = settings.IsAuthEnabled;
    this.staticToken = settings.StaticToken;
    this.GetSlot_Endpoint = settings.GetSlot_Endpoint;
    this.CancelSlot_Endpoint = settings.CancelSlot_Endpoint;
    this.ReserveSlot_Endpoint = settings.ReserveSlot_Endpoint;
  }

  private async setAuthentication(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let accessToken = this.staticToken;
        if (this.isAuthEnabled) {
          accessToken = await this.getAccessToken();
        }
        this.options!.headers!["Authorization"] = `Bearer ${accessToken}`;
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  private async getAccessToken(retry: number = 0): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let body = {
        grant_type: "client_credentials",
        client_id: AES256Decode(this.clientId!),
        client_secret: AES256Decode(this.clientSecret!)
      }
      this.http.post("TBD", body, this.options)
        .then((res: any) => resolve(res.access_token))
        .catch(async (err) => {
          if (retry < this.MAX_RETRY) {
            await wait(this.MAX_TIME);
            return this.getAccessToken(retry + 1).then(res1 => resolve(res1)).catch(err1 => reject(err1))
          } else {
            reject({ msg: `Error while retrieving access token from FarEye --details: ${stringify(err)}` })
          }
        })
    })
  }

  public async GetDeliverySlots(body: GetSlotPayload, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.setAuthentication()
        .then(() => {
          this.http.post(`${this.GetSlot_Endpoint}`, body, this.options)
            .then((res: any) => resolve(res))
            .catch(async (err: any) => {
              if (retry < this.MAX_RETRY) {
                await wait(this.MAX_TIME);
                return this.GetDeliverySlots(body, retry + 1).then(res0 => resolve(res0)).catch(res1 => reject(res1))
              } else {
                reject({ msg: `Error while retrieving delivery slots --payload: ${JSON.stringify(body)} --err: ${stringify(err)}` })
              }
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  public async ReserveSlot(body: ReserveSlotPayload, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.setAuthentication()
        .then(() => {
          this.http.post(`${this.ReserveSlot_Endpoint}`, body, this.options)
            .then((res: any) => resolve(res))
            .catch(async (err: any) => {
              if (retry < this.MAX_RETRY) {
                await wait(this.MAX_TIME);
                return this.ReserveSlot(body, retry + 1).then(res0 => resolve(res0)).catch(res1 => reject(res1))
              } else {
                reject({ msg: `Error while reserving a delivery slot --payload: ${JSON.stringify(body)} --err: ${stringify(err)}` })
              }
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  public async CancelSlot(body: CancelSlotPayload, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.setAuthentication()
        .then(() => {
          this.http.post(`${this.CancelSlot_Endpoint}`, body, this.options)
            .then((res: any) => resolve(res))
            .catch(async (err: any) => {
              if (retry < this.MAX_RETRY) {
                await wait(this.MAX_TIME);
                return this.CancelSlot(body, retry + 1).then(res0 => resolve(res0)).catch(res1 => reject(res1))
              } else {
                reject({ msg: `Error while deleting a delivery slot --payload: ${JSON.stringify(body)} -err: ${stringify(err)}` })
              }
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
