import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";

export default class ApiConfig extends ExternalClient {

    constructor(context: IOContext, options?: InstanceOptions) {
        super("https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com", context, {
            ...options,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
    }

    // OAUTH API -> get token
    // https://mcw785xyskn2jrl9kbr-hjtx1w88.auth.marketingcloudapis.com/v2/token
    public async getToken(input: {}) {
        const url: string = JSON.parse(`${process.env.TEST}`).endpointAUTH;
        return this.http.post(url, input);
    }

    // INSERT PRODUCT DETAILS API -> send order details
    // https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com/hub/v1/dataevents/key:SomeKey/rowset
    public async productDetails(orders: any, key: string, token: string) {
        //@ts-ignore
        this.options?.headers = { ...this.options?.headers, ...{ "Authorization": "Bearer " + token } }
        const url: string = (JSON.parse(`${process.env.TEST}`).endpointPRODUCT).replace("<SomeKey>", key);
        return this.http.post(url, orders, this.options);
    }

    // JOURNEY API -> send email
    // https://mcw785xyskn2jrl9kbr-hjtx1w88.rest.marketingcloudapis.com/interaction/v1/events
    public async sendEmail(message: object, token: string) {
        //@ts-ignore
        this.options?.headers = { ...this.options?.headers, ...{ "Authorization": "Bearer " + token } }
        const url: string = JSON.parse(`${process.env.TEST}`).endpointEMAIL;
        return this.http.post(url, message, this.options);
    }
}
