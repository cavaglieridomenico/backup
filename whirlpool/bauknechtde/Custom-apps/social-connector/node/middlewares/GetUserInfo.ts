import { configs } from "../typings/configs"
import { CustomLogger } from "../utils/Logger"
import { GetEntry } from "../utils/Storage"

export async function GetUserInfo(ctx: Context, next: () => Promise<any>) {
  ctx.set('cache-control', 'no-store')
  ctx.vtex.logger = new CustomLogger(ctx)
  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)

  if (ctx.query.access_token !== undefined && ctx.query.access_token !== 'undefined') {
    let storedData = await GetEntry(ctx, ctx.query.access_token, 'accesstoken', `tokenExpiration>${new Date().toISOString()}`).catch(() => null)
    if (storedData) {
      const socialSettings = appSettings.Socials.find(social => social.socialName.toLowerCase() == storedData.social.toLowerCase())
      if (socialSettings) {
        let userData = await ctx.clients.Social.GetUserInfo(socialSettings?.socialUserInfoUrl, ctx.query.access_token, socialSettings.socialUserInfoAuthType).catch(err => {
          ctx.vtex.logger.error("[GetUserInfo] - User info request ended with an error")
          ctx.vtex.logger.debug(err)
          return null
        })

        if (userData) {
          ctx.vtex.logger.info(userData)
          await ctx.clients.masterdata.createOrUpdatePartialDocument({
            dataEntity: 'CL',
            fields: {
              acceptedTerms: storedData.acceptedTerms,
              isNewsletterOptIn: storedData.newsletteroptin || undefined,
              firstName: userData[socialSettings.socialUserFirstNameField] ? userData[socialSettings.socialUserFirstNameField] : null,
              lastName: userData[socialSettings.socialUserLastNameField] ? userData[socialSettings.socialUserLastNameField] : null,
              email: userData[socialSettings.socialUserEmailField]
            }
          }).catch(err => {
            ctx.vtex.logger.error("[GetUserInfo] - Failed to update user on master data")
            ctx.vtex.logger.debug(err?.message || err)
          })

          ctx.status = 200
          ctx.body = {
            id: userData[socialSettings.socialUserIdField],
            email: userData[socialSettings.socialUserEmailField],
            firstName: userData[socialSettings.socialUserFirstNameField],
            lastName: userData[socialSettings.socialUserLastNameField]
          }
        } else {
          ctx.status = 500
          ctx.body = "Failed to retrieve data"
        }
      } else {
        ctx.vtex.logger.warn("[GetUserInfo] - received request with social: " + storedData.social)
        ctx.status = 400
        ctx.body = `${storedData.social} is not supported`
      }

    } else {
      ctx.vtex.logger.warn("[GetUserInfo] - failed to retrieve data from storage")
      ctx.status = 500
      ctx.body = "Unexpected error"
    }

  } else {
    ctx.vtex.logger.warn("[GetUserInfo] - 'access_token' parameter missing")
    ctx.status = 401
    ctx.body = "'access_token' parameter missing."
  }

  await next()
}

