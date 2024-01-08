//@ts-nocheck
export const GetCouponList = async (ctx: Context, skuid: string, max: number) => {
  let skuContInvUtmPromises = [
    new Promise<any>((resolve, reject) => {
      ctx.clients.SearchGraphQL.SkuDetails(skuid)
        .then(res => {
          if (res.error) {
            reject(res.error)
          } else {
            resolve(res.data.product);
          }

        })
        .catch(err => {
          reject(err);
        })
    }),
    new Promise<any>((resolve, reject) => {
      ctx.clients.vtexAPI.getCoupons()
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        })
    }),
    new Promise<any>((resolve, reject) => {
      ctx.clients.vtexAPI.getAllPromotions()
        .then(res => {
          resolve(res.data.items.filter((f: any) => f.isActive && !f.isArchived && f.status == "active" && (f.utmSource != "" || f.utmCampain != "" || f.utmCampaign != "")));
        })
        .catch(err => {
          reject(err);
        })
    })
  ];

  const [skuContext, coupons, promotions] = await Promise.all(skuContInvUtmPromises);

  let sellable = skuContext.properties.find((f: { name: string; }) => f.name == "sellableA1")?.values[0];
  let discontinued = skuContext.properties.find((f: { name: string; }) => f.name == "isDiscontinued")?.values[0];
  let stock = skuContext.items[0].sellers[0].commertialOffer.AvailableQuantity
  let price = skuContext.items[0].sellers[0].commertialOffer.ListPrice
  if (sellable == "true" && discontinued == "false" && stock > 0) {
    let promises: any[] = [];
    promotions.filter(IsPromoShowablePDP).forEach((p: any) => {
      promises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.vtexAPI.getPromotionById(p.idCalculatorConfiguration)
          .then(res => {
            p.type == 'regular' && p.scope.allCatalog ? res.data["allCatalog"] = true : res.data["allCatalog"] = false;
            res.data.collections = res.data.collections?.concat(res.data.collections1BuyTogether)?.concat(res.data.collections2BuyTogether)
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          })
      }));
    })
    let results = await Promise.all(promises);
    let promoToAnalyzePromises = results.map(promo => new Promise<any>((resolve, reject) => {
      promoContainsSku(ctx, promo, skuid, price, skuContext)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    }));

    let promoToAnalyzeResponses = await Promise.all(promoToAnalyzePromises);

    let couponList = promoToAnalyzeResponses.filter(f => f.found).sort((p1: any, p2: any) => {
      let discount1 = GetDiscountValue(price, p1)
      let discount2 = GetDiscountValue(price, p2)

      return discount1 - discount2
    }).map(promo => {
      let code = coupons.find((coupon: any) => (promo.utmSource && promo.utmSource.trim() != "" && promo.utmSource.split(',').includes(coupon.utmSource)) ||
        (promo.utmCampain && promo.utmCampain.trim() != "" && promo.utmCampain.split(',').includes(coupon.utmCampaign)) ||
        (promo.utmCampaign && promo.utmCampaign.trim() != "" && promo.utmCampaign.split(',').includes(coupon.utmCampaign)))?.couponCode

      return code ? {
        code: code,
        description: promo.description || ""
      } : undefined
    }).filter(c => c != undefined)
    return couponList.slice(0, max)
  } else {
    return []
  }
}


const GetDiscountValue = (price: number, promo: any) => {
  if (promo.nominalDiscountValue > 0) {
    return price - promo.nominalDiscountValue;
  } else if (promo.percentualDiscountValue > 0) {
    return (price - (price * promo.percentualDiscountValue / 100))
  }
  return 0
}


async function promoContainsSku(ctx: Context, promo: any, skuId: string, price: number, skuContext: any): Promise<Object> {
  return new Promise<Boolean>(async (resolve, reject) => {
    try {
      let found = false;
      if (promo.allCatalog) {
        if (promo.itemMinPrice == 0 && promo.itemMaxPrice == 0) {
          found = true;
        } else {
          if (price >= promo.itemMinPrice && price <= promo.itemMaxPrice) {
            found = true;
          }
        }
      }
      if (promo.products.length > 0 && !found) {
        let productId = skuContext.productId;
        let product = promo.products.find((f: { id: any; }) => f.id == productId);
        if ((product != undefined && promo.productsAreInclusive) || (product == undefined && !promo.productsAreInclusive)) {
          if (promo.itemMinPrice == 0 && promo.itemMaxPrice == 0) {
            found = true;
          } else {
            if (price >= promo.itemMinPrice && price <= promo.itemMaxPrice) {
              found = true;
            }
          }
        }
      }
      if (promo.brands.length > 0 && !found) {
        let brandId = skuContext.brandId;
        let brand = promo.brands.find((f: { id: any; }) => f.id == brandId);
        if ((brand != undefined && promo.brandsAreInclusive) || (brand == undefined && !promo.brandsAreInclusive)) {
          if (promo.itemMinPrice == 0 && promo.itemMaxPrice == 0) {
            found = true;
          } else {
            if (price >= promo.itemMinPrice && price <= promo.itemMaxPrice) {
              found = true;
            }
          }
        }
      }
      if (promo.categories.length > 0 && !found) {
        let productCategories: string[] = skuContext.categoryTree.map((cat: any) => cat.id.toString());
        let promoCategories: string[] = promo.categories.map((c: any) => c.id.toString())
        let categoryIncluded = productCategories.some(productCat => promoCategories.includes(productCat))
        if ((categoryIncluded && promo.categoriesAreInclusive) || (!categoryIncluded && !promo.categoriesAreInclusive)) {
          if (promo.itemMinPrice == 0 && promo.itemMaxPrice == 0) {
            found = true;
          } else {
            if (price >= promo.itemMinPrice && price <= promo.itemMaxPrice) {
              found = true;
            }
          }
        }
      }
      if (promo.collections.length > 0 && !found) {
        let promises: any[] = [];
        let products: any[] = [];
        promo.collections.forEach((c: { id: string; }) => {
          promises.push(new Promise<any>((resolve, reject) => {
            ctx.clients.vtexAPI.getProductsByCollectionId(c.id, 1)
              .then(async res => {
                products = products.concat(res.data.Data)
                if (res.data.TotalPage <= 1) {
                  resolve(products)
                } else {
                  for (let i = 2; i <= res.data.TotalPage; i++) {
                    await ctx.clients.vtexAPI.getProductsByCollectionId(c.id, i).then(response => { products = products.concat(response.data.Data) })
                  }
                  resolve(products)
                }
              })
              .catch(err => {
                reject(err)
              })
          }));
        })
        let results = await Promise.all(promises);
        for (let i = 0; i < results.length && !found; i++) {
          if (results[i].find((f: { SkuId: string; }) => f.SkuId == skuId) != undefined) {
            if (promo.itemMinPrice == 0 && promo.itemMaxPrice == 0) {
              found = true;
            } else {
              if (price >= promo.itemMinPrice && price <= promo.itemMaxPrice) {
                found = true;
              }
            }
          }
        }
      }
      promo["found"] = found;
      resolve(promo);
    } catch (err) {
      reject(err);
    }
  });
}

const IsPromoShowablePDP = (promo: any) => promo.isActive &&
  promo.generalValues?.pdp?.toLowerCase() == "y" &&
  (
    (promo.utmSource && promo.utmSource.trim() != "") ||
    (promo.utmCampaign && promo.utmCampaign.trim() != "") ||
    (promo.utmCampain && promo.utmCampain.trim() != "")
  )
