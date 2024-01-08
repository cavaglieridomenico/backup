import { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { ClientRequest } from 'http';
import logMessage from '../utils/loggingUtils';
import { pfxPathProduction, pfxPathQuality } from '../utils/whrAuth';

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

export default class UpdateCrmUserAddress extends ExternalClient
{
  productionMode : string | undefined
  createConsumerUrl : string | undefined
  password : string | undefined

  constructor(context: IOContext, options?: InstanceOptions)
  { super('', context, options) }

  vtexDateToCRMDate(vtexDate: string)
  { return vtexDate.split("T")[0].replace(new RegExp("-", "g"),"") }

  //Creates a user on the CRM.
  public async updateAddress(vtexUserInfo: any, ctx: Context): Promise<string>
  {
    let responseBody = ""
    let gotBody = false

    let street2 = vtexUserInfo['complement']
    //console.log("street2 is "+street2)
    if(street2==undefined || street2==null || street2=="null")
    {
        street2=String.fromCharCode(8206)
    }
    //console.log("street2 is "+street2)

    let state = vtexUserInfo['state']
    if(state==undefined || state==null || state=="null")
    {
        state=""
    }
    else
    {
        if(state.length>3)
        { state="" }
    }
    //info mapping specified here: https://docs.google.com/spreadsheets/d/12LlGDSvDCC9mP2iP96Sr4XObVwb0oxndodSIpI-l2dw/edit#gid=0
    //console.log("webId is "+vtexUserInfo['webId'])
    console.log("VTex User Info:"+JSON.stringify(vtexUserInfo))
    console.log("updating user with address on the CRM")

    let newsletterOptIn = 2;
    if(vtexUserInfo['isNewsletterOptIn'] == "true" || vtexUserInfo['isNewsletterOptIn'] == true) { newsletterOptIn = 1 }

    let body

    if(vtexUserInfo['accountName']=="smartcsb2cqa" || vtexUserInfo['accountName']=="smartcsb2c")
    {
        body =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soapenv:Body>' +
                '<n0:ZEsCreaconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">'+
                    '<WebId>'+vtexUserInfo['webId']+'</WebId>'+
                    '<CsAddressData>'+
                        '<HouseNum>'+vtexUserInfo['number']+'</HouseNum>'+ //There's a control on number on the CRM side
                        '<Street1>'+vtexUserInfo['street']+'</Street1>'+
                        '<Street2>'+street2+'</Street2>'+
                        '<Street3/>'+
                        '<City>'+vtexUserInfo['city']+'</City>'+
                        '<District/>'+
                        '<State></State>'+
                        '<Country>'+vtexUserInfo['country']+'</Country>'+
                        '<PostCode>'+vtexUserInfo['postalCode']+'</PostCode>'+
                        '<EmailAddress>'+vtexUserInfo['email']+'</EmailAddress>'+
                    '</CsAddressData>'+
                    '<CsNameData>'+
                        '<TitleKey>'+vtexUserInfo['TitleKey']+'</TitleKey>'+
                        '<FirstName>'+vtexUserInfo['FirstName']+'</FirstName>'+
                        '<MiddleName/>'+
                        '<LastName>'+vtexUserInfo['LastName']+'</LastName>'+
                        '<DateOfBirth>'+vtexUserInfo['DateOfBirth']+'</DateOfBirth>'+
                        '<CorrLanguage>'+vtexUserInfo['CorrLanguage']+'</CorrLanguage>'+
                        '<Contactable/>'+
                        '<CreateDate/>'+
                        '<CreateTime/>'+
                        '<LastChangeDate/>'+
                        '<LastChangeTime/>'+
                        '<Vip/>'+
                    '</CsNameData>'+
                    '<CtMktAttrib>'+
                        '<item>'+
                            '<AttSet>EU_CONSUMER_BRAND</AttSet>'+
                            '<AttName>EU_CONSUMER_SPARE_PARTS</AttName>'+
                            '<AttValue>'+newsletterOptIn+'</AttValue>'+
                        '</item>'+
                    '</CtMktAttrib>'+
                    '<WebChgDate/>'+
                    '<WebChgTime/>'+
                    '<WebCrtDate/>'+
                    '<WebCrtTime/>'+
                '</n0:ZEsCreaconMyacc>'+
            '</soapenv:Body>' +
        '</soapenv:Envelope>';
    }

    ctx.vtex.logger.info(logMessage("sending the following data to CRM:\n"+body))
    console.log("sending the following data to CRM:\n"+body)

    let https = require('https')
    let fs  = require('fs')

    let url = this.createConsumerUrl

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
