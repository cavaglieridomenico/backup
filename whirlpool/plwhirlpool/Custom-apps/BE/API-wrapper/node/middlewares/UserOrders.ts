//@ts-nocheck

import { defaultCookie } from "../utils/constants"

export async function UserOrders(ctx: Context, next: () => Promise<any>) {

  const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  let loggedUser = await ctx.clients.AuthUser.GetLoggedUser(ctx.cookies.get(appSettings.authcookie ? appSettings.authcookie : defaultCookie))
  //ctx.vtex.logger.info("user: " + loggedUser)
  if (loggedUser != null && loggedUser != undefined) {
    let orders = await ctx.clients.vtexAPI.GetUserOrders(loggedUser?.user)
    ctx.set("Cache-Control", "no-store")
    ctx.body = orders?.list
  } else {
    ctx.body = "not logged in"
  }
  ctx.status = 200
  await next()
}
