import { json } from 'co-body'
import { nanoid } from 'nanoid'
import { AddServGeneralInfo, AppSettings, SFMCSettings } from '../typings/config';
import { Product, TradePolicy } from "../typings/types";
import { AlertEntity, maxRetries, maxTime, categoryValues } from "./constants";
import { createDocument } from './documentCRUD';
import { CustomLogger } from './Logger';
import { WORKSPACE } from '@vtex/api';
import { Order } from '../typings/order';

export async function wait(time: number): Promise<Boolean> {
  return new Promise<Boolean>((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time);
  });
}

export function isValid(param: any): Boolean {
  return param != undefined && param != null && param != "undefined" && param != "null" && param != "" && param != " " && param != "-" && param != "_";
}

export function isValidReturnOrRefundForm(payload: any): Boolean {
  return isValid(payload.ContactAttributes?.SubscriberAttributes?.ClientEmail) && isValid(payload.ContactAttributes?.SubscriberAttributes?.OrderNumber)
    && isValid(payload.ContactAttributes?.SubscriberAttributes?.ProductCode)
}

export function routeToLabel(ctx: Context | StatusChangeContext | Invitation | DropPriceAlertContext | BackInStockContext): string {
  let label = "Unknown event: ";
  if (!ctx.vtex.eventInfo?.sender) {
    switch (ctx.vtex.route.id) {
      case "createOrder":
        label = "Create order " + ctx.vtex.route.params.orderId + ": ";
        break;
      case "cancelOrder":
        label = "Cancel order " + ctx.vtex.route.params.orderId + ": ";
        break;
      case "refundOrder":
        label = "Refund order: ";
        break;
      case "returnOrder":
        label = "Return order: ";
        break;
    }
  } else {
    if (isValid((ctx as Invitation).body.eventId)) {
      label = (ctx as Invitation).body.eventId + " - " + (ctx as Invitation).body.invitedUser + ": ";
    } else {
      label = "Create order " + (ctx as StatusChangeContext).body.orderId + ": ";
    }
  }
  return label;
}

export function getOrderIdByCtx(ctx: Context | StatusChangeContext): any {
  if (!ctx.vtex.eventInfo?.sender) {
    return ctx.vtex.route.params.orderId;
  }
  return (ctx as StatusChangeContext).body.orderId;
}

export function alignServiceNames(additionalServices: AddServGeneralInfo[], order: any, locale: string): any {
  for (let i = 0; i < order.items.length; i++) {
    for (let j = 0; j < order.items[i].bundleItems.length; j++) {
      let translations = additionalServices?.find(s => s.serviceIds?.split(",").includes(order.items[i].bundleItems[j].additionalInfo.offeringTypeId + ""))?.serviceName;
      let value = translations?.find(t => t.key?.toLowerCase() == locale.toLowerCase())?.value;
      if (isValid(value)) {
        order.items[i].bundleItems[j].name = value;
      }
    }
  }
  return order;
}

export async function getRequestPayload(ctx: Context, retry: number = 0) {
  return new Promise<any>((resolve, reject) => {
    json((ctx as Context).req)
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetries) {
          await wait(maxTime);
          return getRequestPayload(ctx, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        } else {
          reject({ message: "error while retrieving request payload --details " + stringify(err.response?.data ? err.response.data : err) });
        }
      });
  });
}

export function getProductUrl(ctx: Context | StatusChangeContext, salesChannel: string, skuContext: any): string {
  let baseUrl = "https://";

  switch (salesChannel) {
    case ctx.state.appSettings.epp?.tradePolicyId:
      baseUrl += ctx.state.appSettings.epp?.hostname;
      break;
    case ctx.state.appSettings.ff?.tradePolicyId:
      baseUrl += ctx.state.appSettings.ff?.hostname;
      break;
    case ctx.state.appSettings.vip?.tradePolicyId:
      baseUrl += ctx.state.appSettings.vip?.hostname;
      break;
    case ctx.state.appSettings.o2p?.tradePolicyId:
      baseUrl += ctx.state.appSettings.o2p?.hostname;
      break;
    default:
      baseUrl += (ctx as Context)?.hostname;
  }
  return baseUrl + skuContext.DetailUrl;
}

export function sendAlert(ctx: Context | StatusChangeContext | Invitation | DropPriceAlertContext | BackInStockContext): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      if (!ctx.vtex.eventInfo?.sender) {
        switch (ctx.vtex.route.id) {
          case "cancelOrder":
            await createDocument(ctx as Context, AlertEntity, { subject: "SFMC Error", message: "Error while sending the cancellation email for the order " + ctx.vtex.route.params.orderId + "." })
            break;
        }
      } else {
        if (!isValid((ctx as Invitation).body.eventId)) {
          await createDocument(ctx as StatusChangeContext, AlertEntity, { subject: "SFMC Error", message: "Error while sending the confirmation email for the order " + (ctx as StatusChangeContext).body.orderId + "." })
        }
      }
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}

export function getSFMCDataByTradePolicy(appSettings: AppSettings, tradePolicy: string | undefined): SFMCSettings | undefined {
  let result: SFMCSettings | undefined = undefined;
  switch (tradePolicy) {
    case TradePolicy.O2P:
      result = appSettings.o2p;
      break;
    case TradePolicy.EPP:
      result = appSettings.epp;
      break;
    case TradePolicy.FF:
      result = appSettings.ff;
      break;
    case TradePolicy.VIP:
      result = appSettings.vip;
      break;
  }
  return result;
}

export function getSFMCDataByHostname(ctx: Context): SFMCSettings | undefined {
  let result: SFMCSettings | undefined = undefined;
  ctx.vtex.logger = new CustomLogger(ctx);
  let host: string = ctx.hostname.includes(ctx.vtex.account) ? ctx.query?.host as string : ctx.hostname;

  if (ctx.state.appSettings.vtex.isCCProject) {
    switch (host.toLowerCase()) {
      case ctx.state.appSettings.epp?.hostname?.toLowerCase():
        result = ctx.state.appSettings.epp;
        break;
      case ctx.state.appSettings.ff?.hostname?.toLowerCase():
        result = ctx.state.appSettings.ff;
        break;
      case ctx.state.appSettings.vip?.hostname?.toLowerCase():
        result = ctx.state.appSettings.vip;
        break;
    }
  } else {
    if (host.toLowerCase() == ctx.state.appSettings.o2p?.hostname?.toLowerCase()) {
      result = ctx.state.appSettings.o2p;
    }
  }
  return result;
}

export function getSFMCDataByOrder(ctx: Context | StatusChangeContext): SFMCSettings | undefined {
  let result: SFMCSettings | undefined = undefined;
  if (ctx.state.appSettings.vtex.isCCProject) {
    switch (ctx.state.orderData.salesChannel) {
      case ctx.state.appSettings.epp?.tradePolicyId:
        result = ctx.state.appSettings.epp;
        break;
      case ctx.state.appSettings.ff?.tradePolicyId:
        result = ctx.state.appSettings.ff;
        break;
      case ctx.state.appSettings.vip?.tradePolicyId:
        result = ctx.state.appSettings.vip;
        break;
    }
  } else {
    if (ctx.state.orderData.salesChannel == ctx.state.appSettings.o2p?.tradePolicyId) {
      result = ctx.state.appSettings.o2p;
    }
  }
  return result;
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

export const GenerateID = () => nanoid()

export const BuildProductDetails = (product: Product, o2p_HostName: string) => ({
  ProductName: product.productName,
  ProductCode: product.properties.find((spec: any) => spec.originalName == "CommercialCode_field")?.values[0] || '',
  ProductImage: product.items[0].images[0].imageUrl,
  URL: WORKSPACE != "master" ? `https://${WORKSPACE}--${o2p_HostName}/${product.linkText}/p` : `https://${o2p_HostName}/${product.linkText}/p`
})

export const UniqueArray = (array: any[]) => [...new Set(array)]

export function isValidCategoryAdvice(category: string): Boolean {

  return categoryValues.includes(category.toLowerCase())

}

export function whiteSpaceFieldCleaner(arr: any): Object {
  const cleanedArr = arr.filter((item: string) => {
    return item != "";
  })
  return cleanedArr
}

export const FormatPrice = (price: number) => price.toFixed(2).replace('.', ',')

export const isPresale = (order: Order): boolean => order.items.some((item) => item.preSaleDate && new Date(item.preSaleDate).getTime() > Date.now())


export const getDeliveryPrice = (settings: AppSettings, item: any): number => settings.vtex?.shippingInfo?.deliveryServiceId && item?.additionalInfo?.offeringTypeId == settings.vtex.shippingInfo.deliveryServiceId ? item.price : 0

export const isDeliveryService = (settings: AppSettings, item: any): boolean => settings.vtex?.shippingInfo?.deliveryServiceId != undefined && item?.additionalInfo?.offeringTypeId == settings.vtex.shippingInfo.deliveryServiceId



