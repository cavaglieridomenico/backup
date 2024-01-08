//@ts-nocheck

import { DnGPayload } from "../typings/DnGPayload";
import { CustomApps, DGRecord, ProductSpecificationResponse, ProfileCustomFields } from "../typings/types";
import { vbaseBucket } from "../utils/constants";
import { createDocument, searchDocuments } from "../utils/documentCRUD";
import { formatPrice, isValid, sendAlert } from "../utils/functions";
import { convertIso3Code } from "../utils/ISOCountryConverter";
import { CustomLogger } from "../utils/Logger";

export async function sendDataToDnG(ctx: Context|StatusChangeContext, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    let orderId = isValid(ctx.body?.orderId) ? ctx.body.orderId : ctx.vtex.route.params.orderId;
    let order = await ctx.clients.Vtex.getOrder(orderId);
    let distinctProducts: string[] = [];
    order.items.forEach(i => !distinctProducts.includes(i.productId) ? distinctProducts.push(i.productId) : "");
    let promises: Promise<ProductSpecificationResponse>[] = [];
    distinctProducts.forEach(i => promises.push(ctx.clients.Vtex.getProductSpecifications(i)));
    let prodSpecs: ProductSpecificationResponse[] = await Promise.all(promises);
    let legalWarrId = ctx.state.appSettings.vtex.legalWarrantyId;
    let extendedWarrId = ctx.state.appSettings.vtex.extendedWarrantyId;
    let address = isValid(order.invoiceData?.address) ? order.invoiceData?.address : order.shippingData.address;
    let userEmail = ctx.state.appSettings.vtex.checkoutAsGuest ?
                    order.customData?.customApps?.find(f => f.id==CustomApps.PROFILE)?.fields[ProfileCustomFields.email] :
                    (await searchDocuments(ctx, "CL", ["email"], "userId="+order.clientProfileData.userProfileId, {page: 1, pageSize: 5}, true))[0]?.email;
    let mdEntity = ctx.state.appSettings.vtex.mdName;
    order.items.forEach(item => {
      let hasLegalWarranty = item.bundleItems.find(b => b.additionalInfo.offeringTypeId==legalWarrId) ? true :false;
      let hasExtendedWarranty = item.bundleItems.find(b => b.additionalInfo.offeringTypeId==extendedWarrId) ? true: false;
      let commCode = prodSpecs.find(f => f.id==item.productId)?.data?.find(f => f.Name?.toLowerCase()==ctx.state.appSettings.vtex.commCodeSpecName?.toLowerCase())?.Value[0];
      commCode ? commCode : "";
      let DnGPayload: DnGPayload = {
        Client: ctx.state.appSettings.dng.client,
        ClientChannel: ctx.state.appSettings.dng.clientChannel,
        ClientReference: ctx.state.appSettings.dng.clientReference,
        CustomerName: order.clientProfileData.firstName,
        CustomerSurname: order.clientProfileData.lastName,
        CustomerAddress: address?.street+" "+address?.number,
        CustomerPostalCode: address?.postalCode,
        CustomerTown: address?.city,
        CustomerCountry: convertIso3Code(address?.country)?.iso2 ? convertIso3Code(address?.country)?.iso2 : ctx.state.appSettings.vtex.defaultCountry,
        CustomerCellPhone: order.clientProfileData.phone,
        CustomerEmail: userEmail,
        ApplianceCommercialCode: item.refId,
        ApplianceGTIN: item.ean,
        AppliancePurchaseDate: order.creationDate.split("+")[0]+"Z",
        AppliancePurchasePrice: formatPrice(item.sellingPrice),
        RegisterOnly: true,
        PromoCode: ctx.state.appSettings.dng.promoCode,
        brand: item.additionalInfo.brandName,
        ApplianceCommercialModel: commCode,
        CustomerLanguage: convertIso3Code(address?.country)?.iso2 ? (convertIso3Code(address?.country)?.iso2+"").toLowerCase() : ctx.state.appSettings.vtex.defaultCountry.toLowerCase()
      }
      if(hasLegalWarranty){
        ctx.clients.DnG.getToken()
        .then(token => {
          ctx.clients.DnG.sendOrderData(DnGPayload, token)
          .then(code => {
            let record: DGRecord = {
              orderId: order.orderId,
              itemId: item.uniqueId,
              itemToken: code,
              typeOfWarranty: legalWarrId
            }
            ctx.clients.vbase.saveJSON(vbaseBucket, order.orderId+"-"+item.uniqueId+"-"+legalWarrId, code)
            createDocument(ctx, mdEntity, record)
              .then(() => ctx.vtex.logger.info("order "+order.orderId+" & item "+item.uniqueId+" & legal warranty: data correctly sent to DnG and saved on MD --data: "+JSON.stringify(DnGPayload).replace("\"RegisterOnly\":false", "\"RegisterOnly\":true")))
              .catch(err => ctx.vtex.logger.error("order "+order.orderId+" & item "+item.uniqueId+" & legal warranty: error while saving the DG token on MD --details "+err.message+" --data: "+JSON.stringify(DnGPayload).replace("\"RegisterOnly\":false", "\"RegisterOnly\":true")))
          })
          .catch(err => ctx.vtex.logger.error("order "+order.orderId+" & item "+item.uniqueId+" & legal warranty: "+err.message+" --data: "+JSON.stringify(DnGPayload).replace("\"RegisterOnly\":false", "\"RegisterOnly\":true")))
        })
        .catch(err => ctx.vtex.logger.error("order "+order.orderId+" & item "+item.uniqueId+" & legal warranty: "+err.message+" --data: "+JSON.stringify(DnGPayload).replace("\"RegisterOnly\":false", "\"RegisterOnly\":true")))
      }
      if(hasExtendedWarranty){
        DnGPayload.RegisterOnly = false;
        ctx.clients.DnG.getToken()
        .then(token => {
          ctx.clients.DnG.sendOrderData(DnGPayload, token)
          .then(code => {
            let record: DGRecord = {
              orderId: order.orderId,
              itemId: item.uniqueId,
              itemToken: code,
              typeOfWarranty: extendedWarrId
            }
            ctx.clients.vbase.saveJSON(vbaseBucket, order.orderId+"-"+item.uniqueId+"-"+extendedWarrId, code)
            createDocument(ctx, mdEntity, record)
              .then(() => ctx.vtex.logger.info("order "+order.orderId+" & item "+item.uniqueId+" & extended warranty: data correctly sent to DnG and saved on MD --data: "+JSON.stringify(DnGPayload)))
              .catch(err => ctx.vtex.logger.error("order "+order.orderId+" & item "+item.uniqueId+" & extended warranty: error while saving the DG token on MD --details "+err.message+" --data: "+JSON.stringify(DnGPayload)))
          })
          .catch(err => ctx.vtex.logger.error("order "+order.orderId+" & item "+item.uniqueId+" & extended warranty: "+err.message+" --data: "+JSON.stringify(DnGPayload)))
        })
        .catch(err => ctx.vtex.logger.error("order "+order.orderId+" & item "+item.uniqueId+" & extended warranty: "+err.message+" --data: "+JSON.stringify(DnGPayload)))
      }
    })
    ctx.status = 200;
    ctx.body = "OK";
  }catch(err){
    //console.log(err)
    ctx.vtex.logger.error(err.message)
    sendAlert(ctx);
  }
  await next()
}
