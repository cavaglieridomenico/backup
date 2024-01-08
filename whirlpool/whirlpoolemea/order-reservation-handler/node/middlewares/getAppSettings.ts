

import { APP } from "@vtex/api";

export async function getAppSettings(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.appSettings = await ctx.clients.apps.getAppSettings(APP.ID)
    await next();
  } catch (err) {
    ctx.vtex.logger.error("Error in getAppSettings()")
    ctx.vtex.logger.debug(err)
  }
}

