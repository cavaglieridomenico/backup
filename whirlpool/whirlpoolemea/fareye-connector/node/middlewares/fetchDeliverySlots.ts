import { GetSlotPayload } from "../typings/fareye";
import { CustomApp, GDS_AvailableSlots, GetDeliverySlots_Response, TimeSlot_ToBeReturned } from "../typings/types";
import { NO_SLOT_CODE } from "../utils/constants";
import { checkOrderItems, routeToLabel, stringify } from "../utils/functions";
import { getDeliverySlotPayload } from "../utils/mapper";
import { cleanUpAntiThrottler } from "./antiThrottler";

//useful to retrieve all available slots based on the orderFormId.
export async function getDeliverySlots(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  let checkOrderRes = undefined;
  try {
    const orderFormId = ctx.vtex.route.params.orderFormId as string;
    ctx.state.orderForm = await ctx.clients.OrderForm.getOrderForm(orderFormId, ctx.state.cookies);
    //get all distinct Ids of the item
    let distinctSkuId = new Set(ctx.state.orderForm!.items.map(element => element.id));
    //retrieving the sku context of each item in the order
    let promises: Promise<any>[] = [];
    distinctSkuId.forEach(id => promises.push(ctx.clients.Vtex.getSkuContext(id)));
    ctx.state.skus = await Promise.all(promises);
    checkOrderRes = checkOrderItems(ctx);
    //error managed in catch through error message
    if (checkOrderRes.ignore) {
      throw new Error(checkOrderRes.hasCGasAppliances ? "#gas" : "#presale");
    }
    //build the payload to send to FarEye
    let payload: GetSlotPayload = await getDeliverySlotPayload(ctx);
    ctx.state.logger.info(`${routeToLabel(ctx)} - Sending request for orderform ${orderFormId} with payload: ${JSON.stringify(payload)}`)
    //timeSlot returned by FarEye
    let timeSlot: TimeSlot_ToBeReturned[] = [];
    let response: GetDeliverySlots_Response = await ctx.clients.FarEye.GetDeliverySlots((payload));
    ctx.state.logger.info(`${routeToLabel(ctx)} - Fareye response for orderform ${orderFormId}: ${JSON.stringify(response)}`)
    let carrierCode = undefined;
    if (response.carriers) {
      let available_slots: GDS_AvailableSlots[] = [];
      response.carriers?.forEach(carrier => available_slots = available_slots.concat(carrier.available_slots));
      available_slots?.forEach(slot => {
        let endSlotPieces = slot.end.split(":");
        let endSlot = `${endSlotPieces[0]}:${endSlotPieces[1]}:59`;
        if (ctx.state.allSlots?.includes(`${slot.start}-${endSlot}`)) {
          let startDateUtc = `${slot.date}T${slot.start}+00:00`;
          let endDateUtc = `${slot.date}T${endSlot}+00:00`;
          timeSlot.push({
            startDateUtc: startDateUtc,
            endDateUtc: endDateUtc
          })
        }
      })
      if (timeSlot.length) {
        carrierCode = response.carriers[0]?.code;
      } else {
        carrierCode = NO_SLOT_CODE
      }
    } else if (response.available_slots?.length == 0) {
      carrierCode = NO_SLOT_CODE
    }
    //needed in reservation and returned by FE in the get delivery slots

    await ctx.clients.OrderForm.fillInCustomData(ctx.state.orderForm.orderFormId, CustomApp.FAREYE,
      { carrierCode: carrierCode + "" }, ctx.state.cookies);
    ctx.body = { slots: timeSlot, hasCGasAppliances: false };
    ctx.status = 200;
  } catch (error) {
    if (error.message == "#gas" || error.message == "#presale") {
      ctx.status = 200;
      ctx.body = { slots: [], hasCGasAppliances: checkOrderRes?.hasCGasAppliances };
    } else {
      let label = routeToLabel(ctx);
      let msg = error.msg ? error.msg : stringify(error);
      ctx.state.logger.error(`${label} ${msg}`);
      ctx.state.logger.debug(ctx.state.orderForm);
      ctx.status = 500;
    }
  }
  cleanUpAntiThrottler(ctx);
  await next();
}

