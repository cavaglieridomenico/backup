//@ts-nocheck

import { json } from "co-body"
import { defaultCookie } from "../utils/constants"
import crypto from 'crypto'

export async function UpdateUser(ctx: Context, next: () => Promise<any>) {

  const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  let loggedUser = await ctx.clients.AuthUser.GetLoggedUser(ctx.cookies.get(appSettings.authcookie ? appSettings.authcookie : defaultCookie))
  let user = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: "CL",
    fields: ['id', 'email'],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `userId=${loggedUser?.userId}`
  })

  //console.log(user)

  let reqbody = await json(ctx.req)


  if (user.length > 0) {
    if(ctx.query.userId && ctx.query.userId == "true") {
      reqbody.userId = crypto.createHash("md5").update(user[0].email).digest("hex")
    }

    //check max char length of campaign and upperCase the value
    if( reqbody.campaign ){  
      reqbody.campaign = reqbody.campaign.toUpperCase()     
      if(reqbody.campaign.length > 30) {   
        ctx.vtex.logger.error(`User ${reqbody.email} - Error field campaign more then 30 chars: ${reqbody.campaign}`)             
        reqbody.campaign = undefined
      }         
    }

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
