import { AuthenticationError } from "@vtex/api"
import { testCredentials } from "../utils/constants"
import { HandleTestRequest } from "./TestRequestHandler"
import { CustomLogger } from "../utils/Logger"
import { GetHash } from "../utils/AuthenticationUtils"
import { configs } from "../typings/configs"

export async function CheckCredentials(ctx: Context, next: () => Promise<any>) {

  if (ctx.get("X-VTEX-API-Is-TestSuite")) {
    let key = ctx.get('X-VTEX-API-AppKey')
    let token = GetHash(ctx.get('X-VTEX-API-AppToken'))
    if (token != testCredentials[key]) {
      throw new AuthenticationError("Credentials are not valid")
    }
    await HandleTestRequest(ctx);
  }
  else {
    let logger = new CustomLogger(ctx)
    const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
    let key = ctx.get('X-VTEX-API-AppKey')
    let token = GetHash(ctx.get('X-VTEX-API-AppToken'))
    if (key != appSettings.vtexAppKey || token != appSettings.vtexAppToken) {
      logger.error("Request blocked: invalid credentials")
      throw new AuthenticationError("Credentials are not valid")
    }
    ctx.state.appSettings = appSettings
    await next()
  }
}
