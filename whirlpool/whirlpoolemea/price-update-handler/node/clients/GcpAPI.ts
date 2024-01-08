
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { GoogleAuth, JWT } from "google-auth-library";
import { GCPPayload } from "../typings/interface";
// import { AES256Decode } from "../utils/auth";
import { maxWaitTime, maxRetry } from "../utils/constants";
import { wait } from "../utils/functions";

export default class GCP extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
    });
  }


  public async sendPriceToGCPClient(body: GCPPayload, token: string) {
    return this.http.post("https://cross-vtex-price-propagation-6bpqblei5a-ew.a.run.app", body, { // qa -> https://cross-vtex-price-propagation-akdisufsqa-ey.a.run.app
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export async function getGCPClient(gcpAuth: GoogleAuth, retry: number = 0): Promise<any> {
  return new Promise<JWT | Object>((resolve, reject) => {
    gcpAuth.getClient()
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return getGCPClient(gcpAuth, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: "gcp - get client failed -- details: " + (err.response?.data ? JSON.stringify(err.response.data) : JSON.stringify(err)), status: err.response?.status ? err.response.status : 500, ignore: false })
        }
      })
  });
}

export async function getGCPAuthToken(ctx: any, gcpClient: JWT, retry: number = 0): Promise<any> {
  return new Promise<string | Object>((resolve, reject) => {
    gcpClient.fetchIdToken(ctx.state.appSettings.target)
      .then(res => {
        resolve(res);
      })
      .catch(async (err) => {
        if (retry < maxRetry) {
          await wait(maxWaitTime);
          return getGCPAuthToken(ctx, gcpClient, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: "gcp - get token failed -- details: " + (err.response?.data ? JSON.stringify(err.response.data) : JSON.stringify(err)), status: err.response?.status ? err.response.status : 500, ignore: false })
        }
      })
  });
}

