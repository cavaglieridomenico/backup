import { getProductInfoSheet } from "../middlewares/getProduct";
import { AppSettings } from "../typings/config";
import { FakeService } from "../typings/fakeService";
import { Address, TotalIds } from "../typings/order";
import { TranslationsKeys } from "../typings/translations";
import { OrderItem, OrderDetails, OrderConfCancTemplate, RefundTemplate, ReturnTemplate, Apps, ModalType, DeliveryType, AddressPattern, SpAccDetails } from "../typings/types";
import { FarEyeEntity, fgasSpec, leadTimeSpec } from "./constants";
import { /*getDeliveryPrice,*/ getProductUrl, isDeliveryService, isValid } from "./functions";

export async function confCancEmailMapper(ctx: Context | StatusChangeContext): Promise<OrderConfCancTemplate> {
  let shippingPrice = ctx.state.orderData.totals.find(t => t.id.toLowerCase() == TotalIds.SHIPPING)?.value || 0;
  //al prezzo della shipping devo aggiungere il costo di servizio di shipping.
  let sum = 0;
  let sumService = 0;
  let totalPerService: any = {};
  let quantityService = 0;
  let deliveryService = 0
  const appSettings = ctx.state.appSettings
  const serviceInTotals = appSettings.vtex?.additionalServices?.serviceInTotals
  ctx.state.orderData.items.forEach(item => {
    if (item.sellingPrice != 0) {
      sum += (item.listPrice * item.quantity);
    }
    item.bundleItems.forEach((item: any) => {
      if (isDeliveryService(appSettings, item)) {
        deliveryService += item.price
      } else {
        const serviceCost = item?.price * item?.quantity
        sumService += serviceCost;
        quantityService += item?.quantity;
        totalPerService[item.name] = (totalPerService[item.name] || 0) + serviceCost
      }
    })
  })
  // sumService -= deliveryService
  shippingPrice += deliveryService
  let discount = (sum + sumService + shippingPrice) - ctx.state.orderData.value;
  let subtotal = serviceInTotals ? sum : sum + sumService;

  let orderId = ctx.state.orderData.orderId;
  let paymentMethods = ctx.state.appSettings.vtex.paymentPerTransactionId?.split(",") || [];
  let paymentFound = false;
  for (let i = 0; i < paymentMethods.length && !paymentFound; i++) {
    if (paymentMethods[i]?.toLowerCase() == ctx.state.orderData.paymentData?.transactions[0]?.payments[0]?.paymentSystemName?.toLowerCase()) {
      paymentFound = true;
    }
  }
  if (paymentFound) {
    orderId = orderId + " (" + ctx.state.orderData.sequence + ")";
  }
  let shipTogether = ctx.state.orderData.customData?.customApps?.find((app: any) => app.id == Apps.TRADEPLACE)?.fields?.shipTogether;
  let freeDelivery = ctx.state.appSettings.vtex.shippingInfo?.labelForFreeDelivery?.find(l => l.key?.toLowerCase() == ctx.state.locale?.toLowerCase())?.value;
  ctx.state.ecofeeTotal = ctx.state.ecofeeTotal ? ctx.state.ecofeeTotal : 0;

  let deliveryDates = await getDeliveryDate(ctx.state.orderData, ctx.state.appSettings, ctx);

  let result: OrderConfCancTemplate =
  {
    To: {
      Address: ctx.state.userInfo!.email,
      SubscriberKey: ctx.state.userInfo!.email,
      ContactAttributes: {
        SubscriberAttributes: {
          orderId: orderId,
          orderNumberSAP: orderId,
          purchaseDate: ctx.state.orderData.creationDate,
          paymentMethod: isValid(ctx.state.orderData.paymentData?.transactions[0]?.payments[0]?.paymentSystemName) ? ctx.state.orderData.paymentData.transactions[0].payments[0].paymentSystemName : "",
          creditCardNumber: isValid(ctx.state.orderData.paymentData?.transactions[0]?.payments[0]?.lastDigits) ? ctx.state.orderData.paymentData.transactions[0].payments[0].lastDigits : "",
          klarnaReferenceCode: ctx.state.orderData.paymentData?.transactions[0]?.payments[0]?.paymentSystemName?.toLowerCase()?.includes("klarna") ? ctx.state.orderData.paymentData?.transactions[0]?.payments[0]?.tid : "",
          fiscalCode: getVat(ctx.state.orderData),
          orderProductPrice: formatPrice(sum),
          orderTotal: formatPrice(ctx.state.orderData.value),
          ecofee: (ctx.state.ecofeeTotal + "").includes(".") ? (ctx.state.ecofeeTotal + "") : (ctx.state.ecofeeTotal + ".00"),
          servicePrice: serviceInTotals ? Object.values<number>(totalPerService).map(price => formatPrice(price)).join('|') : formatPrice(sumService),
          serviceName: serviceInTotals ? Object.keys(totalPerService).join('|') : undefined,
          orderTotalAdjustment: formatPrice(discount),
          orderShippingPrice: formatPrice(shippingPrice),
          orderSubtotal: formatPrice(subtotal),
          serviceQuantity: quantityService + "",
          shippingFirstName: isValid(ctx.state.orderData.shippingData.address.receiverName) ? ctx.state.orderData.shippingData.address.receiverName! : "",
          shippingLastName: "",
          shippingAddress: getAddress(ctx.state.appSettings, ctx.state.orderData.shippingData.address),
          shippingZipCode: isValid(ctx.state.orderData.shippingData.address.postalCode) ? ctx.state.orderData.shippingData.address.postalCode : "",
          shippingCity: isValid(ctx.state.orderData.shippingData.address.city) ? ctx.state.orderData.shippingData.address.city : "",
          shippingState: isValid(ctx.state.orderData.shippingData.address.state) ? ctx.state.orderData.shippingData.address.state : "",
          shippingCountry: isValid(ctx.state.appSettings.vtex.defaultCountry) ?
            ctx.state.appSettings.vtex.defaultCountry! :
            (
              isValid(ctx.state.orderData.shippingData.address.country) ?
                ctx.state.orderData.shippingData.address.country :
                ""
            ),
          shippingEmail: ctx.state.userInfo!.email,
          shippingPhone: formatPhone(ctx.state.orderData.clientProfileData.phone, ctx.state.appSettings),
          billingFirstName: isValid(ctx.state.orderData.clientProfileData.corporateName) ? ctx.state.orderData.clientProfileData.corporateName : ctx.state.orderData.clientProfileData.firstName,
          billingLastName: isValid(ctx.state.orderData.clientProfileData.corporateName) ? "" : ctx.state.orderData.clientProfileData.lastName,
          billingAddress: getAddress(ctx.state.appSettings, ctx.state.orderData.shippingData.address, ctx.state.orderData.invoiceData?.address, true),
          billingZipCode: isValid(ctx.state.orderData.invoiceData?.address?.postalCode) ? ctx.state.orderData.invoiceData!.address!.postalCode : (isValid(ctx.state.orderData.shippingData.address.postalCode) ? ctx.state.orderData.shippingData.address.postalCode : ""),
          billingCity: isValid(ctx.state.orderData.invoiceData?.address?.city) ? ctx.state.orderData.invoiceData!.address!.city : (isValid(ctx.state.orderData.shippingData.address.city) ? ctx.state.orderData.shippingData.address.city : ""),
          billingState: isValid(ctx.state.orderData.invoiceData?.address?.state) ? ctx.state.orderData.invoiceData!.address!.state : (isValid(ctx.state.orderData.shippingData.address.state) ? ctx.state.orderData.shippingData.address.state : ""),
          billingCountry: isValid(ctx.state.appSettings.vtex.defaultCountry) ?
            ctx.state.appSettings.vtex.defaultCountry! :
            (
              isValid(ctx.state.orderData.invoiceData?.address?.country) ?
                ctx.state.orderData.invoiceData!.address!.country :
                (
                  isValid(ctx.state.orderData.shippingData.address.country) ?
                    ctx.state.orderData.shippingData.address.country :
                    ""
                )
            ),
          billingEmail: getBillingEmail(ctx.state.orderData) == "email" ? ctx.state.userInfo!.email : "",
          billingPhone: getBillingPhone(ctx.state.orderData, ctx.state.appSettings),
          billingOfficeAddress: "",
          shipInstructions: isValid(ctx.state.orderData.shippingData.address.complement) ? ctx.state.orderData.shippingData.address.complement : "",
          redeemedPoints: "0",
          gainedPoints: "0",
          delivery: shippingPrice == 0 ? (isValid(freeDelivery) ? freeDelivery! : "") : formatPrice(shippingPrice),
          estematedDeliveryDate: deliveryDates.deliveryDateFG,
          deliveryDateSP: deliveryDates.deliveryDateSP_ACC,
          deliveryType: getDeliveryType(ctx.state.orderData, ctx.state.appSettings, ctx.state.spare_accDetails),
          //SDA: containsSDAOrCGAS(ctx.state.orderData, ctx.state.skuContexts!, ctx.state.appSettings), IMPORTANT!! (RIPRISTINARE LA LOGICA DOPO FLUSSO GCP)
          SDA: false,
          shipTogether: isValid(shipTogether) ? shipTogether : "false",
          IsGas: containsFGAS(ctx.state.skuContexts!)
        }
      }
    }
  }

  return result;
}

export function orderDetailsMapper(vtexOrder: any, ctx: Context | StatusChangeContext, coupon: string[], premium: string[], skuContexts: any[], skuImages: any[]): OrderDetails {
  let count = 0;
  let orders: OrderDetails = [];
  let legalWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId == ctx.state.orderData.salesChannel)?.legalWarranty;
  let extendedWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId == ctx.state.orderData.salesChannel)?.extendedWarranty;
  let shippingInfo = getItemsDeliveryDates(vtexOrder, ctx.state.appSettings, skuContexts, ctx);
  vtexOrder.items.forEach((item: any) => {
    let sku = skuContexts.find(f => f.skuId == item.id)?.context;
    let images = skuImages.find(f => f.skuId == item.id)?.images;
    let imageSingle = images.find((image: any) => image.IsMain);
    let image = sku.Images.find((i: any) => i.ImageName == imageSingle?.Label && isValid(imageSingle?.Label))?.ImageUrl;
    image = image ? image : sku.Images[0].ImageUrl;
    let category = undefined;
    let prodCatTranslation = ctx.state.appSettings.vtex.translations?.find(f => f.key == TranslationsKeys.products)?.value;
    prodCatTranslation = prodCatTranslation ? prodCatTranslation : TranslationsKeys.products;
    let accessCatTranslation = ctx.state.appSettings.vtex.translations?.find(f => f.key == TranslationsKeys.accessories)?.value;
    accessCatTranslation = accessCatTranslation ? accessCatTranslation : TranslationsKeys.accessories;
    if (Object.keys(sku.ProductCategories).find(f => sku.ProductCategories[f] == prodCatTranslation)) {
      category = TranslationsKeys.products;
    }
    if (Object.keys(sku.ProductCategories).find(f => sku.ProductCategories[f] == accessCatTranslation)) {
      category = TranslationsKeys.accessories;
    }
    let commCode = sku.ProductSpecifications?.find((f: any) => f.FieldName == "CommercialCode_field")?.FieldValues[0];
    let productInfoSheet = getProductInfoSheet(sku.ProductSpecifications, ctx.state.appSettings.vtex.specifications?.productDataSheet)
    let isFGAS = sku.ProductSpecifications?.find((f: any) => f.FieldName == fgasSpec && f.FieldValues[0] == "false") ? "True" : "False";
    let energyLogo = sku.ProductSpecifications?.find((f: any) => f.FieldName == "EnergyLogo_image")?.FieldValues[0];
    let hasLegalWarranty = item.bundleItems?.find((b: any) => b.additionalInfo?.offeringTypeId == legalWarrId) ? true : false;
    let hasExtendedWarranty = item.bundleItems?.find((b: any) => b.additionalInfo?.offeringTypeId == extendedWarrId) ? true : false;
    let legalWarrLink = ctx.state.dngLinks?.find(f => f.itemId == item.uniqueId && f.typeOfWarranty == legalWarrId)?.itemToken;
    legalWarrLink = (hasLegalWarranty ?
      (isValid(legalWarrLink) ?
        (ctx.state.appSettings.vtex.dngSettings?.redirectUrl + "?id=" + legalWarrLink) :
        ctx.state.appSettings.vtex.dngSettings?.redirectUrl
      ) :
      undefined
    )
    let extendedWarrLink = ctx.state.dngLinks?.find(f => f.itemId == item.uniqueId && f.typeOfWarranty == extendedWarrId)?.itemToken;
    extendedWarrLink = (hasExtendedWarranty ?
      (isValid(extendedWarrLink) ?
        (ctx.state.appSettings.vtex.dngSettings?.redirectUrl + "?id=" + extendedWarrLink) :
        ctx.state.appSettings.vtex.dngSettings?.redirectUrl
      ) :
      undefined
    )

    let orderId = vtexOrder.orderId;
    let paymentMethods = ctx.state.appSettings.vtex.paymentPerTransactionId?.split(",") || [];
    let paymentFound = false;
    for (let i = 0; i < paymentMethods?.length && !paymentFound; i++) {
      if (paymentMethods[i]?.toLowerCase() == vtexOrder.paymentData?.transactions[0]?.payments[0]?.paymentSystemName?.toLowerCase()) {
        paymentFound = true;
      }
    }
    if (paymentFound) {
      orderId = orderId + " (" + vtexOrder.sequence + ")";
    }
    let order: OrderItem =
    {
      keys: {
        orderId: orderId,
        orderItemId: item.uniqueId
      },
      values: {
        coupon: premium.includes(item.productId) ? coupon.slice(count, count + item.quantity).toString().replace(/,/g, '|') : "",
        commercialCode: commCode ? commCode : item.refId,
        code12NC: item.refId,
        orderItemQuantity: item.quantity + "",
        price: formatPrice(item.sellingPrice),
        productUrl: getProductUrl(ctx, vtexOrder.salesChannel, sku),
        ProductName: item.productName,
        imageUrl: image,
        brand: item.additionalInfo.brandName,
        isSuccessfullyPurchased: "true",
        serviceName: getServiceName(vtexOrder.salesChannel, ctx, item, category),
        serviceQuantity: getServiceQuantity(vtexOrder.salesChannel, ctx, item, category),
        servicePrice: getServicePrice(vtexOrder.salesChannel, ctx, item, category),
        EnergyLogo_image: isValid(energyLogo) ? energyLogo : "",
        "product-information-sheet": isValid(productInfoSheet) ? productInfoSheet : "",
        LeadTime: shippingInfo.get(item.uniqueId)?.dataType == "leadtime" ? shippingInfo.get(item.uniqueId)?.shippingData as string : "",
        estimatedDeliveryDate: shippingInfo.get(item.uniqueId)?.dataType == "delivery" ? shippingInfo.get(item.uniqueId)?.shippingData as string : "",
        IsGas: isCGAS(item, vtexOrder.salesChannel, sku, ctx.state.appSettings),
        FGAS: isFGAS
      }
    }
    item.listPrice > item.sellingPrice ? order.values.crossedprice = formatPrice(item.listPrice) : "";
    if (isValid(legalWarrLink) && ctx.state.appSettings.vtex.dngSettings?.hasDnG) { order.values.warrantyUrl10Y = legalWarrLink }
    if (isValid(extendedWarrLink) && ctx.state.appSettings.vtex.dngSettings?.hasDnG) { order.values.warrantyUrlWF = extendedWarrLink }
    count = premium.includes(item.productId) ? count + item.quantity : count;
    orders.push(order);
  });

  return orders;
}

function getAddress(appSettings: AppSettings, shippingAddress: Address, invoiceAddress: Address | undefined = undefined, invoiceData: boolean = false): string {
  let address = "";
  if (invoiceData && invoiceAddress) {
    if (appSettings.vtex.addressPattern == AddressPattern.ITALIAN) {
      address = (isValid(invoiceAddress.street) ? invoiceAddress.street + " " : "") +
        (isValid(invoiceAddress.number) ? invoiceAddress.number + " " : "") +
        (isValid(invoiceAddress.complement) ? invoiceAddress.complement : "")
    } else if (appSettings.vtex.addressPattern == AddressPattern.FRANCE) {
      address = (isValid(invoiceAddress.number) ? invoiceAddress.number + " " : "") +
        (isValid(invoiceAddress.street) ? invoiceAddress.street + " " : "") +
        (isValid(invoiceAddress.complement) ? invoiceAddress.complement : "")
    } else {
      address = (isValid(invoiceAddress.complement) ? invoiceAddress.complement + " " : "") +
        (isValid(invoiceAddress.number) ? invoiceAddress.number + " " : "") +
        (isValid(invoiceAddress.street) ? invoiceAddress.street : "")
    }
  } else {
    if (appSettings.vtex.addressPattern == AddressPattern.ITALIAN) {
      address = (isValid(shippingAddress.street) ? shippingAddress.street + " " : "") +
        (isValid(shippingAddress.number) ? shippingAddress.number + " " : "") +
        (isValid(shippingAddress.complement) ? shippingAddress.complement : "")
    } else if (appSettings.vtex.addressPattern == AddressPattern.FRANCE) {
      address = (isValid(shippingAddress.number) ? shippingAddress.number + " " : "") +
        (isValid(shippingAddress.street) ? shippingAddress.street + " " : "") +
        (isValid(shippingAddress.complement) ? shippingAddress.complement : "")
    } else {
      address = (isValid(shippingAddress.complement) ? shippingAddress.complement + " " : "") +
        (isValid(shippingAddress.number) ? shippingAddress.number + " " : "") +
        (isValid(shippingAddress.street) ? shippingAddress.street : "")
    }
  }
  return address.trim();
}

function getItemsDeliveryDates(order: any, appSettings: AppSettings, skuContexts: any[], ctx: Context | StatusChangeContext): Map<string, { dataType: string, shippingData: string }> {
  let deliveryDates: String[] = [];
  let map = new Map<string, { dataType: string, shippingData: string }>();


  let reservationCode = order.customData?.customApps?.find((app: any) => app.id == Apps.HDX)?.fields?.reservationCode;
  let inStockSP: string | string[] = appSettings.vtex.shippingInfo?.inStockSP as string;
  inStockSP = inStockSP?.split(",");

  let outOfStockSP = appSettings.vtex.shippingInfo?.outOfStockSP;

  skuContexts.forEach((item, index) => {

    let item_LogisticInfo = order.shippingData.logisticsInfo[index];

    if (item.context.ModalType == ModalType.ELECTRONICS) {  //controllo sul modalType per distinguere FG da spare e accessori

      let deliveryDate = formatDateWithoutClock(item_LogisticInfo.shippingEstimateDate);
      map.set(order.items[index].uniqueId, { dataType: "delivery", shippingData: deliveryDate });
      ctx.state.spare_accDetails.containSpareAcc = true;
      ctx.state.spare_accDetails.estematedDeliveryDate_SpAcc = deliveryDate;
      ctx.state.spare_accDetails.spAccIndex.push(index)

    } else if (appSettings.vtex.shippingInfo?.hdx && isValid(reservationCode)) { //controllo sul reservationCode (solo per FG) per distinguere FG inStock da OutOfStock

      if ((inStockSP as string[]).some((x: any) => x == item_LogisticInfo.deliveryIds[0].courierId)) {
        let deliveryDate = formatDateWithClock(item_LogisticInfo.deliveryWindow.startDateUtc, item_LogisticInfo.deliveryWindow.endDateUtc);
        map.set(order.items[index].uniqueId, { dataType: "delivery", shippingData: deliveryDate });
        let date = deliveryDate?.split(" ")[0]
        deliveryDates.push(date);
      } else {
        if (item_LogisticInfo.deliveryIds[0].courierId == outOfStockSP) {
          let leadTime = skuContexts.find(f => f.skuId == order.items[index].id)?.context?.ProductSpecifications?.find((spec: any) => spec.FieldName == leadTimeSpec)?.FieldValues[0];
          map.set(order.items[index].uniqueId, { dataType: "leadtime", shippingData: leadTime });
        }
      }
    } else {
      if (item_LogisticInfo.deliveryIds[0].courierId == outOfStockSP) {
        let leadTime = skuContexts.find(f => f.skuId == order.items[index].id)?.context?.ProductSpecifications?.find((spec: any) => spec.FieldName == leadTimeSpec)?.FieldValues[0];
        map.set(order.items[index].uniqueId, { dataType: "leadtime", shippingData: leadTime });
      } else {
        let deliveryDate = formatDateWithoutClock(item_LogisticInfo.shippingEstimateDate);
        map.set(order.items[index].uniqueId, { dataType: "delivery", shippingData: deliveryDate });

      }


    }

  })

  return map;
}

function isCGAS(item: any, salesChannel: string, skuContext: any, appSettings: AppSettings): boolean {
  let installationId = appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(as => as.salesChannelId == salesChannel)?.installation;
  return skuContext.ModalType == ModalType.FURNITURE && (item.bundleItems?.find((bi: any) => bi.additionalInfo.offeringTypeId == installationId) ? true : false);
}

function getDeliveryDate(order: any, appSettings: AppSettings, ctx: Context | StatusChangeContext): Promise<{ deliveryDateFG: string, deliveryDateSP_ACC: string }> {
  let deliveryDates = {
    deliveryDateFG: "",
    deliveryDateSP_ACC: ""
  };

  if (appSettings.vtex.shippingInfo?.hdx) {

    let reservationCode = order.customData?.customApps?.find((app: any) => app.id == Apps.HDX)?.fields?.reservationCode;
    let inStockSP: string | string[] = appSettings.vtex.shippingInfo?.inStockSP as string;
    inStockSP = inStockSP?.split(",");
    let inStockProduct = order.shippingData.logisticsInfo?.find((item: any) => (inStockSP as string[]).some((x: any) => x == item.deliveryIds[0].courierId)
      && !ctx.state.spare_accDetails.spAccIndex.includes(item.itemIndex));

    //&& instockProduct fix(pezza) for OOS FG with reservation code valid
    deliveryDates.deliveryDateFG = isValid(reservationCode) && inStockProduct ? formatDateWithoutClock(inStockProduct.shippingEstimateDate) : "";

  } else {
    deliveryDates.deliveryDateFG = isValid(order.shippingData?.logisticsInfo[0]?.deliveryWindow) ?
      formatDateWithClock(order.shippingData.logisticsInfo[0].deliveryWindow.startDateUtc, order.shippingData.logisticsInfo[0].deliveryWindow.endDateUtc) :
      formatDateWithoutClock(order.shippingData.logisticsInfo[0].shippingEstimateDate);
  }

  deliveryDates.deliveryDateSP_ACC = ctx.state.spare_accDetails?.estematedDeliveryDate_SpAcc;
  if (ctx.state.appSettings.vtex.shippingInfo?.checkReservationForCustomDeliveryLable) {
    return ctx.clients.masterdata.searchDocuments({ dataEntity: FarEyeEntity, fields: ["reservationCode"], pagination: { page: 1, pageSize: 1 }, where: `orderId=${order.orderId}` })
      .then((data: any) => {
        if (data.length > 0 && data[0]?.reservationCode)
          return deliveryDates;
        else {
          deliveryDates.deliveryDateFG = ctx.state.appSettings.vtex.shippingInfo?.noReservationDeliveryLable as string//custom sentence
          return deliveryDates
        }
      })
  } else return deliveryDates as any
}

function getDeliveryType(order: any, appSettings: AppSettings, spare_accDetails: SpAccDetails): number {
  let deliveryType: number | undefined = undefined;
  let inStockW = appSettings.vtex.shippingInfo?.inStockW;
  let outOfStockW = appSettings.vtex.shippingInfo?.outOfStockW;
  let containsIS_FG = false;
  let containsOOS_FG = false;

  let reservationCode = order.customData?.customApps?.find((app: any) => app.id == Apps.HDX)?.fields?.reservationCode;

  if (isValid(inStockW) && isValid(outOfStockW)) {

    if (appSettings.vtex.shippingInfo?.hdx) {


      containsIS_FG = order.shippingData.logisticsInfo.find((item: any) => item.deliveryIds[0].warehouseId == inStockW
        && !spare_accDetails.spAccIndex.includes(item.itemIndex))
        && isValid(reservationCode) as boolean;

      containsOOS_FG = order.shippingData.logisticsInfo.find((item: any) => item.deliveryIds[0].warehouseId == outOfStockW)
        || (!isValid(reservationCode) as boolean && order.shippingData.logisticsInfo.find((item: any) => item.deliveryIds[0].warehouseId == inStockW && !spare_accDetails.spAccIndex.includes(item.itemIndex)));
    } else {

      containsIS_FG = order.shippingData.logisticsInfo.find((item: any) => item.deliveryIds[0].warehouseId == inStockW
        && !spare_accDetails.spAccIndex.includes(item.itemIndex)
      )

      containsOOS_FG = order.shippingData.logisticsInfo.find((item: any) => item.deliveryIds[0].warehouseId == outOfStockW);

    }
    if (spare_accDetails.containSpareAcc) {

      if (!containsIS_FG && !containsOOS_FG) {
        deliveryType = DeliveryType.ONLY_SPACC;
      } else if (containsIS_FG && !containsOOS_FG) {
        deliveryType = DeliveryType.INSTOCK_SPACC;
      } else {
        if (!containsIS_FG && containsOOS_FG) {
          deliveryType = DeliveryType.OUTOFSTOCK_SPACC;
        } else {
          deliveryType = DeliveryType.MIXED_SPACC;
        }
      }

    } else {
      if (containsIS_FG && !containsOOS_FG) {
        deliveryType = DeliveryType.INSTOCK_FG;
      } else {
        if (!containsIS_FG && containsOOS_FG) {
          deliveryType = DeliveryType.OUTOFSTOCK_FG;
        } else {
          deliveryType = DeliveryType.MIXED_FG;
        }
      }
    }
  }
  return deliveryType as number;
}

/*
function containsSDAOrCGAS(order: any, skuContexts: any[], appSettings: AppSettings): boolean {
  let hasSDA = skuContexts.find(s => s.context?.ModalType == ModalType.WHITE_GOODS) ? true : false;
  let hasCGAS = false;
  if (!hasSDA) {
    let installationId = appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(as => as.salesChannelId == order.salesChannel)?.installation;
    skuContexts.filter(s => s.context?.ModalType == ModalType.FURNITURE)?.forEach(s => {

        console.log("file: mapper.ts:416 ~ spare_accDetails.spAccIndex.includes(item.itemIndex)", spare_accDetails.spAccIndex.includes(item.itemIndex))

      order.items.filter((i: any) => i.id == (s.context.Id + ""))?.forEach((i: any) => {
        if (i.bundleItems.find((b: any) => b.additionalInfo.offeringTypeId == installationId)) {
          hasCGAS = true;
        }
      })
    })
  }
  return hasSDA || hasCGAS;
}
*/

function containsFGAS(skuContexts: any[]): string {
  return skuContexts.find(s => s.context?.ProductSpecifications?.find((ps: any) => ps.FieldName == fgasSpec && ps.FieldValues[0] == "false")) ? "True" : "False";
}

function getVat(data: any): string {
  let fiscaldata = data.customData?.customApps?.find((f: any) => f.id == "fiscaldata");
  return isValid(fiscaldata?.fields?.codiceFiscaleAzienda) ?
    fiscaldata.fields.codiceFiscaleAzienda :
    (
      (fiscaldata?.fields?.typeOfDocument + "")?.toLowerCase() == "company" ?
        fiscaldata.fields.corporateDocument :
        ""
    );
}

function getBillingEmail(data: any): string {
  let fiscaldata = data.customData?.customApps?.find((f: any) => f.id == "fiscaldata");
  return (fiscaldata?.fields?.typeOfDocument + "")?.toLowerCase() == "company" ? "" : "email";
}

function getBillingPhone(data: any, appSettings: AppSettings): string {
  let fiscaldata = data.customData?.customApps?.find((f: any) => f.id == "fiscaldata");
  return (fiscaldata?.fields?.typeOfDocument + "")?.toLowerCase() == "company" ? "" : formatPhone(data.clientProfileData.phone, appSettings);
}

function formatPhone(phone: any, appSettings: AppSettings): string {
  phone = phone + "";
  if (phone.length <= appSettings.vtex.phoneMaxLength) {
    return phone;
  }
  return phone.substr(phone.length - appSettings.vtex.phoneMaxLength, phone.length);
}

function getServiceName(saleChannel: string, ctx: Context | StatusChangeContext, item: any, category: string | undefined): string {
  let fiveYearsWarrantyId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId == saleChannel)?.fiveYearsWarranty;
  let fiveYearsWarranty = item.bundleItems.find((f: any) => f.additionalInfo.offeringTypeId == fiveYearsWarrantyId) ? true : false;
  let delivery = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds == FakeService.FLOORDELIVERY)?.serviceName;
  let twoYearsWarranty = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds == FakeService.TWOYEARSWARRANTY)?.serviceName;
  let service = "";
  if (category == TranslationsKeys.products) {
    if (fiveYearsWarranty) {
      if (isValid(delivery)) {
        let deliveryTranslation = delivery?.find(d => d.key?.toLowerCase() == ctx.state.locale!.toLowerCase())?.value
        service += deliveryTranslation
      }
    } else {
      if (isValid(delivery)) {
        let deliveryTranslation = delivery?.find(d => d.key?.toLowerCase() == ctx.state.locale!.toLowerCase())?.value
        service += deliveryTranslation
      }
      if (isValid(service)) {
        service += "|";
      }
      if (isValid(twoYearsWarranty)) {
        let twoYearsWarrantyTranslation = twoYearsWarranty?.find(tyw => tyw.key?.toLowerCase() == ctx.state.locale!.toLowerCase())?.value
        service += twoYearsWarrantyTranslation
      }
    }
  } else {
    if (category == TranslationsKeys.accessories) {
      if (isValid(delivery)) {
        let deliveryTranslation = delivery?.find(d => d.key?.toLowerCase() == ctx.state.locale!.toLowerCase())?.value
        service += deliveryTranslation
      }
    }
  }
  let bundleItems: any[] | string = [];
  item.bundleItems?.forEach((bi: any) => {
    (bundleItems as any[]).push(bi.name)
  })

  bundleItems = bundleItems.join("|");

  service = isValid(service) ?
    (
      bundleItems.length > 0 ? (service + "|" + bundleItems) : service
    ) :
    bundleItems;

  return service;
}

function getServiceQuantity(saleChannel: string, ctx: Context | StatusChangeContext, item: any, category: string | undefined): string {
  let fiveYearsWarrantyId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId == saleChannel)?.fiveYearsWarranty;
  let fiveYearsWarranty = item.bundleItems.find((f: any) => f.additionalInfo.offeringTypeId == fiveYearsWarrantyId) ? true : false;
  let delivery = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds == FakeService.FLOORDELIVERY)?.serviceName;
  let twoYearsWarranty = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds == FakeService.TWOYEARSWARRANTY)?.serviceName;
  let serviceQuantity = "";
  if (category == TranslationsKeys.products) {
    if (fiveYearsWarranty) {
      if (isValid(delivery)) {
        serviceQuantity += "1";
      }
    } else {
      if (isValid(delivery)) {
        serviceQuantity += "1";
      }
      if (isValid(serviceQuantity)) {
        serviceQuantity += "|";
      }
      if (isValid(twoYearsWarranty)) {
        serviceQuantity += "1";
      }
    }
  } else {
    if (category == TranslationsKeys.accessories) {
      if (isValid(delivery)) {
        serviceQuantity += "1";
      }
    }
  }
  if (item.bundleItems.length > 0) {
    serviceQuantity = isValid(serviceQuantity) ? (serviceQuantity + "|") : serviceQuantity;
    for (let i = 0; i < item.bundleItems?.length - 1; i++) {
      serviceQuantity += item.bundleItems[i].quantity + "|";
    }
    serviceQuantity += item.bundleItems[item.bundleItems.length - 1].quantity;
  }
  return serviceQuantity;
}

function getServicePrice(saleChannel: string, ctx: Context | StatusChangeContext, item: any, category: string | undefined): string {
  let fiveYearsWarrantyId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId == saleChannel)?.fiveYearsWarranty;
  let fiveYearsWarranty = item.bundleItems.find((f: any) => f.additionalInfo.offeringTypeId == fiveYearsWarrantyId) ? true : false;
  let delivery = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds == FakeService.FLOORDELIVERY)?.serviceName;
  let twoYearsWarranty = ctx.state.appSettings.vtex.additionalServices?.generalInfo?.find(f => f.serviceIds == FakeService.TWOYEARSWARRANTY)?.serviceName;
  let servicePrice = "";
  if (category == TranslationsKeys.products) {
    if (fiveYearsWarranty) {
      if (isValid(delivery)) {
        servicePrice += "0.00";
      }
    } else {
      if (isValid(delivery)) {
        servicePrice += "0.00";
      }
      if (isValid(servicePrice)) {
        servicePrice += "|";
      }
      if (isValid(twoYearsWarranty)) {
        servicePrice += "0.00";
      }
    }
  } else {
    if (category == TranslationsKeys.accessories) {
      if (isValid(delivery)) {
        servicePrice += "0.00";
      }
    }
  }
  if (item.bundleItems.length > 0) {
    servicePrice = isValid(servicePrice) ? (servicePrice + "|") : servicePrice;
    for (let i = 0; i < item.bundleItems?.length - 1; i++) {
      servicePrice += formatPrice(item.bundleItems[i].sellingPrice) + "|";
    }
    servicePrice += formatPrice(item.bundleItems[item.bundleItems.length - 1].sellingPrice);
  }
  return servicePrice;
}

function formatDateWithClock(data: string, data2: string): string {
  let dataOriginal = new Date(data);
  let dataOriginal2 = new Date(data2);
  let a = parseInt(data.split("T")[1].split(":")[0]);
  let b = dataOriginal.getHours();
  let diff = a >= b ? (a - b) : (b - a);
  let day = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate();
  let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1);
  let year = dataOriginal.getFullYear();
  let h1 = ((dataOriginal.getHours() - diff) % 24) < 10 ? "0" + ((dataOriginal.getHours() - diff) % 24) : ((dataOriginal.getHours() - diff) % 24);
  let h2 = ((dataOriginal2.getHours() - diff) % 24) < 10 ? "0" + ((dataOriginal2.getHours() - diff) % 24) : ((dataOriginal2.getHours() - diff) % 24);
  let m1 = dataOriginal.getMinutes() < 10 ? "0" + dataOriginal.getMinutes() : dataOriginal.getMinutes();
  let m2 = dataOriginal2.getMinutes() < 10 ? "0" + dataOriginal2.getMinutes() : dataOriginal2.getMinutes();
  return day + "/" + month + "/" + year + " " + h1 + ":" + m1 + " - " + h2 + ":" + m2;
}

function formatDateWithoutClock(data: string): string {
  let dataOriginal = new Date(data);
  let day = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate();
  let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1);
  return day + "/" + month + "/" + dataOriginal.getFullYear();

}

function formatPrice(price: number): string {
  return (price / 100).toFixed(2)
}

export function refundEmailMapper(payload: any): RefundTemplate {
  let object: RefundTemplate = {
    To: {
      Address: payload.Address + "",
      SubscriberKey: payload.SubscriberKey + "",
      ContactAttributes: {
        SubscriberAttributes: {
          FirstName: payload.ContactAttributes?.SubscriberAttributes?.FirstName + "",
          Surname: payload.ContactAttributes?.SubscriberAttributes?.Surname + "",
          City: payload.ContactAttributes?.SubscriberAttributes?.City + "",
          Address: payload.ContactAttributes?.SubscriberAttributes?.Address + "",
          ClientEmail: payload.ContactAttributes?.SubscriberAttributes?.ClientEmail + "",
          PhoneNumber: payload.ContactAttributes?.SubscriberAttributes?.PhoneNumber + "",
          PickupAddress: payload.ContactAttributes?.SubscriberAttributes?.PickUpAddress + "",
          OrderNumber: payload.ContactAttributes?.SubscriberAttributes?.OrderNumber + "",
          ProductCode: payload.ContactAttributes?.SubscriberAttributes?.ProductCode + "",
          DeliveredDate: payload.ContactAttributes?.SubscriberAttributes?.DeliveredDate + "",
          DocumentTransportNumber: payload.ContactAttributes?.SubscriberAttributes?.DocumentTransportNumber + "",
          ReturnReason: payload.ContactAttributes?.SubscriberAttributes?.RefundReason + "", // since the email templates have been swapped, also the related reasons need to be swapped //
          Note: payload.ContactAttributes?.SubscriberAttributes?.Note + "",
          Country: payload.ContactAttributes?.SubscriberAttributes?.Country + "",
          Zip: payload.ContactAttributes?.SubscriberAttributes?.Zip + "",
          itemType: payload.ContactAttributes?.SubscriberAttributes?.itemType + "",
          WithdrawType: payload.ContactAttributes?.SubscriberAttributes?.WithdrawType + "" // "home" or "whirlpool"
        }
      }
    }
  }
  return object;
}

export function returnEmailMapper(payload: any): ReturnTemplate {
  let object: ReturnTemplate = {
    To: {
      Address: payload.Address + "",
      SubscriberKey: payload.SubscriberKey + "",
      ContactAttributes: {
        SubscriberAttributes: {
          FirstName: payload.ContactAttributes?.SubscriberAttributes?.FirstName + "",
          Surname: payload.ContactAttributes?.SubscriberAttributes?.Surname + "",
          City: payload.ContactAttributes?.SubscriberAttributes?.City + "",
          Address: payload.ContactAttributes?.SubscriberAttributes?.Address + "",
          ClientEmail: payload.ContactAttributes?.SubscriberAttributes?.ClientEmail + "",
          PhoneNumber: payload.ContactAttributes?.SubscriberAttributes?.PhoneNumber + "",
          OrderNumber: payload.ContactAttributes?.SubscriberAttributes?.OrderNumber + "",
          ProductCode: payload.ContactAttributes?.SubscriberAttributes?.ProductCode + "",
          PickupAddress: payload.ContactAttributes?.SubscriberAttributes?.PickUpAddress + "",
          DeliveredDate: payload.ContactAttributes?.SubscriberAttributes?.DeliveredDate + "",
          DocumentTransportNumber: payload.ContactAttributes?.SubscriberAttributes?.DocumentTransportNumber + "", // since the email templates have been swapped, also the related reasons need to be swapped //
          RefundReason: payload.ContactAttributes?.SubscriberAttributes?.RefundReason + "",
          Note: payload.ContactAttributes?.SubscriberAttributes?.Note + "",
          Country: payload.ContactAttributes?.SubscriberAttributes?.Country + "",
          Zip: payload.ContactAttributes?.SubscriberAttributes?.Zip + "",
          itemType: payload.ContactAttributes?.SubscriberAttributes?.itemType + "",
          WithdrawType: payload.ContactAttributes?.SubscriberAttributes?.WithdrawType + "" // "home" or "whirlpool"
        }
      }
    }
  }
  return object;
}
