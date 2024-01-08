import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { pfxPathProduction, pfxPathQuality } from "../utils/whrAuth"
import { ClientRequest } from "http";

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

export default class PingCrm extends ExternalClient
{
    productionMode : string | undefined
    pingEndpoint : string = ""
    password : string | undefined

    constructor(context: IOContext, options?: InstanceOptions)
    { super('', context, options) }

    //Pings the quality version. Please switch to production mode when needed.
    public async pingCrm()
    {
        let responseBody = ""
        let gotBody = false

        //According to the docs, this must always be the request body for the Z_ES_PINGCRM endpoint
        const body =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soapenv:Body>' +
                '<n0:ZEsPingCrm xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">'+
                    '<IsCountry>GB</IsCountry>'+
                    '<IsLanguage>EN</IsLanguage>'+
                    '<IsSource>MYAC</IsSource>'+
                '</n0:ZEsPingCrm>'+
            '</soapenv:Body>' +
        '</soapenv:Envelope>';

        let https = require('https')
        let fs  = require('fs')

        let url = this.pingEndpoint

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
        console.log("response body: "+responseBody)
        return responseBody
    }
}
