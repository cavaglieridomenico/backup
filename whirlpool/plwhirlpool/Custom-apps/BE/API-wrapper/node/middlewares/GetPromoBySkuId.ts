//@ts-nocheck

import { NotFoundError } from "@vtex/api";
import { resolve } from "dns";
import { reject } from "ramda";

// priority followed by Vtex: product > collection > catalog > brand > category
// assumption: there cannot exist two identical promotions applied to the same scope (in case of identical promotions, it's not clear the criteria by which
// Vtex select the promotion)
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

function formatDate(beginDate: string, endDate: string, name: string): Object {
  let dateB = new Date(Date.parse(beginDate)+2*60*60*1000);
  let dateE = new Date(Date.parse(endDate)+2*60*60*1000);
  if(dateE.getHours()==0 && dateE.getMinutes()==0){
    dateE.setDate(dateE.getDate()-1);
  }
  let dayB = dateB.getDate() < 10 ? '0' + dateB.getDate() : dateB.getDate();
  let monthB = (dateB.getMonth() + 1) < 10 ? '0' + (dateB.getMonth() + 1) : (dateB.getMonth() + 1);
  let yearB = dateB.getFullYear();
  let dayE = dateE.getDate() < 10 ? '0' + dateE.getDate() : dateE.getDate();
  let monthE = (dateE.getMonth() + 1) < 10 ? '0' + (dateE.getMonth() + 1) : (dateE.getMonth() + 1);
  let yearE = dateE.getFullYear();
  return {
            beginDate: dayB+"/"+monthB+"/"+yearB,
            endDate: dayE+"/"+monthE+"/"+yearE,
            name: name
          }
}

async function promoContainsSku(ctx: Context, promo: Object, skuId: string): Promise<Boolean>{
  return new Promise<Boolean>(async (resolve,reject) => {
    let found = false;
    if(promo.allCatalog){
      found = true;
    }
    try{
      let skuContext = await ctx.clients.vtexAPI.GetSKU(skuId);
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
            ctx.clients.vtexAPI.getProductsByCollectionId(c.id)
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

export async function GetPromoBySkuId(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  if(ctx.query.skuId!=undefined && ctx.query.skuId!=null && ctx.query.skuId!=""){
    if(!isNaN(ctx.query.skuId)){
      try{
        let skuContInvPromises = [];
        skuContInvPromises.push(
          new Promise<any>((resolve,reject) => {
            ctx.clients.vtexAPI.GetSKU(ctx.query.skuId)
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            })
          })
        );
        skuContInvPromises.push(
          new Promise<any>((resolve,reject) => {
            ctx.clients.vtexAPI.getStock(ctx.query.skuId)
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              reject(err);
            })
          })
        );
        let skuContInvRes = await Promise.all(skuContInvPromises);
        let skuContext = skuContInvRes[0];
        let sellable = skuContext.ProductSpecifications.find(f => f.FieldName=="sellable")?.FieldValues[0];
        let discontinued = skuContext.ProductSpecifications.find(f => f.FieldName=="isDiscontinued")?.FieldValues[0];
        let stock = 0;
        skuContInvRes[1].balance.forEach(w => {
          stock += (w.totalQuantity - w.reservedQuantity);
        });
        if(sellable=="true" && discontinued=="false" && stock>0){
          let arrayPromises = [];
          arrayPromises.push(
            new Promise<any>((resolve,reject) => {
              ctx.clients.vtexAPI.getPrice(ctx,ctx.query.skuId,1)
              .then(res => {
                resolve(res.data[0].value)
              })
              .catch(err => {
                reject(err);
              })
            })
          );
          arrayPromises.push(
            new Promise<any>((resolve,reject) => {
              ctx.clients.vtexAPI.getMarketPrice(ctx.query.skuId,1)
              .then(res => {
                resolve(res.data[0].items[0]?.sellers[0]?.commertialOffer?.Price)
              })
              .catch(err => {
                reject(err);
              })
            })
          );
          arrayPromises.push(
            new Promise<any>((resolve,reject) => {
              ctx.clients.vtexAPI.getAllPromotions()
              .then(res => {
                resolve(res.data.items.filter(f => f.isActive && !f.isArchived && f.type=="regular" && f.status=="active" &&
                f.utmSource=="" && f.utmCampain=="" && f.utmiCampaign==""));
              })
              .catch(err => {
                reject(err);
              })
            })
          );
          let promiseResults = await Promise.all(arrayPromises);
          let price = promiseResults[0];
          let marketPrice = promiseResults[1];
          let promotions = promiseResults[2];
          promotions = sortPromotions(promotions);
          let promises = [];
          promotions.forEach(p => {
            promises.push(new Promise<any>((resolve,reject) => {
              ctx.clients.vtexAPI.getPromotionById(p.idCalculatorConfiguration)
              .then(res => {
                p.scope.allCatalog?res.data["allCatalog"]=true:res.data["allCatalog"]=false;
                resolve(res.data);
              })
              .catch(err => {
                reject(err);
              })
            }));
          })
          let results = await Promise.all(promises);
          results = results.filter(f => f.skusGift.gifts.length==0);
          let found = false;
          let response = "There are no promotions for the specified sku."
          //console.log("num of active regular promotions: "+results.length);
          for(let i=0;i<results.length && !found;i++){
            if(await promoContainsSku(ctx, results[i],ctx.query.skuId)){
              if(results[i].nominalDiscountValue>0){
                found = (price - results[i].nominalDiscountValue)==marketPrice;
              }else{
                if(results[i].percentualDiscountValue>0){
                  let discountedPrice = (price * (100-results[i].percentualDiscountValue)/100)+"";
                  let discInt = discountedPrice.split(".")[0];
                  let discDec = discountedPrice.split(".")[1].substr(0,2);;
                  let mpInt = (marketPrice+"").split(".")[0];
                  let mpDec = (marketPrice+"").split(".")[1]?.substr(0,2);
                  found = discInt==mpInt && discDec==mpDec;
                }else{
                  if(results[i].maximumUnitPriceDiscount>0){
                    found = marketPrice == results[i].maximumUnitPriceDiscount
                  }
                }
              }
              if(found){
                //console.log("promo selected: "+results[i].idCalculatorConfiguration);
                response = formatDate(results[i].beginDateUtc,results[i].endDateUtc, results[i].name);
              }
            }
          }
          if(!found){
            ctx.status = 404;
          }else{
            ctx.status = 200;
          }
          ctx.body = response;
        }else{
          ctx.status = 404;
          ctx.body = "There are no promotions for the specified sku.";
        }
      }catch(err){
        //console.log(err);
        ctx.status = err.response?err.response.status:500;
        ctx.body = err.response?err.response.data:"Internal Server Error";
      }
    }else{
      ctx.status = 400;
      ctx.body = "Bad request";
    }
  }else{
    ctx.status = 400;
    ctx.body = "Bad request";
  }
  await next();
}
