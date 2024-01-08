import { AuthenticationError, ForbiddenError } from "@vtex/api"
import { credentials } from "./constants"

export function Authentication(ctx: Context) {
  let apiKey = ctx.get('X-VTEX-API-AppKey')
  let apiToken = ctx.get('X-VTEX-API-AppToken')

  if (!apiKey || !apiToken) {
    ctx.vtex.logger.warn(" - Authentication error, missing credentials")
    throw new AuthenticationError("Missing credentials")
  }

  if (apiKey != credentials[ctx.vtex.account]["X-VTEX-API-AppKey"] || apiToken != credentials[ctx.vtex.account]["X-VTEX-API-AppToken"]) {
    ctx.vtex.logger.warn(" - Authentication error, invalid credentials")
    throw new ForbiddenError("Invalid credentials")
  }
}
