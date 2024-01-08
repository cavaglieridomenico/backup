import { json } from 'co-body'
import logMessage from '../utils/loggingUtils'

async function wait(timeout: number) : Promise<void>
{
    return new Promise(
        (resolve) =>
        {
            setTimeout(()=>
            {
                resolve()
            }, timeout)
        })
}

function getLanguage(country : string) : string
{
  if(country==null || country==undefined || country=="null")
  {
    return "EN"
  }
  let lang = country.split("-")[0]
  return lang.toUpperCase()
}

/*This middleware is called once the service gets a request on the updateAddress route.
The request's source is vtex's masterdata, and the request is triggered by the updation of a record in the AD data entity.
You must setup the trigger via vtex's crm masterdata page to send an HTTP POST Request to the update user route of this service.
The trigger must send ALL information regarding the updated address.*/
export async function updateAddress(ctx: Context, next: () => Promise<any>)
{
  const
  {
    clients:
    {
        getVtexUser: getVtexUser,
        getVtexAddresses: getVtexAddresses,
        updateCrmUserAddress: updateCrmUserAddress,
        pingCrm: pingCrm
    }
  } = ctx

  let appSettings = await ctx.clients.apps.getAppSettings(""+process.env.VTEX_APP_ID)
  //console.log(appSettings['productionMode'])
  pingCrm.productionMode = appSettings['productionMode']
  pingCrm.pingEndpoint = appSettings['pingUrl']
  pingCrm.password = appSettings['crmPassword']
  updateCrmUserAddress.productionMode = appSettings['productionMode']
  updateCrmUserAddress.createConsumerUrl = appSettings['createConsumerUrl']
  updateCrmUserAddress.password = appSettings['crmPassword']
  getVtexUser.appKey = appSettings['vtexAppKey']
  getVtexUser.appToken = appSettings['vtexAppToken']
  getVtexAddresses.appKey = appSettings['vtexAppKey']
  getVtexAddresses.appToken = appSettings['vtexAppToken']

  ctx.vtex.logger.info(logMessage("waiting 30 seconds for address update"))
  let requestBody = await json(ctx.req)
  await wait(30000)

  ctx.vtex.logger.info(logMessage("-----------------------UPDATING ADDRESS-----------------------"))
  ctx.vtex.logger.info(logMessage("got vtex address:\n"+JSON.stringify(requestBody, null, "\t")))
  let info =
  {
    id: requestBody['userId'],
    accountName: requestBody['accountName']
  }
  ctx.vtex.logger.info(logMessage("getting all addresses with userId = "+info.id))
  let tmp = JSON.stringify(await getVtexAddresses.getAddresses(info))
  tmp = '{"addresses": '+tmp+'}'
  let addresses = JSON.parse(tmp)

  let vtexInfo =
  {
    userId: requestBody['userId'],
    accountName: requestBody['accountName']
  }

  if(addresses['addresses'][0]!=undefined)
  {
    //Creates a dates array
    let dates = []
    for(let i=0; i<addresses['addresses'].length; i++)
    {
      let date = addresses['addresses'][i]['createdIn']
      //console.log(date)
      dates.push(new Date(date.substring(0,date.length-1)))
    }

    ctx.vtex.logger.info(logMessage("addresses associated to userId "+vtexInfo.userId+" are:\n"+addresses['addresses']))
    //Gets earliest date
    let min = dates[0]
    let minIndex=0
    for(let i=0; i<dates.length; i++)
    {
      if(dates[i]<min)
      {
        min = dates[i]
        minIndex = i
      }
    }

    const {
      convertIso3Code
    } = require("convert-country-codes");

    //Gets vtex user info
    let vtexResponse = await getVtexUser.getUser(vtexInfo)
    ctx.vtex.logger.info(logMessage("getting user linked to oldest address"))
    while(vtexResponse[0]==undefined)
    {
      await wait(1000)
      vtexResponse = await getVtexUser.getUser(vtexInfo)
      console.log("waiting, vtexuserinfo was undefined")
    }

    //Data validation
    if(addresses['addresses'][minIndex]['number']!=null && addresses['addresses'][minIndex]['number']!=undefined && addresses['addresses'][minIndex]['number']!="")
    { addresses['addresses'][minIndex]['number'] = addresses['addresses'][minIndex]['number'].substring(0,10) }
    else { addresses['addresses'][minIndex]['number']="" }

    let dob=""; //Date of birth
    if((vtexResponse[0] as any)['birthDate']!=null && (vtexResponse[0] as any)['birthDate']!=undefined && (vtexResponse[0] as any)['birthDate']!="")
    {
      dob = (vtexResponse[0] as any)['birthDate']?.split("T")[0].replace(new RegExp("-", "g"),"")
    }

    //Assigns values to firstName and lastName as they cannot be empty. They are required fields on the WHR CRM (but optional on VTEX).
    if((vtexResponse[0] as any)['firstName']==""
    || (vtexResponse[0] as any)['firstName']=="Null"
    || (vtexResponse[0] as any)['firstName']=="null"
    || (vtexResponse[0] as any)['firstName']==null
    || (vtexResponse[0] as any)['firstName']==undefined)
    { (vtexResponse[0] as any)['firstName']= String.fromCharCode(8206) }

    if((vtexResponse[0] as any)['lastName']==""
    || (vtexResponse[0] as any)['lastName']=="Null"
    || (vtexResponse[0] as any)['lastName']=="null"
    || (vtexResponse[0] as any)['lastName']==null
    || (vtexResponse[0] as any)['lastName']==undefined)
    { (vtexResponse[0] as any)['lastName']= String.fromCharCode(8206) }

    //Gender mapping
    if((vtexResponse[0] as any)['gender']=="male")
    { (vtexResponse[0] as any)['gender'] = '0002' } //Maps to CRM's Mr.
    else if((vtexResponse[0] as any)['gender']=="female")
    { (vtexResponse[0] as any)['gender'] = '0001' } //Maps to CRM's Ms.
    else { (vtexResponse[0] as any)['gender'] = '' }

    //Language mapping
    let language = getLanguage((vtexResponse[0] as any)['localeDefault'])

    let crmInfo =
    {
      //EsNameData
      FirstName: (vtexResponse[0] as any)['firstName'],
      LastName: (vtexResponse[0] as any)['lastName'],
      TitleKey: (vtexResponse[0] as any)['gender'],
      isNewsletterOptIn: (vtexResponse[0] as any)['isNewsletterOptIn'],
      accountName: (vtexResponse[0] as any)['accountName'],
      DateOfBirth: dob,
      CorrLanguage: language,
      //EsAddressData
      email: (vtexResponse[0] as any)['email'],
      webId: (vtexResponse[0] as any)['webId'],
      number: addresses['addresses'][minIndex]['number'],
      street: addresses['addresses'][minIndex]['street'],
      complement: addresses['addresses'][minIndex]['complement'],
      city: addresses['addresses'][minIndex]['city'],
      state: addresses['addresses'][minIndex]['state'],
      country: convertIso3Code(addresses['addresses'][minIndex]['country'])['iso2'],
      postalCode: addresses['addresses'][minIndex]['postalCode']
    }

    //Pings the CRM
    //console.log("pinging crm web service...")
    let pingRespBody
    pingRespBody = (await pingCrm.pingCrm() as unknown) as string
    let parser = require('fast-xml-parser');
    let jsonResponse
    jsonResponse = parser.parse(pingRespBody)
    if((jsonResponse['soap-env:Envelope']['soap-env:Body']['n0:ZEsPingCrmResponse']['EvResult'] as string).localeCompare("X")!=0)
    { throw new Error("crm service unavailable"); }
    else
    {
      ctx.vtex.logger.info(logMessage("updating address on the CRM"))
      let crmResponse = await updateCrmUserAddress.updateAddress(crmInfo, ctx)
      crmResponse = parser.parse(crmResponse)
      let items = (crmResponse as any)['soap-env:Envelope']['soap-env:Body']['n0:ZEsCreaconMyaccResponse']['EtReturn']['item']
      if(Array.isArray(items))
      {
        for(let i=0; i<items.length; i++)
        {
          if(items[i]['Type'] === "S")
          {
            ctx.vtex.logger.info(logMessage("CRM says: "+items[i]['Message']))
            if(items[i]['Message'] === "Consumer created" || items[i]['Message'] === "Consumer Found")
            {
              requestBody['crmBpId'] = items[i]['MessageV1']
            }
          }
          else if (items[i]['Type'] === "E") { throw new Error(items[i]['Message']) }
        }
      }
      else
      {
        if(items['Type'] === "S")
        {
          if(items['Message'] === "Consumer created" || items['Message'] === "Consumer found")
          {
            requestBody['crmBpId'] = items['MessageV1']
          }
          ctx.vtex.logger.info(logMessage("CRM says: "+items['Message']))
        }
        else if (items['Type'] === "E") { throw new Error(items['Message']) }
      }
      ctx.vtex.logger.info(logMessage("crmBpId is "+requestBody['crmBpId']))
    }
  }
  else
  {
    ctx.vtex.logger.info(logMessage("no addresses found for user "+info.id))

    //Gets vtex user info
    let vtexResponse = await getVtexUser.getUser(vtexInfo)

    while(vtexResponse[0]==undefined)
    {
      await wait(1000)
      vtexResponse = await getVtexUser.getUser(vtexInfo)
      console.log("waiting, vtexuserinfo was undefined")
    }

    let dob=""; //Date of birth
    if((vtexResponse[0] as any)['birthDate']!=null && (vtexResponse[0] as any)['birthDate']!=undefined && (vtexResponse[0] as any)['birthDate']!="")
    {
      dob = (vtexResponse[0] as any)['birthDate']?.split("T")[0].replace(new RegExp("-", "g"),"")
    }

    //Assigns values to firstName and lastName as they cannot be empty. They are required fields on the WHR CRM (but optional on VTEX).
    if((vtexResponse[0] as any)['firstName']==""
    || (vtexResponse[0] as any)['firstName']=="Null"
    || (vtexResponse[0] as any)['firstName']=="null"
    || (vtexResponse[0] as any)['firstName']==null
    || (vtexResponse[0] as any)['firstName']==undefined)
    { (vtexResponse[0] as any)['firstName']= String.fromCharCode(8206) }

    if((vtexResponse[0] as any)['lastName']==""
    || (vtexResponse[0] as any)['lastName']=="Null"
    || (vtexResponse[0] as any)['lastName']=="null"
    || (vtexResponse[0] as any)['lastName']==null
    || (vtexResponse[0] as any)['lastName']==undefined)
    { (vtexResponse[0] as any)['lastName']= String.fromCharCode(8206) }

    //Gender mapping
    if((vtexResponse[0] as any)['gender']=="male")
    { (vtexResponse[0] as any)['gender'] = '0002' } //Maps to CRM's Mr.
    else if((vtexResponse[0] as any)['gender']=="female")
    { (vtexResponse[0] as any)['gender'] = '0001' } //Maps to CRM's Ms.
    else { (vtexResponse[0] as any)['gender'] = '' }

    //Language mapping
    let language = getLanguage((vtexResponse[0] as any)['localeDefault'])
    if(language==undefined || language==null)
    {
      console.log("WARNING: could not find a language. Using EN as default.")
      language="EN"
    }

    //Country mapping
    if((vtexResponse[0] as any)['localeDefault']==null
    || (vtexResponse[0] as any)['localeDefault']=="null"
    || (vtexResponse[0] as any)['localeDefault']=="Null"
    || (vtexResponse[0] as any)['localeDefault']==undefined)
    {
      if((vtexResponse[0] as any)['accountName'] == "smartukb2cqa" || (vtexResponse[0] as any)['accountName'] == "smartukb2c")
      { (vtexResponse[0] as any)['localeDefault']="GB" }
    }

    let crmInfo =
    {
      //EsNameData
      FirstName: (vtexResponse[0] as any)['firstName'],
      LastName: (vtexResponse[0] as any)['lastName'],
      TitleKey: (vtexResponse[0] as any)['gender'],
      isNewsletterOptIn: (vtexResponse[0] as any)['isNewsletterOptIn'],
      accountName: (vtexResponse[0] as any)['accountName'],
      DateOfBirth: dob,
      CorrLanguage: language,
      //EsAddressData
      email: (vtexResponse[0] as any)['email'],
      webId: (vtexResponse[0] as any)['webId'],
      number: String.fromCharCode(8206),
      street: String.fromCharCode(8206),
      complement: String.fromCharCode(8206),
      city: String.fromCharCode(8206),
      state: String.fromCharCode(8206),
      country: (vtexResponse[0] as any)['localeDefault'],
      postalCode: ""
    }

    console.log(JSON.stringify(crmInfo))

    //Pings the CRM
    let pingRespBody
    pingRespBody = (await pingCrm.pingCrm() as unknown) as string
    let parser = require('fast-xml-parser');
    let jsonResponse
    jsonResponse = parser.parse(pingRespBody)
    if((jsonResponse['soap-env:Envelope']['soap-env:Body']['n0:ZEsPingCrmResponse']['EvResult'] as string).localeCompare("X")!=0)
    { throw new Error("crm service unavailable"); }
    else
    {
      ctx.vtex.logger.info(logMessage("updating address on the CRM"))
      let crmResponse = await updateCrmUserAddress.updateAddress(crmInfo, ctx)
      crmResponse = parser.parse(crmResponse)
      console.log("CRM Response: "+JSON.stringify(crmResponse))
      let items = (crmResponse as any)['soap-env:Envelope']['soap-env:Body']['n0:ZEsCreaconMyaccResponse']['EtReturn']['item']
      if(Array.isArray(items))
      {
        for(let i=0; i<items.length; i++)
        {
          if(items[i]['Type'] === "S")
          {
            ctx.vtex.logger.info(logMessage("CRM says: "+items[i]['Message']))
            if(items[i]['Message'] === "Consumer created" || items[i]['Message'] === "Consumer Found")
            {
              requestBody['crmBpId'] = items[i]['MessageV1']
            }
          }
          else if (items[i]['Type'] === "E") { throw new Error(items[i]['Message']) }
        }
      }
      else
      {
        if(items['Type'] === "S")
        {
          if(items['Message'] === "Consumer created" || items['Message'] === "Consumer found")
          {
            requestBody['crmBpId'] = items['MessageV1']
          }
          ctx.vtex.logger.info(logMessage("CRM says: "+items['Message']))
        }
        else if (items['Type'] === "E") { throw new Error(items['Message']) }
      }
      ctx.vtex.logger.info(logMessage("crmBpId is "+requestBody['crmBpId']))
      console.log(logMessage("crmBpId is "+requestBody['crmBpId']))
    }
  }
  ctx.vtex.logger.info(logMessage("--------------------------------------------------------------"))
  await next()
}
