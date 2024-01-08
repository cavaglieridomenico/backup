//@ts-nocheck
//@ts-ignore

import {ExternalClient, InstanceOptions, IOContext, IOResponse} from "@vtex/api";

export default class ApiConfig extends ExternalClient {

    constructor(context: IOContext, options?: InstanceOptions) {
        super("https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com", context, {
          ...options,
          headers:{
            "Accept": "*/*",
            "Content-Type": "application/json;charset=UTF-8"
          }
        });
    }

    /**
     * getToken
     * @param tokenCredentials 
     * @returns 
     */
    public async getToken(tokenCredentials: {}): Promise<IOResponse<string>> {
        return this.http.post <Promise<IOResponse<string>>>(JSON.parse(process.env.TEST+"").endpointAUTH, tokenCredentials);
    }

    public async sendEmail(message: {}, key: string, accessToken: string): Promise<IOResponse<string>> {
        this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+accessToken}};
        return this.http.post <Promise<IOResponse<string>>>((JSON.parse(process.env.TEST+"").endpointMESSAGE).replace("<key2>",key) , message, this.options);
    }

    public async passedParam(orders: any, key: string, accessToken: string): Promise<IOResponse<string>> {
        this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+accessToken}};
        return this.http.post <Promise<IOResponse<string>>>((JSON.parse(process.env.TEST+"").endpointHUB).replace("<key1>",key) , orders, this.options);
    }

    public async passedProductBack(product: any, key: string, accessToken: string): Promise<IOResponse<string>> {
        this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+accessToken}};
        return this.http.post <Promise<IOResponse<string>>>((JSON.parse(process.env.TEST+"").endpointMESSAGE).replace("<key2>",key)  , product, this.options);
    }

    /**
     * refundOrder
     * @param product product's informations mapping to Salesforce
     * @param key keyRefund
     * @param accessToken obtained by Salesforce
     * @returns 
     */
    public async refundOrder(product: {}, key: string, accessToken: string): Promise<IOResponse<string>> {
        this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+accessToken}};
        return this.http.post <Promise<IOResponse<string>>>((JSON.parse(process.env.TEST+"").endpointMESSAGE).replace("<key2>",key) , product, this.options);
    }

    //new for backInStock
  public async getTokenV2({ endpointAUTH, granttype, clientid, clientsecret }: AppSettings): Promise<TokenResponse> {
    const tokenCredentials: TokenCredentials = {
      grant_type: granttype,
      client_id: clientid,
      client_secret: clientsecret
    }
    return this.http.post(endpointAUTH, tokenCredentials);
  }

  public async SendMessage({ endpointMESSAGE }: AppSettings, payload: any, key: string, accessToken: string): Promise<MessageResponseBody> {    
    console.log(JSON.stringify(payload));
    return this.http.post(endpointMESSAGE.replace("<key2>", key), payload, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
  }

}

