
import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { IOResponse } from '@vtex/api';
import { maxRetry, maxWaitTime } from '../utils/constants';
import { isValid, wait } from '../utils/functions';

export default class AuthUser extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    options!.headers = { ...options?.headers, ...{ VtexIdclientAutCookie: context.authToken } }
    super(context, options);
  }

  public async startLogin(payload: any): Promise<IOResponse<any>> {
    this.options!.headers!["Content-Type"] = "multipart/form-data; boundary=" + payload._boundary;
    return this.http.postRaw("/api/vtexid/pub/authentication/startlogin", payload, this.options);
  }

  public async sendEmail(payload: any, cookie: string[]): Promise<IOResponse<any>> {
    this.options!.headers!["Content-Type"] = "multipart/form-data; boundary=" + payload._boundary;
    this.options!.headers!["Cookie"] = cookie.join(";");
    return this.http.postRaw("/api/vtexid/pub/authentication/accesskey/send", payload, this.options);
  }

  public async setPassword(payload: any, cookie: string): Promise<IOResponse<any>> {
    this.options!.headers!["Content-Type"] = "multipart/form-data; boundary=" + payload._boundary;
    this.options!.headers!["Cookie"] = cookie;
    return this.http.postRaw("/api/vtexid/pub/authentication/classic/setpassword", payload, this.options);
  }

  public async validateCredentials(payload: any, cookie: string[]): Promise<IOResponse<any>> {
    this.options!.headers!["Content-Type"] = "multipart/form-data; boundary=" + payload._boundary;
    this.options!.headers!["Cookie"] = cookie.join(";");
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.http.postRaw("/api/vtexid/pub/authentication/classic/validate", payload, this.options)
        .then((res: any) => {
          if (res.data.authStatus?.toLowerCase() == "wrongcredentials" || !isValid(res.data.userId) || !isValid(res.data.authCookie) || res.data.expiresIn == 0) {
            reject({ code: 401, msg: "Invalid Credentials" });
          } else {
            resolve(res);
          }
        })
        .catch(err => reject(err))
    })
  }

  public async getSession(cookie: string[], retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      this.options!.headers!["Content-Type"] = "application/json";
      this.options!.headers!["Cookie"] = cookie.join(";");
      this.http.getRaw("/api/sessions?items=*", this.options)
        .then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.getSession(cookie, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        })
    })
  }

  public async authorizeVIPSessionCookies(sessionToken: string|undefined, accessCode: string): Promise<IOResponse<any>> {
    this.options!.headers!["Content-Type"] = "application/json";
    const body = {
      "public": {
        "accessCode": {
          "value": accessCode
        }
      }
    }
    // If there is a valid sessionToken, then it can be updated with the infos about the VIP user
    // Otherwise, a new sessionToken needs to be generated
    if(isValid(sessionToken)) {
      return this.updateVIPSession(sessionToken!, body);
    } else {
      return this.createVIPSession(body);
    }
  }

  async createVIPSession(body: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      // Ref: https://developers.vtex.com/vtex-rest-api/reference/editsession
      this.http.patch("/api/sessions", body, this.options)
        .then( (res: any) => {resolve({data: res, headers: {}, status: 201})})
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.createVIPSession(body, retry + 1)
              .then(res0 => resolve({data: res0, headers: {}, status: 201}))
              .catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        });
    });
  }

  async updateVIPSession(sessionToken: string, body: any, retry: number = 0): Promise<IOResponse<any>> {
    return new Promise<IOResponse<any>>((resolve, reject) => {
      // Ref: https://help.vtex.com/tutorial/vtex-session-sessions-system-overview--6C4Edou6bYqqEAOCAg2MQQ
      this.http.postRaw("/api/sessions/"+sessionToken, body, this.options)
        .then( res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.updateVIPSession(sessionToken, body, retry + 1)
              .then(res0 => resolve(res0))
              .catch(err0 => reject(err0));
          } else {
            reject(err);
          }
        });
    });
  }

}
