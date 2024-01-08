import { AuthenticationError, ForbiddenError } from "@vtex/api"
import * as crypto from 'crypto';
import { configs } from "../typings/configs";

export async function Authentication(ctx: Context) {
  let appKey = ctx.get('X-VTEX-API-AppKey')
  let appToken = ctx.get('X-VTEX-API-AppToken')

  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  if (!appKey || !appToken) {
    ctx.vtex.logger.warn(" - Authentication error, missing credentials")
    throw new AuthenticationError("Missing credentials")
  }

  if (GetHash(appKey) != appSettings.gcpappkey || GetHash(appToken) != appSettings.gcpapptoken) {
    ctx.vtex.logger.warn(" - Authentication error, invalid credentials")
    throw new ForbiddenError("Invalid credentials")
  }
}

const GetHash = (input: string): string => {
  return crypto.createHash("sha256").update(input).digest("hex");
}
