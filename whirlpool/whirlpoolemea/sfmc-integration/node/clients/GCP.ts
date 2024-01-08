import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { GoogleAuth, JWT } from "google-auth-library";
import { AES256Decode } from "../utils/cryptography";
import { GCPSettings } from "../typings/config";
import { maxRetries, maxTime } from "../utils/constants";
import { stringify, wait } from "../utils/functions";

export default class GCP extends ExternalClient {

  private gcpAuth: GoogleAuth
  private gcpClient: JWT | undefined
  private targetAudience: string

  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: GCPSettings = JSON.parse(process.env[`${context.account}-GCP`]!);
    super(appSettings.gcpHost!, context, {
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
        private_key: AES256Decode(appSettings.gcpPrivateKey!)
      }
    });
    this.targetAudience = appSettings.gcpTargetAudience!;
  }

  public async triggerProductComparison(data: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        this.gcpClient = await this.getGCPClient();
        let accessToken = await this.getGCPAuthToken();
        await this.productComparison(data, accessToken);
        resolve({ message: `GCP notification sent --data: ${JSON.stringify(data)}`, status: 200 });
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
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getGCPClient(retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `GCP - get client failed --details: ${stringify(err)}`, status: 500 })
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
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.getGCPAuthToken(retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `GCP - get token failed --details: ${stringify(err)}`, status: 500 })
          }
        })
    });
  }

  private async productComparison(data: any, token: string, retry: number = 0): Promise<any> {
    this.options!.headers = { ...this.options?.headers, ...{ "Authorization": "Bearer " + token } };
    return new Promise<any>((resolve, reject) => {
      this.http.post("/product-comparison/sfmc/upload-product-comparison-data", data, this.options)
        .then(res => {
          resolve(res);
        })
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.productComparison(data, token, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `GCP - notification failed --details: ${stringify(err)}`, status: 500 })
          }
        })
    });
  }
}





