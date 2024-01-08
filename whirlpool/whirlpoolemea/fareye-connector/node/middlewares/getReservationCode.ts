import { FBRecord } from "../typings/md_entities";
import { CustomApp } from "../typings/types";
import { VBaseRecord } from "../typings/vbase";
import { FB_FIELDS, NO_SLOT_CODE, VBASE_BUCKET_FAREYE } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { isValid, routeToLabel, stringify } from "../utils/functions";
import { getObjFromVbase } from "../utils/vbase";

//retrieve reservationCode passing the orderId
//responses' cases:
//reservationCode: “xyz” => reservation correctly created on FarEye
//reservationCode: null  => reservation not created on FarEye due to the cart content (basically, BI products with installation service) or no available slots. The shipment will be manually managed by the customer service
//reservationCode: “TBB” => reservation not created due to errors in the comunication with FarEeye. The shipment will be manually managed by the customer service
export async function getReservationCode(ctx: Context, next: () => Promise<any>) {
  try {
    let orderId = ctx.vtex.route.params.orderId.toString();
    ctx.state.order = await ctx.clients.Vtex.getOrder(orderId);
    let hasCGASAppliances = ctx.state.order.customData?.customApps?.find(f => f.id == CustomApp.FAREYE)?.fields?.hasCGASAppliances;
    let hasPresales = ctx.state.order.customData?.customApps?.find(f => f.id == CustomApp.FAREYE)?.fields?.hasPresales;
    let carrierCode = ctx.state.order.customData?.customApps?.find(c => c.id == CustomApp.FAREYE)?.fields?.carrierCode;
    if ((!isValid(hasCGASAppliances) || hasCGASAppliances == "false") && (!isValid(hasPresales) || hasPresales == "false") && carrierCode != NO_SLOT_CODE) {
      // required for the edge case "multiple orders with the same order form id"
      let reservation: VBaseRecord | FBRecord | null = await getObjFromVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${ctx.state.order.orderFormId}`) ??
        (await searchDocuments(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, FB_FIELDS, `orderId=${orderId}`, { page: 1, pageSize: 10 }))[0];
      if (reservation) {
        ctx.state.bookingInfo = { reservationCode: reservation.reservationCode }
      } else {
        ctx.state.bookingInfo = { reservationCode: "TBB" }
      }
    } else {
      ctx.state.bookingInfo = { reservationCode: null }
    }
    await next();
  } catch (error) {
    let label = routeToLabel(ctx);
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
    ctx.status = 500;
  }
}
