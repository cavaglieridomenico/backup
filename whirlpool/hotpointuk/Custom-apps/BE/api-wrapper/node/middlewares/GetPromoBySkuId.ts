
import { UserInputError } from "@vtex/api";
import { FormatDateRange, promoContainsSku, sortPromotions } from "../utils/PromotionsHandling";
import { CustomLogger } from "../utils/customLogger";

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
      ctx.clients.vtexAPI.getStock(skuId).then((res: any) => res),
      ctx.clients.vtexAPI.getPrices(ctx, skuId).then((res: any) => res.data)
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
        ctx.vtex.logger.info(promo)
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
          ctx.vtex.logger.info(cutPrice)
          return {
            type: "cutPrice",
            dateRange: cutPrice
          }
        }
      }
    }
    ctx.status = 200
  } catch (err) {
    ctx.vtex.logger.error(err)
    ctx.status = 500
    ctx.body = "unexpected error"
  }
}


const GetPromo = async (ctx: Context, skuData: SkuData, skuId: any) => {
  try {

    let appSettings = ctx.state.appSettings
    !appSettings ? appSettings = await ctx.clients.apps.getAppSettings(ctx.vtex.account + ".api-wrapper") : appSettings
    const { UTC } = appSettings.retrievePromoParam
    let skuContext = skuData.sku

    let arrayPromises = [];
    arrayPromises.push(
      new Promise<any>((resolve, reject) => {
        ctx.clients.vtexAPI.getMarketPrice(skuId, 1)
          .then(res => {
            resolve(res.data[0].items[0]?.sellers[0]?.commertialOffer?.Price)
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
    let price = skuData.price?.fixedPrices?.find((p: { tradePolicyId: string; }) => p.tradePolicyId == "1")?.value
    let marketPrice = promiseResults[0];
    let promotions = promiseResults[1].filter((p: { isActive: any; }) => p.isActive);
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
    results = results.filter(f => f.skusGift.gifts.length == 0).filter(n => n.generalValues?.countdown?.toLowerCase() == "yes")
    let found = false;
    for (let i = 0; i < results.length && !found; i++) {
      if (await promoContainsSku(ctx, results[i], skuContext)) {
        if (results[i].nominalDiscountValue > 0) {
          if (price == marketPrice)
            price += results[i].nominalDiscountValue
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
        return found ? FormatDateRange(results[i].beginDateUtc, results[i].endDateUtc, results[i].name, UTC) : null
      }
    }
  } catch (err) {
    ctx.vtex.logger.error(err)
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
) => await GetPromoInfo(ctx, skuId)
