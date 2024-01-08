import { json } from 'co-body'
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

/*This middleware is called once the service gets a request on the updateUser route.
The request's source is vtex's masterdata, and the request is triggered by the updation of a record in the CL data entity.
You must setup the trigger via vtex's crm masterdata page to send an HTTP POST Request to the update user route of this service.
The trigger must send ALL information regarding the updated client.*/
export async function CreateNewsletterUser(ctx: Context, next: () => Promise<any>) 
{
  const 
  {
    clients:  { NewsletterClient }
  } = ctx

  ctx.vtex.logger = new CustomLogger(ctx)

  let appSettings = await ctx.clients.apps.getAppSettings(""+process.env.VTEX_APP_ID)
  // ctx.vtex.logger.info(logMessage("-------------------CREATE UPDATE USER-------------------------"))
 
  NewsletterClient.productionMode = appSettings['productionMode']
  NewsletterClient.createConsumerEndpoint = appSettings['createConsumerUrl']
  NewsletterClient.password = appSettings['newsletterPfxPassword']
  // updateVtexUser.appKey = appSettings['vtexAppKey']
  // updateVtexUser.appToken = appSettings['vtexAppToken']

  let requestBody = await json(ctx.req)

  //Ensures requests to this endpoint are processed in series instead of in parallel
  let isBeingProcessed = NewsletterClient.memoryCache?.get(requestBody['email'])
  if(isBeingProcessed==undefined || isBeingProcessed==null)
  {
    NewsletterClient.memoryCache?.set(requestBody['email'], true)
  }
  else if(isBeingProcessed==true)
  {
    while(NewsletterClient.memoryCache?.get(requestBody['email'])==true)
    { await wait(4000) }
  }

  NewsletterClient.memoryCache?.set(requestBody['email'], true)

    //Reading request
    // ctx.vtex.logger.info(logMessage("vtex user info received:\n"+JSON.stringify(requestBody, null, "\t")))

    let crmResponse;

    try //Block 4
    {
      // ctx.vtex.logger.info(logMessage("creating/updating user on the CRM"))
      crmResponse = await NewsletterClient.createUpdateUser(requestBody, ctx)
      let responseObj = JSON.parse(crmResponse);

      if (responseObj.MT_CosumerRegistration_Response.MessageType == 'S') {
        ctx.status= 200;
        ctx.body = {
          result : 'OK',
          message : responseObj.MT_CosumerRegistration_Response.MessageDescription
        }
      } else {
        ctx.status= 400;
        ctx.body = {
          result : 'KO',
          message : responseObj.MT_CosumerRegistration_Response.MessageDescription
        }
      }
    }
    catch(error){ 
      console.log("error in block 4: "+ error + "\n"+error.stack) 
    
      ctx.status= 400;
      ctx.body = {
        result : 'OK',
        message : error
      }
    }

  // ctx.vtex.logger.info(logMessage("--------------------------------------------------------------"))
  NewsletterClient.memoryCache?.set(requestBody['email'], false)

  
    await next()
}
