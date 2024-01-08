import { FFInvitation } from "../typings/types";
import { isValid, routeToLabel, stringify } from "../utils/functions";

export async function sendInvitationEmail(ctx: Invitation, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  let locale = isValid(ctx.body.locale) ? ctx.body.locale : ctx.state.appSettings.vtex.defaultLocale5C;
  let templateKey = ctx.state.sfmcData?.friendInvitationKey?.find(t => t.key?.toLowerCase() == locale?.toLowerCase())?.value;
  let payload: FFInvitation = {
    ContactKey: ctx.body.invitedUser,
    EventDefinitionKey: templateKey!,
    Data: {
      SubscriberKey: ctx.body.invitedUser,
      EmailAddress: ctx.body.invitedUser,
      ActivationLink: "https://" + ctx.state.sfmcData?.hostname + "/login" + (isValid(ctx.body.accessCode) ? ("?sid=" + ctx.body.accessCode + "&email=" + ctx.body.invitedUser) : "?email=" + ctx.body.invitedUser), // accessCode & email => VIP; email => FF
      HomePageLink: "https://" + ctx.state.sfmcData?.hostname,
      ExpirationDate: ctx.body.expirationDate
    }
  }
  ctx.clients.SFMCRest.triggerEvent(payload, ctx.state.accessToken!)
    .then(() => ctx.state.logger.info(label + "email sent --details: " + stringify(payload)))
    .catch(err => ctx.state.logger.error(label + "email sending failed --details: " + (err.message ? err.message : stringify(err))))
  await next();
}
