//@ts-nocheck

import { FFInvitation } from "../typings/types";
import { CustomLogger } from "../utils/Logger";

export async function sendInvitationEmail(ctx: Invitation, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let payload: FFInvitation = {
    ContactKey: ctx.body.invitingUser,
    EventDefinitionKey: ctx.state.sfmcData?.friendInvitationKey,
    Data: {
      SubscriberKey: ctx.body.invitingUser,
      EmailAddress: ctx.body.invitedUser,
      ActivationLink: "https://"+ctx.state.appSettings.ff?.hostname+"/login",
      HomePageLink: "https://"+ctx.state.appSettings.ff?.hostname,
      ExpirationDate: ctx.body.expirationDate
    }
  }
  ctx.clients.SFMCRest.triggerEvent(payload, ctx.state.accessToken)
  .then(res =>  ctx.vtex.logger.info("Friend invitation: invitation email sent --details: "+JSON.stringify(payload)))
  .catch(err => ctx.vtex.logger.error("Friend invitation: invitation email sending failed --details: "+(err.message!=undefined?err.message:JSON.stringify(err))))
  await next();
}
