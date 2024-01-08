import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { ClientRequest } from "http";
import { pfxPathProduction, pfxPathQuality } from "../utils/whrAuth";

async function wait(timeout: number)
{
    return new Promise<void>(
        (resolve) => 
        {
            setTimeout(()=>
            {
                resolve()
            }, timeout)
        })
}

export default class GetCrmUser extends ExternalClient
{
    productionMode : string | undefined
    displayEndpoint : string | undefined
    password : string | undefined

    constructor(context: IOContext, options?: InstanceOptions)
    { 
        super('', context, options) 
    }

    public async getUser(crmBpId: string) : Promise<string>
    {
        let responseBody = ""
        let gotBody = false

        let body = 
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope ' + 
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soapenv:Body>' +
                '<n0:ZEsDispconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">'+
                    '<CrmBpId>'+crmBpId+'</CrmBpId>'+
                    '<Date/>'+
                '</n0:ZEsDispconMyacc>'+
            '</soapenv:Body>' +
        '</soapenv:Envelope>';

        let https = require('https')
        let fs  = require('fs')
    
        let url = this.displayEndpoint

        let options = 
        {
            method: 'POST',
            headers:
            {
                "Content-Type": "text/xml",
                "Accept": "text/xml"
            },
            pfx: (this.productionMode=="true") ? fs.readFileSync(pfxPathProduction) : fs.readFileSync(pfxPathQuality),
            passphrase: this.password
        }
    
        const req = await https.request
        (
            url,
            options,
            (response: ClientRequest) => 
            {
                let dataQueue = "";
                response.on("data", function (d: string) { dataQueue += d; });
                console.log(dataQueue)
                response.on("end", () => {responseBody = dataQueue; gotBody=true;})
            }
        )

        req.write(body)
        req.end();

        while(gotBody==false) { await wait(50) }
        return responseBody
    }
}