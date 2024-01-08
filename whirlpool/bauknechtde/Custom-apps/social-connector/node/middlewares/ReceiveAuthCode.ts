import { CustomLogger } from "../utils/Logger"
import crypto from "crypto"
import { GetEntry, UpdateEntry } from "../utils/Storage"

export async function ReceiveAuthCode(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store')
  ctx.vtex.logger = new CustomLogger(ctx)

  if (ctx.query.state !== undefined) {
    // Generate a standard 64 char long auth code
    let storedData = await GetEntry(ctx, ctx.query.state, 'vtexstate').catch(() => null)
    if (storedData) {
      if (ctx.query.code) {
        const stdCode = createAuthCode(ctx.query.code)
        storedData.authcode = ctx.query.code
        storedData.normalizedauthcode = stdCode
        await UpdateEntry(ctx, stdCode, storedData).then(() => {
          const redirectUrl = storedData.redirecturi +
            "?code=" + stdCode +
            "&state=" + ctx.query.state
          ctx.redirect(redirectUrl)
        }, err => {
          ctx.vtex.logger.error("[ReceiveAuthCode] - Failed to store data")
          ctx.vtex.logger.debug(err)
          ctx.status = 500
          ctx.body = "Error updating data"
        })
      } else {
        const redirectUrl = storedData.redirecturi +
          "?error=" + ctx.query.error +
          "&state=" + ctx.query.state
        ctx.redirect(redirectUrl)
      }

    } else {
      ctx.vtex.logger.warn("[ReceiveAuthCode] - failed to retrieve data")
      ctx.status = 500
      ctx.body = "Cannot retrieve data"
    }
  } else {
    ctx.vtex.logger.warn("[ReceiveAuthCode] - received request without 'state' parameter")
    ctx.status = 400
    ctx.body = "'state' parameter missing or has invalid value."
  }
  await next()
}


const createAuthCode = (code: string) => {
  return code.length == 64 ? code : crypto.createHash("sha256").update(code).digest("hex")
}

