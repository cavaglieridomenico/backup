//@ts-nocheck

import { FFInvitation } from "../typings/types";
import { CustomLogger } from "../utils/Logger";

export async function sendWelcomeEmail(ctx: Invitation, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  let payload: FFInvitation = {
    ContactKey: ctx.body.invitingUser,
    EventDefinitionKey: ctx.state.sfmcData?.friendConfirmationKey,
    Data: {
      SubscriberKey: ctx.body.invitingUser,
      EmailAddress: ctx.body.invitedUser,
      HomePageLink: "https://"+ctx.state.appSettings.ff?.hostname,
      ExpirationDate: ctx.body.expirationDate,
      ActivationDate: ctx.body.activationDate
    }
  }
  ctx.clients.SFMCRest.triggerEvent(payload, ctx.state.accessToken)
  .then(res =>  ctx.vtex.logger.info("Friend invitation: welcome email sent --details: "+JSON.stringify(payload)))
  .catch(err => ctx.vtex.logger.error("Friend invitation: welcome email sending failed --details: "+(err.message!=undefined?err.message:JSON.stringify(err))))
  await next();
}
