import { createHash } from 'crypto'
export const getLoggedUserEmail = async (ctx: Context) => {
  let loggedUser = ctx.vtex.storeUserAuthToken ? await ctx.clients.vtex.GetLoggedUser(ctx.vtex.storeUserAuthToken) : null
  return loggedUser?.user
}

export const convertToMillis = (time: number, unit: 'seconds' | 'minutes' | 'hours' | 'days') => {
  switch (unit) {
    case 'days':
      time *= 24
    case 'hours':
      time *= 60
    case 'minutes':
      time *= 60
    case 'seconds':
      time *= 1000
  }
  return time
}

export const getCacheKey = (...args: (string | number)[]) => {
  return createHash("sha256").update(args.join('_')).digest("hex")
}
