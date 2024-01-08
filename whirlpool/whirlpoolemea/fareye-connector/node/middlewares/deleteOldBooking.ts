import { CancelSlotPayload, FB_STATUS } from "../typings/fareye";
import { FBRecord } from "../typings/md_entities";
import { CustomApp } from "../typings/types";
import { VBaseRecord } from "../typings/vbase";
import { FB_FIELDS, VBASE_BUCKET_FAREYE } from "../utils/constants";
import { getDocument, updatePartialDocument } from "../utils/documentCRUD";
import { getRandomReference, routeToLabel, stringify } from "../utils/functions";
import { deleteObjFromVbase, getObjFromVbase } from "../utils/vbase";
import { cleanUpAntiThrottler } from "./antiThrottler";

export async function deleteOldBooking(ctx: Context, next: () => Promise<any>) {
  let label = routeToLabel(ctx);
  try {
    ctx.set("Cache-Control", "no-cache");
    const orderFormId = ctx.vtex.route.params.orderFormId as string;
    ctx.state.orderForm = await ctx.clients.OrderForm.getOrderForm(orderFormId, ctx.state.cookies);
    let reservation: VBaseRecord | null = await getObjFromVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${orderFormId}`);
    // required for the edge case "multiple orders with the same order form id"
    if (reservation) {
      let mdRecord: FBRecord = await getDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, reservation!.docId, FB_FIELDS);
      reservation = (mdRecord?.status == FB_STATUS.CREATED && !mdRecord?.orderId) ? reservation : null;
      if (!reservation) {
        await deleteObjFromVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${orderFormId}`); // delete link with the old order
      }
    }
    if (reservation) {
      let payload: CancelSlotPayload = {
        reference_id: getRandomReference(),
        carrier_code: reservation.carrierCode,
        slot_id: reservation.reservationCode,
        order_number: reservation.referenceNumber
      }
      ctx.clients.FarEye.CancelSlot(payload)
        .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`));
      updatePartialDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, reservation.docId, { status: FB_STATUS.CANCELED })
        .then(() => ctx.state.logger.debug(`${label} cancelling reservation ${reservation?.reservationCode}...`))
        .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`));
      ctx.clients.OrderForm.deleteCustomData(orderFormId, CustomApp.FAREYE, "reservationCode", ctx.state.cookies)
        .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`));
      await deleteObjFromVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${orderFormId}`);
    }
    await next();
  } catch (error) {
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
    ctx.status = 500;
    cleanUpAntiThrottler(ctx);
  }
}
