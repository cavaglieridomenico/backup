import { AuthenticationError, ForbiddenError } from "@vtex/api"
import * as crypto from 'crypto'
import { Settings } from "../typings/configs";

export async function Authentication(ctx: Context) {
  let apiKey = ctx.get('X-VTEX-API-AppKey')
  let apiToken = ctx.get('X-VTEX-API-AppToken')
  const appSettings: Settings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  if (!apiKey || !apiToken) {
    ctx.vtex.logger.warn("[Discontinued Products] Authentication error, missing credentials")
    throw new AuthenticationError("Missing credentials")
  }
  if (GetHash(apiKey) != appSettings.gcpappkey || GetHash(apiToken) != appSettings.gcpapptoken) {
    ctx.vtex.logger.warn("[Discontinued Products] Authentication error, invalid credentials")
    throw new ForbiddenError("Invalid credentials")
  }
}

const GetHash = (input: string): string => {
  return crypto.createHash("sha256").update(input).digest("hex");
}
