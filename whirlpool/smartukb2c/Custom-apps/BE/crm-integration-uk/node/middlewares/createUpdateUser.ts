import { json } from 'co-body'
import logMessage from '../utils/loggingUtils'
import { CustomLogger } from "../utils/Logger";

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

/**
 * This middleware is called once the service gets a request on the updateUser route.
The request's source is vtex's masterdata, and the request is triggered by the updation of a record in the CL data entity.
You must setup the trigger via vtex's crm masterdata page to send an HTTP POST Request to the update user route of this service.
The trigger must send ALL information regarding the updated client.
@param ctx the application context
*/
export async function createUpdateUser(ctx: Context, next: () => Promise<any>)
{
  const
  {
    clients:
    {
      pingCrm: pingCrm,
      createUpdateCrmUser: createUpdateCrmUser,
      updateVtexUser: updateVtexUser
    }
  } = ctx

  ctx.vtex.logger = new CustomLogger(ctx)

  let appSettings = await ctx.clients.apps.getAppSettings(""+process.env.VTEX_APP_ID)
  ctx.vtex.logger.info(logMessage("-------------------CREATE UPDATE USER-------------------------"))
  pingCrm.productionMode = appSettings['productionMode']
  pingCrm.pingEndpoint = appSettings['pingUrl']
  pingCrm.password = appSettings['crmPassword']
  createUpdateCrmUser.productionMode = appSettings['productionMode']
  createUpdateCrmUser.createConsumerEndpoint = appSettings['createConsumerUrl']
  createUpdateCrmUser.password = appSettings['crmPassword']
  updateVtexUser.appKey = appSettings['vtexAppKey']
  updateVtexUser.appToken = appSettings['vtexAppToken']

  console.log("App Settings: " + JSON.stringify(appSettings))

  let requestBody = await json(ctx.req)

  //Ensures requests to this endpoint are processed in series instead of in parallel
  let isBeingProcessed = createUpdateCrmUser.memoryCache?.get(requestBody['email'])
  if(isBeingProcessed==undefined || isBeingProcessed==null)
  {
    createUpdateCrmUser.memoryCache?.set(requestBody['email'], true)
  }
  else if(isBeingProcessed==true)
  {
    while(createUpdateCrmUser.memoryCache?.get(requestBody['email'])==true)
    { await wait(4000) }
  }

  createUpdateCrmUser.memoryCache?.set(requestBody['email'], true)

  try //Block 1
  {
    console.log("CREATING/UPDATING USER"/*+JSON.stringify(requestBody)*/)

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
      try //Block 2
      {
        //Ping was successful and you can update the user.

        //Reading request
        ctx.vtex.logger.info(logMessage("vtex user info received:\n"+JSON.stringify(requestBody, null, "\t")))
        let account = requestBody['accountName'] as string
        //console.log("got "+account+" as account name")
        if(account === "smartukb2cqa" || account === "smartukb2c")
        {
          account = 'B2CCH_'
          if (requestBody['localeDefault'] === undefined || requestBody['localeDefault'] === null || requestBody['localeDefault'].toString().toLowerCase() === 'null') {
            requestBody['localeDefault'] = 'en-GB'
          } else {
            if (!requestBody['localeDefault'].toString().toUpperCase().includes('-GB')) {
              requestBody['localeDefault'] = requestBody['localeDefault'].toString().concat('-GB')
            }
          }
        }
        else
        { throw new Error("account name doesn't match the app's registered account names.") }

        let crmResponse;
        let newVtexUser = false
        //If the crmBpId is null, it means the user was created but hasn't yet been synced with the CRM because either the CRM was down or
        //there was an error. In this case you should create the user on the CRM and set the returned values on vtex.
        if(requestBody['crmBpId']==="") //Create the user
        {
          try //Block 3
          {
            newVtexUser = true
            //Generates a webId
            const shortUuid = require('short-uuid');
            let webId = account + shortUuid.generate().substring(0,14)
            requestBody['webId'] = webId
          }
          catch(error){ console.log("error in block 3. "+error) }
        }

        try //Block 4
        {
          ctx.vtex.logger.info(logMessage("creating/updating user on the CRM"))
          crmResponse = await createUpdateCrmUser.createUpdateUser(requestBody, ctx)
          crmResponse = parser.parse(crmResponse)
          let items = crmResponse['soap-env:Envelope']['soap-env:Body']['n0:ZEsCreaconMyaccResponse']['EtReturn']['item']

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

          ctx.vtex.logger.info("crmBpId is "+requestBody['crmBpId'])
          console.log("crmBpId is "+requestBody['crmBpId'])
          if(newVtexUser)
          {
            try
            {
              ctx.vtex.logger.info(logMessage("updating user on vtex"))
              let vtexResponse = await updateVtexUser.updateUser(requestBody, ctx)
              console.log(vtexResponse)
            }
            catch(error){ console.log("error in block 5. "+error) }
          }
        }
        catch(error){ console.log("error in block 4. "+error) }
      }
      catch(error) { console.log("error in block 2. "+error) }
    }
  }
  catch(error)
  {
    console.log("error in block 1. "+error)
    ctx.response.status = 503
    ctx.response.body =
    { error: "CRM service unavailable" }
  }

  ctx.vtex.logger.info(logMessage("--------------------------------------------------------------"))
  createUpdateCrmUser.memoryCache?.set(requestBody['email'], false)
  await next()
}
