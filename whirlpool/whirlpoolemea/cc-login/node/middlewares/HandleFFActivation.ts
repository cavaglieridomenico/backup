import { TradePolicy } from "../typings/TradePolicy";
import { CLEntityName } from "../utils/constants";
import { updatePartialDocument } from "../utils/documentCRUD";
import { isValid, sendEventWithRetry } from "../utils/functions";

export async function HandleFFActivation(ctx: Context, next: () => Promise<any>) {
  try {
    let currentDate = ctx.state.userActivationDate || new Date().toISOString();
    if (isValid(ctx.state.invitation)) { // => TradePolicy.FF
      if (!isValid(ctx.state.invitation?.activationDate)) {
        updatePartialDocument(ctx, ctx.state.appSettings.FF!.recordsMDName!, ctx.state.invitation!.id!, { activationDate: currentDate });
        sendEventWithRetry(ctx, ctx.vtex.account + ".sfmc-integration", "ff-invitation-accepted",
          {
            invitingUser: ctx.state.invitation!.invitingUser,
            invitedUser: ctx.state.req!.email,
            expirationDate: ctx.state.invitation!.expirationDate,
            activationDate: currentDate,
            cluster: TradePolicy.FF,
            eventId: TradePolicy.FF + " - Friend welcome email",
            locale: ctx.state.req!.locale
          }
        );
        // Align record in the CL entity related to FF user
        if (ctx.state.userData) {
          updatePartialDocument(ctx, CLEntityName, ctx.state.userData!.id!, {activationDate: currentDate, invitingUser: ctx.state.invitation!.invitingUser});
        }
      } else {
        // If the record in the CL entity is misaligned or contains the activationDate as null, then the fields related to the FF users are updated
        if (ctx.state.userData && (!ctx.state.userData.activationDate || ctx.state.userData.invitingUser != ctx.state.invitation!.invitingUser)) {
          updatePartialDocument(ctx, CLEntityName, ctx.state.userData!.id!, {activationDate: ctx.state.invitation!.activationDate, invitingUser: ctx.state.invitation!.invitingUser});
        }
      }
    } else {
      if (ctx.state.tradePolicyInfo?.name == TradePolicy.VIP) {
        if (isValid(ctx.state.vipInvitation)) {
          if (!isValid(ctx.state.vipInvitation?.activationDate)) {
            updatePartialDocument(ctx, ctx.state.appSettings.FF!.recordsMDName!, ctx.state.vipInvitation!.id!, { activationDate: currentDate });
            sendEventWithRetry(ctx, ctx.vtex.account + ".sfmc-integration", "ff-invitation-accepted",
              {
                invitingUser: ctx.state.vipInvitation!.invitingUser,
                invitedUser: ctx.state.req!.email,
                expirationDate: ctx.state.vipInvitation!.expirationDate,
                activationDate: currentDate,
                cluster: TradePolicy.VIP,
                eventId: TradePolicy.VIP + " - Friend welcome email",
                locale: ctx.state.req!.locale
              }
            );
            // Align record in the CL entity related to VIP user
            if (ctx.state.userData) {
              updatePartialDocument(ctx, CLEntityName, ctx.state.userData!.id!, {activationDate: currentDate, invitingUser: ctx.state.vipInvitation!.invitingUser});
            }
          } else {
            // If the record in the CL entity is misaligned or contains the activationDate as null, then the fields related to the VIP users are updated
            if (ctx.state.userData && (!ctx.state.userData.activationDate || ctx.state.userData.invitingUser != ctx.state.vipInvitation!.invitingUser)) {
              updatePartialDocument(ctx, CLEntityName, ctx.state.userData!.id!, {activationDate: ctx.state.vipInvitation!.activationDate, invitingUser: ctx.state.vipInvitation!.invitingUser});
            }
          }
        }
      }
    }
    await next();
  } catch (err) {
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
