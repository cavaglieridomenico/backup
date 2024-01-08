import { FB_STATUS } from "../typings/fareye";
import { FBRecord } from "../typings/md_entities";
import { ShippingDataOF } from "../typings/orderForm";
import { CustomApp } from "../typings/types";
import { VBASE_BUCKET_FAREYE } from "../utils/constants";
import { createDocument } from "../utils/documentCRUD";
import { routeToLabel, stringify } from "../utils/functions";
import { saveObjInVbase } from "../utils/vbase";
import { cleanUpAntiThrottler } from "./antiThrottler";

//used to save booking's info in MD and orderForm that are useful to retrieve the record in next phases
export async function saveBookingInfo(ctx: Context, next: () => Promise<any>) {
  try {
    let analyticsInfo = getAnalyticInfo(ctx.state.orderForm.shippingData, ctx.state.appSettings.Vtex_Settings.Admin.InStock_SpId!);
    let FB_Fields: FBRecord = {
      carrierCode: ctx.state.bookingInfo.carrierCode!,
      orderFormId: ctx.state.orderForm.orderFormId,
      referenceNumber: ctx.state.bookingInfo.referenceNumber!,
      reservationCode: ctx.state.bookingInfo.reservationCode!,
      status: FB_STATUS.CREATED,
      creationDate: new Date().toISOString(),
      firstAvailableSlot: analyticsInfo.firstAvailableSlot,
      selectedSlot: analyticsInfo.selectedSlot
    }
    let docId = (await createDocument(ctx, ctx.state.appSettings.Vtex_Settings.Admin.FB_EntityName, FB_Fields))?.DocumentId;
    await Promise.all([
      saveObjInVbase(ctx, VBASE_BUCKET_FAREYE, `${ctx.vtex.account}_${ctx.vtex.route.params.orderFormId}`,
        {
          carrierCode: FB_Fields.carrierCode,
          referenceNumber: FB_Fields.referenceNumber,
          reservationCode: FB_Fields.reservationCode,
          creationDate: FB_Fields.creationDate,
          docId: docId
        } as FBRecord
      ),
      ctx.clients.OrderForm.fillInCustomData(ctx.state.orderForm.orderFormId, CustomApp.FAREYE,
        {
          reservationCode: ctx.state.bookingInfo?.reservationCode,
          referenceNumber: ctx.state.bookingInfo?.referenceNumber,
          carrierCode: ctx.state.bookingInfo?.carrierCode,
          hasCGASAppliances: "false",
          hasPresales: "false"
        }, ctx.state.cookies)
    ])
    ctx.status = 200;
  } catch (error) {
    let label = routeToLabel(ctx);
    let msg = error.msg ? error.msg : stringify(error);
    ctx.state.logger.error(`${label} ${msg}`);
    ctx.status = 500;
  }
  cleanUpAntiThrottler(ctx);
  await next()
}

//we need to know the format of data to send to GCP or something else
function getAnalyticInfo(shippingData: ShippingDataOF, shippingPolicy_Id: string) {
  let analyticsInfo = {
    firstAvailableSlot: JSON.stringify(shippingData.logisticsInfo.find(f => f.selectedSla == shippingPolicy_Id)?.slas?.find(f => f.id == shippingPolicy_Id)?.availableDeliveryWindows[0]),
    selectedSlot: JSON.stringify(shippingData.logisticsInfo.find(f => f.selectedSla == shippingPolicy_Id)?.slas?.find(f => f.id == shippingPolicy_Id)?.deliveryWindow)
  }
  return analyticsInfo;
}
