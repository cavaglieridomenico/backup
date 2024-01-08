//@ts-nocheck

import { AppSettings } from "../typings/config";
import { TradePolicy } from "../typings/types";
import { specsXTradePolicy } from "../utils/constants";
import { getProductUrl, isValid } from "../utils/functions";

export async function getProduct(ctx: Context, next: () => Promise<any>) {
    ctx.set('Cache-Control', 'no-store');
    if(isValid(ctx.query.skuId)){
      try{
        let tradePolicy = isValidTradePolicy(ctx.query.tradePolicy)?ctx.query.tradePolicy:TradePolicy.O2P;
        let InfoBySKUResponse = await getInfoBySKU(ctx, ctx.query.skuId, tradePolicy);
        let skuContext = InfoBySKUResponse[0];
        let price = InfoBySKUResponse[1];
        let marketPrice = InfoBySKUResponse[2];
        let stockResponse = InfoBySKUResponse[3];
        let images = InfoBySKUResponse[4];
        let skuComplement = InfoBySKUResponse[5];
        let stock = 0;
        if(isValid(stockResponse)){
          stockResponse.balance?.forEach(w => stock += (w.totalQuantity - w.reservedQuantity));
        }else{
          stock = getStockByMarketPriceResponse(ctx.state.appSettings, marketPrice);
        }
        let sellable = skuContext.ProductSpecifications.find(f => f.FieldName==specsXTradePolicy["sellable"][tradePolicy])?.FieldValues[0];
        //let isDiscontinued = skuContext.ProductSpecifications.find(f => f.FieldName=="isDiscontinued")?.FieldValues[0];
        let hasPrice  = price.length==0?false:true;
        let hasImages = images.length==0?false:true;
        let mainCategoriesIds = skuContext.ProductCategoryIds.split("/");
        let mainCategoryId = mainCategoriesIds[mainCategoriesIds.length-2];
        let mainImage = images?.find(f => f.IsMain);
        let imageUrl = mainImage?skuContext.Images?.find(f => f.ImageName==mainImage.Label)?.ImageUrl:"undefined";
        let productInfoSheet = skuContext.ProductSpecifications?.find(f => f.FieldName=="product-data-sheet")?.FieldValues[0];
        let energyLogo = skuContext.ProductSpecifications?.find(f => f.FieldName=="EnergyLogo_image")?.FieldValues[0];
        let xsell = [];
        let upsell = [];
        let accessory = [];
        skuComplement?.filter(f => f.ComplementTypeId==1).forEach(s => xsell.push(s.SkuId));
        skuComplement?.filter(f => f.ComplementTypeId==2).forEach(s => upsell.push(s.SkuId));
        skuComplement?.filter(f => f.ComplementTypeId==3).forEach(s =>  accessory.push(s.SkuId));
        let distinctSkuComplement = [];
        xsell.forEach(s => {
          if(!distinctSkuComplement.includes(s)){
            distinctSkuComplement.push(s);
          }
        })
        upsell.forEach(s => {
          if(!distinctSkuComplement.includes(s)){
            distinctSkuComplement.push(s);
          }
        })
        accessory.forEach(s => {
          if(!distinctSkuComplement.includes(s)){
            distinctSkuComplement.push(s);
          }
        })
        let skuComplementPromises = [];
        distinctSkuComplement.forEach(s => {
          skuComplementPromises.push(new Promise<any>((resolve,reject) => {
            ctx.clients.VtexMP.getSkuBySkuId(s)
            .then(res => resolve({skuId: s, data: res.data}))
            .catch(err => reject(err))
          }))
        })
        let productPromise = new Promise<any>((resolve,reject) => {
          ctx.clients.VtexMP.getProduct(skuContext.ProductId)
          .then(res => resolve(res.data))
          .catch(err => reject(err))
        });
        let categoryPromise = new Promise<any>((resolve,reject) => {
          ctx.clients.VtexMP.getCategory(mainCategoryId)
          .then(res => resolve(res.data))
          .catch(err => reject(err))
        });
        let results = await Promise.all(skuComplementPromises.concat([productPromise, categoryPromise]));
        let xsellArray = [];
        let upsellArray = [];
        let accessoryArray = [];
        xsell.forEach(s => {
          let refid = results.find(f => f.skuId==s)?.data.RefId;
          if(refid!=undefined){
            xsellArray.push(refid);
          }
        })
        upsell.forEach(s => {
          let refid = results.find(f => f.skuId==s)?.data.RefId;
          if(refid!=undefined){
            upsellArray.push(refid);
          }
        })
        accessory.forEach(s => {
          let refid = results.find(f => f.skuId==s)?.data.RefId;
          if(refid!=undefined){
            accessoryArray.push(refid);
          }
        })
        let product = results[results.length-2];
        let category = results[results.length-1];
        ctx.body = [
          getPayloadForSFMC(tradePolicy, skuContext, price, stock, category, ctx, imageUrl, productInfoSheet, energyLogo, marketPrice, true, false, sellable, /*isDiscontinued,*/ product.IsActive, product.IsVisible, hasPrice, hasImages, xsellArray, upsellArray, accessoryArray),
          getPayloadForSFMC(tradePolicy, skuContext, price, stock, category, ctx, imageUrl, productInfoSheet, energyLogo, marketPrice, false, true, sellable, /*isDiscontinued,*/ product.IsActive, product.IsVisible, hasPrice, hasImages, xsellArray, upsellArray, accessoryArray)
        ]
        ctx.status = 200;
      }catch(err){
        ctx.status = err.response?.status!=undefined?err.response.status:500;
        let msg = err.response?.data!=undefined?err.response.data:err.message;
        ctx.body = msg!=undefined?JSON.stringify(msg):("Internal Server Error --details: "+JSON.stringify(err));
      }
    }else{
      ctx.status = 400;
      ctx.body= "Bad Request";
    }
    await next();
}

function isValidTradePolicy(tradePolicy: string): Boolean {
  return isValid(tradePolicy) && (tradePolicy==TradePolicy.EPP || tradePolicy==TradePolicy.FF || tradePolicy==TradePolicy.VIP || tradePolicy==TradePolicy.O2P);
}

function getTradePolicyIdByName(appSettings: AppSettings, tradePolicy: string): string {
  let tpId = "1";
  switch(tradePolicy) {
    case TradePolicy.EPP:
      tpId = appSettings.epp?.tradePolicyId;
      break;
    case TradePolicy.FF:
      tpId = appSettings.ff?.tradePolicyId;
      break;
    case TradePolicy.VIP:
      tpId = appSettings.vip?.tradePolicyId;
      break;
    case TradePolicy.O2P:
      tpId = appSettings.o2p?.tradePolicyId;
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
      if(err.response?.status==404){
        resolve([]);
      }else{
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
    if(tradePolicy==TradePolicy.O2P){
      ctx.clients.VtexMP.getStock(sku)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    }else{
      resolve(undefined);
    }
  })
  let imagesPromise = new Promise<any>((resolve, reject) => {
    ctx.clients.VtexMP.getImages(sku)
    .then(res => resolve(res.data))
    .catch(err => {
      if(err.status==404){
        resolve([]);
      }else{
        reject(err);
      }
    });
  })
  let skuComplementPromise = new Promise<any>((resolve,reject) => {
    ctx.clients.VtexMP.getSkuComplementBySkuId(sku)
    .then(res => resolve(res.data.length>0?res.data:[]))
    .catch(err => reject(err))
  });
  return Promise.all([skuContextPromise, pricePromise, marketPricePromise, stockPromise, imagesPromise, skuComplementPromise]);
}

function getPayloadForSFMC(tradePolicy: string, sku: any, price: any, inventory: any, category: any, ctx: Context, mainImage: any, productInfoSheet: any, energyLogo: any, marketPriceResponse: any, localeFields: boolean, additionalFields: boolean, sellable: string, /*isDiscontinued: string,*/ isActive: boolean, IsVisible: boolean, hasPrice: boolean, hasImages: boolean, xsell: [], upsell: [], accessory: []): Object {
  let locale2CLowerCase = ctx.state.appSettings.vtex.defaultLocale2C.toLowerCase();
  let locale2CUpperCase = ctx.state.appSettings.vtex.defaultLocale2C.toUpperCase();
  let obj = {
      item_type: "product",
      unique_id: sku.AlternateIds.RefId,
      item:sku.AlternateIds.RefId,
      productCategory: category.AdWordsRemarketingCode,
      name: sku.ProductName,
      url: getProductUrl(ctx, tradePolicy, sku),
      image_url: mainImage,
      price: hasPrice==true?getPrice(price, tradePolicy):9999,
      sale_price: hasPrice==true?getMarketPrice(ctx.state.appSettings.vtex.sellerAccount?.name, marketPriceResponse, tradePolicy, price):9999,
      EnergyLogo: isValid(energyLogo)?energyLogo:"",
      "TBD_InformationSheet": isValid(productInfoSheet)?productInfoSheet:"",
      quantity: inventory,
      available: (inventory>0 && /*(inventory>=sku.ProductSpecifications.find(f => f.FieldName=="minimumQuantityThreshold")?.FieldValues[0]) &&*/ /*(isDiscontinued=="false") &&*/ (sellable=="true") && isActive && IsVisible && hasPrice && hasImages)?"Y":"N",
      product_availability: locale2CLowerCase+"_"+locale2CLowerCase,
      productDescription: sku.ProductDescription,
      brandName: sku.BrandName
  }
  if(localeFields){
    obj = {...obj,...{
      "locale_TBD_TBD_name": sku.ProductName,
      "locale_TBD_TBD_ProductLink": getProductUrl(ctx, tradePolicy, sku),
      "locale_TBD_TBD_price": hasPrice==true?getPrice(price, tradePolicy):9999,
      "locale_TBD_TBD_sale_price": hasPrice==true?getMarketPrice(ctx.state.appSettings.vtex.sellerAccount?.name, marketPriceResponse, tradePolicy, price):9999,
      "TBD_product_availability": obj.available=='Y'?true:false,
      }
    }
  }
  obj = JSON.parse(JSON.stringify(obj).replace(/TBD_TBD/g, locale2CLowerCase+"-"+locale2CLowerCase).replace(/TBD_/g, locale2CUpperCase+"_"));
  if(additionalFields){
    let constructionType = sku.ProductSpecifications.find(f => f.FieldName=="constructionType")?.FieldValues[0];
    let accessoryType = sku.ProductSpecifications.find(f => f.FieldName=="accessory_type")?.FieldValues[0];
    let commCode = sku.ProductSpecifications.find(f => f.FieldName=="CommercialCode_field")?.FieldValues[0];
    let IFU = sku.ProductSpecifications.find(f => f.FieldName=="instruction-for-use")?.FieldValues[0];
    let discount = "";
    if(hasPrice){
      let mp =  getMarketPrice(ctx.state.appSettings.vtex.sellerAccount?.name, marketPriceResponse, tradePolicy, price);
      let p = getPrice(price, tradePolicy);
      if(mp!=p){
        discount = 100-mp/p*100;
        discount = discount+"";
        let a = discount.split(".")[0];
        let b = discount.split(".")[1]!=undefined?"."+discount.split(".")[1].substring(0,2):"";
        discount = a+b+" %"
      }
    }
    obj = {...obj,...{
        commercial_code: commCode,
        Product_type: (constructionType+"").toLowerCase()=="accessory"?"Accessory":"Appliance",
        Accessories_category : accessoryType!=undefined?accessoryType:"",
        Accessories: accessory.length>0?accessory.join("|"):"",
        Similar_Product: upsell.length>0?upsell.join("|"):"",
        Complementary_products : xsell.length>0?xsell.join("|"):"",
        Manual_URL: IFU!=undefined?IFU:"",
        Promotion: discount,
      }
    }
  }
  return obj;
}


function getPrice(price: any, tradePolicy: string): number {
 return isValid(price[0].listPrice)?price[0].listPrice:price[0].value;
}

function getMarketPrice(seller: string, marketPriceResponse: any, tradePolicy: string, listprice: any): number {
  let price = undefined;
  if(tradePolicy==TradePolicy.O2P){
    price = marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price;
  }else{
    price = marketPriceResponse[0]?.items[0]?.sellers?.find(f => f.sellerId==seller)?.commertialOffer?.Price;
  }
  if(price==undefined){
    price = getPrice(listprice, tradePolicy);
  }
  return price;
}

function getStockByMarketPriceResponse(appSettings: AppSettings, marketPriceResponse: any): any{
  let stock = marketPriceResponse[0]?.items[0]?.sellers?.find(f => f.sellerId==appSettings.vtex.sellerAccount?.name)?.commertialOffer?.AvailableQuantity
  if(stock==undefined){
    stock = 0;
  }
  return stock;
}
