import { APP, AuthenticationError } from "@vtex/api"
import { createHash } from "crypto"
import { AppSettings } from "../typings/config"
import { AuthHeaders } from "../utils/constants"

export async function Authentication(ctx: Context, next: () => Promise<any>) {
  const appSettings: AppSettings = await ctx.clients.apps.getAppSettings(APP.ID)
  if (!CheckApiCredentials(ctx, appSettings) && !await CheckAdminRole(ctx)) {
    throw new AuthenticationError('invalid credentials')
  }
  ctx.state.appSettings = appSettings
  await next()
}

const GetHash = (input: string) => createHash("sha256").update(input).digest("hex");

const CheckApiCredentials = (ctx: Context, settings: AppSettings) => ctx.get(AuthHeaders.APPKEY) == settings.o2p?.appkey && GetHash(ctx.get(AuthHeaders.APPTOKEN)) == settings.o2p?.apptoken

const CheckAdminRole = async (ctx: Context) => ctx.vtex.adminUserAuthToken && await ctx.clients.licenseManager.canAccessResource(ctx.vtex.adminUserAuthToken, 'ADMIN_DS')
