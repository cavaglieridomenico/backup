import { FB_STATUS_CAMEL_CASE, GetSlotPayload, ReserveSlotPayload, TimeSlot_ReserveDS } from "../typings/fareye";
import { AddressOF, ItemOF, OrderForm } from "../typings/orderForm";
import { CustomApp, ItemsInfo, SkuContext, TotSkuInfo } from "../typings/types";
import { convertIso3Code } from "./ISOCountryConverter";
import { DIMENSION_UOM, VOLUME_UOM, WEIGHT_UOM } from "./constants";
import { getDaysDelayedDate, getRandomReference, isValid, stringify } from "./functions";

//useful to map all fields needed by FarEye in order to fetch all delivery slots available
export async function getDeliverySlotPayload(ctx: Context): Promise<GetSlotPayload> {
  return new Promise<GetSlotPayload>(async (resolve, reject) => {
    try {
      let skuItems = ctx.state.skus;
      let totalSkuInfo: TotSkuInfo = getTotalSkuInfo(ctx.state.orderForm.items, skuItems);
      let itemsInfo: ItemsInfo = getItemsInfo(ctx.state.orderForm.items, skuItems);
      resolve({
        reference_number: getRandomReference(),
        fulfilment_center: ctx.state.appSettings.FarEye_Settings.Fulfillment_center, //by appSettings or orderForm
        destination_postal_code: ctx.state.orderForm.shippingData.address.postalCode,
        destination_address_line1: getShippingAddress(ctx.state.orderForm.shippingData.address),//ctx.state.orderForm.shippingData.address.street + ctx.state.orderForm.shippingData.address.number ? (", " + ctx.state.orderForm.shippingData.address.number) : "",
        destination_city_code: ctx.state.orderForm.shippingData.address.city,
        destination_state_code: ctx.state.orderForm.shippingData.address.state,
        destination_country_code: convertIso3Code(ctx.state.orderForm.shippingData.address.country).ioc,
        invoice_value: (ctx.state.orderForm.value / 100),//total
        item_value: totalSkuInfo.TotItemValue,//total without services
        quantity: totalSkuInfo.TotQuantity,
        booking_date: new Date().toISOString().split("T")[0],
        weight: totalSkuInfo.TotWeight,
        volume: ((totalSkuInfo.TotHeight / 1000) * (totalSkuInfo.TotLength / 1000) * (totalSkuInfo.TotWidth / 1000)),
        length: totalSkuInfo.TotLength,
        breadth: totalSkuInfo.TotWidth,
        height: totalSkuInfo.TotHeight,
        additional_heads: [],
        timeslot: {
          end_date: getDaysDelayedDate(ctx.state.appSettings.FarEye_Settings.TimeSlotEndDate_Delay),
          start_date: getDaysDelayedDate(ctx.state.appSettings.FarEye_Settings.BookingDate_Delay),
          requested_time_slot: getTimeSlotHours_byOrderForm(ctx, ctx.state.orderForm, ctx.state.appSettings.Vtex_Settings.Admin.InStock_SpId!, ctx.state.appSettings.FarEye_Settings.TimeSlotBlackList)
        },
        items_list: itemsInfo.itemProductInfo,
        sku_list: itemsInfo.itemSkuInfo
      })
    } catch (error) {
      reject({ msg: `Error while building the payload for the getDeliverySlot: Details -- ${stringify(error)}` });
    }
  })
}

//useful to map all fields needed by FarEye in order to reserve a delivery slot
export async function getReserveSlotPayload(ctx: Context): Promise<ReserveSlotPayload> {
  return new Promise<ReserveSlotPayload>(async (resolve, reject) => {
    try {
      let skuItems = ctx.state.skus;
      let totalSkuInfo: TotSkuInfo = getTotalSkuInfo(ctx.state.orderForm.items, skuItems);
      let itemsInfo: ItemsInfo = getItemsInfo(ctx.state.orderForm.items, skuItems);
      resolve({
        reference_number: getRandomReference(),
        carrier_code: ctx.state.orderForm.customData.customApps.find(f => f.id == CustomApp.FAREYE)?.fields.carrierCode,
        fulfilment_center: ctx.state.appSettings.FarEye_Settings.Fulfillment_center,
        destination_postal_code: ctx.state.orderForm.shippingData.address.postalCode,
        destination_address_line1: getShippingAddress(ctx.state.orderForm.shippingData.address),
        destination_city_code: ctx.state.orderForm.shippingData.address.city,
        destination_state_code: ctx.state.orderForm.shippingData.address.state,
        destination_country_code: convertIso3Code(ctx.state.orderForm.shippingData.address.country).ioc,
        invoice_value: (ctx.state.orderForm.value / 100),//total
        item_value: totalSkuInfo.TotItemValue,//total without services
        quantity: totalSkuInfo.TotQuantity,
        booking_date: new Date().toISOString().split("T")[0],
        weight: totalSkuInfo.TotWeight,
        volume: ((totalSkuInfo.TotHeight / 1000) * (totalSkuInfo.TotLength / 1000) * (totalSkuInfo.TotWidth / 1000)),
        length: totalSkuInfo.TotLength,
        breadth: totalSkuInfo.TotWidth,
        height: totalSkuInfo.TotHeight,
        status: FB_STATUS_CAMEL_CASE.CREATED,
        status_code: FB_STATUS_CAMEL_CASE.CREATED,
        timeslot: getSlotInfo_Reserve(ctx.state.orderForm, ctx.state.appSettings.Vtex_Settings.Admin.InStock_SpId!),
        additional_heads: [],
        items_list: itemsInfo.itemProductInfo,
        sku_list: itemsInfo.itemSkuInfo
      })
    } catch (error) {
      reject({ msg: `Error while building the payload for the reserveSlot: Details -- ${(stringify(error))}` });
    }
  })
}

//returns info relative all items in the order, hence the sum of each value per item
function getTotalSkuInfo(items: ItemOF[], skuItems: any): TotSkuInfo {
  let totSkuInfo: TotSkuInfo = {
    TotHeight: 0,
    TotLength: 0,
    TotWeight: 0,
    TotWidth: 0,
    TotQuantity: 0,
    TotItemValue: 0
  };
  items.forEach((item: any) => {
    let sku = skuItems.find((s: any) => s.Id == item.id)
    totSkuInfo.TotWeight += (sku.Dimension.weight * item.quantity);
    totSkuInfo.TotHeight += (sku.Dimension.height * item.quantity);
    totSkuInfo.TotLength += (sku.Dimension.length * item.quantity);
    totSkuInfo.TotWidth += (sku.Dimension.width * item.quantity);
    totSkuInfo.TotQuantity += item.quantity;
    totSkuInfo.TotItemValue += (item.sellingPrice / 100) * item.quantity
  })
  return totSkuInfo
}

//returns info specific for each item
function getItemsInfo(items: ItemOF[], skuSpecs: SkuContext[]) {
  let itemsInfo: ItemsInfo =
  {
    itemProductInfo: [],
    itemSkuInfo: []
  }
  skuSpecs.forEach((skuItem) => {
    let itemQuantity = 0;
    items.filter((e) => e.id == skuItem.Id.toString()).forEach(item => {
      itemQuantity += item.quantity
    });
    itemsInfo.itemProductInfo.push({
      item_code: skuItem.ProductId.toString(),
      item_height: skuItem.Dimension.height,
      item_length: skuItem.Dimension.length,
      item_weight: skuItem.Dimension.weight,
      item_width: skuItem.Dimension.width,
      item_quantity: itemQuantity,
      item_name: skuItem.ProductName,
      item_reference_number: skuItem.ProductRefId,
      item_uom: DIMENSION_UOM,
      weight_uom: WEIGHT_UOM,
      info: { additional_field1: "" }
    })
    itemsInfo.itemSkuInfo.push({
      sku_description: skuItem.ProductDescription,
      sku_item_name: skuItem.ProductName,
      sku_quantity: itemQuantity,
      sku_volume: `${((skuItem.Dimension.height / 1000) * (skuItem.Dimension.length / 1000) * (skuItem.Dimension.width / 1000))} ${VOLUME_UOM}`,
      sku_weight: `${skuItem.Dimension.weight} ${WEIGHT_UOM}`,
      info: { additional_field1: "" }
    })
  });
  return itemsInfo
}

//returns only the hour range of each slot requested by VTEX
function getTimeSlotHours_byOrderForm(ctx: Context, orderForm: OrderForm, shippingPolicy_Id: string, timeSlotBlackList: string) {
  let slots: string[] = [];
  let adw = orderForm.shippingData.logisticsInfo.find(f => f.selectedSla == shippingPolicy_Id)?.slas.find(f => f.id == shippingPolicy_Id)?.availableDeliveryWindows;
  adw?.forEach(item => {
    slots.push(`${item.startDateUtc.split("T")[1].split("+")[0]}-${item.endDateUtc.split("T")[1].split("+")[0]}`);
  })
  let distinctSlots = new Set(slots.map(element => element));
  ctx.state.allSlots = [];
  distinctSlots.forEach(d => ctx.state.allSlots.push(d));
  let timeSlotBLArray = timeSlotBlackList.split(",");
  return ctx.state.allSlots.filter(s => !timeSlotBLArray.includes(s));
}

//returns the time slot to reserve in FarEye
function getSlotInfo_Reserve(orderForm: OrderForm, shippingPolicy_Id: string) {
  let deliveryWindow = orderForm.shippingData.logisticsInfo.find(f => f.selectedSla == shippingPolicy_Id)?.slas.find(f => f.id == shippingPolicy_Id)?.deliveryWindow;
  let slot: TimeSlot_ReserveDS = {
    date: deliveryWindow!.startDateUtc.split("T")[0],
    end_time: deliveryWindow!.endDateUtc.split("T")[1].split("+")[0],
    start_time: deliveryWindow!.startDateUtc.split("T")[1].split("+")[0]
  }
  return slot
}

//returns the shipping address based on info present in the OrderForm
function getShippingAddress(address: AddressOF): string {
  let address_String = [];
  address_String.push(address.street);
  address_String.push(address.number);
  address_String.push(address.complement);
  return address_String.filter(f => isValid(f))?.join(", ")
}
