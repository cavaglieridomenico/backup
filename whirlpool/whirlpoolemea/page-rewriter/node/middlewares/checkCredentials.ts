import { AuthenticationError } from "@vtex/api"
import * as crypto from 'crypto'
import { AppSettings } from "../typings/configs";

export async function checkCredentials(ctx: Context, next: () => Promise<any>) {
  let apiKey = ctx.get('X-VTEX-API-AppKey')
  let apiToken = ctx.get('X-VTEX-API-AppToken')

  const appSettings: AppSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);

  let apiKeyHash = GetHash(apiKey);
  let apiTokenHash = GetHash(apiToken);

  if (!apiKey || !apiToken) {
    throw new AuthenticationError("Missing credentials")
  } else if (apiKeyHash != appSettings.appKey || apiTokenHash != appSettings.appToken) {
    throw new AuthenticationError("Invalid credentials")
  } else {
    await next();
  }
}

const GetHash = (input: string): string => {
  return crypto.createHash("sha256").update(input).digest("hex");
}
