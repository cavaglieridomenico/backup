//@ts-nocheck

import { AddServGeneralInfo, AppSettings } from "../typings/config";
import { FakeService } from "../typings/fakeService";
import { TranslationsKeys } from "../typings/translations";
import { OrderItem, OrderDetails, OrderConfCancTemplate, UserInfo, RefundTemplate, ReturnTemplate } from "../typings/types";
import { getProductUrl, isValid } from "./functions";

export function confCancEmailMapper(order: Object, ecofeeTotal: number, userInfo: UserInfo, appSettings: AppSettings): OrderConfCancTemplate {
  let shippingPrice = order.totals.find((t: { id: string; }) => t.id === "Shipping").value;
  let sum = 0;
  let sumService = 0;
  let quantityService = 0;
  order.items.forEach((price: { listPrice: number; quantity: number; bundleItems: []; sellingPrice:any; }) => {
      if(price.sellingPrice!=0){
        sum += (price.listPrice*price.quantity);
      }
      price.bundleItems.forEach((item: any) => {
        sumService += (item?.price*item?.quantity);
        quantityService += item?.quantity;
      })
  })
  let discount = (sum+sumService)-order.value;
  let subtotal = sum+sumService;
  let orderId = order.orderId;
  let paymentMethods = appSettings.vtex.paymentPerTransactionId?.split(",");
  let paymentFound = false;
  for(let i = 0; i<paymentMethods?.length && !paymentFound; i++){
    if(paymentMethods[i]?.toLowerCase()==order.paymentData?.transactions[0]?.payments[0]?.paymentSystemName?.toLowerCase()){
      paymentFound = true;
    }
  }
  if(paymentFound){
    orderId = orderId+" ("+order.sequence+")";
  }
  let result: OrderConfCancTemplate =
      {
        To: {
          Address: userInfo.email,
          SubscriberKey: userInfo.email,
          ContactAttributes: {
            SubscriberAttributes: {
              orderId: orderId,
              orderNumberSAP: orderId,
              purchaseDate: order.creationDate,
              paymentMethod: isValid(order.paymentData?.transactions[0]?.payments[0]?.paymentSystemName)?order.paymentData.transactions[0].payments[0].paymentSystemName:"",
              creditCardNumber: isValid(order.paymentData?.transactions[0]?.payments[0]?.lastDigits)?order.paymentData.transactions[0].payments[0].lastDigits:"",
              klarnaReferenceCode: order.paymentData?.transactions[0]?.payments[0]?.paymentSystemName?.toLowerCase()?.includes("klarna") ? order.paymentData?.transactions[0]?.payments[0]?.tid : "",
              fiscalCode: getVat(order),
              orderProductPrice: formatPrice(sum),
              orderTotal: formatPrice(order.value),
              ecofee: (ecofeeTotal+"").includes(".")?ecofeeTotal+"":ecofeeTotal+".00",
              servicePrice: formatPrice(sumService),
              orderTotalAdjustment: formatPrice(discount),
              orderShippingPrice: formatPrice(shippingPrice),
              orderSubtotal: formatPrice(subtotal),
              serviceQuantity: quantityService+"",
              shippingFirstName: isValid(order.shippingData.address.receiverName)?order.shippingData.address.receiverName:"",
              shippingLastName: "",
              shippingAddress: (isValid(order.shippingData.address.street)?order.shippingData.address.street+" ":"")
                              +(isValid(order.shippingData.address.number)?order.shippingData.address.number+" ":"")
                              +(isValid(order.shippingData.address.complement)?order.shippingData.address.complement:""),
              shippingZipCode: isValid(order.shippingData.address.postalCode)?order.shippingData.address.postalCode:"",
              shippingCity: isValid(order.shippingData.address.city)?order.shippingData.address.city:"",
              shippingState: isValid(order.shippingData.address.state)?order.shippingData.address.state:"",
              shippingCountry: isValid(appSettings.vtex.defaultCountry)?
                                appSettings.vtex.defaultCountry:
                                (
                                  isValid(order.shippingData.address.country)?
                                    order.shippingData.address.country:
                                    ""
                                ),
              shippingEmail: userInfo.email,
              shippingPhone: formatPhone(order.clientProfileData.phone, appSettings),
              billingFirstName: isValid(order.clientProfileData.corporateName)?order.clientProfileData.corporateName:order.clientProfileData.firstName,
              billingLastName: isValid(order.clientProfileData.corporateName)?"":order.clientProfileData.lastName,
              billingAddress: (isValid(order.invoiceData?.address?.street) && isValid(order.invoiceData?.address?.number))?(order.invoiceData.address.street+" "+order.invoiceData.address.number):
                              (
                                (isValid(order.shippingData.address.street)?order.shippingData.address.street+" ":"")
                               +(isValid(order.shippingData.address.number)?order.shippingData.address.number+" ":"")
                               +(isValid(order.shippingData.address.complement)?order.shippingData.address.complement:"")
                              ),
              billingZipCode: isValid(order.invoiceData?.address?.postalCode)?order.invoiceData.address.postalCode:(isValid(order.shippingData.address.postalCode)?order.shippingData.address.postalCode:""),
              billingCity: isValid(order.invoiceData?.address?.city)?order.invoiceData.address.city:(isValid(order.shippingData.address.city)?order.shippingData.address.city:""),
              billingState:  isValid(order.invoiceData?.address?.state)?order.invoiceData.address.state:(isValid(order.shippingData.address.state)?order.shippingData.address.state:""),
              billingCountry: isValid(appSettings.vtex.defaultCountry)?
                                appSettings.vtex.defaultCountry:
                                (
                                  isValid(order.invoiceData.address.country)?
                                    order.invoiceData.address.country:
                                    (
                                      isValid(order.shippingData.address.country)?
                                        order.shippingData.address.country:
                                        ""
                                    )
                                ),
              billingEmail: getBillingEmail(order)=="email"?userInfo.email:"",
              billingPhone: getBillingPhone(order, appSettings),
              billingOfficeAddress: "",
              shipInstructions: "",
              redeemedPoints: "0",
              gainedPoints: "0",
              delivery: "",
              estematedDeliveryDate: isValid(order.shippingData?.logisticsInfo[0]?.deliveryWindow)?
                                     formatDateWithClock(order.shippingData.logisticsInfo[0].deliveryWindow.startDateUtc, order.shippingData.logisticsInfo[0].deliveryWindow.endDateUtc):
                                     (isValid(order.shippingData?.logisticsInfo[0]?.shippingEstimateDate)?formatDateWithoutClock(order.shippingData.logisticsInfo[0].shippingEstimateDate):"")
            }
          }
        }
      }
  return result;
}

export function orderDetailsMapper(vtexOrder: Object, ctx: Context, coupon: string[], premium: string[], skuContexts: [], skuImages: []): OrderDetails {
  let count = 0;
  let orders: OrderDetails = [];
  let legalWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId==ctx.state.orderData.salesChannel)?.legalWarranty;
  let extendedWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId==ctx.state.orderData.salesChannel)?.extendedWarranty;
  vtexOrder.items.forEach(function(item: {id: number, refId: string, uniqueId: string, quantity: number, productId: number, name: string, listPrice: number, sellingPrice: number, detailUrl: string, additionalInfo: { brandName: string }}){
    let sku = skuContexts.find(f => f.skuId==item.id)?.context;
    let images = skuImages.find(f => f.skuId==item.id)?.images;
    let imageSingle = images.find((image: any) => image.IsMain);
    let image = sku.Images.find((i: any) => i.ImageName == imageSingle.Label)?.ImageUrl;
    let category = undefined;
    let prodCatTranslation = ctx.state.appSettings.vtex.translations?.find(f => f.key==TranslationsKeys.products)?.value;
    prodCatTranslation = prodCatTranslation ? prodCatTranslation : TranslationsKeys.products;
    let accessCatTranslation = ctx.state.appSettings.vtex.translations?.find(f => f.key==TranslationsKeys.accessories)?.value;
    accessCatTranslation = accessCatTranslation ? accessCatTranslation : TranslationsKeys.accessories;
    if(Object.keys(sku.ProductCategories).find(f => sku.ProductCategories[f]==prodCatTranslation)!=undefined){
      category = TranslationsKeys.products;
    }
    if(Object.keys(sku.ProductCategories).find(f => sku.ProductCategories[f]==accessCatTranslation)!=undefined){
      category = TranslationsKeys.accessories;
    }
    let commCode = sku.ProductSpecifications?.find(f => f.FieldName=="CommercialCode_field")?.FieldValues[0];
    let productInfoSheet = sku.ProductSpecifications?.find(f => f.FieldName=="product-information-sheet")?.FieldValues[0];
    let energyLogo = sku.ProductSpecifications?.find(f => f.FieldName=="EnergyLogo_image")?.FieldValues[0];
    let hasLegalWarranty = item.bundleItems?.find(b => b.additionalInfo?.offeringTypeId==legalWarrId) ? true : false;
    let hasExtendedWarranty = item.bundleItems?.find(b => b.additionalInfo?.offeringTypeId==extendedWarrId) ? true : false;
    let legalWarrLink = ctx.state.dngLinks?.find(f => f.itemId==item.uniqueId && f.typeOfWarranty==legalWarrId)?.itemToken;
    legalWarrLink = (hasLegalWarranty?
                  (isValid(legalWarrLink)?
                    (ctx.state.appSettings.vtex.dngSettings?.redirectUrl+"?id="+legalWarrLink):
                    ctx.state.appSettings.vtex.dngSettings?.redirectUrl
                  ):
                  undefined
                )
    let extendedWarrLink = ctx.state.dngLinks?.find(f => f.itemId==item.uniqueId && f.typeOfWarranty==extendedWarrId)?.itemToken;
    extendedWarrLink = (hasExtendedWarranty?
                  (isValid(extendedWarrLink)?
                    (ctx.state.appSettings.vtex.dngSettings?.redirectUrl+"?id="+extendedWarrLink):
                    ctx.state.appSettings.vtex.dngSettings?.redirectUrl
                  ):
                  undefined
                )
    let orderId = vtexOrder.orderId;
    let paymentMethods = ctx.state.appSettings.vtex.paymentPerTransactionId?.split(",");
    let paymentFound = false;
    for(let i = 0; i<paymentMethods?.length && !paymentFound; i++){
      if(paymentMethods[i]?.toLowerCase()==vtexOrder.paymentData?.transactions[0]?.payments[0]?.paymentSystemName?.toLowerCase()){
        paymentFound = true;
      }
    }
    if(paymentFound){
      orderId = orderId+" ("+vtexOrder.sequence+")";
    }
    let order: OrderItem =
        {
            keys: {
                orderId: orderId,
                orderItemId: item.uniqueId
            },
            values: {
                coupon: premium.includes(item.productId)?coupon.slice(count,count+item.quantity).toString().replace(/,/g, '|'):"",
                commercialCode: commCode!=undefined?commCode:item.refId,
                code12NC: item.refId,
                orderItemQuantity: item.quantity+"",
                price: formatPrice(item.sellingPrice),
                productUrl: getProductUrl(ctx, ctx.state.userInfo?.tradePolicy, sku),
                imageUrl: image,
                brand: item.additionalInfo.brandName,
                isSuccessfullyPurchased: "true",
                serviceName: getServiceName(vtexOrder.salesChannel, ctx, item, category),
                serviceQuantity: getServiceQuantity(vtexOrder.salesChannel, ctx, item, category),
                servicePrice: getServicePrice(vtexOrder.salesChannel, ctx, item, category),
                EnergyLogo_image: isValid(energyLogo)?energyLogo:"",
                "product-information-sheet": isValid(productInfoSheet)?productInfoSheet:"",
            }
        }
    item.listPrice > item.sellingPrice ? order.values.crossedprice = formatPrice(item.listPrice) :  "";
    if(isValid(legalWarrLink) && ctx.state.appSettings.vtex.dngSettings?.hasDnG) { order.values.warrantyUrl10Y = legalWarrLink }
    if(isValid(extendedWarrLink) && ctx.state.appSettings.vtex.dngSettings?.hasDnG) { order.values.warrantyUrlWF = extendedWarrLink }
    count = premium.includes(item.productId)?count+item.quantity:count;
    orders.push(order);
  });
  return orders;
}

function getVat(data: any): string {
  let fiscaldata = data.customData?.customApps?.find(f => f.id == "fiscaldata");
  return (fiscaldata?.fields?.typeOfDocument+"").toLowerCase()=="company"?fiscaldata.fields.corporateDocument:"";
}

function getBillingEmail(data: any): string{
  let fiscaldata = data.customData?.customApps?.find(f => f.id == "fiscaldata");
  return (fiscaldata?.fields?.typeOfDocument+"").toLowerCase()=="company"?"":"email";
}

function getBillingPhone(data: any, appSettings: AppSettings): string{
  let fiscaldata = data.customData?.customApps?.find(f => f.id == "fiscaldata");
  return (fiscaldata?.fields?.typeOfDocument+"").toLowerCase()=="company"?"":formatPhone(data.clientProfileData.phone, appSettings);
}

function formatPhone(phone: any, appSettings: AppSettings): string{
  phone = phone+"";
  if(phone.length<=appSettings.vtex.phoneMaxLength){
    return phone;
  }
  return phone.substr(phone.length-appSettings.vtex.phoneMaxLength, phone.length);
}

function getServiceName(saleChannel: string, ctx: Context, item: any, category: string): string {
  let fiveYearsWarrantyId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId==saleChannel)?.fiveYearsWarranty;
  let fiveYearsWarranty = item.bundleItems.find(f => f.additionalInfo.offeringTypeId==fiveYearsWarrantyId)!=undefined?true:false;
  let delivery = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds==FakeService.FLOORDELIVERY)?.serviceName;
  let twoYearsWarranty = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds==FakeService.TWOYEARSWARRANTY)?.serviceName;
  let service = "";
  if(category==TranslationsKeys.products){
    if(fiveYearsWarranty){
      if(isValid(delivery)){
        service += delivery;
      }
    }else{
      if(isValid(delivery)){
        service += delivery;
      }
      if(isValid(service)){
        service += "|";
      }
      if(isValid(twoYearsWarranty)){
        service += twoYearsWarranty;
      }
    }
  }else{
    if(category==TranslationsKeys.accessories){
      if(isValid(delivery)){
        service += delivery;
      }
    }
  }
  let bundleItems = [];
  item.bundleItems?.forEach(bi => {
    let name = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds==(bi.additionalInfo.offeringTypeId+""))?.serviceName;
    name = name ? name : bi.name;
    bundleItems.push(name)
  })
  bundleItems = bundleItems.join("|");
  service = isValid(service) ?
              (
                bundleItems.length>0 ? (service+"|"+bundleItems) : service
              ):
              bundleItems;
  return service;
}

function getServiceQuantity(saleChannel: string, ctx: Context, item: any, category: string): string {
  let fiveYearsWarrantyId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId==saleChannel)?.fiveYearsWarranty;
  let fiveYearsWarranty = item.bundleItems.find(f => f.additionalInfo.offeringTypeId==fiveYearsWarrantyId)!=undefined?true:false;
  let delivery = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds==FakeService.FLOORDELIVERY)?.serviceName;
  let twoYearsWarranty = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds==FakeService.TWOYEARSWARRANTY)?.serviceName;
  let serviceQuantity = "";
  if(category==TranslationsKeys.products){
    if(fiveYearsWarranty){
      if(isValid(delivery)){
        serviceQuantity += "1";
      }
    }else{
      if(isValid(delivery)){
        serviceQuantity += "1";
      }
      if(isValid(serviceQuantity)){
        serviceQuantity += "|";
      }
      if(isValid(twoYearsWarranty)){
        serviceQuantity += "1";
      }
    }
  }else{
    if(category==TranslationsKeys.accessories){
      if(isValid(delivery)){
        serviceQuantity += "1";
      }
    }
  }
  if(item.bundleItems.length>0){
    serviceQuantity = isValid(serviceQuantity) ? (serviceQuantity+"|") : serviceQuantity;
    for(let i=0; i<item.bundleItems?.length-1; i++){
        serviceQuantity += item.bundleItems[i].quantity+"|";
    }
    serviceQuantity += item.bundleItems[item.bundleItems.length-1].quantity;
  }
  return serviceQuantity;
}

function getServicePrice(saleChannel: string, ctx: Context, item: any, category: string): string {
  let fiveYearsWarrantyId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId==saleChannel)?.fiveYearsWarranty;
  let fiveYearsWarranty = item.bundleItems.find(f => f.additionalInfo.offeringTypeId==fiveYearsWarrantyId)!=undefined?true:false;
  let delivery = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds==FakeService.FLOORDELIVERY)?.serviceName;
  let twoYearsWarranty = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds==FakeService.TWOYEARSWARRANTY)?.serviceName;
  let servicePrice = "";
  if(category==TranslationsKeys.products){
    if(fiveYearsWarranty){
      if(isValid(delivery)){
        servicePrice += "0.00";
      }
    }else{
      if(isValid(delivery)){
        servicePrice += "0.00";
      }
      if(isValid(servicePrice)){
        servicePrice += "|";
      }
      if(isValid(twoYearsWarranty)){
        servicePrice += "0.00";
      }
    }
  }else{
    if(category==TranslationsKeys.accessories){
      if(isValid(delivery)){
        servicePrice += "0.00";
      }
    }
  }
  if(item.bundleItems.length>0){
    servicePrice = isValid(servicePrice) ? (servicePrice+"|") : servicePrice;
    for(let i=0; i<item.bundleItems?.length-1; i++) {
        servicePrice += formatPrice(item.bundleItems[i].sellingPrice)+"|";
    }
    servicePrice += formatPrice(item.bundleItems[item.bundleItems.length-1].sellingPrice);
  }
  return servicePrice;
}

function formatDateWithClock(data: string, data2: string): string {
    let dataOriginal = new Date(data);
    let dataOriginal2 = new Date(data2);
    let a = parseInt(data.split("T")[1].split(":")[0]);
    let b = dataOriginal.getHours();
    let diff = a>=b?(a-b):b-a;
    let day = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate();
    let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1);
    let year = dataOriginal.getFullYear();
    let h1 = ((dataOriginal.getHours()-diff)%24)<10?"0"+((dataOriginal.getHours()-diff)%24):((dataOriginal.getHours()-diff)%24);
    let h2 = ((dataOriginal2.getHours()-diff)%24)<10?"0"+((dataOriginal2.getHours()-diff)%24):((dataOriginal2.getHours()-diff)%24);
    let m1 = dataOriginal.getMinutes()<10?"0"+dataOriginal.getMinutes():dataOriginal.getMinutes();
    let m2 = dataOriginal2.getMinutes()<10?"0"+dataOriginal2.getMinutes():dataOriginal2.getMinutes();
    return day+"/"+month+"/"+year+" "+h1+":"+m1+" - "+h2+":"+m2;
}

function formatDateWithoutClock(data: string): string {
    let dataOriginal = new Date(data);
    let day = dataOriginal.getDate()<10?'0'+dataOriginal.getDate():dataOriginal.getDate();
    let month = (dataOriginal.getMonth()+1)<10?'0'+(dataOriginal.getMonth()+1):(dataOriginal.getMonth()+1);
    return day+"/"+month+"/"+dataOriginal.getFullYear();

}

function formatPrice(price: number): string {
  return price==0?"0.00":(price.toString().substring(0, price.toString().length-2)+"."+ price.toString().substring(price.toString().length-2,price.toString().length));
}

export function refundEmailMapper(payload: Object): RefundTemplate{
  let object: RefundTemplate = {
      To: {
          Address: payload.Address+"",
          SubscriberKey: payload.SubscriberKey+"",
          ContactAttributes: {
              SubscriberAttributes: {
                  FirstName: payload.ContactAttributes?.SubscriberAttributes?.FirstName+"",
                  Surname: payload.ContactAttributes?.SubscriberAttributes?.Surname+"",
                  City: payload.ContactAttributes?.SubscriberAttributes?.City+"",
                  Address: payload.ContactAttributes?.SubscriberAttributes?.Address+"",
                  ClientEmail: payload.ContactAttributes?.SubscriberAttributes?.ClientEmail+"",
                  PhoneNumber: payload.ContactAttributes?.SubscriberAttributes?.PhoneNumber+"",
                  PickupAddress: payload.ContactAttributes?.SubscriberAttributes?.PickUpAddress+"",
                  OrderNumber: payload.ContactAttributes?.SubscriberAttributes?.OrderNumber+"",
                  ProductCode: payload.ContactAttributes?.SubscriberAttributes?.ProductCode+"",
                  //DeliveredDate: payload.ContactAttributes?.SubscriberAttributes?.DeliveredDate+"",
                  DocumentTransportNumber: payload.ContactAttributes?.SubscriberAttributes?.DocumentTransportNumber+"",
                  ReturnReason:  payload.ContactAttributes?.SubscriberAttributes?.RefundReason+"", // since the email templates have been swapped, also the related reasons need to be swapped //
                  Note:  payload.ContactAttributes?.SubscriberAttributes?.Note+"",
                  Country:  payload.ContactAttributes?.SubscriberAttributes?.Country+"",
                  Zip:  payload.ContactAttributes?.SubscriberAttributes?.Zip+"",
                  itemType:  payload.ContactAttributes?.SubscriberAttributes?.itemType+"",
                  WithdrawType: payload.ContactAttributes?.SubscriberAttributes?.WithdrawType+"" // "home" or "whirlpool"
              }
          }
      }
  }
  return object;
}

export function returnEmailMapper(payload: Object): ReturnTemplate {
  let object: ReturnTemplate = {
      To: {
          Address: payload.Address+"",
          SubscriberKey: payload.SubscriberKey+"",
          ContactAttributes: {
              SubscriberAttributes: {
                  FirstName:  payload.ContactAttributes?.SubscriberAttributes?.FirstName+"",
                  Surname:  payload.ContactAttributes?.SubscriberAttributes?.Surname+"",
                  City: payload.ContactAttributes?.SubscriberAttributes?.City+"",
                  Address:payload.ContactAttributes?.SubscriberAttributes?.Address+"",
                  ClientEmail: payload.ContactAttributes?.SubscriberAttributes?.ClientEmail+"",
                  PhoneNumber: payload.ContactAttributes?.SubscriberAttributes?.PhoneNumber+"",
                  OrderNumber: payload.ContactAttributes?.SubscriberAttributes?.OrderNumber+"",
                  ProductCode: payload.ContactAttributes?.SubscriberAttributes?.ProductCode+"",
                  PickupAddress: payload.ContactAttributes?.SubscriberAttributes?.pickUpAddress+"",
                  //DeliveredDate: payload.ContactAttributes?.SubscriberAttributes?.DeliveredDate+"",
                  DocumentTransportNumber: payload.ContactAttributes?.SubscriberAttributes?.DocumentTransportNumber+"", // since the email templates have been swapped, also the related reasons need to be swapped //
                  RefundReason: payload.ContactAttributes?.SubscriberAttributes?.RefundReason+"",
                  Note: payload.ContactAttributes?.SubscriberAttributes?.Note+"",
                  Country: payload.ContactAttributes?.SubscriberAttributes?.Country+"",
                  Zip: payload.ContactAttributes?.SubscriberAttributes?.Zip+"",
                  itemType: payload.ContactAttributes?.SubscriberAttributes?.itemType+"",
                  WithdrawType: payload.ContactAttributes?.SubscriberAttributes?.WithdrawType+"" // "home" or "whirlpool"
              }
          }
      }
  }
  return object;
}
