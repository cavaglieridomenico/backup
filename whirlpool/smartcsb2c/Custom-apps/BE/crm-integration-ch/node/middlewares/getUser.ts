export async function getUser(ctx: Context, next: () => Promise<any>) 
{
  const 
  {
    clients: 
    { 
      getCrmUser: getCrmUser
    },
  } = ctx

  //Reads request parameters.
  let queryParams = ctx.querystring.split('&')

  let appSettings = await ctx.clients.apps.getAppSettings(""+process.env.VTEX_APP_ID)
  getCrmUser.productionMode = appSettings['productionMode']
  getCrmUser.displayEndpoint = appSettings['displayConsumerUrl']
  getCrmUser.password = appSettings['crmPassword']
 
  try //Block 1
  {
     //Parses the request parameters.
    let crmBpId
    for(let i=0; i<queryParams.length; i++)
    {
        if(queryParams[i].includes("crmBpId"))
        { crmBpId = queryParams[i].split('=')[1] }
    }

    if(crmBpId==undefined)
    { throw new Error("crmBpId parameter missing.") }

    try //Block 2
    {
        //Makes the request
        let crmResponse = await getCrmUser.getUser(crmBpId)

        try //Block 3
        {
            //Parses the response
            let parser = require('fast-xml-parser')
            crmResponse = parser.parse(crmResponse)

            //Responds with a 200 OK, forwarding the body of the response from the CRM.
            ctx.response.status = 200
            ctx.response.body = (crmResponse as any)['soap-env:Envelope']['soap-env:Body']
        }
        catch(error){ console.log("error in block 3. "+error) }
    }
    catch(error){ console.log("error in block 2. "+error) }
  }
  catch(error)
  {
    console.log("error in block 1. "+error)
    ctx.response.status = 400
    ctx.response.body = 
    {
      error: error.message
    }
  }

  await next()
}