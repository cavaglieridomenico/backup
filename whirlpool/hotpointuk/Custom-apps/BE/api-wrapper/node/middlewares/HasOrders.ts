import { GetLoggedUserEmail } from "../utils/commonFunctions"

export async function HasOrders(ctx: Context, next: () => Promise<any>) {
  const loggedUser = await GetLoggedUserEmail(ctx)
  if (loggedUser != undefined) {
    let orders = await ctx.clients.vtexAPI.GetUserOrders(loggedUser)
    ctx.set("Cache-Control", "no-store")
    ctx.body = orders?.list?.length > 0
  } else {
    ctx.body = "false"
  }
  ctx.status = 200
  await next()
}
