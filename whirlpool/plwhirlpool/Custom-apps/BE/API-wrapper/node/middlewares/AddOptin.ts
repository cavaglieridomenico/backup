//@ts-nocheck

import { defaultCookie } from "../utils/constants"

export async function AddOptin(ctx: Context, next: () => Promise<any>) {

  const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  let loggedUser = await ctx.clients.AuthUser.GetLoggedUser(ctx.cookies.get(appSettings.authcookie ? appSettings.authcookie : defaultCookie))
  //console.log(loggedUser)
  let user = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: "CL",
    fields: ['id'],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `userId=${loggedUser?.userId}`
  })

  //console.log(user)


  if (user.length > 0) {
    let fields: { [index: string]: boolean } = {
      isNewsletterOptIn: true
    }
    await ctx.clients.masterdata.updatePartialDocument({
      dataEntity: "CL",
      id: user[0]?.id,
      fields: fields
    })
    ctx.status = 200
  }
  else{
    ctx.status = 401
  }

  await next()
}
