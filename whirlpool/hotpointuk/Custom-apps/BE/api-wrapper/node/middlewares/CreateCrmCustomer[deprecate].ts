//@ts-nocheck

import { json } from 'co-body'
import { Order } from '../typings/order'
import { CLRecord } from '../typings/types'
import { maxRetry } from '../utils/constants'
import {CustomLogger} from '../utils/customLogger'
import { searchDocuments } from '../utils/mdCRUD'
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
export async function CreateCrmCustomer(ctx: Context|NewOrder, next: () => Promise<any>)
{
  const
  {
    clients:  { CrmClient }
  } = ctx

  ctx.vtex.logger = new CustomLogger(ctx)

  let appSettings = await ctx.clients.apps.getAppSettings(""+process.env.VTEX_APP_ID)
  // ctx.vtex.logger.info(logMessage("-------------------CREATE UPDATE USER-------------------------"))

  CrmClient.productionMode = appSettings['productionMode']
  CrmClient.createConsumerEndpoint = appSettings['createConsumerUrl']
  CrmClient.password = appSettings['pfxPassword']

  let event = (ctx.vtex?.route?.id=="createUpdateCrmUser") ? false : true;
  let order: Order = undefined;
  let customer: CLRecord = undefined;
  if(event){
    order = await ctx.clients.vtexAPI.GetOrder(ctx.body.orderId);
    customer = (await searchDocuments(ctx, "CL", ["id", "email", "firstName", "lastName", "crmBpId", "isNewsletterOptIn","isProfilingOptIn"], "userId="+order.clientProfileData.userProfileId, {page: 1, pageSize: 10}, true))[0];
  }
  let requestBody = !event ? await json(ctx.req) : customer;
  requestBody = event ? requestBody : {
    ...requestBody,
    ...(await searchDocuments(ctx, "CL", ["id", "crmBpId"], "email="+requestBody.email, {page: 1, pageSize: 10}, true, true))[0]
  }

  //Ensures requests to this endpoint are processed in series instead of in parallel
  let isBeingProcessed = CrmClient.memoryCache?.get(requestBody['email'])
  if(isBeingProcessed==undefined || isBeingProcessed==null)
  {
    CrmClient.memoryCache?.set(requestBody['email'], true)
  }
  else if(isBeingProcessed==true)
  {
    while(CrmClient.memoryCache?.get(requestBody['email'])==true)
    { await wait(4000) }
  }

  CrmClient.memoryCache?.set(requestBody['email'], true)

    //Reading request
    // ctx.vtex.logger.info(logMessage("vtex user info received:\n"+JSON.stringify(requestBody, null, "\t")))

    let crmResponse;

    let newVtexUser = requestBody['crmBpId']==="";

    try //Block 4
    {     
      crmResponse = await CrmClient.createUpdateUser(requestBody, ctx)
      let responseObj = JSON.parse(crmResponse);

      if (newVtexUser) {
          console.log("TODO: add bpId info to the masterData")
      }

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
    CrmClient.memoryCache?.set(requestBody['email'], false)


    await next()
}
