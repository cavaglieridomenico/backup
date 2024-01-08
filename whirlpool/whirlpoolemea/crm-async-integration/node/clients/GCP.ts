import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { GoogleAuth, JWT } from "google-auth-library";
import { AES256Decode } from "../utils/cryptography";
import { stringify, wait } from "../utils/commons";
import { GCPPayload, GCPSettings } from "../typings/GCP";
import { maxRetry, maxWaitTime } from "../utils/constants";

export default class GCP extends ExternalClient {

  private gcpAuth: GoogleAuth
  private gcpClient: JWT | undefined
  private targetAudience: string
  private brand: any
  private country: any

  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: GCPSettings = JSON.parse(process.env[`${context.account}-GCP`]!);
    super(appSettings.gcpHost, context, {
      ...options,
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "X-VTEX-Use-Https": "true"
      },
    });
    this.gcpAuth = new GoogleAuth({
      projectId: appSettings.gcpProjectId,
      credentials: {
        client_email: appSettings.gcpClientEmail,
        private_key: AES256Decode(appSettings.gcpPrivateKey)
      }
    });
    this.targetAudience = appSettings.gcpTargetAudience;
    this.brand = appSettings.gcpBrand;
    this.country = appSettings.gcpCountry;
  }

  public async sendNotification(data: GCPPayload): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        this.brand ? data.brand = this.brand : null;
        this.country ? data.country = this.country : null;
        this.gcpClient = await this.getGCPClient();
        let accessToken = await this.getGCPAuthToken();
        await this.notify(data, accessToken);        
        resolve(true);
      } catch (err) {
        reject(err);
      }
    })
  }

  private async getGCPClient(retry: number = 0): Promise<JWT> {
    return new Promise<JWT>((resolve, reject) => {
      this.gcpAuth.getClient()
        .then((res: any) => {
          resolve(res);
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getGCPClient(retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `GCP - get client failed --details: ${stringify(err)}` })
          }
        })
    });
  }

  private async getGCPAuthToken(retry: number = 0): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.gcpClient!.fetchIdToken(this.targetAudience)
        .then((res: string) => {
          resolve(res);
        })
        .catch(async (err: any) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getGCPAuthToken(retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `GCP - get token failed --details: ${stringify(err)}` })
          }
        })
    });
  }

  private async notify(data: GCPPayload, token: string, retry: number = 0): Promise<any> {
    this.options!.headers = { ...this.options?.headers, ...{ "Authorization": "Bearer " + token } };
    return new Promise<any>((resolve, reject) => {
      this.http.post("/trigger_flow", data, this.options)
        .then(res => {
          resolve(res);
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.notify(data, token, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `GCP - notification failed --details: ${stringify(err)}` })
          }
        })
    });
  }
}

