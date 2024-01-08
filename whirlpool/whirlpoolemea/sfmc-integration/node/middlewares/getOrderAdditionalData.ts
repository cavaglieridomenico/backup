import { alignServiceNames, isValid, routeToLabel, sendAlert, stringify } from "../utils/functions";
import { GetProductTranslationReq, GetProductTranslationRes } from "../typings/translations";

export async function getOrderAdditionalData(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  try {
    let promises: Promise<any>[] = [];
    ctx.state.distinctSkus?.forEach(s => {
      promises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.VtexMP.getImages(s)
          .then(res => resolve({ skuId: s, images: res.data }))
          .catch(err => reject(err));
      }));
    });
    let ecofeeTotal = 0;
    let premiumProducts: any[] = [];
    let nPremium = 0;
    let premiumSpec = ctx.state.appSettings.vtex.premiumProducts?.specification?.split(":")[0];
    let premiumValue = ctx.state.appSettings.vtex.premiumProducts?.specification?.split(":")[1];
    let legalWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId == ctx.state.orderData.salesChannel)?.legalWarranty;
    let extendedWarrId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel.find(info => info.salesChannelId == ctx.state.orderData.salesChannel)?.extendedWarranty;
    let numberOfDnGLinks = 0;
    ctx.state.orderData?.items?.forEach(async (i: any) => {
      let ecofee = ctx.state.skuContexts?.find(f => f.skuId == i.id)?.context?.ProductSpecifications?.find((f: any) => f.FieldName == "ecofee")?.FieldValues[0];
      let premium = ctx.state.skuContexts?.find(f => f.skuId == i.id)?.context?.ProductSpecifications?.find((f: any) => f.FieldName == premiumSpec)?.FieldValues[0];
      i.productName = ctx.state.skuContexts?.find(f => f.skuId == i.id)?.context?.ProductName;
      if (isValid(ecofee)) {
        ecofeeTotal = ecofeeTotal + (parseFloat(ecofee) * i.quantity);
      }
      if (isValid(premium) && (premium + "").toLowerCase() == premiumValue?.toLowerCase()) {
        nPremium = nPremium + i.quantity;
        if (!premiumProducts.includes(i.productId)) {
          premiumProducts.push(i.productId);
        }
      }

      let hasLegalWarranty = i.bundleItems?.find((b: any) => b.additionalInfo?.offeringTypeId == legalWarrId) ? true : false;
      let hasExtendedWarranty = i.bundleItems?.find((b: any) => b.additionalInfo?.offeringTypeId == extendedWarrId) ? true : false;
      if (isValid(legalWarrId) && hasLegalWarranty) {
        numberOfDnGLinks++;
      }
      if (isValid(extendedWarrId) && hasExtendedWarranty) {
        numberOfDnGLinks++;
      }
    });
    let BIProductWithInstallation: any[] = [];
    let installationId = ctx.state.appSettings.vtex.additionalServices?.infoPerSalesChannel?.find(i => i.salesChannelId == ctx.state.orderData.salesChannel)?.installation;
    ctx.state.distinctSkus?.forEach(s => {
      let sku = ctx.state.orderData?.items?.find((f: any) => f.id == s);
      let constructionType = ctx.state.skuContexts?.find(f => f.skuId == s)?.context?.ProductSpecifications?.find((f: any) => f.FieldName == "constructionType")?.FieldValues[0];
      if ((constructionType + "").toLowerCase() == "built in") {
        if (sku!.bundleItems?.find((f: any) => f.additionalInfo?.offeringTypeId == installationId)) {
          BIProductWithInstallation.push(s);
        }
      }
    });
    if (BIProductWithInstallation.length > 0 && ctx.state.appSettings.vtex.checkZipCodes) {
      promises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.VtexMP.isServedZipCode(ctx, ctx.state.orderData?.shippingData?.address?.postalCode)
          .then((res: any) => resolve({ servedZip: res }))
          .catch((err: any) => reject(err))
      }));
    }
    promises.push(new Promise<any>((resolve, reject) => {
      ctx.clients.VtexMP.createCoupons(ctx.state.appSettings.vtex.premiumProducts, nPremium)
        .then(res => resolve({ coupons: res }))
        .catch(err => reject(err))
    }));
    if (ctx.state.appSettings.vtex.dngSettings?.hasDnG) {
      promises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.VtexMP.getDnGLinks(ctx, numberOfDnGLinks).then(res => resolve({ dngLinks: res })).catch(err => reject(err))
      }));
    }
    let responses = await Promise.all(promises);
    let skuImages = responses.filter(f => f.images);
    let coupons = responses.find(f => f.coupons)?.coupons;
    let servedZip: Boolean = responses.find(f => f.servedZip)?.servedZip;
    ctx.state.dngLinks = responses.find(f => f.dngLinks)?.dngLinks;
    ctx.state.dngLinks = ctx.state.dngLinks ? ctx.state.dngLinks : [];
    for (let i = 0; i < ctx.state.orderData?.items?.length && servedZip != undefined; i++) {
      if (BIProductWithInstallation.includes(ctx.state.orderData?.items[i]?.id)) {
        ctx.state.orderData.items[i].bundleItems = ctx.state.orderData?.items[i]?.bundleItems?.filter((f: any) => f.additionalInfo?.offeringTypeId != installationId);
      }
    }
    ctx.state.orderData = alignServiceNames(ctx.state.appSettings.vtex.additionalServices?.generalInfo, ctx.state.orderData, ctx.state.locale!);
    ctx.state.coupons = coupons;
    ctx.state.premiumProducts = premiumProducts;
    ctx.state.skuImages = skuImages;
    ctx.state.ecofeeTotal = ecofeeTotal;
    if (ctx.state.appSettings.vtex.multilanguage && ctx.state.locale!.toLowerCase()!=ctx.state.appSettings.vtex.defaultLocale5C.toLowerCase()) {
      promises = [];
      ctx.state.skuContexts?.forEach(s => {
        let payload: GetProductTranslationReq = {
          identifier: {
            field: "id",
            value: s.context.ProductId
          },
          srcLocale: ctx.state.appSettings.vtex.defaultLocale5C,
          dstLocale: ctx.state.locale!
        }
        promises.push(ctx.clients.TranslatorGQL.getProductTranslation(payload))
      })
      let translations: GetProductTranslationRes[] = await Promise.all(promises);
      ctx.state.orderData.items.forEach((i: any) => {
        let prodTranslation = translations.find(t => t.data.product.id == i.productId)?.data;
        i.name = prodTranslation ? prodTranslation.product.name : i.name;
      })
      // Translated links don't work. Opened a thread with Vtex. Out of scope for the current projects.
      /*ctx.state.skuContexts?.forEach((s: any) => {
        let prodTranslation = translations.find(t => t.data.product.id == s.context.ProductId)?.data;
        s.context.DetailUrl = prodTranslation ? ("/" + prodTranslation.product.linkId.toLowerCase() + "/p") : s.context.DetailUrl;
      })*/
    }
    await next();
  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    let label = routeToLabel(ctx);
    ctx.state.logger.error(label + msg);
    sendAlert(ctx);
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";

  }
}
