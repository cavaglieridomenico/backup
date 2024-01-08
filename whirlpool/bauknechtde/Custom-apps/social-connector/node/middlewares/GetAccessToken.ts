import { AuthenticationError } from "@vtex/api"
import { json } from "co-body"
import { configs } from "../typings/configs"
import { RedirectUriPath, TokenTTL } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"
import { GetEntry, UpdateEntry } from "../utils/Storage"

export async function GetAccessToken(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store')
  ctx.vtex.logger = new CustomLogger(ctx)
  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
  let payload: any = {}
  try {
    payload = await json(ctx.req)
    ctx.vtex.logger.info(payload)
  } catch (err) {
    ctx.vtex.logger.error("[GetAccessToken] - Failed to read request body")
    ctx.vtex.logger.debug(err)
  }

  if (payload.client_id != appSettings.VtexClientID || payload.client_secret != appSettings.VtexClientSecret) {
    ctx.vtex.logger.warn("[GetAccessToken] - Invalid credentials")
    throw new AuthenticationError("Invalid credentials")
  }

  if (payload.code) {
    let storedData = await GetEntry(ctx, payload.code, "normalizedauthcode").catch(() => null)

    if (storedData) {
      const socialSettings = appSettings.Socials.find(social => social.socialName.toLowerCase() == storedData.social.toLowerCase())
      if (socialSettings) {
        await ctx.clients.Social.GetAccessToken(socialSettings.socialAccessTokenEndpoint,
          socialSettings.socialAccessTokenMethod,
          socialSettings.socialClientId, socialSettings.socialClientSecret,
          appSettings.SiteUrl + RedirectUriPath, storedData.authcode).then(res => {
            ctx.body = {
              accessToken: res.access_token,
              expires_in: res.expires_in || TokenTTL
            }
            ctx.status = 200
          }, err => {
            ctx.vtex.logger.error("[GetAccessToken] - AccessToken request ended with an error")
            ctx.vtex.logger.debug(err?.response?.data || err?.response || err)
            ctx.status = 500
            ctx.body = "Unexpected error"
          })

        if (ctx.status == 200) {
          storedData.accesstoken = ctx.body.accessToken
          storedData.tokenExpiration = new Date(Date.now() + (ctx.body.expires_in * 1000)).toISOString()
          await UpdateEntry(ctx, ctx.body.accessToken, storedData).catch(err => {
            ctx.vtex.logger.error(err)
            ctx.status = 500
            ctx.body = "Error saving data"
          })
        }
      } else {
        ctx.vtex.logger.warn("[GetAccessToken] - received request with social: " + storedData.social)
        ctx.status = 400
        ctx.body = `${storedData.social} is not supported`
      }
    } else {
      ctx.vtex.logger.warn("[GetAccessToken] - failed to retrieve data")
      ctx.status = 500
      ctx.body = "Error retrieving data"
    }

  } else {
    ctx.vtex.logger.warn("[GetAccessToken] - received request withouth 'code' parameter")
    ctx.status = 400
    ctx.body = "'code' parameter missing or has invalid value."
  }

  await next()
}

