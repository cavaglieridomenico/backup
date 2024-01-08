import { HDXSettings } from "../typings/config";
import { AES256Decode } from "./cryptography";
import { DeliveryWindowOF, ItemOF, OrderForm } from "../typings/orderForm";
import { CustomApp, DeliverySlot, FillInStandardParamsRes, FillInVisitParamsRes, HDXFieldsEnum, RequestPaylod } from "../typings/types";
import { DMRecord, DTRecord } from "../typings/md";
import { BookingWindow, VehicleType } from "../typings/hdx";
import { applyOffsetRule, computeDeliveryMeasuresAndCollectMeasures, getVehicleType } from "./bizRules";
import { Order, DeliveryWindow, Item } from "../typings/order";
import { bucketOrderForm } from "./constants";
import { getObjFromVbase, saveObjInVbase } from "./vbase";
import { createHash, randomBytes } from "crypto";

export async function wait(time: number = 500): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
}

export function isValid(field: any): Boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_" &&
    (
      typeof field != 'object' ||
      (typeof field == 'object' && field.length == undefined) ||
      typeof field == 'object' && field.length > 0
    );
}

export function getRandomReference(): string {
  return (Math.floor(Math.random() * Date.now()) + "").substring(0, 200);
}

export function fillInInterfaceName(payload: string, interfaceName: string): string {
  payload = payload.replace(/\$InterfaceName/g, interfaceName);
  return payload;
}

export function fillInStandardParams(payload: string, hdxSettings: HDXSettings, order: OrderForm | Order | undefined = undefined): FillInStandardParamsRes {
  let referenceCode = getRandomReference();
  payload = payload.replace("$UserID", hdxSettings.userId);
  payload = payload.replace("$Password", AES256Decode(hdxSettings.password));
  payload = payload.replace("$SystemID", hdxSettings.systemID);
  payload = payload.replace("$CallReference", referenceCode);
  payload = payload.replace("$ClientNum", hdxSettings.clientNum);
  payload = payload.replace("$ISOLangCode", hdxSettings.isoLanguageCode);
  payload = payload.replace("$ISOCountryCode", order ? order.storePreferencesData.countryCode : hdxSettings.isoCountryCode);
  payload = payload.replace("$ISOCurrencyCode", order ? order.storePreferencesData.currencyCode : hdxSettings.isoCurrencyCode);
  return {
    payload: payload,
    referenceCode: referenceCode
  }
}

export async function fillInVisitParams(payload: string, ctx: Context | OrderEvent, order: OrderForm | Order, reservation: DeliveryWindow | DeliveryWindowOF | undefined = undefined, orderPlaced: number = 0): Promise<FillInVisitParamsRes> {
  return new Promise<FillInVisitParamsRes>(async (resolve, reject) => {
    try {
      let date: string = reservation ? reservation.startDateUtc : applyOffsetRule(ctx, order);
      let measures = computeDeliveryMeasuresAndCollectMeasures(ctx, order);
      let vehicleType = getVehicleType(ctx, order);
      let orderFormVehicle = order.customData.customApps.find(f => f.id == CustomApp.HDX)?.fields[HDXFieldsEnum.VehicleType];
      payload = payload.replace("$OrderId", orderPlaced ? (order as Order).orderId : await getOrderFormRef(ctx, order));
      payload = payload.replace("$CustomerSurname", (order.clientProfileData.lastName + "")?.substring(0, 30));
      payload = payload.replace("$Telephone", (order.clientProfileData.phone + ""));
      payload = payload.replace("$Email", order.clientProfileData.email);
      payload = payload.replace("$Address", order.shippingData.address.street + " " + order.shippingData.address.complement);
      payload = payload.replace("$CountryCode", isValid(order.shippingData.address.country) ? order.shippingData.address.country : ctx.state.appSettings.hdx.isoCountryCode);
      payload = payload.replace("$GeoCode", order.shippingData.address.postalCode);
      payload = payload.replace("$VisitDate", date?.split("T")[0]);
      payload = payload.replace("$FixedTime", `${getNumericValue(ctx.state.delTimeCalc?.timeCalFixed)}`);
      payload = payload.replace("$TimeslotGroupNumber", ctx.state.appSettings.hdx.visitTimeSlotGroupNum);
      payload = payload.replace("$TimeslotNumber", ctx.state.appSettings.hdx.visitTimeSlotNum);
      payload = payload.replace("$EmergencyVisit", !reservation ? "0" : (isValid(orderFormVehicle) && orderFormVehicle != VehicleType.VR02 && vehicleType == VehicleType.VR02 ? "1" : "0"));
      payload = payload.replace("$DeliverVariableTime", `${measures.deliveryVariableTime}`);
      payload = payload.replace("$DeliverMeasure1", `${measures.deliveryMeasure1}`);
      payload = payload.replace("$DeliverMeasure2", `${measures.deliveryMeasure2}`);
      payload = payload.replace("$DeliverMeasure3", `${measures.deliveryMeasure3}`);
      payload = payload.replace("$DeliverMeasure4", "0");
      payload = payload.replace("$DeliverMeasure5", "0");
      payload = payload.replace("$CollectVariableTime", `${measures.collectVariableTime}`);
      payload = payload.replace("$CollectMeasure1", `${measures.collectMeasure1}`);
      payload = payload.replace("$CollectMeasure2", `${measures.collectMeasure2}`);
      payload = payload.replace("$CollectMeasure3", `${measures.collectMeasure3}`);
      payload = payload.replace("$CollectMeasure4", "0");
      payload = payload.replace("$CollectMeasure5", "0");
      payload = payload.replace("$RigidTypeAcceptability", vehicleType);
      payload = payload.replace("$ReleasedInd", ctx.state.appSettings.hdx.visitReleasedInd);
      payload = payload.replace("$Products", `${getProducts(order.items)}`);
      payload = payload.replace("$StartDate", date);
      payload = payload.replace("$NumDays", ctx.state.appSettings.hdx.visitNumDays);
      resolve({
        payload: payload,
        vehicleType: vehicleType
      });
    } catch (err) {
      reject(err);
    }
  })
}

function getProducts(products: Item[] | ItemOF[]): string {
  let payload = '';
  (products as any).filter((f: Item | ItemOF) => !f.ignore)?.forEach((p: Item | ItemOF) =>
    payload += `<Product SKU="${p.refId}" Quantity="${p.quantity}" Description="${p.name}" Service=""/>`
  )
  return payload;
}

export async function fillInReleaseSlotFields(ctx: Context | OrderEvent, payload: string, orderForm: OrderForm | Order, reservationCode: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      payload = payload.replace("$OrderCode", await getOrderFormRef(ctx, orderForm));
      payload = payload.replace("$VisitNum", reservationCode);
      resolve(payload);
    } catch (err) {
      reject(err);
    }
  })
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return ({ }, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

export function stringify(data: any): string {
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data + "";
}


export async function getRequestPayload(ctx: Context): Promise<RequestPaylod> {
  return new Promise<RequestPaylod>((resolve, reject) => {
    let payload = "";
    ctx.req.on("data", (chunk: any) => payload += Buffer.from(chunk, "binary").toString("utf8"));
    ctx.req.on("end", () => resolve(JSON.parse(payload)));
    ctx.req.on("error", (err: any) => reject({ msg: `error while retrieving the request payload --details: ${stringify(err)}` }))
  })
}

export function equalObjects(mdRecord: DMRecord | DTRecord, gcpRecord: DMRecord | DTRecord): boolean {
  let keys = Object.keys(mdRecord)?.filter(f => f != "id");
  let equal = true;
  for (let i = 0; i < keys.length && equal; i++) {
    if ((mdRecord as any)[keys[i]] != (gcpRecord as any)[keys[i]]) {
      equal = false;
    }
  }
  return equal;
}

export function routeToLabel(ctx: Context | OrderEvent): string {
  let label = "Unknown event: ";
  if (isValid(ctx.vtex.eventInfo?.sender)) {
    label = "Reserve delivery slot on order placed: ";
  } else {
    switch (ctx.vtex.route.id) {
      case "deliverySlots":
        label = (ctx as Context).request.method == "GET" ? "Retrieve delivery slots: " : "Reserve delivery slot: ";
        break;
      case "getServerStatus":
        label = "Query server status: ";
        break;
      case "uploadDeliveryData":
        label = "Import delivery data: ";
        break;
    }
  }
  return label;
}

export function parseSlots(payload: string): DeliverySlot[] {
  let placeholder: BookingWindow = {
    AvailableToBook: "placeholder",
    DeliveryDate: "placeholder",
    DefaultTimeSlotGroup: "placeholder",
    DelOUCode: "placeholder",
    DelOUName: "placeholder",
    Greenness: "placeholder",
    MarginalCost: "placeholder",
    PCodeGroupNum: "placeholder",
    RouteOpen: "placeholder",
    TimeSlotDescription: "placeholder",
    TimeSlotEndTime: "placeholder",
    TimeSlotGroupDesc: "placeholder",
    TimeSlotGroupName: "placeholder",
    TimeSlotGroupNumber: "placeholder",
    TimeSlotName: "placeholder",
    TimeSlotNumber: "placeholder",
    TimeSlotStartTime: "placeholder",
    VehicleGroup: "placeholder",
    VehicleType: "placeholder",
    WindowColour: "placeholder",
    WindowText: "placeholder",
    WindowTextColour: "placeholder"
  }
  let payloadBookingWindows: string[] = payload.split("<Data>")[1]?.split("</Data>")[0]?.split("/>");
  let bookingWindows: BookingWindow[] = [];
  let slots: DeliverySlot[] = [];
  payloadBookingWindows?.forEach(b => {
    let bookingWindow: BookingWindow = {};
    let payloadBookingWindow: string = b.trim().split("<BookingWindow ")[1];
    let ids: number[] = [];
    Object.keys(placeholder)?.forEach(k => {
      let index = payloadBookingWindow?.lastIndexOf(k);
      if (index != undefined) {
        ids.push(index);
      }
    })
    ids?.forEach(i => {
      let propertySlices: string[] = payloadBookingWindow.substring(i, payloadBookingWindow.length)?.split("=");
      switch (propertySlices[0]) {
        case "AvailableToBook":
          bookingWindow.AvailableToBook = propertySlices[1]?.split(" ")[0]?.replace(/\'/g, "");
          break;
        case "DeliveryDate":
          bookingWindow.DeliveryDate = propertySlices[1]?.split(" ")[0]?.replace(/\'/g, "");
          break;
      }
    })
    if (bookingWindow.AvailableToBook != undefined) {
      bookingWindows.push(bookingWindow);
    }
  })
  bookingWindows?.filter(f => f.AvailableToBook == "true")?.forEach(b => {
    slots.push({
      startDateUtc: b.DeliveryDate?.split("T")[0] + "T07:00:00+00:00",
      endDateUtc: b.DeliveryDate?.split("T")[0] + "T20:00:59+00:00"
    })
  })
  return slots;
}

export function parseReservationCode(payload: string): string {
  let visit = payload.split("<Data>")[1]?.split("<Visit ")[1].split("/>")[0];
  let resCode = visit.substring(visit.lastIndexOf("Number"), visit.length)?.split("=")[1]?.replace(/\'/g, "");
  return resCode;
}

export async function isNotUndefined(data: any, error: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    data ? resolve(true) : reject({ msg: error });
  })
}

export function getNumericValue(data: any): number {
  return isValid(data) ? data : 0;
}

async function getOrderFormRef(ctx: Context | OrderEvent, orderForm: OrderForm | Order): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let ref = await getObjFromVbase(ctx, bucketOrderForm, getBucketOrderFormKey(orderForm.orderFormId, orderForm.value, orderForm.shippingData.address.receiverName ?? ""));
      if (!isValid(ref)) {
        ref = randomBytes(10).toString("hex").substring(0, 20);
        await saveObjInVbase(ctx, bucketOrderForm, getBucketOrderFormKey(orderForm.orderFormId, orderForm.value, orderForm.shippingData.address.receiverName ?? ""), ref);
      }
      resolve(ref);
    } catch (err) {
      reject(err);
    }
  })
}

export function getBucketOrderFormKey(...args: (number | string)[]) {
  return createHash("sha256").update(args.join('_')).digest("hex")
}