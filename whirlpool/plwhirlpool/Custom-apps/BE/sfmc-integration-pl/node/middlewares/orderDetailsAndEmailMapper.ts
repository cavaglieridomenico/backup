//@ts-ignore
//@ts-nocheck

import { MineWinsConflictsResolver } from "@vtex/api";

export function emailMapper(data: any, ctx: Context, ecofee: number, emailJson: any): Object {
    let shippingPrice = data.totals.find((t: { id: string; }) => t.id === "Shipping").value;
    let sum = 0;
    let sumService = 0;
    let quantityService = 0;
    data.items.forEach((price: { price: number; quantity: number; bundleItems: []; sellingPrice:any; }) => {
        if(price.sellingPrice!=0){
          sum += (price.price*price.quantity);
        }
        price.bundleItems.forEach((item: any) => {
          sumService += (item?.price*item?.quantity);
          quantityService += item?.quantity;
        })
    })
    //let discount = (sum+sumService)-data.value;
    let discount = data.totals.find((t: { id: string; }) => t.id === "Discounts").value;
    let subtotal = sum+sumService;
    let objMail = {
        To: {
            Address: emailJson.email,
            SubscriberKey: emailJson.email,
            ContactAttributes: {
                SubscriberAttributes: {
                    orderId: data.orderId,
                    orderNumberSAP: "",
                    purchaseDate: data.creationDate,
                    paymentMethod: data.paymentData?.transactions[0]?.payments[0]?.paymentSystemName!=undefined?data.paymentData.transactions[0].payments[0].paymentSystemName:"",
                    creditCardNumber: data.paymentData?.transactions[0]?.payments[0]?.lastDigits!=undefined?data.paymentData.transactions[0].payments[0].lastDigits:"",
                    fiscalCode: getVat(data),
                    orderProductPrice: formatPrice(sum),
                    orderTotal: formatPrice(data.value),
                    ecofee: (ecofee+"").includes(".")?ecofee+"":ecofee+".00",
                    servicePrice: formatPrice(sumService),
                    orderTotalAdjustment: Math.abs(formatPrice(discount)),
                    orderShippingPrice: formatPrice(shippingPrice),
                    orderSubtotal: formatPrice(subtotal),
                    serviceQuantity: quantityService,
                    shippingFirstName: data.shippingData.address.receiverName,
                    shippingLastName: "",
                    shippingAddress: data.shippingData.address.street+" "+data.shippingData.address.number+" "+(isValid(data.shippingData.address.complement)?data.shippingData.address.complement:""),
                    shippingZipCode: data.shippingData.address.postalCode,
                    shippingCity: data.shippingData.address.city,
                    shippingState: data.shippingData.address.state,
                    shippingCountry: /*data.shippingData.address.country*/"Polska",
                    shippingEmail: emailJson.email,
                    shippingPhone: (ctx.vtex.account == "frwhirlpool" || ctx.vtex.account == "frwhirlpoolqa" ) ? formatPhone(data.clientProfileData.phone) :data.clientProfileData.phone ,
                    billingFirstName: isValid(data.clientProfileData.corporateName)?data.clientProfileData.corporateName:data.clientProfileData.firstName,
                    billingLastName: isValid(data.clientProfileData.corporateName)?"":data.clientProfileData.lastName,
                    billingAddress: (data.invoiceData?.address?.street!=undefined && data.invoiceData?.address?.number!=undefined)?(data.invoiceData.address.street+" "+data.invoiceData.address.number):(data.shippingData.address.street+" "+data.shippingData.address.number+" "+(isValid(data.shippingData.address.complement)?data.shippingData.address.complement:"")),
                    billingZipCode: data.invoiceData?.address?.postalCode!=undefined?data.invoiceData.address.postalCode:data.shippingData.address.postalCode,
                    billingCity: data.invoiceData?.address?.city!=undefined?data.invoiceData.address.city:data.shippingData.address.city,
                    billingState:  data.invoiceData?.address?.state!=undefined?data.invoiceData.address.state:data.shippingData.address.state,
                    billingCountry: /*data.invoiceData?.address?.country!=undefined?data.invoiceData.address.country:data.shippingData.address.country*/"Polska",
                    billingEmail: getBillingEmail(data)=="email"?emailJson.email:"",
                    billingPhone: getBillingPhone(data, ctx),
                    billingOfficeAddress: "",
                    shipInstructions: "",
                    redeemedPoints: 0,
                    gainedPoints: 0,
                    delivery: "",
                    estematedDeliveryDate: data.shippingData?.logisticsInfo[0]?.deliveryWindow!=null?parseDataFormatSingle(data.shippingData.logisticsInfo[0].shippingEstimateDate):""
                }
            }
        }
    };
    return objMail
}

export function orderDetailsMapper(vtexOrder: any, ctx: Context, coupon: string[], premium: string[], skuContexts: [], skuImages: [], baseURL: string): [] {
  let count = 0;
  let orders = [];
  let sheet = undefined
  let productNelSheet = undefined
  vtexOrder.items.forEach(function(item: {id: any, refId: any, uniqueId: any, quantity: any, productId: any, name: any, sellingPrice: any, detailUrl: any, additionalInfo: { brandName: any }}){
    let sku = skuContexts.find(f => f.skuId==item.id)?.context;
    let product_logo = sku?.ProductSpecifications?.find(f => f.FieldName==='EnergyLogo_image')
    let logo = !!product_logo ? product_logo.FieldValues[0] : "" ;
    let productDataSheet = sku?.ProductSpecifications?.find(f => f.FieldName==='product-data-sheet')
    if(!!productDataSheet){
      sheet = productDataSheet.FieldValues[0]
    }
    else{
      productNelSheet = sku?.ProductSpecifications?.find(f => f.FieldName==='nel-data-sheet')
      sheet = !!productNelSheet ? productNelSheet.FieldValues[0] : "";
    }
    let images = skuImages.find(f => f.skuId==item.id)?.images;
    let imageSingle = images.find((image: any) => image.IsMain);
    let image = sku.Images.find((i: any) => i.ImageName == imageSingle.Label)?.ImageUrl;
    let category = undefined;
    // PL_WHP prodotti -> urzadzenia
    if(Object.keys(sku.ProductCategories).find(f => sku.ProductCategories[f]=="urzadzenia")!=undefined){
      category = "urzadzenia";
    }
    // PL_WHP accessori -> akcesoria
    if(Object.keys(sku.ProductCategories).find(f => sku.ProductCategories[f]=="akcesoria")!=undefined){
      category = "akcesoria";
    }
    let commCode = skuContexts.find(f => f.skuId==item.id)?.context?.ProductSpecifications?.find(f => f.FieldName=="CommercialCode_field")?.FieldValues[0];
    //console.log(category)
    let order =
        {
            keys: {
                orderId: vtexOrder.orderId,
                orderItemId: item.uniqueId
            },
            values: {
                coupon: premium.includes(item.productId)?coupon.slice(count,count+item.quantity).toString().replace(/,/g, '|'):"",
                commercialCode: commCode!=undefined?commCode:item.refId,
                code12NC: item.refId,
                orderItemQuantity: item.quantity,
                price: formatPrice(item.sellingPrice),
                productUrl: ctx.vtex.account == "plwhirlpoolqa" ? ('https://' + ctx.vtex.account + ".myvtex.com" + item.detailUrl) : (baseURL + item.detailUrl),
                //productUrl: ('https://' + ctx.vtex.account + ".myvtex.com" + item.detailUrl),
                imageUrl: image,
                brand: item.additionalInfo.brandName,
                isSuccessfullyPurchased: true,
                serviceName: getServiceName(item, category),
                serviceQuantity: getServiceQuantity(item, category),
                servicePrice: getServicePrice(item, category),
                EnergyLogo_image: logo,
                "product-information-sheet": sheet
            }
        };
    count = premium.includes(item.productId)?count+item.quantity:count;
    orders.push(order);
  });
  return orders;
}

function getVat(data: any): string {
  if (data.customData != null){
    let fiscaldata = data.customData.customApps.find(f => f.id == "fiscaldata");
    return (fiscaldata.fields.typeOfDocument+"").toLowerCase()=="company"?fiscaldata.fields.corporateDocument:""
  }
  else 
   return ""
}

function getBillingEmail(data: any): string{
  if (data.customData != null){
    let fiscaldata = data.customData.customApps.find(f => f.id == "fiscaldata");
    return (fiscaldata.fields.typeOfDocument+"").toLowerCase()=="company"?"":"email";
  }
  else 
    return "email"
}

function getBillingPhone(data: any, ctx: Context): string{
  if (data.customData != null){
    let fiscaldata = data.customData.customApps.find(f => f.id == "fiscaldata");
    return (fiscaldata.fields.typeOfDocument+"").toLowerCase()=="company"?""
    :(ctx.vtex.account == "frwhirlpool" || ctx.vtex.account == "frwhirlpoolqa" )?formatPhone(data.clientProfileData.phone)
     :data.clientProfileData.phone;
  }
  else
    return data.clientProfileData.phone;
  }

function formatPhone(phone: any): string{
  phone = phone+"";
  if(phone.length<=9){
    return "0"+phone;
  }
  return "0"+phone.substr(phone.length-9,phone.length);
}

function getServiceName(item: any, category: string): string {
  let fiveYearsWarranty = item.bundleItems.find(f => f.additionalInfo.offeringTypeId=="4")!=undefined?true:false;
  let service = category=="urzadzenia"?(fiveYearsWarranty==true?"":"2 lata gwarancji"):(category=="akcesoria"?"":"");
  if(item.bundleItems.length>0){
    service += service===""?"":"|";
    for(let i=0; i<item.bundleItems?.length-1; i++){
        service += item.bundleItems[i].name+"|";
    }
    service+= item.bundleItems[item.bundleItems.length - 1].name;
  }
  return service;
}

function getServiceQuantity(item: any, category: string): string {
  let fiveYearsWarranty = item.bundleItems.find(f => f.additionalInfo.offeringTypeId=="4")!=undefined?true:false;
  let serviceQuantity = category=="urzadzenia"?(fiveYearsWarranty==true?"":"1"):(category=="akcesoria"?"":"");
  if(item.bundleItems.length>0){
    serviceQuantity += serviceQuantity===""?"":"|";
    for(let i=0; i<item.bundleItems?.length-1; i++){
        serviceQuantity += item.bundleItems[i].quantity+"|";
    }
    serviceQuantity += item.bundleItems[item.bundleItems.length-1].quantity;
  }
  return serviceQuantity;
}

function getServicePrice(item: any, category: string): string {
  let fiveYearsWarranty = item.bundleItems.find(f => f.additionalInfo.offeringTypeId=="4")!=undefined?true:false;
  let servicePrice = category=="urzadzenia"?(fiveYearsWarranty==true?"":"0.00"):(category=="akcesoria"?"":"");
  if(item.bundleItems.length>0){
    servicePrice += servicePrice===""?"":"|";
    for(let i=0; i<item.bundleItems?.length-1; i++) {
        servicePrice += formatPrice(item.bundleItems[i].sellingPrice)+"|";
    }
    servicePrice += formatPrice(item.bundleItems[item.bundleItems.length-1].sellingPrice);
  }
  return servicePrice;
}

/*function parseDataFormat(data: string, data2: string): string {
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
}*/

function parseDataFormatSingle(data: string): string {
    let dataOriginal = new Date(data);
    let day = dataOriginal.getDate()<10?'0'+dataOriginal.getDate():dataOriginal.getDate();
    let month = (dataOriginal.getMonth()+1)<10?'0'+(dataOriginal.getMonth()+1):(dataOriginal.getMonth()+1);
    return day+"/"+month+"/"+dataOriginal.getFullYear();

}

function formatPrice(price: number): string {
  return price==0?"0.00":(price.toString().substring(0, price.toString().length-2)+"."+ price.toString().substring(price.toString().length-2,price.toString().length));
}

export function isValid(field: string): Boolean{
  return field!=undefined && field!=null && field!="null" && field!=" " && field!="‎" && field!=!"-" && field!="_";
}

