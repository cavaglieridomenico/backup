//@ts-nocheck

import { CustomLogger } from "../utils/Logger";
import { alignServiceNames, isValid, routeToLabel, sendAlert } from "../utils/functions";
import { getDnGLinks, isServedZipCode } from "../clients/VtexMP";
import { DGRecord } from "../typings/types";

export async function getOrderAdditionalData(ctx: Context|StatusChangeContext, next: () => Promise<any>){
  ctx.vtex.logger = new CustomLogger(ctx);
  try{
    let promises = [];
    ctx.state.distinctSkus?.forEach(s => {
      promises.push(new Promise<any>((resolve,reject) => {
        ctx.clients.VtexMP.getImages(s)
        .then(res => resolve({skuId: s, images: res.data}))
        .catch(err => reject(err));
      }));
    });
    let ecofeeTotal = 0;
    let premiumProducts = [];
    let nPremium = 0;
    let premiumSpec = ctx.state.appSettings.vtex.premiumProducts?.specification?.split(":")[0];
    let premiumValue = ctx.state.appSettings.vtex.premiumProducts?.specification?.split(":")[1];
    let legalWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId==ctx.state.orderData.salesChannel)?.legalWarranty;
    let extendedWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId==ctx.state.orderData.salesChannel)?.extendedWarranty;
    let numberOfDnGLinks = 0;
    ctx.state.orderData?.items?.forEach(i => {
      let ecofee = ctx.state.skuContexts?.find(f => f.skuId==i.id)?.context?.ProductSpecifications?.find(f => f.FieldName=="ecofee")?.FieldValues[0];
      let premium = ctx.state.skuContexts?.find(f => f.skuId==i.id)?.context?.ProductSpecifications?.find(f => f.FieldName==premiumSpec)?.FieldValues[0];
      if(isValid(ecofee)){
        ecofeeTotal = ecofeeTotal + (parseFloat(ecofee)*i.quantity);
      }
      if(isValid(premium) && (premium+"").toLowerCase()==premiumValue?.toLowerCase()){
        nPremium = nPremium + i.quantity;
        if(!premiumProducts.includes(i.productId)){
          premiumProducts.push(i.productId);
        }
      }
      let hasLegalWarranty = i.bundleItems?.find(b => b.additionalInfo?.offeringTypeId==legalWarrId) ? true :false;
      let hasExtendedWarranty = i.bundleItems?.find(b => b.additionalInfo?.offeringTypeId==extendedWarrId) ? true: false;
      if(isValid(legalWarrId) && hasLegalWarranty){
        numberOfDnGLinks++;
      }
      if(isValid(extendedWarrId) && hasExtendedWarranty){
        numberOfDnGLinks++;
      }
    });
    let BIProductWithInstallation = [];
    let installationId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId==ctx.state.orderData.salesChannel)?.installation;
    ctx.state.distinctSkus?.forEach(s => {
      let sku = ctx.state.orderData?.items?.find(f => f.id==s);
      let constructionType = ctx.state.skuContexts?.find(f => f.skuId==s)?.context?.ProductSpecifications?.find(f => f.FieldName=="constructionType")?.FieldValues[0];
      if((constructionType+"").toLowerCase()=="built in"){
        if(sku.bundleItems?.find(f => f.additionalInfo?.offeringTypeId==installationId)!=undefined){
          BIProductWithInstallation.push(s);
        }
      }
    });
    if(BIProductWithInstallation.length>0 && ctx.state.appSettings.vtex.checkZipCodes){
      promises.push(new Promise<any>((resolve,reject) => {
        isServedZipCode(ctx, ctx.state.orderData?.shippingData?.address?.postalCode)
        .then(res => resolve({servedZip: res}))
        .catch(err => reject(err))
      }));
    }
    promises.push(new Promise<any>((resolve,reject) => {
      ctx.clients.VtexMP.createCoupons(ctx.state.appSettings.vtex.premiumProducts, nPremium)
      .then(res => resolve({coupons: res}))
      .catch(err => reject(err))
    }));
    if(ctx.state.appSettings.vtex.dngSettings?.hasDnG){
      promises.push(new Promise<any>((resolve,reject) => {
        getDnGLinks(ctx, numberOfDnGLinks).then(res => resolve({dngLinks: res})).catch(err => reject(err))
      }));
    }
    let responses = await Promise.all(promises);
    let skuImages = responses.filter(f => f.images!=undefined);
    let coupons = responses.find(f => f.coupons!=undefined)?.coupons;
    let servedZip: Boolean = responses.find(f => f.servedZip!=undefined)?.servedZip;
    ctx.state.dngLinks = responses.find(f => f.dngLinks!=undefined)?.dngLinks;
    ctx.state.dngLinks = ctx.state.dngLinks ? ctx.state.dngLinks : [];
    for(let i=0; i<ctx.state.orderData?.items?.length && servedZip!=undefined; i++){
      if(BIProductWithInstallation.includes(ctx.state.orderData?.items[i]?.id)){
        if(!servedZip){
          ctx.state.orderData?.items[i]?.bundleItems = ctx.state.orderData?.items[i]?.bundleItems?.filter(f => f.additionalInfo?.offeringTypeId!=installationId);
        }
      }
    }
    ctx.state.orderData = alignServiceNames(ctx.state.appSettings.vtex.additionalServices?.generalInfo, ctx.state.orderData);
    ctx.state.coupons = coupons;
    ctx.state.premiumProducts = premiumProducts;
    ctx.state.skuImages = skuImages;
    ctx.state.ecofeeTotal = ecofeeTotal;
    await next();
  }catch(err){
    //console.log(err)
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    let label = routeToLabel(ctx);
    ctx.vtex.logger.error(label+msg);
    sendAlert(ctx);
    ctx.status = 500;
    ctx.body = "Internal Server Error";

  }
}
