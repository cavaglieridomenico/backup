//@ts-nocheck

import { baseUrl, sellableMap } from "../utils/constants";
import { prettyIdToUrl } from "../utils/energyLabel";
import { prettyIdToLabel } from "../utils/energyLabel";
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

export async function exportCatalog(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  try{
    let products = [];
    let initialPromises = [];
    initialPromises.push(new Promise<any>((resolve,reject) => {
        ctx.clients.Vtex.getSalesChannelList()
        .then(res => resolve(res.data))
        .catch(err => reject(err))
      })
    );
    initialPromises.push(new Promise<any>((resolve,reject) => {
      getAllProducts(ctx,[],1)
      .then(res => resolve(res))
      .catch(err => reject(err))
      })
    );
    initialPromises.push(new Promise<any>((resolve,reject) => {
      ctx.clients.Vtex.getAllPromo()
      .then(res => resolve(res.data.items))
      .catch(err => reject(err))
      })
    );
    let initialResults = await Promise.all(initialPromises);
    let saleschannels = initialResults[0];
    let skuIds = initialResults[1];
    let promos = initialResults[2];
    promos = promos.length>0?sortPromotions(promos):promos;
    let tableColumns = [
      {id: 'Sku Id', title: 'Sku Id'},
      {id: 'Product Id', title: 'Product Id'},
      {id: '12nc', title: '12nc'},
      {id: 'Commercial code', title: 'Commercial code'},
      {id: 'Description', title: 'Description'},
      {id: 'Category', title: 'Category'},
      {id: 'Brand', title: 'Brand'},
      {id: 'Construction type', title: 'Construction type'},
      {id: 'Visibile', title: 'Visibile'},
      {id: 'Discontinued', title: 'Discontinued'},
    ];
    if(saleschannels.length>1){
      saleschannels.forEach(s => {
        tableColumns.push({id: s.Name+' - Sellable', title: s.Name+' - Sellable'});
      });
    }else{
      tableColumns.push({id: 'Sellable', title: 'Sellable'});
    }
    if(saleschannels.length>1){
      saleschannels.forEach(s => {
        tableColumns.push({id: s.Name+' - List price', title: s.Name+' - List price ('+s.CurrencySymbol+')'});
        tableColumns.push({id: s.Name+' - Sale price', title: s.Name+' - Sale price ('+s.CurrencySymbol+')'});
        tableColumns.push({id: s.Name+' - Market price', title: s.Name+' - Market price ('+s.CurrencySymbol+')'});
      });
    }else{
      tableColumns = tableColumns.concat([
        {id: 'List price', title: 'List price ('+saleschannels[0].CurrencySymbol+')'},
        {id: 'Sale price', title: 'Sale price ('+saleschannels[0].CurrencySymbol+')'},
        {id: 'Market price', title: 'Market price ('+saleschannels[0].CurrencySymbol+')'}
      ]);
    }
    tableColumns = tableColumns.concat([
      {id: 'Stock', title: 'Stock'},
      {id: 'Minimum quantity threshold', title: 'Minimum quantity threshold'},
      {id: 'Available', title: 'Available'},
      {id: 'Active promo', title: 'Active promo'},
      {id: 'Promo begin date', title: 'Promo begin date'},
      {id: 'Promo end date', title: 'Promo end date'},
      {id: 'Energy label', title: 'Energy label'},
      {id: 'Score', title: 'Score'},
      {id: 'Gifts', title: 'Gifts'},
      {id: 'MDA Cross-sell', title: 'MDA Cross-sell'},
      {id: 'MDA Up-sell', title: 'MDA Up-sell'},
      {id: 'WPRO Cross-sell', title: 'WPRO Cross-sell'},
      {id: 'Product url', title: 'Product url'}
    ]);
    let promisesInfo = [];
    skuIds?.forEach(s => {
      promisesInfo.push(new Promise<any>((resolve,reject) => {
        getProductInfo(ctx, s, saleschannels)
        .then(res => resolve(res))
        .catch(err => reject(err))
      }));
    });
    let resultInfo = await Promise.all(promisesInfo);
    let serviceColumns = getServiceColumns(saleschannels, resultInfo);
    tableColumns = tableColumns.concat(serviceColumns);
    const csvStringifier  = createCsvStringifier({
      header: tableColumns
    });
    let promisesProductsCategoriesPromo = [];
    resultInfo?.forEach(r => {
      let skuId = r[0]?.skuId;
      let productId = r[0]?.skuContext?.ProductId;
      promisesProductsCategoriesPromo.push(new Promise<any>((resolve,reject) => {
        ctx.clients.Vtex.getProduct(productId)
        .then(res => resolve({skuId: skuId, productId: productId, productData: res.data}))
        .catch(err => reject(err))
      }));
      promisesProductsCategoriesPromo.push(new Promise<any>((resolve,reject) => {
        ctx.clients.Vtex.getAssociatedSimilarCategories(productId)
        .then(res => res.data==""?resolve({skuId: skuId, productId: productId, similarCategories: []}):resolve({skuId: skuId, productId: productId, similarCategories: res.data}))
        .catch(err => reject(err))
      }));
    });
    promos?.forEach(p => {
      if(p.isActive && !p.isArchived && p.type=="regular" && p.status=="active" && p.utmSource=="" && p.utmCampain=="" && p.utmiCampaign==""){
        promisesProductsCategoriesPromo.push(new Promise<any>((resolve,reject) => {
          ctx.clients.Vtex.getPromoById(p.idCalculatorConfiguration)
          .then(res => {
            p.scope.allCatalog?res.data["allCatalog"]=true:res.data["allCatalog"]=false;
            resolve({promoId: p.idCalculatorConfiguration, promoData: res.data})
          })
          .catch(err => reject(err))
        }));
      }
    })
    let resultProductsCategoriesPromo = await Promise.all(promisesProductsCategoriesPromo);
    let resultProducts = resultProductsCategoriesPromo?.filter(f => f.productData!=undefined);
    let resultSimilarCategories = resultProductsCategoriesPromo?.filter(f => f.similarCategories!=undefined);
    let resultPromos = resultProductsCategoriesPromo?.filter(f => f.promoData!=undefined);
    let giftPromos = [];
    let skuPromos = [];
    let skuPromosInfoRes = [];
    resultPromos?.forEach(p => {
      if(p.promoData?.skusGift?.gifts?.length>0){
        giftPromos.push(p.promoData);
      }else{
        skuPromos.push(p.promoData);
      }
    })
    if(skuPromos.length>=0){
      let skuPromosInfo = [];
      skuIds?.forEach(s => {
        let skuInfo = resultInfo?.find(f => f[0].skuId==s);
        skuPromosInfo.push(new Promise<any>((resolve,reject) => {
            getSkuPromo(ctx, s, skuPromos, skuInfo, saleschannels[0].CultureInfo)
            .then(res => resolve({skuId: s, promoInfo: res}))
            .catch(err => reject(err))
          })
        );
      })
      skuPromosInfoRes = await Promise.all(skuPromosInfo);
    }
    resultInfo?.forEach(r => {
      let skuContext = r[0]?.skuContext;
      let price = r[1]?.price;
      let marketPrice = r?.filter(f => f.marketPrice!=undefined);
      let stock = 0;
      r?.find(f => f.stock!=undefined)?.stock.balance?.forEach(w => {
        stock += (w.totalQuantity - w.reservedQuantity);
      });
      let obj = {};
      obj["Sku Id"] = skuContext?.Id;
      obj["Product Id"] = skuContext?.ProductId;
      obj["12nc"] = skuContext?.AlternateIds?.RefId;
      obj["Commercial code"] = skuContext?.ProductSpecifications?.find(f => f.FieldName=="CommercialCode_field")?.FieldValues[0];
      obj["Description"] = skuContext?.ProductName;
      let mainCategoriesIds = skuContext?.ProductCategoryIds?.split("/");
      let mainCategoryId = mainCategoriesIds[mainCategoriesIds.length-2];
      let categories = [];
      categories.push(skuContext?.ProductCategories[mainCategoryId]);
      let similarCategories = resultSimilarCategories?.find(f => skuContext.Id==f.skuId)?.similarCategories;
      similarCategories?.forEach(as => {
        categories.push(skuContext?.ProductCategories[as.CategoryId]);
      })
      obj["Category"] = categories.join(" , ");
      obj["Brand"] = skuContext?.BrandName;
      obj['Construction type'] = skuContext?.ProductSpecifications?.find(f => f.FieldName=="constructionType")?.FieldValues[0];
      obj["Visibile"] = (resultProducts?.find(f => f.productId==skuContext.ProductId)?.productData?.IsVisible==true) && (resultProducts?.find(f => f.productId==skuContext.ProductId)?.productData?.IsActive==true)?"yes":"no";
      obj["Discontinued"] = skuContext?.ProductSpecifications?.find(f => f.FieldName=="isDiscontinued")?.FieldValues[0]=="true"?"yes":"no";
      if(saleschannels.length>1){
        saleschannels?.forEach(s => {
          let sellableField = sellableMap[ctx.vtex.account][s.Name];
          obj[s.Name+" - Sellable"] = skuContext?.ProductSpecifications?.find(f => f.FieldName==sellableField)?.FieldValues[0]=="true"?"yes":"no";
        })
      }else{
        obj["Sellable"] = skuContext?.ProductSpecifications?.find(f => f.FieldName=="sellable")?.FieldValues[0]=="true"?"yes":"no";
      }
      if(saleschannels.length>1){
        saleschannels?.forEach(s => {
          let fixedPrice = price?.fixedPrices?.find(f => f.tradePolicyId==(s.Id+""));
          let salePrice = fixedPrice?.value;
          let listPriceValue = fixedPrice?.listPrice;
          obj[s.Name+" - List price"] = listPriceValue!=undefined?listPriceValue:(salePrice!=undefined?salePrice:"undefined");
          obj[s.Name+" - Sale price"] = salePrice!=undefined?salePrice:"undefined";
          let marketPriceValue = marketPrice?.find(f => f.tradePolicy==s.Id)?.marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer?.Price;
          obj[s.Name+" - Market price"] = (marketPriceValue!=undefined && marketPriceValue!=0)?marketPriceValue:obj[s.Name+" - Sale price"];
        })
      }else{
        let fixedPrice = price?.fixedPrices[0];
        let salePrice = fixedPrice?.value;
        let listPriceValue = fixedPrice?.listPrice;
        obj["List price"] = listPriceValue!=undefined?listPriceValue:(salePrice!=undefined?salePrice:"undefined");
        obj["Sale price"] = salePrice!=undefined?salePrice:"undefined";
        let marketPriceValue = marketPrice[0]?.marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer?.Price;
        obj["Market price"] = (marketPriceValue!=undefined && marketPriceValue!=0)?marketPriceValue:obj["Sale price"];
      }
      obj["Stock"] = stock;
      obj["Minimum quantity threshold"] = skuContext?.ProductSpecifications?.find(f => f.FieldName=="minimumQuantityThreshold")?.FieldValues[0];
      obj["Available"] = (stock>=skuContext?.ProductSpecifications?.find(f => f.FieldName=="minimumQuantityThreshold")?.FieldValues[0]) && (stock>0)?"yes":"no";
      let promoToShow = skuPromosInfoRes?.find(f => f.skuId==r[0].skuContext.Id)?.promoInfo;
      obj["Active promo"] = promoToShow!=undefined?promoToShow.name:"";
      obj["Promo begin date"] = promoToShow!=undefined?promoToShow.beginDate:"";
      obj["Promo end date"] = promoToShow!=undefined?promoToShow.endDate:"";
      let labelUrl = skuContext?.ProductSpecifications?.find(f => f.FieldName=="EnergyLogo_image")?.FieldValues[0];
      let label = "";
      if(labelUrl!=undefined){
        let prettyId = Object.keys(prettyIdToUrl).find(f => prettyIdToUrl[f]==labelUrl);
        label = prettyIdToLabel[prettyId+""];
      }
      obj["Energy label"] = label;
      obj["Score"] = resultProducts?.find(f => f.productId == skuContext.ProductId)?.productData?.Score;
      let acccessories = [];
      giftPromos?.forEach(g => {
        if(g.products?.find(f => f.id==skuContext.ProductId)!=undefined){
          g.skusGift?.gifts?.forEach(s => {
            acccessories.push(s.name?.split(" (")[0]);
          });
        }
      })
      obj["Gifts"] = acccessories.length>0?acccessories.join(" , "):"";
      let skuComplementData = r?.find(f => f.skuComplement!=undefined)?.skuComplement;
      let mdaXSell = skuComplementData?.filter(f => f.ComplementTypeId==1);
      let mdaUpSell = skuComplementData?.filter(f => f.ComplementTypeId==2);
      let wproXSell = skuComplementData?.filter(f => f.ComplementTypeId==3);
      let mdaXSellRefIds = [];
      let mdaUpSellRefIds = [];
      let wproXSellRefIds = [];
      mdaXSell?.forEach(m => {
        mdaXSellRefIds.push(resultInfo?.find(f => f[0].skuContext!=undefined && f[0].skuId==m.SkuId)[0]?.skuContext?.AlternateIds?.RefId);
      })
      mdaUpSell?.forEach(m => {
        mdaUpSellRefIds.push(resultInfo?.find(f => f[0].skuContext!=undefined && f[0].skuId==m.SkuId)[0]?.skuContext?.AlternateIds?.RefId);
      })
      wproXSell?.forEach(m => {
        wproXSellRefIds.push(resultInfo?.find(f => f[0].skuContext!=undefined && f[0].skuId==m.SkuId)[0]?.skuContext?.AlternateIds?.RefId);
      })
      obj["MDA Cross-sell"] = mdaXSellRefIds.length>0?mdaXSellRefIds.join(" , "):"";
      obj["MDA Up-sell"] = mdaUpSellRefIds.length>0?mdaUpSellRefIds.join(" , "):"";
      obj["WPRO Cross-sell"] = wproXSellRefIds.length>0?wproXSellRefIds.join(" , "):"";
      obj["Product url"] = baseUrl[ctx.vtex.account]+skuContext.DetailUrl;
      serviceColumns.forEach(sc => {
        let service = skuContext?.Services?.find(f => f.Name==sc.id)?.Options[0]?.Price
        if(service!=undefined){
          service = service+"";
          let slices = service.split(".");
          if(slices==2){
            service = slices[0]+"."+slices[1].substr(0,2)
          }
        }
        obj[sc.id] = service!=undefined?service:"";
      })
      products.push(obj);
    });
    let timestamp = new Date().toISOString().replace(/-/g,"").split(".")[0].replace(/:/g,"");
    ctx.status = 200;
    ctx.res.setHeader("Content-Type","text/csv");
    ctx.res.setHeader("Content-Disposition","attachment;filename=export-"+timestamp+".csv");
    ctx.body = csvStringifier.getHeaderString().concat(csvStringifier.stringifyRecords(products))
  }catch(err){
    //console.log(err);
    ctx.body = err.response?.data!=undefined?err.response.data:"Internal Server Error";
    ctx.status = err.response?.status!=undefined?err.response.status:500;
  }
  await next();
}

async function getAllProducts(ctx: Context, ids: [],page: number): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.Vtex.getSkuRangeByPage(page)
    .then(res => {
      ids = ids.concat(res.data);
      if(res.data.length<1000){
        resolve(ids)
      }else{
        return getAllProducts(ctx,ids,page+1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }
    })
    .catch(err => reject(err))
  });
}

async function getProductInfo(ctx: Context, sku: string, saleschannel: Object[]): Promise<any> {
  let promises = [];
  promises.push(new Promise<any>((resolve,reject) => {
      ctx.clients.Vtex.getSkuContext(sku)
      .then(res => resolve({skuId: sku, skuContext: res.data}))
      .catch(err => {
        //console.log(err)
        reject(err)
      })
    })
  );
  promises.push(new Promise<any>((resolve,reject) => {
      ctx.clients.Vtex.getPrice(sku, ctx)
      .then(res => resolve({skuId: sku, price: res.data}))
      .catch(err => {
        //console.log(err)
        resolve({skuId: sku, price: undefined})
      })
    })
  );
  saleschannel.forEach(s => {
    promises.push(new Promise<any>((resolve,reject) => {
        ctx.clients.Vtex.getMarketPrice(sku, s.Id)
        .then(res => resolve({skuId: sku, tradePolicy: s.Id, marketPrice: res.data}))
        .catch(err => {
          //console.log(err)
          reject(err)
        })
      })
    );
  })
  promises.push(new Promise<any>((resolve,reject) => {
      ctx.clients.Vtex.getStock(sku)
      .then(res => resolve({skuId: sku, stock: res.data}))
      .catch(err => {
        //console.log(err)
        reject(err)
      })
    })
  );
  promises.push(new Promise<any>((resolve,reject) => {
      ctx.clients.Vtex.getSkuComplement(sku)
      .then(res => resolve({skuId: sku, skuComplement: res.data==""?[]:res.data}))
      .catch(err => {
        //console.log(err)
        reject(err)
      })
    })
  );
  return Promise.all(promises);
}


function sortPromotions(promotions: []): []{
  let newPromotions = [];
  let product = promotions.filter(f => f.scope.products>0);
  let collection = promotions.filter(f => f.scope.collections>0);
  let catalog = promotions.filter(f => f.scope.allCatalog);
  let brand = promotions.filter(f => f.scope.brands>0);
  let category = promotions.filter(f => f.scope.categories>0);
  product.forEach(p => {
    newPromotions.push(p);
  })
  collection.forEach(c => {
    if(newPromotions.find(f => f.idCalculatorConfiguration==c.idCalculatorConfiguration)==undefined){
      newPromotions.push(c);
    }
  })
  catalog.forEach(c => {
    if(newPromotions.find(f => f.idCalculatorConfiguration==c.idCalculatorConfiguration)==undefined){
      newPromotions.push(c);
    }
  })
  brand.forEach(b => {
    if(newPromotions.find(f => f.idCalculatorConfiguration==b.idCalculatorConfiguration)==undefined){
      newPromotions.push(b);
    }
  })
  category.forEach(c => {
    if(newPromotions.find(f => f.idCalculatorConfiguration==c.idCalculatorConfiguration)==undefined){
      newPromotions.push(c);
    }
  })
  return newPromotions;
}

function formatDate(beginDate: string, endDate: string, name: string, locale: string): Object {
  return {
            beginDate: new Date(Date.parse(beginDate)).toLocaleString(locale),
            endDate: new Date(Date.parse(endDate)).toLocaleString(locale),
            name: name
          }
}

async function promoContainsSku(ctx: Context, promo: Object, skuId: string, skuContext: Object): Promise<Boolean>{
  return new Promise<Boolean>(async (resolve,reject) => {
    let found = false;
    if(promo.allCatalog){
      found = true;
    }
    try{
      if(promo.products.length>0 && !found){
        let productId = skuContext.ProductId;
        let product = promo.products.find(f => f.id==productId);
        if(product!=undefined){
          found = true;
        }
      }
      if(promo.brands.length>0 && !found){
        let brandId = skuContext.BrandId;
        let brand = promo.brands.find(f => f.id==brandId);
        if(brand!=undefined){
          found=true;
        }
      }
      if(promo.categories.length>0 && !found){
        let productCategories = [];
        Object.keys(skuContext.ProductCategories).forEach(c => {
          productCategories.push(c);
        })
        let promoCategories = [];
        promo.categories.forEach(c => {
          promoCategories.push(c.id);
        })
        let catFound = false;
        for(let i=0;i<productCategories.length && !catFound;i++){
          if(promoCategories.includes(productCategories[i])){
            catFound=true;
            found=true;
          }
        }
      }
      if(promo.collections.length>0 && !found){
        let promises = [];
        promo.collections.forEach(c => {
          promises.push(new Promise<any>((resolve,reject) => {
            ctx.clients.Vtex.getProductsByCollectionId(c.id)
            .then(res => {
              resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
          }));
        })
        let results = await Promise.all(promises);
        let collFound = false;
        for(let i=0;i<results.length && !collFound;i++){
          if(results[i].Data.find(f => f.SkuId == skuId)!=undefined){
            collFound = true;
            found = true;
          }
        }
      }
      resolve(found);
    }catch(err){
      reject(err);
    }
  });
}

async function getSkuPromo(ctx: Context, skuId: number, skuPromos: [], skuInfo: [], locale: string): Promise<any>{
  return new Promise<any>(async(resolve,reject) => {
    try{
      let found = false;
      let response = undefined;
      for(let i=0;i<skuPromos.length && !found;i++){
        if(await promoContainsSku(ctx, skuPromos[i], skuId, skuInfo[0].skuContext)){
          let price = skuInfo[1].price?.fixedPrices[0]?.value;
          let marketPrice = skuInfo[2].marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer?.Price;
          if(skuPromos[i].nominalDiscountValue>0){
            found = (price - skuPromos[i].nominalDiscountValue)==marketPrice;
          }else{
            if(skuPromos[i].percentualDiscountValue>0){
              let discountedPrice = (price * (100-skuPromos[i].percentualDiscountValue)/100)+"";
              let discInt = discountedPrice.split(".")[0];
              let discDec = discountedPrice.split(".")[1]?.substr(0,2);
              let mpInt = (marketPrice+"").split(".")[0];
              let mpDec = (marketPrice+"").split(".")[1]?.substr(0,2);
              found = discInt==mpInt && discDec==mpDec;
            }else{
              if(skuPromos[i].maximumUnitPriceDiscount>0){
                found = marketPrice == skuPromos[i].maximumUnitPriceDiscount
              }
            }
          }
          if(found){
            //console.log("promo selected: "+skuPromos[i].idCalculatorConfiguration);
            response = formatDate(skuPromos[i].beginDateUtc,skuPromos[i].endDateUtc, skuPromos[i].name, locale);
          }else{
            response = {name: "#error", beginDate: "#error", endDate: "#error"}
          }
        }
      }
      resolve(response);
    }catch(err){
      reject(err);
    }
  })
}

function getServiceColumns(saleschannels: [], productsInfo: []): []{
  let services = [];
  productsInfo.forEach(p => {
    let skuServices: [] = p[0].skuContext.Services;
    skuServices?.forEach(s => {
      if(services?.find(f => f.id==s.Name)==undefined){
        services.push({id: s.Name, title: s.Name+' ('+saleschannels[0].CurrencySymbol+')'})
      }
    })
  })
  return services;
}
