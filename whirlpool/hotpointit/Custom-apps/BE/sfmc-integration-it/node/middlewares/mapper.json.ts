//@ts-ignore
//@ts-nocheck

export function mapperMail(data: any, emailJson: any, ctx: Context): Object {
  let shippingPrice = data.totals.find((t: { id: string; }) => t.id === "Shipping").value;
  let sum = 0
  let sumService = 0
  let quantityService = 0
  data.items.forEach((price: { price: number; quantity: number; bundleItems: []; sellingPrice: any; }) => {
    if (price.sellingPrice != 0) {
      sum += (price.price * price.quantity)
    }
    price.bundleItems.forEach((item: any) => {
      sumService += (item?.price * item?.quantity)
      quantityService += item?.quantity;
    })
  })
  let discount = (sum + sumService) - data.value;
  let subtotal = sum + sumService;
  let shippingMessage = "Verrai contattato dal trasportatore per organizzare la tua consegna.";
  let objMail = {
    To: {
      Address: emailJson.email,
      SubscriberKey: emailJson.email,
      ContactAttributes: {
        SubscriberAttributes: {
          orderId: data.orderId,
          orderNumberSAP: null,
          //purchaseDate: data.creationDate,
          purchaseDate: data.creationDate.split("T")[0],
          paymentMethod: data.paymentData?.transactions[0]?.payments[0]?.paymentSystemName,
          creditCardNumber: data.paymentData?.transactions[0]?.payments[0]?.lastDigits,
          fiscalCode: getCfOrIva(data),
          orderProductPrice: formatPrice(sum + ''),
          orderTotal: formatPrice(data.value + ''),
          servicePrice: formatPrice(sumService + ''),
          orderTotalAdjustment: formatPrice(discount + ''),
          orderShippingPrice: formatPrice(shippingPrice + ''),
          orderSubtotal: formatPrice(subtotal + ''),
          serviceQuantity: quantityService,
          shippingFirstName: data.shippingData?.address?.receiverName,
          shippingLastName: null,
          shippingAddress: data.shippingData?.address?.street + " " + data.shippingData?.address?.number,
          shippingZipCode: data.shippingData?.address?.postalCode,
          shippingCity: data.shippingData?.address?.city,
          shippingState: data.shippingData?.address?.state,
          shippingCountry: data.shippingData?.address?.country,
          shippingEmail: emailJson.email,
          shippingPhone: data.clientProfileData?.phone,
          billingFirstName: data.clientProfileData?.firstName,
          billingLastName: data.clientProfileData?.lastName,
          billingAddress: "",
          billingZipCode: "",
          billingCity: "",
          billingState: "",
          billingCountry: "",
          billingEmail: emailJson.email,
          billingPhone: data.clientProfileData?.phone,
          billingOfficeAddress: null,
          //shipInstructions: data.shippingData?.address?.complement,
          shipInstructions: data.shippingData?.address?.complement != undefined ? data.shippingData?.address?.complement : "",
          redeemedPoints: 0,
          gainedPoints: 0,
          delivery: "INCLUSA",
          estematedDeliveryDate: data.shippingData?.logisticsInfo[0]?.deliveryWindow != null ?
            ((data.shippingData.logisticsInfo[0].deliveryWindow.startDateUtc.includes("T01:00:00") && data.shippingData.logisticsInfo[0].deliveryWindow.endDateUtc.includes("T01:00:00")) ?
              shippingMessage :
              parseDataFormat(data.shippingData.logisticsInfo[0].deliveryWindow.startDateUtc, data.shippingData.logisticsInfo[0].deliveryWindow.endDateUtc)) : shippingMessage
        }
      }
    }
  };
  if (objMail.To.ContactAttributes.SubscriberAttributes.estematedDeliveryDate == "01/01/1970") {
    let oldDate = objMail.To.ContactAttributes.SubscriberAttributes.estematedDeliveryDate
    let businessDays: string = (data.shippingData.logisticsInfo[0].shippingEstimate).split("bd")[0]
    objMail.To.ContactAttributes.SubscriberAttributes.estematedDeliveryDate = calculateEstematedDeliveryDate(objMail.To.ContactAttributes.SubscriberAttributes.purchaseDate, businessDays);
    ctx.vtex.logger.info("Order - " + objMail.To.ContactAttributes.SubscriberAttributes.orderId + " - previous date : " + oldDate + " , new shipping estimated date : " + objMail.To.ContactAttributes.SubscriberAttributes.estematedDeliveryDate)
  }
  let requestInvoice: boolean = false;
  if (data.customData != undefined && data.customData.customApps != undefined) {
    for (let customApp of data.customData?.customApps) {
      if (customApp.id === "fiscaldata" && customApp.fields?.requestInvoice === "true") {
        objMail.To.ContactAttributes.SubscriberAttributes.billingAddress = data.invoiceData?.address?.street + " " + data?.invoiceData?.address?.number;
        objMail.To.ContactAttributes.SubscriberAttributes.billingZipCode = data.invoiceData?.address?.postalCode;
        objMail.To.ContactAttributes.SubscriberAttributes.billingCity = data.invoiceData?.address?.city;
        objMail.To.ContactAttributes.SubscriberAttributes.billingState = data.invoiceData?.address?.state;
        objMail.To.ContactAttributes.SubscriberAttributes.billingCountry = data.invoiceData?.address?.country;
        if (data.clientProfileData.corporateName != undefined) {
          objMail.To.ContactAttributes.SubscriberAttributes.billingFirstName = data.clientProfileData.corporateName;
          objMail.To.ContactAttributes.SubscriberAttributes.billingLastName = "";
        }
        requestInvoice = true;
        break;
      }
    }
  }

  if (!requestInvoice) {
    objMail.To.ContactAttributes.SubscriberAttributes.billingAddress = data.shippingData?.address?.street + " " + data.shippingData?.address?.number;
    objMail.To.ContactAttributes.SubscriberAttributes.billingZipCode = data.shippingData?.address?.postalCode;
    objMail.To.ContactAttributes.SubscriberAttributes.billingCity = data.shippingData?.address?.city;
    objMail.To.ContactAttributes.SubscriberAttributes.billingState = data.shippingData?.address?.state;
    objMail.To.ContactAttributes.SubscriberAttributes.billingCountry = data.shippingData?.address?.country;
  }

  return objMail;
}

export async function orderMapperLoad(data: any, baseUrl: any, ctx: any, coupon: string[], premium: string[], services: any): Promise<any> {
  let count = 0
  return new Promise<any>(async function (resolve, reject) {
    try {
      let orders = [];
      data.items.forEach(async function (item: { id: any, refId: any, uniqueId: any, quantity: any, productId: any, name: any, ean: any, sellingPrice: any, price: any, detailUrl: any, imageUrl: any, additionalInfo: { brandName: any } }) {
        let sku = (await ctx.clients.Vtex.getProductSkuAlternative(item.id)).data;
        let images = (await ctx.clients.Vtex.getImagesMain(sku.Id)).data;
        let imageSingle = images.find((image: any) => image.IsMain)
        let image = sku.Images.find((i: any) => i.ImageName === imageSingle.Label)?.ImageUrl;
        let energyLogo = sku.ProductSpecifications?.find(f => f.FieldName == "EnergyLogo_image")?.FieldValues[0];
        let productInfoSheet = sku.ProductSpecifications?.find(f => f.FieldName == "nel-data-sheet")?.FieldValues[0];
        let order =
        {
          keys: {
            orderId: data.orderId,
            orderItemId: item.uniqueId
          },
          values: {
            coupon: premium.includes(item.productId) ? coupon.slice(count, count + item.quantity).toString().replace(/,/g, '|') : "",
            commercialCode: sku.ProductSpecifications.find((f: any) => f.FieldName == 'CommercialCode_field')?.FieldValues[0],
            code12NC: item.refId,
            orderItemQuantity: item.quantity,
            price: item.sellingPrice == 0 ? item.sellingPrice : formatPrice(item.sellingPrice),
            productUrl: ('https://' + baseUrl + item.detailUrl),
            imageUrl: image,
            brand: item.additionalInfo.brandName,
            isSuccessfullyPurchased: true,
            serviceName: getServiceName(item, services),
            serviceQuantity: getServiceQuantity(item),
            servicePrice: getServicePrice(item),
            EnergyLogo_image: isValid(energyLogo) ? energyLogo : "",
            "product-information-sheet": isValid(productInfoSheet) ? productInfoSheet : ""
          }
        };
        count = premium.includes(item.productId) ? count + item.quantity : count;
        orders.push(order);
        console.log(orders);

        if (orders.length === data.items.length) {
          console.log(orders);
          resolve(orders);
        }
      });
    } catch (err) {
      reject({ status: err?.response?.status, message: err?.response?.data });
    }
  });
}
function isValid(param: any): Boolean {
  return param != undefined && param != null && param != "undefined" && param != "null" && param != "" && param != " " && param != "-" && param != "_";
}

function getCfOrIva(data: any): string {
  if (data?.clientProfileData?.corporateDocument != null) {
    return data.clientProfileData.corporateDocument;
  }
  if (data?.clientProfileData?.document != null) {
    return data?.clientProfileData?.document;
  }
  if (data.customData?.customApps?.find((app: { id: string }) => app.id == "fiscaldata")?.fields?.codiceFiscaleAzienda != null) {
    return data.customData?.customApps?.find((app: { id: string }) => app.id == "fiscaldata")?.fields?.codiceFiscaleAzienda;
  }

  return "";
}

function getServiceName(item: any, services: any): string {
  let service = "";
  let bundleItems: any[] | string = [];
  item.bundleItems?.forEach((bi: any) => {
    let name = services.find(s => s.serviceIds?.split(",").includes(bi.additionalInfo.offeringTypeId + ""))?.serviceName;
    name = name ? name : bi.name;
    bundleItems.push(name);
  })
  service = bundleItems.join("|");
  return service
}

function getServiceQuantity(item: any): string {
  let serviceQuantity = ""
  if (item?.bundleItems?.length > 0) {
    for (let i = 0; i < item.bundleItems?.length - 1; i++) {
      serviceQuantity = serviceQuantity + item.bundleItems[i].quantity + "|"
    }
    serviceQuantity = serviceQuantity + item.bundleItems[item.bundleItems.length - 1].quantity
  }
  return serviceQuantity
}

function getServicePrice(item: any): string {
  let servicePrice = ""
  if (item?.bundleItems?.length > 0) {
    for (let i = 0; i < item.bundleItems?.length - 1; i++) {
      //servicePrice = servicePrice + item.bundleItems[i].sellingPrice + "|"
      servicePrice = servicePrice + formatPrice(item.bundleItems[i].sellingPrice) + "|"
    }
    //servicePrice = servicePrice + item.bundleItems[item.bundleItems.length - 1].sellingPrice
    servicePrice = servicePrice + formatPrice(item.bundleItems[item.bundleItems.length - 1].sellingPrice)
  }
  return servicePrice
}

function parseDataFormat(data: string, data2: string): string {
  let dataOriginal = new Date(data);
  let dataOriginal2 = new Date(data2);
  let a = parseInt(data.split("T")[1].split(":")[0]);
  let b = dataOriginal.getHours();
  let diff = a >= b ? (a - b) : b - a;
  let day = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate();
  let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1);
  let year = dataOriginal.getFullYear();
  let h1 = ((dataOriginal.getHours() - diff) % 24) < 10 ? "0" + ((dataOriginal.getHours() - diff) % 24) : ((dataOriginal.getHours() - diff) % 24);
  let h2 = ((dataOriginal2.getHours() - diff) % 24) < 10 ? "0" + ((dataOriginal2.getHours() - diff) % 24) : ((dataOriginal2.getHours() - diff) % 24);
  let m1 = dataOriginal.getMinutes() < 10 ? "0" + dataOriginal.getMinutes() : dataOriginal.getMinutes();
  let m2 = dataOriginal2.getMinutes() < 10 ? "0" + dataOriginal2.getMinutes() : dataOriginal2.getMinutes();
  return day + "/" + month + "/" + year + " " + h1 + ":" + m1 + " - " + h2 + ":" + m2;
}

function parseDataFormatSingle(data: string): string {
  let dataOriginal = new Date(data);
  let day = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate();
  let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1);
  return day + "/" + month + "/" + dataOriginal.getFullYear();

}

function formatPrice(price: string): string {
  if (price != undefined && price != '0') {
    return price.toString().substring(0, price.toString().length - 2) + "." + price.toString().substring(price.toString().length - 2, price.toString().length)
  } else return price
}

function calculateEstematedDeliveryDate(startDate: string, businessDays: string): string {
  let date = new Date(startDate)
  let dayOfTheWeek = date.getDay();// 0 is Sunday, 1 is Monday , ... , 6 is Saturday
  let daysToAdd = parseInt(businessDays);
  if (dayOfTheWeek == 0)
    daysToAdd++;
  if (dayOfTheWeek + daysToAdd >= 6) {
    let remainingWorkDays = daysToAdd - (5 - dayOfTheWeek);
    daysToAdd += 2;
    if (remainingWorkDays > 5) {
      daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
      if (remainingWorkDays % 5 == 0)
        daysToAdd -= 2;
    }
  }
  date.setDate(date.getDate() + daysToAdd);
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  return day + "/" + month + "/" + date.getFullYear();
}
