//@ts-nocheck
import { resolve } from "dns";
import { reject } from "ramda";
import fetch from 'node-fetch'
import { prettyIdToUrl } from "./energyLabel";
import { prettyIdToLabel } from "./energyLabel";
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;


export async function exportCatalog(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  let coloumnHeader = [
    { id: '12nc', title: '12nc' },
    { id: 'Commercial code', title: 'Commercial code' },
    { id: 'ProductUrl', title: 'Product Url' },
    { id: 'Category', title: 'Category' },
    { id: 'Brand', title: 'Brand' },
    { id: 'Description', title: 'Description' },
    { id: 'Sale price', title: 'Sale price' },
    { id: 'Market Price', title: 'Market Price' },
    { id: 'Discount', title: 'Discount' },
    { id: 'Stock', title: 'Stock' },
    { id: 'Visibile', title: 'Visibile' },
    { id: 'Sellable', title: 'Sellable' },
    { id: 'Discontinued', title: 'Discontinued' },
    { id: 'Minimum quantity threshold', title: 'Minimum quantity threshold' },
    { id: 'Available', title: 'Available' },
    { id: 'Energy label', title: 'Energy label' },
    { id: 'Score', title: 'Score' },
    { id: 'Promo Name', title: 'Promo Name' },
    { id: 'Promo Begin Date', title: 'Promo Begin Date' },
    { id: 'Promo End Date', title: 'Promo End Date' },
    { id: 'Gifts0', title: 'Gifts' }
  ]
  const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
  let seller = appSettings.isMarketplace ? appSettings.sellerAccount?.name : undefined;
  let products = [];
  let maxGifts = 0;
  try {
    let skuIds = await getAllProducts(ctx, [], 1);
    let promos = (await ctx.clients.Vtex.getAllPromo()).data;
    let promisesInfo = [];
    skuIds.forEach(s => {
      promisesInfo.push(new Promise<any>((resolve, reject) => {
        getProductInfo(ctx, s, seller)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          })
      }));
    });
    let resultInfo = await Promise.all(promisesInfo);
    let promisesProducts = [];
    resultInfo.forEach(r => {
      promisesProducts.push(new Promise<any>((resolve, reject) => {
        ctx.clients.Vtex.getProduct(r[0]?.ProductId)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            reject({ status: err?.response?.status, message: err?.response?.data });
          })
      }))
    });
    let resultProducts = await Promise.all(promisesProducts);
    let similarCategoriesPromises = [];
    resultInfo.forEach(r => {
      similarCategoriesPromises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.Vtex.getAssociatedSimilarCategories(r[0].ProductId)
          .then(res => {
            if (res.data == "") {
              resolve([])
            } else {
              resolve(res.data);
            }
          })
          .catch(err => {
            reject({ status: err?.response?.status, message: err?.response?.data });
          })
      }));
    })
    let resultsSimilarCategories = await Promise.all(similarCategoriesPromises);
    let promosPromises = [];
    promos?.items.forEach(p => {
      if (p.isActive == true && p.isArchived == false) {
        promosPromises.push(new Promise<any>((resolve, reject) => {
          ctx.clients.Vtex.getPromoById(p.idCalculatorConfiguration)
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              reject({ status: err?.response?.status, message: err?.response?.data });
            })
        }));
      }
    })
    let resultPromos = [];
    if (promosPromises.length > 0) {
      resultPromos = await Promise.all(promosPromises);
    }
    let giftPromos = [];
    resultPromos.forEach(p => {
      if (p?.skusGift?.gifts?.length > 0) {
        giftPromos.push(p);
      }
    })
    
    let differentAdditionalService: any[] = []

    resultInfo.forEach(r => {
      let skuContext = r[0];
      let price = r[1];
      let salePrice = r[2];
      let stock = 0;
      let productPromo = {
        name: "",
        beginDate: "",
        endDate: ""
      }

      for (let promo of resultPromos) {
        if (promo?.products?.find((x: any) => x.id == skuContext.ProductId)) {
          if (productPromo?.beginDate < promo.beginDateUtc.split("T")[0]) {
            productPromo = {
              name: promo?.name,
              beginDate: promo.beginDateUtc.split("T")[0],
              endDate: promo.endDateUtc.split("T")[0]
            }
          }
        }
      }

      for (let service of skuContext.Services){
        if(!differentAdditionalService?.includes(service.Name)){
          differentAdditionalService.push(service.Name)
        }
      }

      stock = r[3];

      let obj = {};

      obj["12nc"] = skuContext?.AlternateIds?.RefId;
      obj["Commercial code"] = skuContext?.ProductSpecifications?.find(f => f.FieldName == "CommercialCode_field")?.FieldValues[0];
      let mainCategoriesIds = skuContext?.ProductCategoryIds.split("/");
      let mainCategoryId = mainCategoriesIds[mainCategoriesIds.length - 2];
      let categories = [];
      categories.push(skuContext?.ProductCategories[mainCategoryId]);
      let similarCategories = resultsSimilarCategories.find(f => f.find(r => r.ProductId == skuContext.ProductId) != undefined);
      similarCategories?.forEach(as => {
        categories.push(skuContext?.ProductCategories[as.CategoryId]);
      })
      obj["Category"] = categories.join();
      obj["Brand"] = skuContext?.BrandName;
      obj["ProductUrl"] = 'https://www.hotpoint.it' + skuContext?.DetailUrl
      //obj["ProductUrl"] = 'https://' + ctx.vtex.host + skuContext?.DetailUrl
      obj["Description"] = skuContext?.ProductName.replace(/[\n\r]/g, ' ');
      obj["Sale price"] = (salePrice[0]?.items[0]?.sellers[0]?.commertialOffer?.Price != undefined && salePrice[0]?.items[0]?.sellers[0]?.commertialOffer?.Price != 0) ? salePrice[0]?.items[0]?.sellers[0]?.commertialOffer?.Price : (price != undefined ? price[0]?.value : "undefined");
      obj["Market Price"] = price != undefined ? price?.listPrice : "undefined";
      obj["Discount"] = obj["Sale price"] != undefined && obj["Market Price"] != undefined ? 100 - (Math.round(100 * parseInt(obj["Sale price"]) / parseInt(obj["Market Price"]))) + "" : "";
      obj["Stock"] = stock;
      obj["Visibile"] = (resultProducts?.find(f => f.Id == skuContext.ProductId)?.IsVisible == true) && (resultProducts?.find(f => f.Id == skuContext.ProductId)?.IsActive == true) ? "yes" : "no";
      obj["Sellable"] = skuContext?.ProductSpecifications?.find(f => f.FieldName == "sellable")?.FieldValues[0] == "true" ? "yes" : "no";
      obj["Discontinued"] = skuContext?.ProductSpecifications?.find(f => f.FieldName == "isDiscontinued")?.FieldValues[0] == "true" ? "yes" : "no";
      obj["Minimum quantity threshold"] = skuContext?.ProductSpecifications?.find(f => f.FieldName == "minimumQuantityThreshold")?.FieldValues[0];
      obj["Available"] = (stock >= skuContext?.ProductSpecifications?.find(f => f.FieldName == "minimumQuantityThreshold")?.FieldValues[0]) && (stock > 0) ? "yes" : "no";
      let labelUrl = skuContext?.ProductSpecifications?.find(f => f.FieldName == "EnergyLogo_image")?.FieldValues[0];
      let label = "";
      if (labelUrl != undefined) {
        let prettyId = Object.keys(prettyIdToUrl).find(f => prettyIdToUrl[f] == labelUrl);
        label = prettyIdToLabel[prettyId + ""];
      }
      obj["Energy label"] = label;
      obj["Score"] = resultProducts?.find(f => f.Id == skuContext.ProductId)?.Score;
      let acccessories = [];
      giftPromos.forEach(g => {
        if (g.products.find(f => f.id == skuContext.ProductId) != undefined) {
          g.skusGift.gifts.forEach(s => {
            acccessories.push(s.name.split(" (")[0]);
          })
        }
      })
      maxGifts = acccessories.length > maxGifts ? acccessories.length : maxGifts

      obj['Promo Name'] = productPromo != {} ? productPromo.name : ""
      obj['Promo Begin Date'] = productPromo != {} ? productPromo.beginDate : "";
      obj['Promo End Date'] = productPromo != {} ? productPromo.endDate : "";

      products.push(obj);
    });
    //Divido i gifts in più colonne
    for (let ngift = 1; ngift < maxGifts; ngift++) {
      coloumnHeader.push({ id: "Gifts" + ngift, title: "Gifts" })
    }

    //Aggiungo le colonne dei servizi addizionali
    for(let nService = 0; nService < differentAdditionalService.length; nService++){
      coloumnHeader.push({ id: differentAdditionalService[nService], title: differentAdditionalService[nService] })
      coloumnHeader.push({ id: differentAdditionalService[nService] + "Price", title: "Price" })
    }

    for (let resultInfo_index = 0; resultInfo_index < resultInfo.length; resultInfo_index++) {
      let skuContext = resultInfo[resultInfo_index][0];
      let acccessories = [];
      giftPromos.forEach(g => {
        if (g.products.find(f => f.id == skuContext.ProductId) != undefined) {
          g.skusGift.gifts.forEach(s => {
            acccessories.push(s.name.split(" (")[0]);
          })
        }
      })
      for (let i = 0; i < acccessories.length; i++) {
        if (acccessories[i] != undefined && acccessories[i] != 'undefined') products[resultInfo_index]['Gifts' + i] = acccessories[i]
      }
      for(let i = 0; i < skuContext.Services.length; i++){
        products[resultInfo_index][skuContext.Services[i].Name] = skuContext.Services[i].Name
        products[resultInfo_index][skuContext.Services[i].Name + "Price"] = skuContext.Services[i]?.Options[0]?.Price
      }
    }

    products.sort((product1, product2) => parseInt(product1['12nc']) - parseInt(product2['12nc']))
    const writerInstance = csvWriter({
      path: 'export.csv',
      header: coloumnHeader,
      fieldDelimiter: ";"
    });
    
    await writerInstance.writeRecords(products);
    let timestamp = new Date().toISOString().replace(/-/g, "").split(".")[0].replace(/:/g, "");
    ctx.status = 200;
    ctx.res.setHeader("Content-Type", "text/csv");
    ctx.res.setHeader("Content-Disposition", "attachment;filename=export-" + timestamp + ".csv");
    ctx.body = fs.readFileSync("/usr/local/data/export.csv");
  } catch (err) {
    console.log(err)
    if (err?.response == undefined) {
      ctx.body = err.message;
      ctx.status = err.status;
    } else {
      ctx.body = err?.response?.data;
      ctx.status = err?.response?.status;
    }
  }
  await next();
}

async function getAllProducts(ctx: Context, ids: [], page: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.Vtex.getSkuRangeByPage(page)
      .then(res => {
        ids = ids.concat(res.data);
        if (res.data.length < 1000) {
          resolve(ids)
        } else {
          resolve(getAllProducts(ctx, ids, page + 1));
        }
      })
      .catch(err => {
        reject({ status: err?.response?.status, message: err?.response?.data });
      })
  });
}

async function getProductInfo(ctx: Context, sku: string, seller: string): Promise<any> {
  let skuContextPromise = new Promise<any>((resolve, reject) => {
    ctx.clients.Vtex.getSkuContext(sku)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject({ status: err?.response?.status, message: err?.response?.data });
      });
  })
  let pricePromise = new Promise<any>((resolve, reject) => {
    ctx.clients.Vtex.getPrice(sku, ctx)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        resolve(undefined)
        //reject({status: err?.response?.status, message: err?.response?.data});
      });
  })
  let salePricePromise = new Promise<any>((resolve, reject) => {
    ctx.clients.Vtex.getSalePrice(sku)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject({ status: err?.response?.status, message: err?.response?.data });
      });
  })
  let stockPromise = new Promise<any>((resolve, reject) => {
    ctx.clients.Vtex.getStockBySellerName(sku, 1, seller)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject({ status: err?.response?.status, message: err?.response?.data });
      });
  })
  return Promise.all([skuContextPromise, pricePromise, salePricePromise, stockPromise]);
}
