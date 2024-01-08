import { json } from "co-body"

export async function CreateUser(ctx: Context, next: () => Promise<any>) {

  let body = await json(ctx.req)

  try {

    //if campaign: check max char length of campaign and upperCase the value
    if( body.campaign ){  
      body.campaign = body.campaign.toUpperCase()     
      if(body.campaign.length > 30) {   
        ctx.vtex.logger.error(`User ${body.email} - Error field campaign more then 30 chars: ${body.campaign}`)             
        body.campaign = undefined
      }         
    }  
    
    body.isProfilingOptIn = body.isNewsletterOptIn ? body.isProfilingOptIn : false //profile optin can be true if optin is true only

    let res = await ctx.clients.masterdata.createDocument({
      dataEntity: "CL",
      fields: body
    })
    ctx.body = res
    ctx.status = 200
  } catch (err) {
    //ctx.vtex.logger.error("Error creating user")
    ctx.vtex.logger.error(JSON.stringify(err.response.data.Message));
    ctx.body = err.response.data
    ctx.status = 500
  }

  await next()
}
