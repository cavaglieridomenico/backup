import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export default class getVtexAddresses extends JanusClient
{
    appKey: string | undefined
    appToken: string | undefined

    constructor(context: IOContext, options?: InstanceOptions)
    { super(context, options) }

    //Please switch to production mode when needed.
    public async getAddresses(vtexUserInfo: any) : Promise<string>
    {
        //console.log("got accountName "+vtexUserInfo['accountName'])

        let account = vtexUserInfo['accountName'] as string
        let url
        let headers
        
        url = 'https://'+account+'.vtexcommercestable.com.br/api/dataentities/AD/search?userId='+vtexUserInfo['id']+'&_fields=_all'

        headers =
        {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-VTEX-API-AppKey": this.appKey,
            "X-VTEX-API-AppToken": this.appToken
        }

        return this.http.get
        (
            url,
            {
                headers: headers
            }
        )
    }
}