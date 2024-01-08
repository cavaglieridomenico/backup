import { AppSettings } from "../typings/config";
import { GetProductTranslationRes } from "../typings/translations";
import { TradePolicy } from "../typings/types";
import { specsXTradePolicy } from "../utils/constants";
import { isValid, stringify } from "../utils/functions";

export async function getProduct(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  if (isValid(ctx.query.skuId)) {
    try {
      ctx.state.product = {};
      ctx.state.product.tradePolicy = isValidTradePolicy(ctx.query.tradePolicy as string | undefined) ? ctx.query.tradePolicy as string : TradePolicy.O2P;
      let InfoBySKUResponse = await getInfoBySKU(ctx, ctx.query.skuId as string, ctx.state.product.tradePolicy);
      ctx.state.product.skuContext = InfoBySKUResponse[0];
      ctx.state.product.price = InfoBySKUResponse[1];
      ctx.state.product.marketPrice = InfoBySKUResponse[2];
      let stockResponse = InfoBySKUResponse[3];
      let images = InfoBySKUResponse[4];
      let skuComplement = InfoBySKUResponse[5];
      ctx.state.product.stock = 0;
     
      if (isValid(stockResponse) && !ctx.state.appSettings.vtex.isMarketplace) {
        stockResponse.balance?.forEach((w: any) => ctx.state.product!.stock += (w.totalQuantity - w.reservedQuantity));
      } else {
        ctx.state.product.stock = getStockByMarketPriceResponse(ctx.state.appSettings, ctx.state.product.marketPrice);
      }

      ctx.state.product.sellable = ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == specsXTradePolicy["sellable"][ctx.state.product!.tradePolicy!])?.FieldValues[0];
      ctx.state.product.hasPrice = ctx.state.product.price.length > 0;
      ctx.state.product.hasImages = images.length > 0;
      let mainCategoriesIds = ctx.state.product.skuContext.ProductCategoryIds.split("/");
      let mainCategoryId = mainCategoriesIds[mainCategoriesIds.length - 2];
      let mainImage = images?.find((f: any) => f.IsMain);
      ctx.state.product.imageUrl = ctx.state.product.skuContext.Images?.find((f: any) => f.ImageName == mainImage?.Label)?.ImageUrl;
      ctx.state.product.imageUrl = ctx.state.product.imageUrl ? ctx.state.product.imageUrl : (ctx.state.product.hasImages ? ctx.state.product.skuContext.Images[0].ImageUrl : "undefined");
      ctx.state.product.productInfoSheet = getProductInfoSheet(ctx.state.product.skuContext.ProductSpecifications, ctx.state.appSettings.vtex.specifications?.productDataSheet);
      ctx.state.product.energyLogo = ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "EnergyLogo_image")?.FieldValues[0];
      ctx.state.product.constructionType = ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "constructionType")?.FieldValues[0];
      ctx.state.product.accessoryType = ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "accessory_type")?.FieldValues[0];
      ctx.state.product.commCode = ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "CommercialCode_field")?.FieldValues[0];
      ctx.state.product.IFU = isValid(ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "instruction-for-use")) ? ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "instruction-for-use")?.FieldValues[0] : 
        (isValid(ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "daily-reference-guide")) ? ctx.state.product.skuContext.ProductSpecifications?.find((f: any) => f.FieldName == "daily-reference-guide")?.FieldValues[0] : "");
      ctx.state.product.discount = 0;
      if (ctx.state.product.hasPrice) {
        let mp = getMarketPrice(ctx.state.appSettings.vtex.sellerAccount?.sellerIds, ctx.state.product.marketPrice, ctx.state.product.tradePolicy, ctx.state.product.price);
        let p = getPrice(ctx.state.product.price);
        if (mp != p) {
          ctx.state.product.discount = 100 - mp / p * 100;
          ctx.state.product.discount = ctx.state.product.discount + "";
          let a = ctx.state.product.discount.split(".")[0];
          let b = ctx.state.product.discount.split(".")[1] ? "." + ctx.state.product.discount.split(".")[1].substring(0, 2) : "";
          ctx.state.product.discount = a + b + " %"
        }
      }
      let xsell: any[] = [];
      let upsell: any[] = [];
      let accessory: any[] = [];
      skuComplement?.filter((f: any) => f.ComplementTypeId == 1).forEach((s: any) => xsell.push(s.SkuId));
      skuComplement?.filter((f: any) => f.ComplementTypeId == 2).forEach((s: any) => upsell.push(s.SkuId));
      skuComplement?.filter((f: any) => f.ComplementTypeId == 3).forEach((s: any) => accessory.push(s.SkuId));
      let distinctSkuComplement: any[] = [];
      xsell.forEach(s => {
        if (!distinctSkuComplement.includes(s)) {
          distinctSkuComplement.push(s);
        }
      })
      upsell.forEach(s => {
        if (!distinctSkuComplement.includes(s)) {
          distinctSkuComplement.push(s);
        }
      })
      accessory.forEach(s => {
        if (!distinctSkuComplement.includes(s)) {
          distinctSkuComplement.push(s);
        }
      })
      let skuComplementPromises: Promise<any>[] = [];
      distinctSkuComplement.forEach(s => {
        skuComplementPromises.push(new Promise<any>((resolve, reject) => {
          ctx.clients.VtexMP.getSkuBySkuId(s)
            .then(res => resolve({ skuId: s, data: res.data }))
            .catch(err => reject(err))
        }))
      })
      let productPromise = new Promise<any>((resolve, reject) => {
        ctx.clients.VtexMP.getProduct(ctx.state.product!.skuContext.ProductId)
          .then(res => resolve(res.data))
          .catch(err => reject(err))
      });
      let categoryPromise = new Promise<any>((resolve, reject) => {
        ctx.clients.VtexMP.getCategory(mainCategoryId)
          .then(res => resolve(res.data))
          .catch(err => reject(err))

      });
      let results = await Promise.all(skuComplementPromises.concat([productPromise, categoryPromise]));
      ctx.state.product.xsellAss = [];
      ctx.state.product.upsellAss = [];
      ctx.state.product.accessoryAss = [];
      xsell.forEach(s => {
        let refid = results.find(f => f.skuId == s)?.data.RefId;
        if (refid) {
          ctx.state.product!.xsellAss!.push(refid);
        }
      })
      upsell.forEach(s => {
        let refid = results.find(f => f.skuId == s)?.data.RefId;
        if (refid) {
          ctx.state.product!.upsellAss!.push(refid);
        }
      })
      accessory.forEach(s => {
        let refid = results.find(f => f.skuId == s)?.data.RefId;
        if (refid) {
          ctx.state.product!.accessoryAss!.push(refid);
        }
      })
      ctx.state.product.productInfo = results[results.length - 2];
      ctx.state.product.category = results[results.length - 1];
      if (ctx.state.appSettings.vtex.multilanguage) {
        let promises: Promise<{ locale: string, response: GetProductTranslationRes }>[] = [];
        ctx.state.appSettings.vtex.localeList?.split(",")?.forEach(l => {
          promises.push(
            new Promise<{ locale: string, response: GetProductTranslationRes }>((resolve, reject) => {
              ctx.clients.TranslatorGQL.getProductTranslation({
                identifier: {
                  field: "id",
                  value: ctx.state.product!.skuContext.ProductId
                },
                srcLocale: ctx.state.appSettings.vtex.defaultLocale5C,
                dstLocale: l
              }).then(res => resolve({ locale: l, response: res })).catch(err => reject(err))
            })
          )
        })
        ctx.state.product.translations = await Promise.all(promises);
      }
      ctx.body = [
        getPayloadForSFMC(ctx, true, false),
        getPayloadForSFMC(ctx, false, true)
      ]
      ctx.status = 200;
    } catch (err) {
      //console.error(err)
      ctx.status = err.response?.status ? err.response.status : 500;
      let msg = err.response?.data ? err.response.data : err.message;
      ctx.body = msg ? stringify(msg) : ("Internal Server Error --details: " + stringify(err));
    }
  } else {
    ctx.status = 400;
    ctx.body = "Bad Request";
  }
  await next();
}

function isValidTradePolicy(tradePolicy: string | undefined): Boolean {
  return isValid(tradePolicy) && (tradePolicy == TradePolicy.EPP || tradePolicy == TradePolicy.FF || tradePolicy == TradePolicy.VIP || tradePolicy == TradePolicy.O2P);
}

function getProductUrl(ctx: Context, tradePolicy: string, skuContext: any = undefined, translatedLink: string | undefined = undefined): string {
  let baseUrl = "https://";
  switch (tradePolicy) {
    case TradePolicy.EPP:
      baseUrl += ctx.state.appSettings.epp?.hostname;
      break;
    case TradePolicy.FF:
      baseUrl += ctx.state.appSettings.ff?.hostname;
      break;
    case TradePolicy.VIP:
      baseUrl += ctx.state.appSettings.vip?.hostname;
      break;
    case TradePolicy.O2P:
      baseUrl += ctx.state.appSettings.o2p?.hostname;
      break;
    default:
      baseUrl += ctx.hostname;
  }
  return baseUrl + (skuContext?.DetailUrl ? skuContext!.DetailUrl : ("/" + translatedLink?.toLowerCase() + "/p"));
}

function getTradePolicyIdByName(appSettings: AppSettings, tradePolicy: string): string {
  let tpId = "1";
  switch (tradePolicy) {
    case TradePolicy.EPP:
      tpId = appSettings.epp!.tradePolicyId;
      break;
    case TradePolicy.FF:
      tpId = appSettings.ff!.tradePolicyId;
      break;
    case TradePolicy.VIP:
      tpId = appSettings.vip!.tradePolicyId;
      break;
    case TradePolicy.O2P:
      tpId = appSettings.o2p!.tradePolicyId;
  }
  return tpId;
}

async function getInfoBySKU(ctx: Context, sku: string, tradePolicy: string): Promise<any> {
  let tpId = getTradePolicyIdByName(ctx.state.appSettings, tradePolicy);
  let skuContextPromise = new Promise<any>((resolve, reject) => {
    ctx.clients.VtexMP.getSkuContext(sku)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
  let pricePromise = new Promise<any>((resolve, reject) => {
    ctx.clients.VtexMP.getPrice(ctx, sku, tpId)
      .then(res => resolve(res.data))
      .catch(err => {
        if (err.response?.status == 404) {
          resolve([]);
        } else {
          reject(err);
        }
      });
  })
  let marketPricePromise = new Promise<any>((resolve, reject) => {
    ctx.clients.VtexMP.getMarketPrice(sku, tpId)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
  let stockPromise = new Promise<any>((resolve, reject) => {
    if (tradePolicy == TradePolicy.O2P) {
      ctx.clients.VtexMP.getStock(sku)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    } else {
      resolve(undefined);
    }
  })
  let imagesPromise = new Promise<any>((resolve, reject) => {
    ctx.clients.VtexMP.getImages(sku)
      .then(res => resolve(res.data))
      .catch(err => {
        if (err.status == 404) {
          resolve([]);
        } else {
          reject(err);
        }
      });
  })
  let skuComplementPromise = new Promise<any>((resolve, reject) => {
    ctx.clients.VtexMP.getSkuComplementBySkuId(sku)
      .then(res => resolve(res.data.length > 0 ? res.data : []))
      .catch(err => reject(err))
  });
  return Promise.all([skuContextPromise, pricePromise, marketPricePromise, stockPromise, imagesPromise, skuComplementPromise]);
}

// Convention agreed with SFMC:
// TBD_ => country_ (2 chars) for the standard payload; locale_ (2 chars) for translations;
// TBD_TBD_ => locale-country_ (5 chars), excpet for product_availability whose value is country_country
function getPayloadForSFMC(ctx: Context, localeFields: boolean, additionalFields: boolean): any {

  let country = ctx.state.appSettings.vtex.defaultLocale5C.split("-")[1];

  let obj = {
    item_type: "product",
    unique_id: ctx.state.product!.skuContext.AlternateIds.RefId,
    item: ctx.state.product!.skuContext.AlternateIds.RefId,
    productCategory: ctx.state.product!.category.AdWordsRemarketingCode,
    name: ctx.state.product!.skuContext.ProductName,
    url: getProductUrl(ctx, ctx.state.product!.tradePolicy!, ctx.state.product!.skuContext),
    image_url: ctx.state.product!.imageUrl,
    price: ctx.state.product!.hasPrice ? getPrice(ctx.state.product!.price) : 9999,
    sale_price: ctx.state.product!.hasPrice ? getMarketPrice(ctx.state.appSettings.vtex.sellerAccount?.sellerIds, ctx.state.product!.marketPrice, ctx.state.product!.tradePolicy!, ctx.state.product!.price) : 9999,
    EnergyLogo: isValid(ctx.state.product!.energyLogo) ? ctx.state.product!.energyLogo : "",
    TBD_InformationSheet: isValid(ctx.state.product!.productInfoSheet) ? ctx.state.product!.productInfoSheet : "",
    quantity: ctx.state.product!.stock,
    available: (
      ctx.state.product!.stock > 0 &&
      ctx.state.product!.sellable == "true" &&
      ctx.state.product!.productInfo.IsActive &&
      ctx.state.product!.productInfo.IsVisible &&
      ctx.state.product!.hasPrice &&
      ctx.state.product!.hasImages
    ) ? "Y" : "N",
    product_availability: (country + "_" + country).toLowerCase(),
    productDescription: ctx.state.product!.skuContext.ProductDescription,
    brandName: ctx.state.product!.skuContext.BrandName
  }

  if (localeFields) {
    obj = {
      ...obj, ...{
        locale_TBD_TBD_name: ctx.state.product!.skuContext.ProductName,
        locale_TBD_TBD_ProductLink: getProductUrl(ctx, ctx.state.product!.tradePolicy!, ctx.state.product!.skuContext),
        locale_TBD_TBD_price: ctx.state.product!.hasPrice ? getPrice(ctx.state.product!.price) : 9999,
        locale_TBD_TBD_sale_price: ctx.state.product!.hasPrice ? getMarketPrice(ctx.state.appSettings.vtex.sellerAccount?.sellerIds, ctx.state.product!.marketPrice, ctx.state.product!.tradePolicy!, ctx.state.product!.price) : 9999,
        TBD_product_availability: obj.available == "Y"
      }
    }
  }
  obj = JSON.parse(JSON.stringify(obj).replace(/TBD_TBD/g, ctx.state.appSettings.vtex.defaultLocale5C.toLowerCase()).replace(/TBD_/g, (country + "_").toUpperCase()));

  if (additionalFields) {
    obj = {
      ...obj, ...{
        commercial_code: ctx.state.product!.commCode,
        Product_type: (ctx.state.product!.constructionType + "").toLowerCase() == "accessory" ? "Accessory" : "Appliance",
        Accessories_category: ctx.state.product!.accessoryType ? ctx.state.product!.accessoryType : "",
        Accessories: ctx.state.product!.accessoryAss!.length > 0 ? ctx.state.product!.accessoryAss!.join("|") : "",
        Similar_Product: ctx.state.product!.upsellAss!.length > 0 ? ctx.state.product!.upsellAss!.join("|") : "",
        Complementary_products: ctx.state.product!.xsellAss!.length > 0 ? ctx.state.product!.xsellAss!.join("|") : "",
        Manual_URL: ctx.state.product!.IFU ? ctx.state.product!.IFU : "",
        Promotion: ctx.state.product!.discount
      }
    }
  }

  if (ctx.state.appSettings.vtex.multilanguage) {
    ctx.state.appSettings.vtex.localeList?.split(",")?.forEach(l => {
      let translation = ctx.state.product!.translations?.find(t => t.locale.toLowerCase() == l.toLowerCase())?.response?.data?.product;
      obj = {
        ...obj,
        ...{
          TBD_name: translation?.name,
          // no real translation for now. Moreover translated links don't work. Opened a thread with Vtex. Out of scope for the current projects.
          TBD_url: getProductUrl(ctx, ctx.state.product!.tradePolicy!, ctx.state.product!.skuContext),
          TBD_productDescription: translation?.description,
          TBD_InformationSheet: isValid(ctx.state.product!.productInfoSheet) ? ctx.state.product!.productInfoSheet : "", // no real translated document for now
        }
      }
      if (localeFields) {
        obj = {
          ...obj,
          ...{
            locale_TBD_TBD_name: translation?.name,
            // no real translation for now. Moreover translated links don't work. Opened a thread with Vtex. Out of scope for the current projects.
            locale_TBD_TBD_ProductLink: getProductUrl(ctx, ctx.state.product!.tradePolicy!, ctx.state.product!.skuContext),
          }
        }
      }
      if (additionalFields) {
        obj = {
          ...obj,
          ...{
            TBD_Manual_URL: ctx.state.product!.IFU ? ctx.state.product!.IFU : "", // no real translated document for now
          }
        }
      }
      let sfmcLocale = l.split("-")[0].toUpperCase();
      let sfmcCountry = ctx.state.appSettings.vtex.defaultLocale5C.split("-")[1];
      obj = JSON.parse(JSON.stringify(obj).replace(/TBD_TBD/g, (sfmcLocale + "-" + sfmcCountry).toLowerCase()).replace(/TBD_/g, sfmcLocale + "_"));
    })
  }

  return obj;
}


function getPrice(price: any): number {
  return isValid(price[0]?.listPrice) && price[0]?.listPrice >= price[0].value ? price[0].listPrice : price[0].value;
}

function getMarketPrice(sellerIds: string | undefined, marketPriceResponse: any, tradePolicy: string, listprice: any): number {
  let price = undefined;
  if (tradePolicy == TradePolicy.O2P) {
    price = marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price;
  } else {
    price = marketPriceResponse[0]?.items[0]?.sellers?.find((f: any) => sellerIds?.split(",").includes(f.sellerId))?.commertialOffer?.Price;
  }
  if (!price) {
    price = getPrice(listprice);
  }
  return price;
}

function getStockByMarketPriceResponse(appSettings: AppSettings, marketPriceResponse: any): any {
  let stock = marketPriceResponse[0]?.items[0]?.sellers?.find((f: any) => appSettings.vtex.sellerAccount?.sellerIds?.split(",").includes(f.sellerId))?.commertialOffer?.AvailableQuantity
  if (!stock) {
    stock = 0;
  }
  return stock;
}

export function getProductInfoSheet(productSpecifications: any, possibleSpecificationNames: string[]) {
  let productInfoSheet = "";
  for (let i = 0; i < possibleSpecificationNames?.length; i++) {
    let possibleInfoSheet = productSpecifications?.find((spec: any) => spec.FieldName == possibleSpecificationNames[i]);
    if (isValid(possibleInfoSheet) && isValid(possibleInfoSheet.FieldValues[0])) {
      productInfoSheet = possibleInfoSheet.FieldValues[0];
      break;
    }
  }
  return productInfoSheet;
}