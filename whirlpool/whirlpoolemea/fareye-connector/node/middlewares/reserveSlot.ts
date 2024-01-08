import { ReserveSlotPayload } from "../typings/fareye";
import { CustomApp, ReserveSlot_Response } from "../typings/types";
import { NO_SLOT_CODE } from "../utils/constants";
import { checkOrderItems, isValid, routeToLabel, stringify } from "../utils/functions";
import { getReserveSlotPayload } from "../utils/mapper";
import { cleanUpAntiThrottler } from "./antiThrottler";

export async function reserveSlot(ctx: Context, next: () => Promise<any>) {
  let checkOrderRes = undefined;
  try {
    let distinctSkuId = new Set(ctx.state.orderForm!.items.map(element => element.id));
    //retrieving the sku context of each item in the order
    let promises: Promise<any>[] = [];
    distinctSkuId.forEach(id => {
      promises.push(ctx.clients.Vtex.getSkuContext(id))
    })
    ctx.state.skus = await Promise.all(promises);
    checkOrderRes = checkOrderItems(ctx);
    //error managed in catch through error message
    if (checkOrderRes.ignore) {
      throw new Error(checkOrderRes.hasCGasAppliances ? "#gas" : "#presale")
    }
    let carrierCode = ctx.state.orderForm.customData?.customApps?.find(c => c.id == CustomApp.FAREYE)?.fields?.carrierCode;
    if (!isValid(carrierCode) || carrierCode == NO_SLOT_CODE) {
      throw new Error("no available slots");
    }
    let payload: ReserveSlotPayload = await getReserveSlotPayload(ctx);
    ctx.state.logger.info(`${routeToLabel(ctx)} - Sending request for orderform ${ctx.state.orderForm.orderFormId} with payload: ${JSON.stringify(payload)}`)
    let reserveSlot_Response: ReserveSlot_Response = await ctx.clients.FarEye.ReserveSlot(payload);
    ctx.state.logger.info(`${routeToLabel(ctx)} - Fareye response for orderform ${ctx.state.orderForm.orderFormId}: ${JSON.stringify(reserveSlot_Response)}`)
    ctx.state.bookingInfo = {
      referenceNumber: reserveSlot_Response.reference_number,
      reservationCode: reserveSlot_Response.slot_token,
      carrierCode: payload.carrier_code
    }
    await next();
  } catch (error) {
    if (error.message == "#gas" || error.message == "#presale") {
      await ctx.clients.OrderForm.fillInCustomData(ctx.state.orderForm.orderFormId, CustomApp.FAREYE,
        { hasCGASAppliances: checkOrderRes!.hasCGasAppliances.toString(), hasPresales: checkOrderRes!.hasPresales.toString() }, ctx.state.cookies);
      ctx.status = 200;
    } else {
      let label = routeToLabel(ctx);
      let msg = error.msg ? error.msg : stringify(error);
      ctx.state.logger.error(`${label} ${msg}`);
      ctx.status = 500;
    }
    cleanUpAntiThrottler(ctx);
  }
}
