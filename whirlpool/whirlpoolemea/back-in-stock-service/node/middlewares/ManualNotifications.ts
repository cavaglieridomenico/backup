import { json } from "co-body"
import { SFMC_EVENT } from "../utils/constants"

export async function ManualNotifications(ctx: Context, next: () => Promise<any>) {
  const payload = await json(ctx.req)
  await ctx.clients.events.sendEvent(`${ctx.vtex.account}.sfmc-integration`, SFMC_EVENT, payload)
  ctx.status = 200
  await next()
}
