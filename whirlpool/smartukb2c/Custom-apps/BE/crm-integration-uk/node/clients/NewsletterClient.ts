import { CacheLayer, InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { ClientRequest } from 'http';
import { newsletterPfxPathQuality, newsletterPfxPathProduction } from '../utils/whrAuth';
import { defaultCrmCreateUpdateCustomerRequestBody } from '../utils/constants'
import { CreateUpdateCrmCustomerRequestType, MarketingTableItem } from "../typings/CreateUpdateCrmCustomerRequestType";
import logMessage from '../utils/loggingUtils';

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

export default class NewsletterClient extends ExternalClient
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

    console.log("VtexUserInfo: " + JSON.stringify(vtexUserInfo))

    //info mapping specified here: https://docs.google.com/presentation/d/1ys82GSCdZ0CcE__oa-ZUjMiRnXJu30uJq3bwsVqA1CY/edit#slide=id.ge1e3a910cd_0_0

    //Assigns values to firstName and lastName as they cannot be empty. They are required fields on the WHR CRM (but optional on VTEX).
    vtexUserInfo['firstName'] = this.defaultToCrmNullValue(vtexUserInfo['firstName']);
    vtexUserInfo['lastName'] = this.defaultToCrmNullValue(vtexUserInfo['lastName']);

    if (vtexUserInfo['firstName'] !== String.fromCharCode(8206) && vtexUserInfo['lastName'] !== String.fromCharCode(8206)) {

      console.log("sent crmBpId is " + vtexUserInfo['crmBpId'])
      let bodyObj: CreateUpdateCrmCustomerRequestType = this.buildRequestBody(vtexUserInfo);

      console.log("updating/creating user on the CRM")
      let body = JSON.stringify(bodyObj);

      ctx.vtex.logger.info(logMessage("sending the following data to CRM:\n" + body));
      console.log("sending the following data to CRM:\n" + body)

      let https = require('https')
      let fs = require('fs')
      
      console.log("pfx: " + (this.productionMode == 'true') ? (newsletterPfxPathProduction) : (newsletterPfxPathQuality));
      console.log("password: " + this.password);
      
      let options =
        {
          method: 'POST',
          headers:
            {
              "Content-Type": "text/xml",
              "Accept": "text/xml"
            },
          pfx: (this.productionMode == 'true') ? fs.readFileSync(newsletterPfxPathProduction) : fs.readFileSync(newsletterPfxPathQuality),
          passphrase: this.password
        }

      const req = await https.request
      (
        this.createConsumerEndpoint,
        options,
        (response: ClientRequest) => {
          let dataQueue = "";
          response.on("data", function (d: string) {
            dataQueue += d;
          });
          console.log(dataQueue)
          response.on("end", () => {
            responseBody = dataQueue;
            gotBody = true;
          })
        }
      )

      req.write(JSON.stringify(bodyObj))
      req.end();

      while (gotBody == false) {
        await wait(50)
      }

      if (responseBody !== undefined && JSON.parse(responseBody).MT_CosumerRegistration_Response !== undefined && JSON.parse(responseBody).MT_CosumerRegistration_Response.BP_ID !== undefined) {

        const crmBpId = JSON.parse(responseBody).MT_CosumerRegistration_Response.BP_ID


        if (
            (vtexUserInfo.hasOwnProperty('id')) && 
            (typeof vtexUserInfo['crmBpId'] === 'undefined' || vtexUserInfo['crmBpId'] === undefined || vtexUserInfo['crmBpId'] === null || vtexUserInfo['crmBpId'] === "")
            
          ) {
          ctx.clients.masterdata.updatePartialDocument({
            dataEntity: "CL",
            id: vtexUserInfo['id'],
            fields: {
              "crmBpId": crmBpId.toString()
            }
          })
        }
      }

      console.log("response from CRM was :\n" + responseBody);
      
    }

    return responseBody;
  }

  getCrmOptinValue(vtexUserInfo:any) : string {
    let newsletterOptIn = "N";
    if(vtexUserInfo['isNewsletterOptIn'] == "true" || vtexUserInfo['isNewsletterOptIn'] == true) {
        newsletterOptIn = "Y"
    }
    return newsletterOptIn;
  }

  defaultToCrmNullValue(fieldValue : string) : string {
    if(fieldValue==""  || fieldValue=="Null"  ||fieldValue=="null" ||fieldValue==null || fieldValue==undefined) {
        fieldValue= String.fromCharCode(8206)
    }
    return fieldValue;
  }

  buildRequestBody(vtexUserInfo: any) : CreateUpdateCrmCustomerRequestType {

    let bodyObj: CreateUpdateCrmCustomerRequestType = JSON.parse(JSON.stringify(defaultCrmCreateUpdateCustomerRequestBody));

    if (typeof vtexUserInfo['crmBpId'] !== 'undefined' || vtexUserInfo['crmBpId'] !== undefined || vtexUserInfo['crmBpId'] !== null || vtexUserInfo['crmBpId'] !== "") {
      bodyObj.BP_ID = vtexUserInfo['crmBpId'];
    }

    bodyObj.Email = vtexUserInfo['email'];

    bodyObj.Name = vtexUserInfo['firstName'];
    bodyObj.Surname = vtexUserInfo['lastName'];

    let crmOptinValue = this.getCrmOptinValue(vtexUserInfo);


    let comunicHot: MarketingTableItem = {
      AttributeSet: 'COMUNIC_BRAND',
      AttributeName: 'COMUNIC_BRAND_HOT',
      AttributeValue: crmOptinValue
    };
    let comunicEmail: MarketingTableItem = {
      AttributeSet: 'COMUNIC_BRAND',
      AttributeName: 'COMUNIC_EMAIL',
      AttributeValue: crmOptinValue
    };
    let comunicPhone: MarketingTableItem = {
      AttributeSet: 'COMUNIC_BRAND',
      AttributeName: 'COMUNIC_PHONE',
      AttributeValue: crmOptinValue
    };
    let comunicSms: MarketingTableItem = {
      AttributeSet: 'COMUNIC_BRAND',
      AttributeName: 'COMUNIC_SMS',
      AttributeValue: crmOptinValue
    };
    let comunicPostal: MarketingTableItem = {
      AttributeSet: 'COMUNIC_BRAND',
      AttributeName: 'COMUNIC_POSTAL',
      AttributeValue: crmOptinValue
    };

    bodyObj.MarketingTable = [];
    bodyObj.MarketingTable.push(comunicHot);
    bodyObj.MarketingTable.push(comunicEmail);
    bodyObj.MarketingTable.push(comunicPhone);
    bodyObj.MarketingTable.push(comunicSms);
    bodyObj.MarketingTable.push(comunicPostal);

    return bodyObj;
  }
}
