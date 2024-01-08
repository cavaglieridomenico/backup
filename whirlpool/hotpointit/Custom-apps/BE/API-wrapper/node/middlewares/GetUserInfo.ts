import { defaultCookie } from "../utils/constants"

export async function GetUserInfo(ctx: Context, next: () => Promise<any>) {

  const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  let loggedUser = await ctx.clients.AuthUser.GetLoggedUser(ctx.cookies.get(appSettings.authcookie ? appSettings.authcookie : defaultCookie))

  if (loggedUser?.userId) {
    ctx.body = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "CL",
      fields: ['id', 'isNewsletterOptIn', 'gender'],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `userId=${loggedUser.userId}`
    })
  } else {
    ctx.body = []
  }
  ctx.set("Cache-Control", "no-store")
  ctx.status = 200
  await next()
}

export async function GetUserInfoByEmail(ctx: Context, next: () => Promise<any>) {

  try {
    ctx.body = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "CL",
      fields: ['email', 'isNewsletterOptIn'],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `email=${ctx.query.email}`
    })
  }
  catch (err) {
    console.log(err)
    ctx.body = []
  }
  ctx.set("Cache-Control", "no-store")
  ctx.status = 200
  await next()
}
