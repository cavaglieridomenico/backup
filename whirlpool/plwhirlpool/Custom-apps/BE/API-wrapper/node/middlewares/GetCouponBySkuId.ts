//@ts-nocheck

import { NotFoundError } from "@vtex/api";
import { resolve } from "dns";
import { reject } from "ramda";

async function promoContainsSku(ctx: Context, promo: Object, skuId: string, price: number, skuContext: Object): Promise<Object>{
  return new Promise<Boolean>(async (resolve,reject) => {
    try{
      let found = false;
      if(promo.allCatalog){
        if(promo.itemMinPrice==0 && promo.itemMaxPrice==0){
          found = true;
        }else{
          if(price>=promo.itemMinPrice && price<=promo.itemMaxPrice){
            found = true;
          }
        }
      }
      if(promo.products.length>0 && !found){
        let productId = skuContext.ProductId;
        let product = promo.products.find(f => f.id==productId);
        if(product!=undefined){
          if(promo.itemMinPrice==0 && promo.itemMaxPrice==0){
            found = true;
          }else{
            if(price>=promo.itemMinPrice && price<=promo.itemMaxPrice){
              found = true;
            }
          }
        }
      }
      if(promo.brands.length>0 && !found){
        let brandId = skuContext.BrandId;
        let brand = promo.brands.find(f => f.id==brandId);
        if(brand!=undefined){
          if(promo.itemMinPrice==0 && promo.itemMaxPrice==0){
            found = true;
          }else{
            if(price>=promo.itemMinPrice && price<=promo.itemMaxPrice){
              found = true;
            }
          }
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
            catFound = true;
            if(promo.itemMinPrice==0 && promo.itemMaxPrice==0){
              found = true;
            }else{
              if(price>=promo.itemMinPrice && price<=promo.itemMaxPrice){
                found = true;
              }
            }
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
        for(let i=0;i<results.length && !found;i++){
          if(results[i].Data.find(f => f.SkuId == skuId)!=undefined){
            if(promo.itemMinPrice==0 && promo.itemMaxPrice==0){
              found = true;
            }else{
              if(price>=promo.itemMinPrice && price<=promo.itemMaxPrice){
                found = true;
              }
            }
          }
        }
      }
      promo["found"]=found;
      resolve(promo);
    }catch(err){
      reject(err);
    }
  });
}

async function getAllUtm(ctx: Context, codes: [], page: number): Promise<any>{
  return new Promise<any>(async (resolve,reject) => {
    ctx.clients.masterdata.searchDocuments({dataEntity: "UT", fields: ["utmCode"],pagination:{page: page, pageSize: 500}})
    .then(res => {
      codes = codes.concat(res)
      if(res.length<500){
        resolve(codes);
      }else{
        page++;
        return getAllUtm(ctx,codes,page).then(res0 => resolve(res0)).catch(err0 => reject(err0));
      }
    })
    .catch(err => {
      reject(err);
    });
  });
}

export async function GetCouponBySkuId(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  if(ctx.query.skuId!=undefined && ctx.query.skuId!=null && ctx.query.skuId!=""){
    if(!isNaN(ctx.query.skuId)){
      try{
        let skuContInvUtmPromises = [];
        skuContInvUtmPromises.push(
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
        skuContInvUtmPromises.push(
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
        skuContInvUtmPromises.push(
          new Promise<any>((resolve,reject) => {
            getAllUtm(ctx,[],1)
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            })
          })
        );
        let skuContInvUtmRes = await Promise.all(skuContInvUtmPromises);
        let skuContext = skuContInvUtmRes[0];
        let sellable = skuContext.ProductSpecifications.find(f => f.FieldName=="sellable")?.FieldValues[0];
        let discontinued = skuContext.ProductSpecifications.find(f => f.FieldName=="isDiscontinued")?.FieldValues[0];
        let stock = 0;
        skuContInvUtmRes[1].balance.forEach(w => {
          stock += (w.totalQuantity - w.reservedQuantity);
        });
        let utmCodesToExclude = skuContInvUtmRes[2];
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
              ctx.clients.vtexAPI.getAllPromotions()
              .then(res => {
                resolve(res.data.items.filter(f => f.isActive && !f.isArchived && f.type=="regular" && f.status=="active" &&
                (f.utmSource!="" || f.utmCampain!="") && (utmCodesToExclude.find(u => u?.utmCode==f.utmSource)==undefined) && (utmCodesToExclude.find(u => u?.utmCode==f.utmCampain)==undefined)));
              })
              .catch(err => {
                reject(err);
              })
            })
          );
          let promiseResults = await Promise.all(arrayPromises);
          let price = promiseResults[0];
          let promotions = promiseResults[1];
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
          let found = false;
          let response = "There are no coupons for the specified sku.";
          let promoToAnalyzePromises = [];
          for(let i=0;i<results.length;i++){
            promoToAnalyzePromises.push(new Promise<Object>((resolve,reject) => {
              promoContainsSku(ctx, results[i],ctx.query.skuId,price,skuContext)
              .then(res => {
                resolve(res);
              })
              .catch(err => {
                reject(err);
              })
            }));
          }
          let promoToAnalyzeResponses = await Promise.all(promoToAnalyzePromises);
          let bestDiscount = 0;
          let bestPromo = undefined;
          promoToAnalyzeResponses.filter(f => f.found)?.forEach(p => {
            if(p.nominalDiscountValue>0){
              let discountedPrice = p.nominalDiscountValue;
              if(discountedPrice>bestDiscount){
                bestDiscount = discountedPrice;
                bestPromo = p.idCalculatorConfiguration;
              }
            }else{
              if(p.percentualDiscountValue>0){
                let discountedPrice = (price*p.percentualDiscountValue/100);
                if(discountedPrice>bestDiscount){
                  bestDiscount = discountedPrice;
                  bestPromo = p.idCalculatorConfiguration;
                }
              }
            }
          });
          let promoToUse = promoToAnalyzeResponses.find(f => f.idCalculatorConfiguration==bestPromo);
          if(bestPromo!=undefined){
            let utmSource = promoToUse.utmSource;
            let utmCampaign = promoToUse.utmCampaign;
            let coupon = (await ctx.clients.vtexAPI.getCoupons()).data.find(f => f.utmSource==utmSource && f.utmCampaign==utmCampaign)?.couponCode;
            if(coupon!=undefined){
              found = true;
              response = {code: coupon};
            }
          }
          if(found){
            ctx.status = 200;
          }
          else{
            ctx.status = 404;
          }
          ctx.body = response;
        }else{
          ctx.status = 404;
          ctx.body = "There are no coupons for the specified sku.";
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
