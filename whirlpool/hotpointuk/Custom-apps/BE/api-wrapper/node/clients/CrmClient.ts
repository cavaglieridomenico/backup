import { CacheLayer, InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { ClientRequest } from 'http';
import { pfxPathProduction, pfxPathQuality } from '../utils/whrAuth';
import { defaultCrmCreateUpdateCustomerRequestBody } from '../utils/constants'
import { CreateUpdateCrmCustomerRequestType, MarketingTableItem } from "../typings/CreateUpdateCrmCustomerRequestType";
import logMessage from '../utils/loggingUtils';
import { isValid } from '../utils/functions';

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
  productionMode: boolean | undefined
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

      if(isValid(vtexUserInfo["campaign"])){
        bodyObj.MarketingTable.push({
          AttributeSet: "EU_SOURCE_CAMPAIGN",
          AttributeName: "HOTPOINT_SOURCE_CAMPAIGN",
          AttributeValue: vtexUserInfo["campaign"]
        })
      }

      // INTRODUCED WITH SAP HANA MIGRATION //

      bodyObj.MarketingTable.push({
        AttributeSet: "COMUNIC_BRAND",
        AttributeName: "COMUNIC_BRAND_SCH",
        AttributeValue: crmOptinValue
      })

      bodyObj.MarketingTable.push({
        AttributeSet: "COMUNIC_BRAND",
        AttributeName: "COMUNIC_BRAND_IND",
        AttributeValue: crmOptinValue
      })

      bodyObj.MarketingTable.push({
        AttributeSet: "COMUNIC_BRAND",
        AttributeName: "COMUNIC_BRAND_WHP",
        AttributeValue: crmOptinValue
      })

      bodyObj.MarketingTable.push({
        AttributeSet: "COMUNIC_BRAND",
        AttributeName: "COMUNIC_BRAND_KIA",
        AttributeValue: crmOptinValue
      })

      bodyObj.MarketingTable.push({
        AttributeSet: "CONSUMER_PRIVACY",
        AttributeName: "SAP_0000010899",
        AttributeValue: crmOptinValue
      })

      bodyObj.MarketingTable.push({
        AttributeSet: "CONSUMER_PRIVACY",
        AttributeName: "LEGIT_INTEREST",
        AttributeValue: crmOptinValue
      })

      // ------------------------------------ //

      console.log("updating/creating user on the CRM")

      let body = JSON.stringify(bodyObj);

      ctx.vtex.logger.info(logMessage("sending the following data to CRM:\n" + body));
      console.log("sending the following data to CRM:\n" + body)

      let https = require('https')
      let fs = require('fs')

      let options =
        {
          method: 'POST',
          headers:
            {
              "Content-Type": "application/json",
              "Accept": "*/*"
            },
          pfx: (this.productionMode == true) ? fs.readFileSync(pfxPathProduction) : fs.readFileSync(pfxPathQuality),
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

        if (typeof vtexUserInfo['crmBpId'] === 'undefined' || vtexUserInfo['crmBpId'] === undefined || vtexUserInfo['crmBpId'] === null || vtexUserInfo['crmBpId'] === "") {
          if(vtexUserInfo['id']!=undefined){
            ctx.clients.masterdata.updatePartialDocument({
              dataEntity: "CL",
              id: vtexUserInfo['id'],
              fields: {
                "crmBpId": crmBpId.toString()
              }
            })
          }
        }
      }

      console.log("response from CRM was :\n" + responseBody);
      ctx.vtex.logger.info(logMessage("received response from CRM:\n" + responseBody))

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
}
