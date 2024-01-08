//@ts-nocheck

import { json } from "co-body"
import { GetLoggedUserEmail } from "../utils/commonFunctions"

export async function UpdateUser(ctx: Context, next: () => Promise<any>) {
  const loggedUser = await GetLoggedUserEmail(ctx)
  const user = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: "CL",
    fields: ['id'],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `email=${loggedUser}`
  })

  //console.log(user)

  let reqbody = await json(ctx.req)

  if (user.length > 0) {

    //check max char length of campaign and upperCase the value
    if( reqbody.campaign ){  
      reqbody.campaign = body.reqbody.toUpperCase()     
      if(reqbody.campaign.length > 30) {   
        ctx.vtex.logger.error(`User ${reqbody.email} - Error field campaign more then 30 chars: ${reqbody.campaign}`)             
        reqbody.campaign = undefined
      }         
    }

    reqbody.isProfilingOptIn = reqbody.isNewsletterOptIn ? reqbody.isProfilingOptIn : false //profile optin can be true if optin is true only

    await ctx.clients.masterdata.updatePartialDocument({
      dataEntity: "CL",
      id: user[0]?.id,
      fields: reqbody
    })

    ctx.status = 200
  } else {
    ctx.status = 401
  }
  await next()
}
