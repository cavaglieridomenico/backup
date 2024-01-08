// priority followed by Vtex: product > collection > catalog > brand > category
// assumption: there cannot exist two identical promotions applied to the same scope (in case of identical promotions, it's not clear the criteria by which
// Vtex select the promotion)
//@ts-nocheck
export const sortPromotions = (promotions: any[]): any[] => {
  let newPromotions: any[] = [];
  let product = promotions.filter(f => f.scope.products > 0);
  let collection = promotions.filter(f => f.scope.collections > 0);
  let catalog = promotions.filter(f => f.scope.allCatalog);
  let brand = promotions.filter(f => f.scope.brands > 0);
  let category = promotions.filter(f => f.scope.categories > 0);
  product.forEach(p => {
    newPromotions.push(p);
  })
  collection.forEach(c => {
    if (newPromotions.find(f => f.idCalculatorConfiguration == c.idCalculatorConfiguration) == undefined) {
      newPromotions.push(c);
    }
  })
  catalog.forEach(c => {
    if (newPromotions.find(f => f.idCalculatorConfiguration == c.idCalculatorConfiguration) == undefined) {
      newPromotions.push(c);
    }
  })
  brand.forEach(b => {
    if (newPromotions.find(f => f.idCalculatorConfiguration == b.idCalculatorConfiguration) == undefined) {
      newPromotions.push(b);
    }
  })
  category.forEach(c => {
    if (newPromotions.find(f => f.idCalculatorConfiguration == c.idCalculatorConfiguration) == undefined) {
      newPromotions.push(c);
    }
  })
  return newPromotions;
}


export const promoContainsSku = async (ctx: Context, promo: any, skuContext: any): Promise<Boolean> => {
  return new Promise<Boolean>(async (resolve, reject) => {
    let found = false;
    if (promo.allCatalog) {
      found = true;
    }
    try {
      if (promo.products.length > 0 && !found) {
        let productId = skuContext.ProductId;
        let product = promo.products.find((f: { id: { toString: () => any; }; }) => f.id.toString() == productId.toString());
        if (product != undefined) {
          found = true;
        }
      }
      if (promo.brands.length > 0 && !found) {
        let brandId = skuContext.BrandId;
        let brand = promo.brands.find((f: { id: { toString: () => any; }; }) => f.id.toString() == brandId.toString());
        if (brand != undefined) {
          found = true;
        }
      }
      if (promo.categories.length > 0 && !found) {
        let productCategories: any[] = [];
        Object.keys(skuContext.ProductCategories).forEach(c => {
          productCategories.push(c);
        })
        let promoCategories: any[] = [];
        promo.categories.forEach((c: { id: any; }) => {
          promoCategories.push(c.id);
        })
        let catFound = false;
        for (let i = 0; i < productCategories.length && !catFound; i++) {
          if (promoCategories.includes(productCategories[i])) {
            catFound = true;
            found = true;
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
        let collFound = false;
        for (let i = 0; i < results.length && !collFound; i++) {
          if (results[i].find((f: { SkuId: { toString: () => any; }; }) => f.SkuId.toString() == skuContext.Id.toString()) != undefined) {
            collFound = true;
            found = true;
          }
        }
      }
      resolve(found);
    } catch (err) {
      reject(err);
    }
  });
}


interface DateRange {
  beginDate: string
  endDate: string
  name?: string
}

export const FormatDateRange = (beginDate: string, endDate: string, name?: string): DateRange => {
  let dateB = new Date(beginDate);
  let dateE = new Date(endDate);

  const [hours, minutes] = dateE.toLocaleTimeString('it-IT', {
    timeZone: 'europe/rome',
    hour: 'numeric',
    minute: 'numeric'
  }).split(':')
  if (hours == '00' && minutes == '00') {
    dateE.setDate(dateE.getDate() - 1);
  }
  return {
    beginDate: dateB.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'europe/rome'
    }),
    endDate: dateE.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'europe/rome'
    }),
    name: name
  }
}
