import { Cancellation, getHDXPayload, Reservation, Visit } from "../typings/hdx";
import { OrderForm } from "../typings/orderForm";
import { POInterfaces } from "../typings/sap-po";
import { CustomApp, HDXFieldsEnum, TPFieldsEnum } from "../typings/types";
import { flagItemsOrderForm, getPostCode } from "../utils/bizRules";
import { DTFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { fillInInterfaceName, fillInReleaseSlotFields, fillInStandardParams, fillInVisitParams, isNotUndefined, isValid, parseReservationCode, routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function reserveSlot(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  try {
    const orderFormId = ctx.vtex.route.params.orderformid as string;

    let orderForm = await ctx.clients.OrderForm.getOrderForm(orderFormId, ctx.state.CheckoutOrderFormOwnershipCookie);
    orderForm = flagItemsOrderForm(ctx, orderForm).orderForm;
    let reservationCode = orderForm.customData?.customApps?.find((f: any) => f.id == CustomApp.HDX)?.fields[HDXFieldsEnum.ReservationCode];
    let shipTogether = orderForm.customData?.customApps?.find((f: any) => f.id == CustomApp.Tradeplace)?.fields[TPFieldsEnum.ShipTogether];
    let inStockSLA = orderForm.shippingData?.logisticsInfo?.find((f: any) => f.selectedSla?.toLowerCase() == ctx.state.appSettings.vtex.inStockShippingPolicy.toLowerCase());
    let deliveryWindow = inStockSLA?.slas?.find((f: any) => f.id == inStockSLA?.selectedSla)?.deliveryWindow; // hyp: one delivery window for all the instock items
    if (isValid(reservationCode)) {
      await deleteReservation(ctx, orderForm, reservationCode);
    }
    if (orderForm.items.filter((f: any) => !f.ignore)?.length > 0 && shipTogether != "true" && deliveryWindow != undefined) {
      orderForm.shippingData.address.postalCode = await getPostCode(ctx, orderForm);
      let distinctSkus: string[] = [];
      orderForm.items.filter((f: any) => !f.ignore)?.forEach((i: any) => !distinctSkus.includes(i.id) ? distinctSkus.push(i.id) : "");
      let promises: Promise<any>[] = [];
      distinctSkus?.forEach(s => {
        promises.push(ctx.clients.Vtex.getSkuContext(s));
      })
      promises.push(searchDocuments(ctx, ctx.state.appSettings.vtex.deliveryTimeCalc.mdName, DTFields, `timeCalCode=${ctx.state.appSettings.vtex.deliveryTimeCalc.mainRecordId}`, { page: 1, pageSize: 10 }));
      let responses = await Promise.all(promises);
      ctx.state.skuContext = responses.filter(f => f.ProductId);
      ctx.state.delTimeCalc = responses[responses.length - 1]?.length > 0 ? responses[responses.length - 1][0] : undefined;
      await isNotUndefined(ctx.state.delTimeCalc, "no DT records found");
      let payload = getHDXPayload(Visit.FALSE, Reservation.TRUE);
      payload = fillInInterfaceName(payload, POInterfaces.CONFIRM_RESERVE_SLOT)
      let res0 = fillInStandardParams(payload, ctx.state.appSettings.hdx, orderForm);
      let res1 = await fillInVisitParams(res0.payload, ctx, orderForm, deliveryWindow);
      let resCode = await ctx.clients.SAPPO.callHDXWebApplication(res1.payload, res0.referenceCode);
      resCode = parseReservationCode(resCode);
      await ctx.clients.OrderForm.fillInCustomdata(orderForm.orderFormId, CustomApp.HDX, { reservationCode: resCode }, ctx.state.CheckoutOrderFormOwnershipCookie!);
    }
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    console.error(err);
    let msg = label + (err.msg ? err.msg : stringify(err));
    ctx.vtex.logger.error(msg);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next();
}

async function deleteReservation(ctx: Context, orderForm: OrderForm, reservationCode: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let payload = getHDXPayload(Visit.FALSE, Reservation.FALSE, Cancellation.TRUE);
      payload = fillInInterfaceName(payload, POInterfaces.RELEASE_SLOT);
      let res0 = fillInStandardParams(payload, ctx.state.appSettings.hdx, orderForm);
      payload = await fillInReleaseSlotFields(ctx, res0.payload, orderForm, reservationCode);
      Promise.all([
        ctx.clients.SAPPO.callHDXWebApplication(payload, res0.referenceCode),
        ctx.clients.OrderForm.deleteCustomdata(orderForm.orderFormId, CustomApp.HDX, HDXFieldsEnum.ReservationCode, ctx.state.CheckoutOrderFormOwnershipCookie!)
      ])
        .then(res => resolve(res))
        .catch(err => reject(err))
    } catch (err) {
      reject(err);
    }
  })
}
