//@ts-nocheck

import {ExternalClient, InstanceOptions, IOContext, IOResponse} from "@vtex/api";


export default class SfmcAPI extends ExternalClient {

    constructor(context: IOContext, options: InstanceOptions) {
        super("https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com", context, {
          ...options,
          headers:{
            "Accept": "*/*",
            "Content-Type": "application/json;charset=UTF-8"
          }
        });
    }

    public async getAccessToken(tokenCredentials: Object): Promise<IOResponse<any>> {
        return this.http.post("https://mcw785xyskn2jrl9kbr-hjtx1w88.auth.marketingcloudapis.com/v2/token", tokenCredentials, this.options);
    }

    public async sendOrderDetails(orders: any, key: string, accessToken: string): Promise<IOResponse<any>> {
      this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+accessToken}};
      return this.http.post("/hub/v1/dataevents/key:"+key+"/rowset", orders, this.options);
    }

    public async triggerEmail(message: Object, key: string, accessToken: string): Promise<IOResponse<any>> {
      this.options?.headers = {...this.options?.headers,...{"Authorization": "Bearer "+accessToken}};
      return this.http.post("/messaging/v1/messageDefinitionSends/key:"+key+"/send", message, this.options);
    }
}

