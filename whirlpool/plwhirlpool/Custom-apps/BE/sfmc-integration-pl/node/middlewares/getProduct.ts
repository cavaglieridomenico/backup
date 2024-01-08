//@ts-nocheck

import { NotFoundError } from "@vtex/api";
import { enabledCredentials } from "../utils/constants";
import { isValid } from "../utils/functions";

export async function getProduct(ctx: Context, next: () => Promise<any>
) {
    ctx.set('Cache-Control', 'no-store');
    let credentials: [] = enabledCredentials[ctx.vtex.account];
    if(credentials.find(f => f.key==ctx.req.headers[("X-VTEX-API-AppKey").toLowerCase()] && f.token==ctx.req.headers[("X-VTEX-API-AppToken").toLowerCase()])!=undefined){
      if(ctx.query.id!=undefined && ctx.query.id!=null && ctx.query.id!="" && !isNaN(ctx.query.id)){
        try{
          let res = await getProductData(ctx);
          ctx.status = 200;
          ctx.body = res.message;
        }catch(err){
          //console.log(err)
          ctx.status = err.status!=undefined?err.status:500;
          ctx.body = err.message!=undefined?err.message:"Internal Server Error";
        }
      }else{
        ctx.status = 400;
        ctx.body= "Empty (or bad) query param";
      }
    }else{
      ctx.body = "Not Authorized";
      ctx.status = 403;
    }
    await next();
}

async function getProductData(ctx: Context): Promise<any>{
  return new Promise<any>(async (resolve,reject) => {
    try{
      const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
      let baseURL = appSettings.baseURL;
      let InfoBySKUResponse = await getInfoBySKU(ctx,ctx.query.id);
      let skuContext = InfoBySKUResponse[0];
      let price = InfoBySKUResponse[1];
      let marketPrice = InfoBySKUResponse[2];
      let stockResponse = InfoBySKUResponse[3];
      let images = InfoBySKUResponse[4];
      let skuComplement = InfoBySKUResponse[5];
      let stock = 0;
      stockResponse.balance?.forEach(w => {
        stock += (w.totalQuantity - w.reservedQuantity);
      });
      let sellable = skuContext.ProductSpecifications.find(f => f.FieldName=="sellable")?.FieldValues[0];
      let isDiscontinued = skuContext.ProductSpecifications.find(f => f.FieldName=="isDiscontinued")?.FieldValues[0];
      let hasPrice  = price.length==0?false:true;
      let hasImages = images.length==0?false:true;
      let mainCategoriesIds = skuContext.ProductCategoryIds.split("/");
      let mainCategoryId = mainCategoriesIds[mainCategoriesIds.length-2];
      let commCode = skuContext.ProductSpecifications?.find(f => f.FieldName=="CommercialCode_field")?.FieldValues[0];
      let mainImage = images?.find(f => f.IsMain);
      let imageUrl = mainImage?skuContext.Images?.find(f => f.ImageName==mainImage.Label)?.ImageUrl:"undefined";
      let productInfoSheet = skuContext.ProductSpecifications?.find(f => f.FieldName=="product-data-sheet")?.FieldValues[0];
      let energyLogo = skuContext.ProductSpecifications?.find(f => f.FieldName=="EnergyLogo_image")?.FieldValues[0];
      let xsell = [];
      let upsell = [];
      let accessory = [];
      skuComplement?.filter(f => f.ComplementTypeId==1).forEach(s => {
        xsell.push(s.SkuId);
      })
      skuComplement?.filter(f => f.ComplementTypeId==2).forEach(s => {
        upsell.push(s.SkuId);
      })
      skuComplement?.filter(f => f.ComplementTypeId==3).forEach(s => {
        accessory.push(s.SkuId);
      })
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
          ctx.clients.Vtex.getSkuBySkuId(s)
          .then(res => {
            resolve({skuId: s, data: res.data});
          })
          .catch(err => {
            reject(err);
          })
        }))
      })
      let productPromise = new Promise<any>((resolve,reject) => {
        ctx.clients.Vtex.getProduct(skuContext.ProductId)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject({status: err.response?.status, message: err.response?.data});
        });
      });
      let categoryPromise = new Promise<any>((resolve,reject) => {
        ctx.clients.Vtex.getCategory(mainCategoryId)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject({status: err.response?.status, message: err.response?.data});
        });
      });
      let results = await Promise.all(skuComplementPromises.concat([productPromise,categoryPromise]));
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
      resolve({status: 200, message: [catalogSalesforce(skuContext, price, stock, category, ctx, imageUrl, productInfoSheet, energyLogo, marketPrice, true, false, sellable, isDiscontinued, product.IsActive, product.IsVisible, hasPrice, hasImages, xsellArray, upsellArray, accessoryArray, commCode, baseURL),
        catalogSalesforce(skuContext, price, stock, category, ctx, imageUrl,productInfoSheet, energyLogo, marketPrice, false, true, sellable, isDiscontinued, product.IsActive, product.IsVisible, hasPrice, hasImages, xsellArray, upsellArray, accessoryArray, commCode, baseURL)]});
    }catch(err){
      //console.log(err)
      if(err.status!==undefined && err.message!=undefined){
        reject(err);
      }else{
        reject({status: err.response?.status, message: err.response?.data});
      }
    }
  });
}

async function getInfoBySKU(ctx: Context, sku: string): Promise<any> {
  let skuContextPromise = new Promise<any>((resolve,reject) => {
    ctx.clients.Vtex.getSkuContext(sku)
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject({status: err.response?.status, message: err.response?.data});
    });
  })
  let pricePromise = new Promise<any>((resolve,reject) => {
    ctx.clients.Vtex.getPrice(sku, ctx)
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      if(err.response?.status==404){
        resolve([]);
      }else{
        reject({status: err.response?.status, message: err.response?.data});
      }
    });
  })
  let marketPricePromise = new Promise<any>((resolve,reject) => {
    ctx.clients.Vtex.getMarketPrice(sku)
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject({status: err.response?.status, message: err.response?.data});
    });
  })
  let stockPromise = new Promise<any>((resolve,reject) => {
    ctx.clients.Vtex.getStock(sku)
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      reject({status: err.response?.status, message: err.response?.data});
    });
  })
  let imagesPromise = new Promise<any>((resolve,reject) => {
    ctx.clients.Vtex.getImages(sku)
    .then(res => {
      resolve(res.data);
    })
    .catch(err => {
      if(err.response?.status==404){
        resolve([]);
      }else{
        reject({status: err.response?.status, message: err.response?.data});
      }
    });
  })
  let skuComplementPromise = new Promise<any>((resolve,reject) => {
    ctx.clients.Vtex.getSkuComplementBySkuId(sku)
    .then(res => {
      resolve(res.data.length>0?res.data:[]);
    })
    .catch(err => {
      reject({status: err.response?.status, message: err.response?.data});
    });
  });
  return Promise.all([skuContextPromise,pricePromise,marketPricePromise,stockPromise,imagesPromise,skuComplementPromise]);
}

function catalogSalesforce(sku: any, price: any, inventory: any, category: any, ctx: Context, mainImage: any, productInfoSheet: any, energyLogo: any, marketPriceResponse: any, localeFields: boolean, additionalFields: boolean, sellable: string, isDiscontinued: string, isActive: boolean, IsVisible: boolean, hasPrice: boolean, hasImages: boolean, xsell: [], upsell: [], accessory: [], commCode: string, baseURL: string): Object {
  let obj = {
      item_type: "product",
      unique_id: sku.AlternateIds.RefId,
      item:sku.AlternateIds.RefId,
      productCategory: category.AdWordsRemarketingCode,
      name: sku.ProductName,
      // PL_WHP set base_url
      url: ctx.vtex.account == "plwhirlpoolqa" ? ('https://' + ctx.vtex.host + sku.DetailUrl) : (baseURL + sku.DetailUrl),
      //url: "https://" + ctx.vtex.host +sku.DetailUrl,
      image_url: mainImage,
      price: hasPrice==true?price[0].value:9999,
      sale_price: hasPrice==true?(marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price!=undefined?marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price:price[0].value):9999,
      EnergyLogo: isValid(energyLogo)?energyLogo:"",
      "PL_InformationSheet": isValid(productInfoSheet)?productInfoSheet:"",
      quantity: inventory,
      available: (inventory>0 && (inventory>=sku.ProductSpecifications.find(f => f.FieldName=="minimumQuantityThreshold")?.FieldValues[0]) && (isDiscontinued=="false") && (sellable=="true") && isActive && IsVisible && hasPrice && hasImages)?"Y":"N",
      // PL_WHP label pl_pl
      product_availability: "pl_pl",
      productDescription: sku.ProductDescription,
      brandName: sku.BrandName
  }
  if(localeFields){
    obj = {...obj,...{
      "locale_pl-pl_name": sku.ProductName,
      "locale_pl-pl_ProductLink": ctx.vtex.account == "plwhirlpoolqa" ? ('https://' + ctx.vtex.host + sku.DetailUrl) : (baseURL + sku.DetailUrl),
      // "locale_pl-pl_ProductLink": "https://" + ctx.vtex.host +sku.DetailUrl,
      "locale_pl-pl_price": hasPrice==true?price[0].value:9999,
      "locale_pl-pl_sale_price": hasPrice==true?(marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price!=undefined?marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price:price[0].value):9999,
      "PL_product_availability": true
      }
    }
  }
  if(additionalFields){
    let constructionType = sku.ProductSpecifications.find(f => f.FieldName=="constructionType")?.FieldValues[0];
    let accessoryType = sku.ProductSpecifications.find(f => f.FieldName=="accessory_type")?.FieldValues[0];
    let IFU = sku.ProductSpecifications.find(f => f.FieldName=="instruction-for-use")?.FieldValues[0];
    let discount = "";
    if(hasPrice){
      if(marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price!=undefined){
        let mp =  parseFloat(marketPriceResponse[0]?.items[0]?.sellers[0]?.commertialOffer?.Price+"");
        let p = parseFloat(price[0].value+"");
        if(mp != p){
          discount = 100-mp/p*100;
          discount = discount+"";
          let a = discount.split(".")[0];
          let b = discount.split(".")[1]!=undefined?"."+discount.split(".")[1].substr(0,2):"";
          discount = a+b+" %"
        }
      }
    }
    obj = {...obj,...{
      Product_type: (constructionType+"").toLowerCase()=="accessory"?"Accessory":"Appliance",
      Accessories_category : accessoryType!=undefined?accessoryType:"",
      Accessories: accessory.length>0?accessory.join("|"):"",
      Similar_Product: upsell.length>0?upsell.join("|"):"",
      Complementary_products : xsell.length>0?xsell.join("|"):"",
      Manual_URL: IFU!=undefined?IFU:"",
      Promotion: discount,
      commercial_code: commCode,
      }
    }
  }
  return obj;
}
