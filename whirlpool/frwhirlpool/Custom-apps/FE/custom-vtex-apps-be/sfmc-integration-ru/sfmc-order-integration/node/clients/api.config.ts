import {ExternalClient, InstanceOptions, IOContext, IOResponse} from "@vtex/api";


export default class ApiConfig extends ExternalClient {

    constructor(baseURL: string, context: IOContext, options: InstanceOptions) {
        // if (options == undefined)
        //     options = {};
        // options.headers = {
        //     'Content-Type': 'application/json;charset=UTF-8',
        // };
        console.log(options);
        super(baseURL, context, options);
    }


    public async getToken(tokenCredentials: {}): Promise<IOResponse<string>> {
        return this.http.post <Promise<IOResponse<string>>>('https://mcw785xyskn2jrl9kbr-hjtx1w88.auth.marketingcloudapis.com/v2/token', tokenCredentials);
    }

    public async sendEmail( message: {}, key: string): Promise<IOResponse<string>> {
        return this.http.post <Promise<IOResponse<string>>>(`https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com/messaging/v1/messageDefinitionSends/key:${key}/send`, message);
    }

    public async passedParam( orders: any, key:string): Promise<IOResponse<string>> {
               return this.http.post <Promise<IOResponse<string>>>(`https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com/hub/v1/dataevents/key:${key}/rowset`, orders);
    }
    public async passedProductBack(product: any,key:string): Promise<IOResponse<string>> {
        return this.http.post <Promise<IOResponse<string>>>(`https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com/messaging/v1/messageDefinitionSends/key:${key}/send`, product);
    }
}

