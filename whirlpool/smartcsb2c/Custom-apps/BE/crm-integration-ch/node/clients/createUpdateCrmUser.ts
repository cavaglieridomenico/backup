import { CacheLayer, InstanceOptions, IOContext } from '@vtex/api'
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

export default class CreateUpdateCrmUser extends ExternalClient
{
  memoryCache? : CacheLayer<string, any> | undefined
  productionMode: string | undefined
  createConsumerEndpoint: string | undefined
  password : string | undefined

  constructor(context: IOContext, options?: InstanceOptions)
  {
    super('', context, options)
    this.memoryCache = options && options?.memoryCache
  }

  vtexDateToCRMDate(vtexDate: string)
  { return vtexDate.split("T")[0].replace(new RegExp("-", "g"),"") }

  getLanguage(country : string) : string
  {
    if(country==null || country==undefined || country=="null")
    {
        return "EN"
    }
    let lang = country.split("-")[0]
    return lang.toUpperCase()
  }

  //Creates or updates a user on the CRM.
  public async createUpdateUser(vtexUserInfo: any, ctx: Context): Promise<string>
  {
    let responseBody = ""
    let gotBody = false

    //info mapping specified here: https://docs.google.com/spreadsheets/d/12LlGDSvDCC9mP2iP96Sr4XObVwb0oxndodSIpI-l2dw/edit#gid=0

    //Maps VTEX's gender value to the CRM's title attribute
    let titleKey
    if(vtexUserInfo['gender']==="male")
    { titleKey = '0002' } //Maps to CRM's Mr.
    else if(vtexUserInfo['gender']==="female")
    { titleKey = '0001' } //Maps to CRM's Ms.
    else { titleKey = '' }

    //Assigns values to firstName and lastName as they cannot be empty. They are required fields on the WHR CRM (but optional on VTEX).
    if(vtexUserInfo['firstName']==""
    || vtexUserInfo['firstName']=="Null"
    || vtexUserInfo['firstName']=="null"
    || vtexUserInfo['firstName']==null
    || vtexUserInfo['firstName']==undefined)
    { vtexUserInfo['firstName']= String.fromCharCode(8206) }

    if(vtexUserInfo['lastName']==""
    || vtexUserInfo['lastName']=="Null"
    || vtexUserInfo['lastName']=="null"
    || vtexUserInfo['lastName']==null
    || vtexUserInfo['lastName']==undefined)
    { vtexUserInfo['lastName']= String.fromCharCode(8206) }

    //Mapping VTEX's isNewsLetterOptIn value to the CRM's marketing attribute's value.
    let newsletterOptIn = 2;
    if(vtexUserInfo['isNewsletterOptIn'] == "true" || vtexUserInfo['isNewsletterOptIn'] == true) { newsletterOptIn = 1 }

    //console.log("language is "+vtexUserInfo['localeDefault'])
    let language = this.getLanguage(vtexUserInfo['localeDefault'])
    if(language==undefined || language==null)
    {
        console.log("WARNING: could not find a language. Using EN as default.")
        language="EN"
    }

    vtexUserInfo['localeDefault'] = vtexUserInfo['localeDefault'].split("-")[1]

    console.log("updating/creating user on the CRM")

    let body;

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
                        '<HouseNum/>'+
                        '<Street1/>'+
                        '<Street2/>'+
                        '<Street3/>'+
                        '<City/>'+
                        '<District/>'+
                        '<State/>'+
                        '<Country>'+vtexUserInfo['localeDefault']+'</Country>'+
                        '<PostCode/>'+
                        '<EmailAddress>'+vtexUserInfo['email']+'</EmailAddress>'+
                        '<HousePhone>'+vtexUserInfo['homePhone']+'</HousePhone>'+
                        '<WorkPhone>'+vtexUserInfo['businessPhone']+'</WorkPhone>'+
                        '<MobilePhone>'+vtexUserInfo['phone']+'</MobilePhone>'+
                    '</CsAddressData>'+
                    '<CsNameData>'+
                        '<TitleKey>'+titleKey+'</TitleKey>'+
                        '<FirstName>'+vtexUserInfo['firstName']+'</FirstName>'+
                        '<MiddleName/>'+
                        '<LastName>'+vtexUserInfo['lastName']+'</LastName>'+
                        '<DateOfBirth>'+this.vtexDateToCRMDate(vtexUserInfo['birthDate'])+'</DateOfBirth>'+
                        '<CorrLanguage>'+language+'</CorrLanguage>'+
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
    else
    { throw new Error("error: could not match accountName with any of the accountNames in the app's settings") }

    ctx.vtex.logger.info(logMessage("sending the following data to CRM:\n"+body))
    console.log("sending the following data to CRM:\n"+body)

    let https = require('https')
    let fs  = require('fs')

    let url = this.createConsumerEndpoint

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
