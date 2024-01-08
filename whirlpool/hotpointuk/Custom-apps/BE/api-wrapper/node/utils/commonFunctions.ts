import { defaultCookie } from "./constants"

export const GetLoggedUserEmail = async (ctx: Context) => {
  let loggedUser = await ctx.clients.AuthUser.GetLoggedUser(ctx.vtex.storeUserAuthToken || ctx.cookies.get(`${defaultCookie}_${ctx.vtex.account}`))
  return loggedUser?.user
}
