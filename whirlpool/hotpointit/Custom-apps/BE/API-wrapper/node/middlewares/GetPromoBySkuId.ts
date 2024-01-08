//@ts-nocheck

import { isValid } from "../utils/functions";
import { promoContainsSku, sortPromotions, FormatDateRange } from "../utils/PromotionsHandling";

export async function GetPromoBySkuId(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  const skuid = ctx.query.skuId?.toString();
  let seller = ctx.state.appSettings.isMarketplace ? ctx.state.appSettings.sellerAccount?.name : undefined;
  if (isValid(skuid)) {
    try {
      let skuContInvPromises = [];
      skuContInvPromises.push(
        new Promise<any>((resolve, reject) => {
          ctx.clients.vtexAPI.GetSKU(skuid)
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            })
        })
      );
      skuContInvPromises.push(
        new Promise<any>((resolve, reject) => {
          ctx.clients.vtexAPI.getStockBySellerName(skuid, 1, seller)
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            })
        })
      );
      let skuContInvRes = await Promise.all(skuContInvPromises);
      let skuContext = skuContInvRes[0];
      let sellable = skuContext.ProductSpecifications.find((f: { FieldName: string; }) => f.FieldName == "sellable")?.FieldValues[0];
      let discontinued = skuContext.ProductSpecifications.find((f: { FieldName: string; }) => f.FieldName == "isDiscontinued")?.FieldValues[0];
      let stock = skuContInvRes[1];
      console.log("stock: "+stock)
      if (sellable == "true" && discontinued == "false" && stock > 0) {
        let arrayPromises = [];
        arrayPromises.push(
          new Promise<any>((resolve, reject) => {
            ctx.clients.vtexAPI.getFixedPrice(ctx, skuid, 1)
              .then(res => {
                resolve(res.data[0].value)
              })
              .catch(err => {
                reject(err);
              })
          })
        );
        arrayPromises.push(
          new Promise<any>((resolve, reject) => {
            ctx.clients.vtexAPI.getMarketPrice(skuid)
              .then(res => {
                resolve( isValid(seller) ? res.data[0].items[0]?.sellers?.find(sel => sel.sellerId==seller)?.commertialOffer?.Price : res.data[0].items[0]?.sellers[0]?.commertialOffer?.Price)
              })
              .catch(err => {
                reject(err);
              })
          })
        );
        arrayPromises.push(
          new Promise<any>((resolve, reject) => {
            ctx.clients.vtexAPI.getAllPromotions()
              .then(res => {
                resolve(res.data.items.filter((f: { isActive: any; isArchived: any; type: string; status: string; utmSource: string; utmCampain: string; utmiCampaign: string; }) => f.isActive && !f.isArchived && f.type == "regular" && f.status == "active" &&
                  f.utmSource == "" && f.utmCampain == "" && f.utmiCampaign == ""));
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
        let promises: any[] = [];
        promotions.forEach((p: { idCalculatorConfiguration: string; scope: { allCatalog: any; }; }) => {
          promises.push(new Promise<any>((resolve, reject) => {
            ctx.clients.vtexAPI.getPromotionById(p.idCalculatorConfiguration)
              .then(res => {
                p.scope.allCatalog ? res.data["allCatalog"] = true : res.data["allCatalog"] = false;
                resolve(res.data);
              })
              .catch(err => {
                reject(err);
              })
          }));
        })
        let results = await Promise.all(promises);
        results = results.filter(f => f.skusGift.gifts.length == 0);
        let found = false;
        let response: any = "There are no promotions for the specified sku."
        //console.log("num of active regular promotions: "+results.length);
        for (let i = 0; i < results.length && !found; i++) {
          if (await promoContainsSku(ctx, results[i], skuContext)) {
            if (results[i].nominalDiscountValue > 0) {
              found = (price - results[i].nominalDiscountValue) == marketPrice;
            } else {
              if (results[i].percentualDiscountValue > 0) {
                let discountedPrice = (price * (100 - results[i].percentualDiscountValue) / 100) + "";
                let discInt = discountedPrice.split(".")[0];
                let discDec = discountedPrice.split(".")[1].substr(0, 2);;
                let mpInt = (marketPrice + "").split(".")[0];
                let mpDec = (marketPrice + "").split(".")[1]?.substr(0, 2);
                found = discInt == mpInt && discDec == mpDec;
              } else {
                if (results[i].maximumUnitPriceDiscount > 0) {
                  found = marketPrice == results[i].maximumUnitPriceDiscount
                } else found = results[i].absoluteShippingDiscountValue > 0
              }
            }
            if (found) {
              //console.log("promo selected: "+results[i].idCalculatorConfiguration);
              response = FormatDateRange(results[i].beginDateUtc, results[i].endDateUtc, results[i].name);
            }
          }
        }
        if (!found) {
          ctx.status = 404;
        } else {
          ctx.status = 200;
        }
        ctx.body = response;
      } else {
        ctx.status = 404;
        ctx.body = "There are no promotions for the specified sku.";
      }
    } catch (err) {
      //console.log(err);
      ctx.status = err.response ? err.response.status : 500;
      ctx.body = err.response ? err.response.data : "Internal Server Error";
    }
  } else {
    ctx.status = 400;
    ctx.body = "Bad request";
  }
  await next();
}
