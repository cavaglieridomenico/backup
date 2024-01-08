//@ts-nocheck
import { defaultCookie } from "./constants"
import { createHash } from 'crypto'
export const GetLoggedUserEmail = async (ctx: Context) => {
	let loggedUser = await ctx.clients.AuthUser.GetLoggedUser(ctx.vtex.storeUserAuthToken || ctx.cookies.get(`${defaultCookie}_${ctx.vtex.account}`))
	return loggedUser?.user
}

export const getCacheKey = (...args: (string | number)[]) =>
	createHash("sha256").update(args.join('_')).digest("hex")

