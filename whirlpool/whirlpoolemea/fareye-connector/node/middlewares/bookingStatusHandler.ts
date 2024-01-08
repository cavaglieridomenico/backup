import { CancelSlotPayload, FB_STATUS } from "../typings/fareye";
import { FB_FIELDS, VBASE_BUCKET_FAREYE } from "../utils/constants";
import { getDocument, searchDocuments, updatePartialDocument } from "../utils/documentCRUD";
import { getRandomReference, stringify } from "../utils/functions";
import { SetBookingStatus_Request } from "../typings/requestBody";
import { json } from "co-body";
import { getObjFromVbase } from "../utils/vbase";
import { FBRecord } from "../typings/md_entities";
import { VBaseRecord } from "../typings/vbase";

export async function orderCreatedUpdate(ctx: OrderEvent, next: () => Promise<any>) {
  let label = `New order event (orderId: ${ctx.body.orderId}):`;
  try {
    let order = await ctx.clients.Vtex.getOrder(ctx.body.orderId);
    let reservation: FBRecord | null = await getObjFromVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${order.orderFormId}`);
    if (reservation) {
      updatePartialDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, reservation.docId!, { orderId: order.orderId })
        .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`))
    } else {
      ctx.state.logger.warn(`${label} No reservations found`);
    }
  } catch (error) {
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
  }
  await next();
}

export async function setBookingStatusOnOrderEvent(ctx: Context | OrderEvent, next: () => Promise<any>) {
  let orderId = (ctx as OrderEvent).body?.orderId ?? ctx.vtex.route.params.orderId;
  let currentState = (ctx as OrderEvent).body?.currentState ?? ctx.vtex.route.params.currentState;
  let label = `Booking status update (orderId: ${orderId}):`;
  try {
    // required for the edge case "multiple orders with the same order form id"
    let reservation: VBaseRecord | FBRecord | null = await getObjFromVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${ctx.state.order.orderFormId}`) ??
      (await searchDocuments(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, FB_FIELDS, `orderId=${orderId}`, { page: 1, pageSize: 10 }))[0];
    if (reservation?.docId) {
      reservation = await getDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, reservation!.docId, FB_FIELDS);
    }
    if (reservation) {
      switch (currentState) {
        case "handling":
          if ((reservation as FBRecord).status == FB_STATUS.CREATED) {
            updatePartialDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, (reservation as VBaseRecord).docId ?? (reservation as FBRecord).id, { status: FB_STATUS.SAP_MANAGED })
              .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`))
          }
          break;
        case "invoiced":
          if ((reservation as FBRecord).status != FB_STATUS.CANCELED) {
            updatePartialDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, (reservation as VBaseRecord).docId ?? (reservation as FBRecord).id, { status: FB_STATUS.USED })
              .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`))
          }
          break;
        case "canceled":
          if ((reservation as FBRecord).status != FB_STATUS.USED) {
            let payload: CancelSlotPayload = {
              reference_id: getRandomReference(),
              carrier_code: reservation.carrierCode,
              slot_id: reservation.reservationCode,
              order_number: reservation.referenceNumber
            }
            ctx.clients.FarEye.CancelSlot(payload)
              .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`));
            updatePartialDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, (reservation as VBaseRecord).docId ?? (reservation as FBRecord).id, { status: FB_STATUS.CANCELED })
              .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`))
          }
          break;
      }
    } else {
      ctx.state.logger.warn(`${label} No reservations found`);
    }
    (ctx as Context).status = 200;
    ctx.body = "OK";
  } catch (error) {
    //console.error(error);
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}

export async function setBookingStatus(ctx: Context, next: () => Promise<any>) {
  let request: SetBookingStatus_Request | undefined = undefined;
  try {
    request = await json(ctx.req);
    let label = `Booking status update (orderId: ${request?.orderId}):`;
    let order = await ctx.clients.Vtex.getOrder(request!.orderId);
    // required for the edge case "multiple orders with the same order form id"
    let reservation: VBaseRecord | FBRecord | null = await getObjFromVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${order.orderFormId}`) ??
      (await searchDocuments(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, FB_FIELDS, `orderId=${request!.orderId}`, { page: 1, pageSize: 10 }))[0];
    if (reservation?.docId) {
      reservation = await getDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, reservation!.docId, FB_FIELDS);
    }
    if (reservation) {
      if ((reservation as FBRecord).status == FB_STATUS.CREATED) { // the status in the request can be only "SAP_MANAGED"
        updatePartialDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, (reservation as VBaseRecord).docId ?? (reservation as FBRecord).id, { status: request?.status })
          .catch(err => ctx.state.logger.error(`${label} ${err?.msg ? err.msg : stringify(err)}`))
      }
    } else {
      ctx.state.logger.warn(`${label} No reservations found`);
    }
    ctx.status = 200;
    ctx.body = "OK";
  } catch (error) {
    let label = `Booking status update (orderId: ${request?.orderId}):`;
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}
