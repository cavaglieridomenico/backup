import { ForbiddenError } from "@vtex/api"
import { configs } from "../typings/configs"
import { RedirectUriPath } from "../utils/constants"
import { CustomLogger } from "../utils/Logger"
import { CreateEntry } from "../utils/Storage"

export async function GetAuthCode(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store')
  ctx.vtex.logger = new CustomLogger(ctx)
  const appSettings: configs = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)

  console.log(JSON.stringify(ctx.query))

  if (ctx.query.state) { // The state parameter must come from both the custom login page and vtex id so we check this first
    if (ctx.query.social == undefined) {
      // In this case the request comes from vtex id, otherwise it comes from the custom login page
      if (ctx.query.redirect_uri) {
        if (ctx.query.client_id === appSettings.VtexClientID) {
          ctx.redirect(appSettings.SiteUrl + appSettings.CustomLoginPageUrl + "?state=" + ctx.query.state + "&redirect_uri=" + ctx.query.redirect_uri)
        } else {
          throw new ForbiddenError("Invalid credentials")
        }
      } else {
        ctx.status = 400
        ctx.body = "'redirect_uri' parameter missing."
      }
    } else {
      if (ctx.query.acceptedTerms) { // Login using any social platform requires both consents to be sent so we check these first
        if (ctx.query.isNewsletterOptIn) {
          let socialSettings = appSettings.Socials.find(social => social.socialName.toLowerCase() == ctx.query.social.toLowerCase())
          console.log(socialSettings)
          if (socialSettings) {
            // Save consent and social provider data using the state as key on masterdata
            await CreateEntry(ctx, ctx.query.state, {
              vtexstate: ctx.query.state,
              acceptedTerms: ctx.query.acceptedTerms == true || ctx.query.acceptedTerms.toLowerCase() == "true",
              newsletteroptin: ctx.query.isNewsletterOptIn == true || ctx.query.isNewsletterOptIn.toLowerCase() == "true",
              social: socialSettings.socialName,
              redirecturi: ctx.query.redirect_uri
            }).then(() => {
              const redirect = socialSettings?.socialLoginUrl +
                "?client_id=" + socialSettings?.socialClientId +
                "&redirect_uri=" + appSettings.SiteUrl + RedirectUriPath +
                "&response_type=code" +
                "&state=" + ctx.query.state +
                "&scope=" + socialSettings?.socialScope

              ctx.redirect(redirect)
            }, err => {
              console.log(err)
              ctx.vtex.logger.error("[GetAuthCode] - Failed to store data")
              ctx.vtex.logger.debug(err)
              ctx.status = 500
              ctx.body = "unexpected error"
            })

          } else {
            ctx.vtex.logger.warn("[GetAuthCode] - received request with social: " + ctx.query.social)
            ctx.status = 400
            ctx.body.error = `${ctx.query.social} is not supported`
          }
        } else {
          ctx.vtex.logger.warn("[GetAuthCode] - received request withouth 'isNewsletterOptIn' parameter")
          ctx.status = 400
          ctx.body = "'isNewsletterOptIn' parameter missing."
        }
      } else {
        ctx.vtex.logger.warn("[GetAuthCode] - received request withouth 'acceptedTerms' parameter")
        ctx.status = 400
        ctx.body = "'acceptedTerms' parameter missing."
      }
    }
  } else {
    ctx.vtex.logger.warn("[GetAuthCode] - received request withouth 'state' parameter")
    ctx.status = 400
    ctx.body = "'state' parameter missing or has invalid value."
  }
  //Send the response back
  await next()
}
