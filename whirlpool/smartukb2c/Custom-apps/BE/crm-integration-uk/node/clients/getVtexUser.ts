import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export default class GetVtexUser extends JanusClient
{
    appKey: string | undefined
    appToken: string | undefined

    constructor(context: IOContext, options?: InstanceOptions)
    { super(context, options) }

    //Please switch to production mode when needed.
    public async getUser(vtexAddressInfo: any) : Promise<string>
    {
        let account = vtexAddressInfo['accountName'] as string

        let url = 'https://'+account+'.vtexcommercestable.com.br/api/dataentities/CL/search?_fields=_all&id='+vtexAddressInfo['userId']
        let headers =
        {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-VTEX-API-AppKey": this.appKey,
            "X-VTEX-API-AppToken": this.appToken,
            "REST-Range": "resources=0-1000"
        }

        return this.http.get
        (
            url,
            { headers: headers }
        )
    }
}