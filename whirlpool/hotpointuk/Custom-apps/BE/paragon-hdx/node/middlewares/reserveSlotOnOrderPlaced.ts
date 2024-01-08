import { Cancellation, getHDXPayload, Reservation, Visit } from "../typings/hdx";
import { Order } from "../typings/order";
import { POInterfaces } from "../typings/sap-po";
import { CustomApp, HDXFieldsEnum, OrderPlaced } from "../typings/types";
import { flagItemsOrder, getPostCode } from "../utils/bizRules";
import { bucketHDX, bucketOrderForm, CLEntity, CLFields, DTFields } from "../utils/constants";
import { createDocument, searchDocuments } from "../utils/documentCRUD";
import { fillInInterfaceName, fillInReleaseSlotFields, fillInStandardParams, fillInVisitParams, getBucketOrderFormKey, isNotUndefined, isValid, parseReservationCode, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";
import { deleteObjFromVbase, saveObjInVbase } from "../utils/vbase";

export async function reserveSlotOnOrderPlaced(ctx: OrderEvent | Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  let orderId = isValid((ctx as OrderEvent).body?.orderId) ? (ctx as OrderEvent).body.orderId : ctx.vtex.route.params.orderId as string;
  try {
    let order = await ctx.clients.Vtex.getOrder(orderId);
    let reservationCode = order.customData?.customApps?.find((f: any) => f.id == CustomApp.HDX)?.fields[HDXFieldsEnum.ReservationCode];
    await isNotUndefined(reservationCode, "#novisitcode");
    let deliveryWindow = order.shippingData?.logisticsInfo?.find((f: any) => f.selectedSla?.toLowerCase() == ctx.state.appSettings.vtex.inStockShippingPolicy.toLowerCase())?.deliveryWindow;
    await isNotUndefined(deliveryWindow, "#nofginstock");
    let distinctSkus: string[] = [];
    order.items?.forEach((i: any) => !distinctSkus.includes(i.id) ? distinctSkus.push(i.id) : "");
    let promises: Promise<any>[] = [];
    distinctSkus?.forEach(s => {
      promises.push(ctx.clients.Vtex.getSkuContext(s));
    })
    let responses = await Promise.all([
      deleteReservation(ctx, order, reservationCode),
      getPostCode(ctx, order),
      searchDocuments(ctx, ctx.state.appSettings.vtex.deliveryTimeCalc.mdName, DTFields, `timeCalCode=${ctx.state.appSettings.vtex.deliveryTimeCalc.mainRecordId}`, { page: 1, pageSize: 10 }),
      searchDocuments(ctx, CLEntity, CLFields, `userId=${order.clientProfileData.userProfileId}`, { page: 1, pageSize: 10 }, true)
    ].concat(promises));
    order.shippingData.address.postalCode = responses[1];
    ctx.state.delTimeCalc = responses[2]?.length > 0 ? responses[2][0] : undefined;
    order.clientProfileData.email = responses[3]?.length > 0 ? (responses[3][0]).email : order.clientProfileData.email;
    ctx.state.skuContext = responses.filter(f => f.ProductId);
    await isNotUndefined(ctx.state.delTimeCalc, "no DT records found");
    order = flagItemsOrder(ctx, order);
    let payload = getHDXPayload(Visit.FALSE, Reservation.TRUE);
    payload = fillInInterfaceName(payload, POInterfaces.CONFIRM_RESERVE_SLOT)
    let res0 = fillInStandardParams(payload, ctx.state.appSettings.hdx, order);
    let res1 = await fillInVisitParams(res0.payload, ctx, order, deliveryWindow, OrderPlaced.TRUE);
    let resCode = await ctx.clients.SAPPO.callHDXWebApplication(res1.payload, res0.referenceCode);
    resCode = parseReservationCode(resCode);
    await Promise.all([
      saveObjInVbase(ctx, bucketHDX, order.orderId, resCode),
      createDocument(ctx, ctx.state.appSettings.vtex.reservationTable.mdName, { orderId: orderId, reservationCode: resCode }),
      deleteObjFromVbase(ctx, bucketOrderForm, getBucketOrderFormKey(order.orderFormId, order.value, order.shippingData.address.receiverName ?? ""))
    ]);
    (ctx as Context).status = 200;
    ctx.body = "OK";
  } catch (err) {
    console.error(err)
    let msg = err.msg ? err.msg : stringify(err);
    if (err.msg?.includes("#novisitcode")) {
      ctx.vtex.logger.warn(`Reserve slot for order ${orderId}: no visit code found`);
    } else {
      if (err.msg?.includes("#nofginstock")) {
        ctx.vtex.logger.warn(`Reserve slot for order ${orderId}: no in stock FGs found`);
      } else {
        ctx.vtex.logger.error(`Reserve slot for order ${orderId}: ${msg}`);
      }
    }
    (ctx as Context).status = 500;
    (ctx as Context).body = "Internal Server Error";
  }
  await next()
}

async function deleteReservation(ctx: Context | OrderEvent, order: Order, reservationCode: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let payload = getHDXPayload(Visit.FALSE, Reservation.FALSE, Cancellation.TRUE);
      payload = fillInInterfaceName(payload, POInterfaces.RELEASE_SLOT);
      let res0 = fillInStandardParams(payload, ctx.state.appSettings.hdx, order);
      payload = await fillInReleaseSlotFields(ctx, res0.payload, order, reservationCode);
      ctx.clients.SAPPO.callHDXWebApplication(payload, res0.referenceCode)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err))
    } catch (err) {
      reject(err);
    }
  })
}
