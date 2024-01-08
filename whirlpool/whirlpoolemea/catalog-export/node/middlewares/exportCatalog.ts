//@ts-nocheck

// import { table } from "console";
//import { sellableMap } from "../utils/constants";
import { prettyIdToUrl } from "../utils/energyLabel";
import { prettyIdToLabel } from "../utils/energyLabel";
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

export async function exportCatalog(ctx: Context, next: () => Promise<any>) {

  ctx.set('Cache-Control', 'no-store');

  try {

    let app = "whirlpoolemea.catalog-export"
    ctx.state.appSettings = await ctx.clients.apps.getAppSettings(app);

    process.env.CE = JSON.stringify(ctx.state.appSettings);

    // get sellable Map from appSettings
    let sellableMap = {}
    ctx.state.appSettings.sellableMap.forEach(({ key, value }) => { sellableMap[key] = value })

    // get catalog export fields from app settings
    let appSettingsXlsFields = ctx.state.appSettings.catalogExportFields


    let products = [];
    let initialPromiseArray = []

    // Sales Channel
    initialPromiseArray.push(new Promise<any>((resolve, reject) => {

      ctx.clients.VtexMP.getSalesChannelList().then(res => {
        if (res.data) resolve(res.data)
      }).catch(err => reject(err))

    }))
    const ressss = await Promise.all(initialPromiseArray)

    // SKU list
    initialPromiseArray.push(getSkuList(ctx, [], 1))

    // Promo
    initialPromiseArray.push(new Promise<any>((resolve, reject) => {

      ctx.clients.VtexMP.getAllPromo().then(res => {
        if (res.data) resolve(res.data.items)
      }).catch(err => reject(err))

    }))

    // wait for:
    // 1. Sales channels
    // 2. SKU list
    // 3. Promo
    let initialResults = await Promise.all(initialPromiseArray)

    // sales channels IDs from appSettings
    let scIds = [];
    ctx.state.appSettings.mp.salesChannelsIds?.split(",")?.forEach(i => scIds.push(i));

    // check if app settings sales channels are admitted (included from the ones requested)
    let saleschannels = initialResults[0].filter(f => scIds.includes(f.Id + ""));

    // SKU list result
    let skuIds = initialResults[1];

    // promos result
    let promos = initialResults[2];
    if (promos && promos.length > 0)
      promos = sortPromotions(promos)

    let tableColumns = [];

    // get SKU Contexts
    let promises: Promise<any>[] = [];
    skuIds?.forEach(s => {
      promises.push(new Promise<any>((resolve, reject) => ctx.clients.VtexMP.getSkuContext(s).then(res => resolve({ skuId: s, skuContext: res.data })).catch(err => reject(err))))
    })
    let skuContextArray = await resolvePromises(promises);

    // get active Products and SKUs
    let activeProductIds = [];
    let activeSkuIds = [];
    skuContextArray.filter(f => f.skuContext.IsProductActive)?.forEach(s => {

      activeSkuIds.push(s.skuContext.Id);
      activeProductIds.push(s.skuContext.ProductId);

    });

    // get SKU complement
    promises = [];
    activeSkuIds?.forEach(s => {
      promises.push(new Promise<any>((resolve, reject) => ctx.clients.VtexMP.getSkuComplement(s).then(res => resolve({ skuId: s, skuComplement: res.data == "" ? [] : res.data })).catch(err => reject(err))))
    })

    let skuComplementArray = await resolvePromises(promises);

    // get market prices
    promises = [];
    activeSkuIds?.forEach(s => {

      // get market prices for sales channels SKUs
      saleschannels.forEach(sc => {
        promises.push(new Promise<any>((resolve, reject) => ctx.clients.VtexMP.getMarketPriceSc(s, sc.Id).then(res => resolve({ skuId: s, tradePolicy: sc.Id, marketPrice: res.data })).catch(err => reject(err))))
      });

      // get market prices for normal SKUs. Check if it makes sense
      promises.push(new Promise<any>((resolve, reject) => ctx.clients.VtexMP.getMarketPrice(s).then(res => resolve({ skuId: s, tradePolicy: "", marketPrice: res.data })).catch(err => reject(err))))

    })

    let marketPriceArray = await resolvePromises(promises);

    // get product detail for each SKU context
    promises = [];
    skuContextArray.filter(f => activeProductIds.includes(f.skuContext.ProductId))?.forEach(r => {

      let skuId = r.skuContext.skuId;
      let productId = r.skuContext.ProductId;
      promises.push(new Promise<any>((resolve, reject) => {

        ctx.clients.VtexMP.getProduct(productId)
          .then(res => resolve({ skuId: skuId, productId: productId, productData: res.data }))
          .catch(err => reject(err))

      }));

    })
    let productArray = await resolvePromises(promises);

    // get similar categories for each SKU context
    promises = [];
    skuContextArray.filter(f => activeProductIds.includes(f.skuContext.ProductId))?.forEach(r => {

      let skuId = r.skuContext.Id;
      let productId = r.skuContext.ProductId;
      promises.push(new Promise<any>((resolve, reject) => {

        ctx.clients.VtexMP.getAssociatedSimilarCategories(productId)
          .then(res => res.data == "" ? resolve({ skuId: skuId, productId: productId, similarCategories: [] }) : resolve({ skuId: skuId, productId: productId, similarCategories: res.data }))
          .catch(err => reject(err))

      }));

    })

    let similarCategoriesArray = await resolvePromises(promises);

    // get only REGULAR and ACTIVE promos
    promises = [];
    promos?.forEach(p => {
      if (p.isActive && !p.isArchived && p.type == "regular" && p.status == "active" && (!p.utmSource || p.utmSource == "") && (!p.utmCampain || p.utmCampain == "") && (!p.utmiCampaign || p.utmiCampaign == "")) {

        promises.push(new Promise<any>((resolve, reject) => {
          ctx.clients.VtexMP.getPromoById(p.idCalculatorConfiguration)
            .then(res => {
              p.scope.allCatalog ? res.data["allCatalog"] = true : res.data["allCatalog"] = false;
              resolve({ promoId: p.idCalculatorConfiguration, promoData: res.data })
            })
            .catch(err => reject(err))
        }));
      }
    })
    let promoArray = await resolvePromises(promises);

    // get price for each SKU
    promises = [];
    activeSkuIds?.forEach(s => {

      promises.push(new Promise<any>((resolve, reject) => {

        ctx.clients.VtexMP.getPrice(s, ctx)
          .then(res => resolve({ skuId: s, price: res.data }))
          .catch(err => resolve({ skuId: s, price: undefined }))

      }))

    })
    let priceArray = await resolvePromises(promises);

    let giftPromos = [];
    let skuPromos = [];
    let skuPromosData = [];

    // differentiate GIFT from SKU promos
    promoArray?.forEach(p => {

      if (p.promoData?.skusGift?.gifts?.length > 0)
        giftPromos.push(p.promoData);

      else
        skuPromos.push(p.promoData);

    })

    // SKU promo iteration
    if (skuPromos.length >= 0) {

      promises = [];
      activeSkuIds?.forEach(s => {

        let skuContext = skuContextArray?.find(f => f.skuId == s).skuContext;
        saleschannels.forEach(sc => {

          let commertialOffer = undefined;

          if (ctx.state.appSettings.isCCProject)
            commertialOffer = marketPriceArray.find(f => f.tradePolicy == sc.Id && f.skuId == s)?.marketPrice[0]?.items[0]?.sellers.find(f => f.sellerId == ctx.state.appSettings.seller?.accountName)?.commertialOffer;

          else
            commertialOffer = marketPriceArray.find(f => f.tradePolicy == sc.Id && f.skuId == s)?.marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer;

          let price = priceArray.find(f => f.skuId == s && f.price != undefined)?.price?.fixedPrices?.find(f => f.tradePolicyId == (sc.Id + ""))?.value;

          if (commertialOffer != undefined && price != undefined) {

            promises.push(new Promise<any>((resolve, reject) => {

              let promoPerSCID = ctx.state.appSettings.isCCProject ? skuPromos.filter(f => f.idsSalesChannel?.includes(sc.Id + "")) : skuPromos;
              getSkuPromo(ctx, promoPerSCID, skuContext, price, commertialOffer, sc.CultureInfo)
                .then(res => resolve({ skuId: s, tradePolicy: sc.Id, promoInfo: res }))
                .catch(err => reject(err))

            }));

          }

        })

      })

      skuPromosData = await resolvePromises(promises);

    }

    let serviceColumns = []
    let skuContextArrayForServices = undefined;

    // Additional services context
    if (appSettingsXlsFields.additionalServices) {

      // get Additional Services Context
      if (ctx.state.appSettings.isCCProject) {

        promises = [];

        activeSkuIds?.forEach(s => {

          let skuIdO2P = skuContextArray.find(f => f.skuId == s)?.skuContext?.SkuSellers?.find(f => f.SellerId == ctx.state.appSettings.seller.accountName)?.SellerStockKeepingUnitId;
          if (skuIdO2P != undefined) {
            promises.push(new Promise<any>((resolve, reject) => ctx.clients.VtexSeller.getSKUContext(skuIdO2P, ctx.state.appSettings.seller.accountName).then(res => resolve({ skuId: s, skuContext: res })).catch(err => reject(err))))
          }

        })

        skuContextArrayForServices = await resolvePromises(promises);

      }

      skuContextArrayForServices = skuContextArrayForServices ? skuContextArrayForServices : skuContextArray;

      // create one COLUMN per SERVICE inside the xls file
      serviceColumns = getServiceColumns(saleschannels, skuContextArrayForServices, ctx);

    }

    // iterate over SKU array
    for (let i = 0; i < skuIds.length; i++) {

      let s = skuIds[i]

      // get SKU context
      let skuContext = skuContextArray.find(f => f.skuId == s)?.skuContext;

      let obj = {};

      // *** SKU Id field *** //
      if (appSettingsXlsFields.skuId) {

        if (tableColumns.findIndex(x => x.id === 'Sku Id') < 0) tableColumns.push({ id: 'Sku Id', title: 'Sku Id' })
        obj["Sku Id"] = skuContext.Id;

      }

      // *** Product Id field *** //
      if (appSettingsXlsFields.productId) {

        if (tableColumns.findIndex(x => x.id === 'Product Id') < 0) tableColumns.push({ id: 'Product Id', title: 'Product Id' })
        obj["Product Id"] = skuContext.ProductId;

      }

      // *** 12nc field *** //
      if (appSettingsXlsFields["12nc"]) {

        if (tableColumns.findIndex(x => x.id === '12nc') < 0) tableColumns.push({ id: '12nc', title: '12nc' })
        obj["12nc"] = skuContext.AlternateIds.RefId

      }

      // *** Commercial code field *** //
      if (appSettingsXlsFields.commercialCode) {

        if (tableColumns.findIndex(x => x.id === 'Commercial code') < 0) tableColumns.push({ id: 'Commercial code', title: 'Commercial code' })
        obj["Commercial code"] = skuContext.ProductSpecifications?.find(f => f.FieldName == "CommercialCode_field")?.FieldValues[0];

      }

      // *** Product Id field *** //
      if (appSettingsXlsFields.description) {

        if (tableColumns.findIndex(x => x.id === 'Description') < 0) tableColumns.push({ id: 'Description', title: 'Description' })
        obj["Description"] = skuContext.ProductName;

      }

      let mainCategoriesIds = skuContext.ProductCategoryIds?.split("/");
      let mainCategoryId = mainCategoriesIds[mainCategoriesIds.length - 2];

      // get category and similar categories
      let categories = [];
      categories.push(skuContext.ProductCategories[mainCategoryId]);
      let similarCategories = similarCategoriesArray?.find(f => s == f.skuId)?.similarCategories;
      similarCategories?.forEach(as => {
        categories.push(skuContext.ProductCategories[as.CategoryId]);
      })

      // Gift Promo Fields
      if (appSettingsXlsFields.giftPromoVisible) {

        let productGiftPromo = {
          name: "",
          beginDate: "",
          endDate: ""
        }

        // Find Product Gift for current SKU
        for (let promo of giftPromos) {

          if (promo?.products?.find((x: any) => x.id == skuContext.ProductId)) {

            if (productGiftPromo?.beginDate < promo.beginDateUtc.split("T")[0]) {

              productGiftPromo = {
                name: promo?.name,
                beginDate: promo.beginDateUtc.split("T")[0],
                endDate: promo.endDateUtc.split("T")[0]
              }

            }

          }

        }

        // *** Gift Promo Name field *** //
        if (appSettingsXlsFields.giftPromoName) {

          if (tableColumns.findIndex(x => x.id === 'Gift Promo Name') < 0) tableColumns.push({ id: 'Gift Promo Name', title: 'Gift Promo Name' })
          obj['Gift Promo Name'] = productGiftPromo != {} ? productGiftPromo.name : ""

        }

        // *** Gift Promo Begin Date field *** //
        if (appSettingsXlsFields.giftPromoBeginDate) {

          if (tableColumns.findIndex(x => x.id === 'Gift Promo Begin Date') < 0) tableColumns.push({ id: 'Gift Promo Begin Date', title: 'Gift Promo Begin Date' })
          obj['Gift Promo Begin Date'] = productGiftPromo != {} ? productGiftPromo.beginDate : "";

        }

        // *** Gift Promo End Date field *** //
        if (appSettingsXlsFields.giftPromoEndDate) {

          if (tableColumns.findIndex(x => x.id === 'Gift Promo End Date') < 0) tableColumns.push({ id: 'Gift Promo End Date', title: 'Gift Promo End Date' })
          obj['Gift Promo End Date'] = productGiftPromo != {} ? productGiftPromo.endDate : "";

        }

      }

      // *** Category field *** //
      if (appSettingsXlsFields.category) {

        if (tableColumns.findIndex(x => x.id === 'Category') < 0) tableColumns.push({ id: 'Category', title: 'Category' })
        obj["Category"] = categories.join(" , ");

      }

      // *** Brand field *** //
      if (appSettingsXlsFields.brand) {

        if (tableColumns.findIndex(x => x.id === 'Brand') < 0) tableColumns.push({ id: 'Brand', title: 'Brand' })
        obj["Brand"] = skuContext.BrandName;

      }

      // *** Construction type field *** //
      if (appSettingsXlsFields.constructionType) {

        if (tableColumns.findIndex(x => x.id === 'Construction type') < 0) tableColumns.push({ id: 'Construction type', title: 'Construction type' })
        obj['Construction type'] = skuContext.ProductSpecifications?.find(f => f.FieldName == "constructionType")?.FieldValues[0];

      }

      // get product from current SKU
      let product = productArray.find(f => f.productId == skuContext.ProductId)?.productData;

      // *** Visibile field *** //
      if (appSettingsXlsFields.visible) {

        if (tableColumns.findIndex(x => x.id === 'Visibile') < 0) tableColumns.push({ id: 'Visibile', title: 'Visibile' })
        obj["Visibile"] = (product?.IsVisible && product?.IsActive) ? "yes" : "no";

      }

      // *** Discontinued field *** //
      if (appSettingsXlsFields.discontinued) {

        if (tableColumns.findIndex(x => x.id === 'Discontinued') < 0) tableColumns.push({ id: 'Discontinued', title: 'Discontinued' })
        obj["Discontinued"] = skuContext.ProductSpecifications?.find(f => f.FieldName == "isDiscontinued")?.FieldValues[0] == "true" ? "yes" : "no";

      }
      // added fields tkt IT2192

      // *** Energy category field *** //
      if (appSettingsXlsFields.energyCategory) {

        if (tableColumns.findIndex(x => x.id === 'Energy category') < 0) tableColumns.push({ id: 'Energy category', title: 'Energy category' })
        let energyCategory = skuContext?.ProductSpecifications?.find(f => f.FieldName == "Classe Energetica" && f.FieldGroupName == "CategoryDataCluster")?.FieldValues;
        obj["Energy category"] = energyCategory != undefined && energyCategory.length > 0 ? energyCategory[0] : "null";

      }

      // *** Width field *** //
      if (appSettingsXlsFields.width) {

        if (tableColumns.findIndex(x => x.id === 'Width') < 0) tableColumns.push({ id: 'Width', title: 'Width' })
        let widthField = skuContext?.ProductSpecifications?.find(f => f.FieldName == "Larghezza (cm)" && f.FieldGroupName == "Dimensioni")?.FieldValues;
        obj["Width"] = widthField != undefined && widthField.length > 0 ? widthField[0] : "null";

      }

      // *** Depth field *** //
      if (appSettingsXlsFields.depth) {

        if (tableColumns.findIndex(x => x.id === 'Depth') < 0) tableColumns.push({ id: 'Depth', title: 'Depth' })
        let depthField = skuContext?.ProductSpecifications?.find(f => f.FieldName == "Profondità (cm)" && f.FieldGroupName == "Dimensioni")?.FieldValues;
        obj["Depth"] = depthField != undefined && depthField.length > 0 ? depthField[0] : "null";

      }

      // *** Height field *** //
      if (appSettingsXlsFields.height) {

        if (tableColumns.findIndex(x => x.id === 'Height') < 0) tableColumns.push({ id: 'Height', title: 'Height' })
        let heightField = skuContext?.ProductSpecifications?.find(f => f.FieldName == "Altezza (cm)" && f.FieldGroupName == "Dimensioni")?.FieldValues;
        obj["Height"] = heightField != undefined && heightField.length > 0 ? heightField[0] : "null";

      }

      // *** Sellable field *** //
      if (appSettingsXlsFields.sellable) {

        if (saleschannels.length > 1) {

          // Multiple Sales Channel management
          saleschannels?.forEach(sc => {

            if (tableColumns.findIndex(x => x.id === sc.Name + " - Sellable") < 0) tableColumns.push({ id: sc.Name + " - Sellable", title: sc.Name + " - Sellable" })
            let sellableField = sellableMap[sc.Name];
            obj[sc.Name + " - Sellable"] = skuContext?.ProductSpecifications?.find(f => f.FieldName == sellableField)?.FieldValues[0] == "true" ? "yes" : "no";

          })

        } else {

          // Mono and No Sales Channel management
          if (tableColumns.findIndex(x => x.id === "Sellable") < 0) tableColumns.push({ id: "Sellable", title: "Sellable" })
          obj["Sellable"] = skuContext?.ProductSpecifications?.find(f => f.FieldName == "sellable")?.FieldValues[0] == "true" ? "yes" : "no";

        }

      }

      if (saleschannels.length > 1) {

        // Multiple Sales Channel management
        saleschannels?.forEach(sc => {
          let commertialOffer = marketPriceArray.find(f => f.tradePolicy == sc.Id && f.skuId == s)?.marketPrice[0]?.items[0]?.sellers?.find(f => f.sellerId == ctx.state.appSettings.seller?.accountName)?.commertialOffer;
          let marketPriceValue = commertialOffer?.Price;
          let msrp = priceArray.find(f => f.skuId == s && f.price != undefined)?.price?.fixedPrices?.find(f => f.tradePolicyId == (sc.Id + ""));
          let salePrice = msrp?.value
          let listPriceValue = msrp?.listPrice;

          // *** List price field *** //
          if (appSettingsXlsFields.listPrice) {

            if (tableColumns.findIndex(x => x.id === sc.Name + ' - List price') < 0) tableColumns.push({ id: sc.Name + ' - List price', title: sc.Name + ' - List price (' + sc.CurrencySymbol + ')' })
            obj[sc.Name + " - List price"] = listPriceValue != undefined ? listPriceValue : (salePrice != undefined ? salePrice : "");

          }

          // *** Sale price field *** //
          if (appSettingsXlsFields.salePrice) {

            if (tableColumns.findIndex(x => x.id === sc.Name + ' - Sale price') < 0) tableColumns.push({ id: sc.Name + ' - Sale price', title: sc.Name + ' - Sale price (' + sc.CurrencySymbol + ')' })
            obj[sc.Name + " - Sale price"] = salePrice != undefined ? salePrice : "";

          }

          // *** Market price field *** //
          if (appSettingsXlsFields.marketPrice) {

            if (tableColumns.findIndex(x => x.id === sc.Name + ' - Market price') < 0) tableColumns.push({ id: sc.Name + ' - Market price', title: sc.Name + ' - Market price (' + sc.CurrencySymbol + ')' })
            obj[sc.Name + " - Market price"] = marketPriceValue != undefined ? marketPriceValue : salePrice;

          }

          // *** Discount field *** //
          if (appSettingsXlsFields.discount) {

            if (tableColumns.findIndex(x => x.id === sc.Name + ' - Discount') < 0) tableColumns.push({ id: sc.Name + ' - Discount', title: sc.Name + ' - Discount (' + sc.CurrencySymbol + ')' })
            obj[sc.Name + " - Discount"] = obj[sc.Name + " - Sale price"] != undefined && obj[sc.Name + " - Market price"] != undefined ? 100 - (Math.round(100 * parseInt(obj[sc.Name + " - Sale price"]) / parseInt(obj[sc.Name + " - Market price"]))) + "" : "";

          }

        })

      } else if (saleschannels.length > 0) {

        // Mono Sales Channel management
        let commertialOffer = marketPriceArray.find(f => f.tradePolicy == 1 && f.skuId == s)?.marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer;
        let marketPriceValue = commertialOffer?.Price;
        let msrp = priceArray.find(f => f.skuId == s && f.price != undefined)?.price?.fixedPrices[0];
        let salePrice = msrp?.value
        let listPriceValue = msrp?.listPrice;

        // *** List price field *** //
        if (appSettingsXlsFields.listPrice) {

          if (tableColumns.findIndex(x => x.id === 'List price') < 0) tableColumns.push({ id: 'List price', title: 'List price (' + saleschannels[0].CurrencySymbol + ')' })
          obj["List price"] = listPriceValue != undefined ? listPriceValue : (salePrice != undefined ? salePrice : "");

        }

        // *** Sale price field *** //
        if (appSettingsXlsFields.salePrice) {

          if (tableColumns.findIndex(x => x.id === 'Sale price') < 0) tableColumns.push({ id: 'Sale price', title: 'Sale price (' + saleschannels[0].CurrencySymbol + ')' })
          obj["Sale price"] = salePrice != undefined ? salePrice : "";

        }

        // *** Market price field *** //
        if (appSettingsXlsFields.marketPrice) {

          if (tableColumns.findIndex(x => x.id === 'Market price') < 0) tableColumns.push({ id: 'Market price', title: 'Market price (' + saleschannels[0].CurrencySymbol + ')' })
          obj["Market price"] = marketPriceValue != undefined ? marketPriceValue : salePrice;

        }

        // *** Discount field *** //
        if (appSettingsXlsFields.discount) {

          if (tableColumns.findIndex(x => x.id === 'Discount') < 0) tableColumns.push({ id: 'Discount', title: 'Discount (' + saleschannels[0].CurrencySymbol + ')' })
          obj["Discount"] = obj["Sale price"] != undefined && obj["Market price"] != undefined ? 100 - (Math.round(100 * parseInt(obj["Sale price"]) / parseInt(obj["Market price"]))) + "" : "";

        }

      } else {

        // No Sales Channel management
        let commertialOffer = marketPriceArray.find(f => f.skuId == s)?.marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer;
        let marketPriceValue = commertialOffer?.Price;
        let msrp = priceArray.find(f => f.skuId == s && f.price != undefined)?.price?.fixedPrices[0];
        let salePrice = msrp?.value
        let listPriceValue = msrp?.listPrice;

        // *** List price field *** //
        if (appSettingsXlsFields.listPrice) {

          if (tableColumns.findIndex(x => x.id === 'List price') < 0) tableColumns.push({ id: 'List price', title: 'List price' })
          obj["List price"] = listPriceValue != undefined ? listPriceValue : (salePrice != undefined ? salePrice : "");

        }

        // *** Sale price field *** //
        if (appSettingsXlsFields.salePrice) {

          if (tableColumns.findIndex(x => x.id === 'Sale price') < 0) tableColumns.push({ id: 'Sale price', title: 'Sale price' })
          obj["Sale price"] = salePrice != undefined ? salePrice : "";

        }

        // *** Market price field *** //
        if (appSettingsXlsFields.marketPrice) {

          if (tableColumns.findIndex(x => x.id === 'Market price') < 0) tableColumns.push({ id: 'Market price', title: 'Market price' })
          obj["Market price"] = marketPriceValue != undefined ? marketPriceValue : salePrice;

        }

        // *** Discount field *** //
        if (appSettingsXlsFields.discount) {

          if (tableColumns.findIndex(x => x.id === 'Discount') < 0) tableColumns.push({ id: 'Discount', title: 'Discount' })
          obj["Discount"] = obj["Sale price"] != undefined && obj["Market price"] != undefined ? 100 - (Math.round(100 * parseInt(obj["Sale price"]) / parseInt(obj["Market price"]))) + "" : "";

        }

      }

      // *** Stock field *** //
      if (appSettingsXlsFields.stock) {

        let stock = marketPriceArray.find(f => f.skuId == s && f.marketPrice[0]?.items != undefined)?.marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity;

        if (tableColumns.findIndex(x => x.id === 'Stock') < 0) tableColumns.push({ id: 'Stock', title: 'Stock' })
        obj["Stock"] = stock != undefined ? stock : 0;

        // *** Available field *** //
        if (appSettingsXlsFields.available) {

          if (tableColumns.findIndex(x => x.id === 'Available') < 0) tableColumns.push({ id: 'Available', title: 'Available' })
          obj["Available"] = (stock > 0) ? "yes" : "no";

        }

      }

      // *** Minimum quantity threshold field *** //
      if (appSettingsXlsFields.minimumQuantityThreshold) {

        if (tableColumns.findIndex(x => x.id === 'Minimum quantity threshold') < 0) tableColumns.push({ id: 'Minimum quantity threshold', title: 'Minimum quantity threshold' })
        obj["Minimum quantity threshold"] = skuContext.ProductSpecifications?.find(f => f.FieldName == "minimumQuantityThreshold")?.FieldValues[0];

      }

      if (appSettingsXlsFields.skuPromoVisible) {

        if (saleschannels.length > 1) {

          // Multiple Sales Channel management
          saleschannels?.forEach(sc => {

            let promoToShow = skuPromosData?.find(f => f.skuId == s && f.tradePolicy == sc.Id)?.promoInfo;

            // *** Sku Active promo field *** //
            if (appSettingsXlsFields.skuActivePromo) {

              if (tableColumns.findIndex(x => x.id === sc.Name + ' - Sku Active promo') < 0) tableColumns.push({ id: sc.Name + ' - Sku Active promo', title: sc.Name + ' - Sku Active promo' })
              obj[sc.Name + " - Sku Active promo"] = promoToShow != undefined ? promoToShow.name : "";

            }

            // *** Sku Promo begin date field *** //
            if (appSettingsXlsFields.skuPromoBeginDate) {

              if (tableColumns.findIndex(x => x.id === sc.Name + ' - Sku Promo begin date') < 0) tableColumns.push({ id: sc.Name + ' - Sku Promo begin date', title: sc.Name + ' - Sku Promo begin date (' + sc.CurrencySymbol + ')' })
              obj[sc.Name + " - Sku Promo begin date"] = promoToShow != undefined ? promoToShow.beginDate : "";

            }

            // *** Sku Promo end date field *** //
            if (appSettingsXlsFields.skuPromoEndDate) {

              if (tableColumns.findIndex(x => x.id === sc.Name + ' - Sku Promo end date') < 0) tableColumns.push({ id: sc.Name + ' - Sku Promo end date', title: sc.Name + ' - Sku Promo end date (' + sc.CurrencySymbol + ')' })
              obj[sc.Name + " - Sku Promo end date"] = promoToShow != undefined ? promoToShow.endDate : "";

            }

          })

        } else {

          // Mono and No Sales Channel management
          let promoToShow = skuPromosData?.find(f => f.skuId == s)?.promoInfo;

          // *** Sku Active promo field *** //
          if (appSettingsXlsFields.skuActivePromo) {

            if (tableColumns.findIndex(x => x.id === 'Sku Active promo') < 0) tableColumns.push({ id: 'Sku Active promo', title: 'Sku Active promo' })
            obj["Sku Active promo"] = promoToShow != undefined ? promoToShow.name : "";

          }

          // *** Sku Promo begin date field *** //
          if (appSettingsXlsFields.skuPromoBeginDate) {

            if (tableColumns.findIndex(x => x.id === 'Sku Promo begin date') < 0) tableColumns.push({ id: 'Sku Promo begin date', title: 'Sku Promo begin date' })
            obj["Sku Promo begin date"] = promoToShow != undefined ? promoToShow.beginDate : "";

          }

          // *** Sku Promo end date field *** //
          if (appSettingsXlsFields.skuPromoEndDate) {

            if (tableColumns.findIndex(x => x.id === 'Sku Promo end date') < 0) tableColumns.push({ id: 'Sku Promo end date', title: 'Sku Promo end date' })
            obj["Sku Promo end date"] = promoToShow != undefined ? promoToShow.endDate : "";

          }

        }

      }

      // *** Energy Label field *** //
      if (appSettingsXlsFields.energyLabel) {

        let labelUrl = skuContext.ProductSpecifications?.find(f => f.FieldName == "EnergyLogo_image")?.FieldValues[0];
        let label = "";

        if (labelUrl != undefined) {

          let prettyId = Object.keys(prettyIdToUrl).find(f => prettyIdToUrl[f] == labelUrl);
          label = prettyIdToLabel[prettyId + ""];

        }

        if (tableColumns.findIndex(x => x.id === 'Energy label') < 0) tableColumns.push({ id: 'Energy label', title: 'Energy label' })
        obj["Energy label"] = label;

      }

      // *** Score field *** //
      if (appSettingsXlsFields.score) {

        if (tableColumns.findIndex(x => x.id === 'Score') < 0) tableColumns.push({ id: 'Score', title: 'Score' })
        obj["Score"] = product?.Score != undefined ? product.Score : "";

      }

      let skuComplementData = skuComplementArray.find(f => f.skuId == s)?.skuComplement;

      // *** MDA Cross-sell field *** //
      if (appSettingsXlsFields.mdaCrossSell) {

        let mdaXSell = skuComplementData?.filter(f => f.ComplementTypeId == 1);
        let mdaXSellRefIds = [];

        mdaXSell?.forEach(m => {
          mdaXSellRefIds.push(skuContextArray?.find(f => f.skuId == m.SkuId).skuContext?.AlternateIds?.RefId);
        })

        if (tableColumns.findIndex(x => x.id === 'MDA Cross-sell') < 0) tableColumns.push({ id: 'MDA Cross-sell', title: 'MDA Cross-sell' })
        obj["MDA Cross-sell"] = mdaXSellRefIds.length > 0 ? mdaXSellRefIds.join(" , ") : "";

      }

      // *** MDA Up-sell field *** //
      if (appSettingsXlsFields.mdaUpSell) {

        let mdaUpSell = skuComplementData?.filter(f => f.ComplementTypeId == 2);
        let mdaUpSellRefIds = [];

        mdaUpSell?.forEach(m => {
          mdaUpSellRefIds.push(skuContextArray?.find(f => f.skuId == m.SkuId).skuContext?.AlternateIds?.RefId);
        })

        if (tableColumns.findIndex(x => x.id === 'MDA Up-sell') < 0) tableColumns.push({ id: 'MDA Up-sell', title: 'MDA Up-sell' })
        obj["MDA Up-sell"] = mdaUpSellRefIds.length > 0 ? mdaUpSellRefIds.join(" , ") : "";

      }

      // *** WPRO Cross-sell field *** //
      if (appSettingsXlsFields.wproCrossSell) {

        let wproXSell = skuComplementData?.filter(f => f.ComplementTypeId == 3);
        let wproXSellRefIds = [];

        wproXSell?.forEach(m => {
          wproXSellRefIds.push(skuContextArray?.find(f => f.skuId == m.SkuId).skuContext?.AlternateIds?.RefId);
        })

        if (tableColumns.findIndex(x => x.id === 'WPRO Cross-sell') < 0) tableColumns.push({ id: 'WPRO Cross-sell', title: 'WPRO Cross-sell' })
        obj["WPRO Cross-sell"] = wproXSellRefIds.length > 0 ? wproXSellRefIds.join(" , ") : "";

      }

      // *** Product url field *** //
      if (appSettingsXlsFields.productUrl) {

        if (tableColumns.findIndex(x => x.id === 'Product url') < 0) tableColumns.push({ id: 'Product url', title: 'Product url' })
        obj["Product url"] = "https://" + ctx.state.appSettings.mp.hostname + skuContext.DetailUrl;

      }

      // *** Additional services fields ** //
      if (appSettingsXlsFields.additionalServices) {

        serviceColumns.forEach(sc => {

          let service = skuContextArrayForServices.find(f => f.skuId == s)?.skuContext?.Services?.find(f => f.Name == sc.id)?.Options[0]?.Price

          if (service != undefined) {

            service = service + "";
            let slices = service.split(".");

            if (slices == 2) {
              service = slices[0] + "." + slices[1].substr(0, 2)
            }

          }

          obj[sc.id] = service != undefined ? service : "";

        })

      }

      products.push(obj);

    }

    // *** Additional services fields ** //
    if (appSettingsXlsFields.additionalServices) {

      // create one COLUMN per SERVICE inside the xls file
      for (let i = 0; i < serviceColumns.length; i++) {

        let service = serviceColumns[i]
        if (tableColumns.findIndex(x => x.id === service.id) < 0) tableColumns.push(service)

      }

    }

    const csvStringifier = createCsvStringifier({
      header: tableColumns,
      fieldDelimiter: ";"
    });

    let timestamp = new Date().toISOString().replace(/-/g, "").split(".")[0].replace(/:/g, "");
    ctx.status = 200;
    ctx.res.setHeader("Content-Type", "text/csv");
    ctx.res.setHeader("Content-Disposition", "attachment;filename=export-" + timestamp + ".csv");
    ctx.body = csvStringifier.getHeaderString().concat(csvStringifier.stringifyRecords(products))

  } catch (err) {
    console.log(err);
    ctx.body = "Internal Server Error";
    ctx.status = 500;

  }

  await next();

}

async function wait(timeout: number): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    setTimeout(() => {
      resolve(true)
    }, timeout);
  })
}

async function getSkuList(ctx: Context, ids: [], page: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.VtexMP.getSkuRangeByPage(page)
      .then(res => {
        ids = ids.concat(res.data);
        if (res.data.length < 1000) {
          resolve(ids)
        } else {
          return getSkuList(ctx, ids, page + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
        }
      })
      .catch(err => reject(err))
  });
}

async function resolvePromises(promises: Promise<any>[], maxPromises?: number = 200, timeout?: number = 0): Promise<any[]> {
  let ret = [];
  for (let i = 0, j = maxPromises; i < i + j && i < promises.length; i = i + j) {
    ret = ret.concat(await Promise.all(promises.slice(i, i + j)))
    await wait(timeout);
  }
  return ret;
}

function sortPromotions(promotions: []): [] {
  let newPromotions = [];
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

function formatDate(beginDate: string, endDate: string, name: string, locale: string): Object {
  return {
    beginDate: new Date(Date.parse(beginDate)).toLocaleString(locale),
    endDate: new Date(Date.parse(endDate)).toLocaleString(locale),
    name: name
  }
}

async function promoContainsSku(ctx: Context, promo: Object, skuId: string, skuContext: Object): Promise<Boolean> {
  return new Promise<Boolean>(async (resolve, reject) => {
    let found = false;
    if (promo.allCatalog) {
      found = true;
    }
    try {
      if (promo.products.length > 0 && !found) {
        let productId = skuContext.ProductId;
        let product = promo.products.find(f => f.id == productId);
        if (product != undefined) {
          found = true;
        }
      }
      if (promo.brands.length > 0 && !found) {
        let brandId = skuContext.BrandId;
        let brand = promo.brands.find(f => f.id == brandId);
        if (brand != undefined) {
          found = true;
        }
      }
      if (promo.categories.length > 0 && !found) {
        let productCategories = [];
        Object.keys(skuContext.ProductCategories).forEach(c => {
          productCategories.push(c);
        })
        let promoCategories = [];
        promo.categories.forEach(c => {
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
        let promises = [];
        promo.collections.forEach(c => {
          promises.push(new Promise<any>((resolve, reject) => {
            ctx.clients.VtexMP.getProductsByCollectionId(c.id)
              .then(res => {
                resolve(res.data)
              })
              .catch(err => {
                reject(err)
              })
          }));
        })
        let results = await resolvePromises(promises);
        let collFound = false;
        for (let i = 0; i < results.length && !collFound; i++) {
          if (results[i].Data.find(f => f.SkuId == skuId) != undefined) {
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

async function getSkuPromo(ctx: Context, skuPromos: Object[], skuContext: Object, price: number, commertialOffer: Object, locale: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let found = false;
      let response = undefined;
      for (let i = 0; i < skuPromos.length && !found; i++) {
        if (await promoContainsSku(ctx, skuPromos[i], skuContext.Id, skuContext)) {
          let marketPrice = commertialOffer.Price;
          if (skuPromos[i].nominalDiscountValue > 0) {
            found = (price - skuPromos[i].nominalDiscountValue) == marketPrice;
          } else {
            if (skuPromos[i].percentualDiscountValue > 0) {
              let discountedPrice = (price * (100 - skuPromos[i].percentualDiscountValue) / 100) + "";
              let discInt = discountedPrice.split(".")[0];
              let discDec = discountedPrice.split(".")[1]?.substring(0, 2);
              discDec = discDec ? discDec : "00";
              let mpInt = (marketPrice + "").split(".")[0];
              let mpDec = (marketPrice + "").split(".")[1]?.substring(0, 2);
              mpDec = mpDec ? mpDec : "00";
              found = discInt == mpInt && discDec == mpDec;
            } else {
              if (skuPromos[i].maximumUnitPriceDiscount > 0) {
                found = marketPrice == skuPromos[i].maximumUnitPriceDiscount
              }
            }
          }
          if (found) {
            response = formatDate(skuPromos[i].beginDateUtc, skuPromos[i].endDateUtc, skuPromos[i].name, locale);
          } else {
            response = { name: "", beginDate: "", endDate: "" }
          }
        }
      }
      resolve(response);
    } catch (err) {
      reject(err);
    }
  })
}

function getServiceColumns(saleschannels: Object[], skuContextArray: Object[], ctx: Context): Object[] {
  let services = [];
  let ids = ctx.state.appSettings.mp.servicesIds?.split(",");
  ids = ids ? ids : [];
  ids = ids.sort((a, b) => {
    a = parseInt(a);
    b = parseInt(b);
    return a < b ? -1 : (a > b ? 1 : 0)
  });
  skuContextArray?.forEach(sku => {
    let skuServices: [] = sku.skuContext?.Services.filter(f => ids?.includes(f.ServiceTypeId + ""));
    skuServices?.forEach(s => {
      if (services?.find(f => f.id == s.Name) == undefined) {

        // manage saleschannels for service name
        if (saleschannels && saleschannels.length > 0)
          services.push({ id: s.Name, title: s.Name + ' (' + saleschannels[0].CurrencySymbol + ')', vtexId: s.ServiceTypeId + "" });
        else
          services.push({ id: s.Name, title: s.Name, vtexId: s.ServiceTypeId + "" });

      }
    })
  })
  let servicesToReturn = [];
  ids.forEach(i => {
    let s = services.find(f => f.vtexId == i);
    if (s != undefined) {
      servicesToReturn.push({
        id: s.id,
        title: s.title
      })
    }
  });
  return servicesToReturn;
}
