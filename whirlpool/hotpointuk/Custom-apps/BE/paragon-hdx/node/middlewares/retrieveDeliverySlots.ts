import { getHDXPayload, Visit } from "../typings/hdx";
import { POInterfaces } from "../typings/sap-po";
import { CustomApp, TPFieldsEnum } from "../typings/types";
import { flagItemsOrderForm, getPostCode } from "../utils/bizRules";
import { DTFields, HTFiedls, OTFields } from "../utils/constants";
import { searchDocuments } from "../utils/documentCRUD";
import { fillInInterfaceName, fillInStandardParams, fillInVisitParams, isNotUndefined, parseSlots, routeToLabel, stringify } from "../utils/functions";
import { CustomLogger } from "../utils/Logger";

export async function retrieveDeliverySlots(ctx: Context, next: () => Promise<any>) {
  ctx.set("Cache-Control", "no-cache");
  ctx.vtex.logger = new CustomLogger(ctx);
  let label = routeToLabel(ctx);
  let flaggedOrderForm = { orderForm: undefined, hasCGasAppliances: false };
  try {
    const orderFormId = ctx.vtex.route.params.orderformid as string;
    let orderForm = await ctx.clients.OrderForm.getOrderForm(orderFormId, ctx.state.CheckoutOrderFormOwnershipCookie);
    //flagging the items out of scope for HDX: GAS appliances with Installation selected, SDAs and OOS products
    let flaggedOrderForm = flagItemsOrderForm(ctx, orderForm);
    orderForm = flaggedOrderForm.orderForm;
    let shipTogether = orderForm.customData?.customApps?.find((f: any) => f.id == CustomApp.Tradeplace)?.fields[TPFieldsEnum.ShipTogether];
    let slots: any = [];
    if (orderForm.items.filter((f: any) => !f.ignore)?.length > 0 && shipTogether != "true") {
      orderForm.shippingData.address.postalCode = await getPostCode(ctx, orderForm);
      let distinctSkus: string[] = [];
      orderForm.items.filter((f: any) => !f.ignore)?.forEach(i => !distinctSkus.includes(i.id) ? distinctSkus.push(i.id) : "");
      let promises: Promise<any>[] = [];
      distinctSkus?.forEach(s => {
        promises.push(ctx.clients.Vtex.getSkuContext(s));
      })
      promises = promises.concat([
        searchDocuments(ctx, ctx.state.appSettings.vtex.deliveryTimeCalc.mdName, DTFields, `timeCalCode=${ctx.state.appSettings.vtex.deliveryTimeCalc.mainRecordId}`, { page: 1, pageSize: 10 }),
        searchDocuments(ctx, ctx.state.appSettings.vtex.offsetTable.mdName, OTFields, `area=${orderForm.shippingData.address.postalCode.split(" ")[0]}`, { page: 1, pageSize: 10 }),
        searchDocuments(ctx, ctx.state.appSettings.vtex.holidayTable.mdName, HTFiedls, `date=${(new Date()).toISOString().split("T")[0]}`, { page: 1, pageSize: 10 })
      ]);
      let responses = await Promise.all(promises);
      ctx.state.skuContext = responses.filter(f => f.ProductId);
      ctx.state.delTimeCalc = responses[responses.length - 3]?.length > 0 ? responses[responses.length - 3][0] : undefined;
      ctx.state.offset = responses[responses.length - 2]?.length > 0 ? responses[responses.length - 2][0] : undefined;
      ctx.state.isHoliday = responses[responses.length - 1]?.length > 0 ? true : false;
      await isNotUndefined(ctx.state.delTimeCalc, "no DT records found");
      let payload = getHDXPayload(Visit.TRUE);
      payload = fillInInterfaceName(payload, POInterfaces.RETRIEVE_SLOTS);
      let res0 = fillInStandardParams(payload, ctx.state.appSettings.hdx, orderForm);
      let res1 = await fillInVisitParams(res0.payload, ctx, orderForm);
      payload = res1.payload;
      slots = (await Promise.all([ctx.clients.SAPPO.callHDXWebApplication(payload, res0.referenceCode), ctx.clients.OrderForm.fillInCustomdata(orderForm.orderFormId, CustomApp.HDX, { vehicleType: res1.vehicleType }, ctx.state.CheckoutOrderFormOwnershipCookie!)]))[0];
      slots = parseSlots(slots);

    }
    ctx.status = 200;
    ctx.body = { slots: slots, hasCGasAppliances: flaggedOrderForm.hasCGasAppliances };
  } catch (err) {
    console.error(err);
    let msg = label + (err.msg ? err.msg : stringify(err));
    ctx.vtex.logger.error(msg);
    ctx.status = 200;
    ctx.body = { slots: [], hasCGasAppliances: flaggedOrderForm.hasCGasAppliances };
  }
  await next();
}
