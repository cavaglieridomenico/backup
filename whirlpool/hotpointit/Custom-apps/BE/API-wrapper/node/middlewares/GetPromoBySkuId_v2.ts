//@ts-nocheck

import { UserInputError } from "@vtex/api";
import { isValid } from "../utils/functions";
import { FormatDateRange, promoContainsSku, sortPromotions } from "../utils/PromotionsHandling";
import { CustomLogger } from "../utils/Logger";
interface SkuData { sku: any, price: any, stock: any }

export async function GetPromoBySkuIdV2(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  const skuId: string = ctx.query.skuId.toString()
  await GetPromoInfo(ctx, skuId)
  await next()
}

async function GetPromoInfo(ctx: any, skuId: any): Promise<any> {
  ctx.vtex.logger = new CustomLogger(ctx);
  if (!skuId) {
    throw new UserInputError('invalid sku ID')
  }

  ctx.body = {
    type: "none",
    dateRange: {}
  }

  try {
    const [sku, stock, price] = await Promise.all([
      ctx.clients.vtexAPI.GetSKU(skuId),
      ctx.clients.vtexAPI.getStock(skuId).then(res => res.data),
      ctx.clients.vtexAPI.getPrices(ctx, skuId).then(res => res.data)
    ])

    let isDiscontinued = sku.ProductSpecifications.find((f: { FieldName: string; }) => f.FieldName == "isDiscontinued")?.FieldValues[0] == "true";

    if (!isDiscontinued) {
      let skuData = { sku, stock, price }
      const promo = await GetPromo(ctx, skuData, skuId)

      if (promo) {
        ctx.body = {
          type: "promo",
          dateRange: promo
        }
        ctx.vtex.logger.info("Promo Exists -- " + promo);
        return {
          type: "promo",
          dateRange: promo
        }
      } else {
        const cutPrice = GetCutPriceDates(skuData)
        if (cutPrice) {
          ctx.body = {
            type: "cutPrice",
            dateRange: cutPrice
          }
          ctx.vtex.logger.info("CutPrice Exists -- " + cutPrice);
          return {
            type: "cutPrice",
            dateRange: cutPrice
          }
        }
      }
    } else {
      ctx.vtex.logger.error("isSellable should be TRUE, but it is actually " + isSellable + "\nisDiscontinued should be FALSE, but it actually is " + isDiscontinued)
    }
    ctx.status = 200
  } catch (err) {
    ctx.vtex.logger.error(err);
    ctx.status = 500
    ctx.body = "unexpected error"
  }
}




const GetPromo = async (ctx: Context, skuData: SkuData, skuId: any) => {
  try {
    const appSettings = await ctx.clients.apps.getAppSettings(ctx.vtex.account + ".api-wrapper")
    const { timezone } = appSettings
    let skuContext = skuData.sku
    let arrayPromises = [];
    arrayPromises.push(
      new Promise<any>((resolve, reject) => {
        ctx.clients.vtexAPI.getMarketPrice(skuId)
          .then(res => {
            resolve(res.data[0].items[0]?.sellers[0]?.commertialOffer?.Price)
          })
          .catch(err => {
            ctx.vtex.logger.error("getMarketPrice() -- " + err)
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
            ctx.vtex.logger.error("getAllPromotions() -- " + err)
            reject(err);
          })
      })
    );
    let promiseResults = await Promise.all(arrayPromises);
    let price = skuData.price?.fixedPrices?.find((p: { tradePolicyId: string; }) => p.tradePolicyId == "1")?.value
    let marketPrice = promiseResults[0];
    ctx.vtex.logger.info("Sku Price = " + price + "\nSku Market Price = " + marketPrice)
    let promotions = promiseResults[1].filter((p: { isActive: any; }) => p.isActive);
    promotions = sortPromotions(promotions);
    ctx.vtex.logger.info("Sorted promotions: " + JSON.stringify(promotions))
    let promises: any[] = [];
    promotions.forEach((p: { idCalculatorConfiguration: string; scope: { allCatalog: any; }; }) => {
      promises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.vtexAPI.getPromotionById(p.idCalculatorConfiguration)
          .then(res => {
            p.scope.allCatalog ? res.data["allCatalog"] = true : res.data["allCatalog"] = false;
            resolve(res.data);
          })
          .catch(err => {
            ctx.vtex.logger.error(err)
            reject(err);
          })
      }));
    })
    let results = await Promise.all(promises);
    ctx.vtex.logger.info("ALLRESULT - " + JSON.stringify(results))
    results = results.filter(f => f.skusGift.gifts.length == 0).filter(n => n.generalValues?.countdown?.toLowerCase() == "yes")

    let found = false;
    for (let i = 0; i < results.length && !found; i++) {
      if (await promoContainsSku(ctx, results[i], skuContext)) {
        if (results[i].nominalDiscountValue > 0) {
          ctx.vtex.logger.info("RESULT - " + JSON.stringify(results[i]))
          price == marketPrice ? price += results[i].nominalDiscountValue : price = price
          found = (price - results[i].nominalDiscountValue) == marketPrice;
        } else {
          if (results[i].percentualDiscountValue > 0) {
            let discountedPrice = (price * (100 - results[i].percentualDiscountValue) / 100)
            found = discountedPrice.toFixed(2) == marketPrice.toFixed(2);
          } else {
            if (results[i].maximumUnitPriceDiscount > 0) {
              found = marketPrice == results[i].maximumUnitPriceDiscount
            } else found = results[i].absoluteShippingDiscountValue > 0
          }
        }
        return found ? FormatDateRange(results[i].beginDateUtc, results[i].endDateUtc, results[i].name, timezone) : null
      }
    }
  } catch (err) {
    ctx.vtex.logger.err(err)
  }
  return null
}


const GetCutPriceDates = (skuData: SkuData) => {
  const fixedPrice = skuData.price?.fixedPrices?.find((p: { tradePolicyId: string; }) => p.tradePolicyId == "1")
  if (skuData.price.listPrice > fixedPrice.value && fixedPrice.dateRange) {
    const now = Date.now()
    const from = new Date(fixedPrice.dateRange.from).getTime()
    const to = new Date(fixedPrice.dateRange.to).getTime()
    if (now > from && now < to)
      return FormatDateRange(fixedPrice.dateRange.from, fixedPrice.dateRange.to)
  }
  return null
}


export const getPromoInfoResover = async (
  _: any,
  { skuId }: { skuId: any },
  ctx: any
) => {
  let getpromo = await GetPromoInfo(ctx, skuId)
  ctx.vtex.logger.info(JSON.stringify(getpromo));
  return getpromo


}


