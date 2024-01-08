import { AuthenticationError } from "@vtex/api"
import { configs } from "../typings/configs"
import { CustomLogger } from "../utils/Logger"
import { ValidateForwardedNotification, ValidateWorldpayNotification } from "../utils/notification"

export async function NotificationProxy(ctx: Context, next: () => Promise<any>) {
  let logger = new CustomLogger(ctx)
  ctx.vtex.logger = logger

  let appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  if (ValidateForwardedNotification(ctx, appSettings) || await ValidateWorldpayNotification(ctx.ip).catch(() => false)) {
    ctx.state.appSettings = appSettings
    next()
  } else {
    throw new AuthenticationError("Invalid credentials")
  }

  ctx.status = 200
  ctx.body = "[OK]"
}
