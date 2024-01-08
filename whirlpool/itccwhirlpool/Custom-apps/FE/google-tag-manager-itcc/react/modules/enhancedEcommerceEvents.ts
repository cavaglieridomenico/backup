import push from "./push";
import { getMacroCategory, getPageType } from "./extraEvents"
import {
  Order,
  PixelMessage,
  ProductOrder,
  Impression,
  CartItem,
} from "../typings/events";
import {
  getVipCompany
} from '../utils/utilityFunctionPageView'
import { AnalyticsEcommerceProduct } from "../typings/gtm";
import { getProductCategoryForList } from "../utils/generic";

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    // case "vtex:productImageClick":{
    //   push({
    //     event: e.data.event,
    //     ...e.data.data
    //   })
    //   return
    // }
    case "vtex:servicesPurchase": {
      getProductsFromOrderData(e.data.data, e.data.data.transactionProducts);

      const ecommerce = {
        purchase: {
          actionField: getPurchaseObjectData(e.data.data),
          products: e.data.data.transactionProducts.map((product: ProductOrder) =>
            getProductObjectData(product)
          ),
        },
      };

      // Backwards compatible event
      push({
        ecommerce,
        event: "pageLoaded",
      });

      return;
    }

    case "vtex:productRegistration": {
      push({
        'event': 'productRegistration'
      })
      return
    }

    // case "vtex:addToWishlist": {
    //   let category = await getStringCategoryFromId(
    //     e.data.items.product.categoryId
    //   );

    //   push({
    //     event: "add_to_wishlist",
    //     ecommerce: {
    //       items: [
    //         {
    //           item_name: e.data.items.product.productName,
    //           item_id: e.data.items.product.items[0].name,
    //           price:
    //             e.data.items.product.items[0].sellers[0].commertialOffer.Price.toString(),
    //           item_brand: e.data.items.product.brand,
    //           item_category: category.AdWordsRemarketingCode,
    //           item_category2: "",
    //           item_category3: "",
    //           item_category4: "",
    //           item_variant:
    //             e.data.items.product.items[0].variations.length == 0
    //               ? ""
    //               : e.data.items.product.items[0].variations[0].values[0],
    //           quantity: 1,
    //         },
    //       ],
    //     },
    //   });
    //   return;
    // }

    case "vtex:removeToWishlist": {
      let category = await getStringCategoryFromId(
        e.data.items.product.categoryId
      );

      push({
        event: "remove_from_wishlist",
        ecommerce: {
          items: [
            {
              item_name: e.data.items.product.productName,
              item_id: e.data.items.product.items[0].name,
              price:
                e.data.items.product.items[0].sellers[0].commertialOffer.Price.toString(),
              item_brand: e.data.items.product.brand,
              item_category: category.AdWordsRemarketingCode,
              item_category2: "",
              item_category3: "",
              item_category4: "",
              item_variant:
                e.data.items.product.items[0].variations.length == 0
                  ? ""
                  : e.data.items.product.items[0].variations[0].values[0],
              quantity: 1,
            },
          ],
        },
      });
      return;
    }

    case "vtex:productView": {
      const { selectedSku, productName, brand } = e.data.product;
      const commercialOffer = selectedSku.sellers[0].commertialOffer;
      const currencyCode = e.data.currency;
      push({
        'event': 'contentIndex',
        'contentIndex': document.getElementsByClassName("frccwhirlpool-video-player-thron-pdp-0-x-thumbImg--productPage").length
      })

      let price: any;
      const options = {
        method: "GET",
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.product.productId +
        "/specification";
      fetch(url, options)
        .then((response) =>
          response.json().then((data) => {
            try {
              price = e.data.product.items[0].sellers[0].commertialOffer.Price;
            } catch {
              price = undefined;
            }
            let dim5Value = costructionType(
              findDimension(data, "constructionType")
            );
            let dim4Value = getDimension({ properties: data }, 4)
            getStringCategoryFromId(e.data.product.categoryId).then(
              (response) => {
                setTimeout(() => {
                  const list: string = getListProductClickAndDetail(selectedSku?.name, response?.AdWordsRemarketingCode)
                  const pr = {
                    ecommerce: {
                      currencyCode,
                      detail: {
                        actionField: {
                          list,
                        },
                        products: [
                          {
                            brand,
                            category: response.AdWordsRemarketingCode,
                            id: selectedSku.name,
                            name: productName,
                            variant: findVariant(data),
                            dimension4: dim4Value,
                            dimension5: dim5Value,
                            dimension6: commercialOffer.ListPrice === commercialOffer.price ? "Not in promo" : "In promo",
                            dimension8: commercialOffer.AvailableQuantity > 0 ? "In stock" : "Out of stock",
                            price:
                              price !== undefined && (price == 0 || price == "0")
                                ? ""
                                : price,
                          },
                        ],
                      },
                    },
                    event: "eec.productDetail",
                  };
                  push(pr);
                }, 2000);
              }
            );
          })
        )
        .catch((err) => console.error(err));

      return;
    }

    case "vtex:productClick": {
      const { productName, brand, sku } = e.data.product;
      const commercialOffer = sku.sellers[0].commertialOffer;
      const currencyCode = e.data.currency;

      const position = e.data.position ? { position: e.data.position } : {};
      let price: any;
      const options = {
        method: "GET",
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.product.productId +
        "/specification";
      fetch(url, options)
        .then((response) =>
          response.json().then((data) => {
            try {
              price = e.data.product.items[0].sellers[0].commertialOffer.Price;
            } catch {
              price = undefined;
            }
            let dim5Value = costructionType(
              findDimension(data, "constructionType")
            );
            let dim4Value = getDimension({ properties: data }, 4);

            getCategoryFromIdProduct(e.data.product.productId).then((value) => {
              getStringCategoryFromId(value.CategoryId).then(
                (values) => {
                  const list: string = getListProductClickAndDetail(sku?.name, values.AdWordsRemarketingCode)
                  const product = {
                    event: "eec.productClick",
                    ecommerce: {
                      currencyCode,
                      click: {
                        actionField: { list, action: "click" },
                        products: [
                          {
                            brand,
                            category: values.AdWordsRemarketingCode,
                            id: sku.name,
                            name: productName,
                            variant: findVariant(data),
                            dimension4: dim4Value,
                            dimension5: dim5Value,
                            dimension6: commercialOffer.ListPrice === commercialOffer.price ? "Not in promo" : "In promo",
                            price:
                              price !== undefined && (price == 0 || price == "0")
                                ? ""
                                : price,
                            ...position,
                          },
                        ],
                      },
                    },
                  };
                  push(product);
                }
              );
            })

          })
        )
        .catch((err) => console.error(err));
      return;
    }

    case "vtex:addToCart": {
      const { items } = e.data;
      const options = {
        method: "GET",
      };
      const url = "/_v/wrapper/api/catalog_system/products/" + e.data.items[0].productId + "/specification";
      const skuUrl = `/api/catalog_system/pub/products/variations/${items[0].productId}`
      let skuData: any = await fetch(skuUrl, options).then((response) => response.json())
      let skuItem = skuData?.skus[0];

      let data: any = await fetch(url, options).then((response) => response.json())
      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value = getDimension({ properties: data }, 4);
      let productAPI = await getCategoryFromIdProduct(items[0].productId)
      let values = await getStringCategoryFromId(productAPI.CategoryId)
      push({
        ecommerce: {
          add: {
            actionField: {
              action: "add",
            },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              category: values.AdWordsRemarketingCode,
              id: sku.variant,
              name: sku.name,
              price:
                `${sku.price}` == "0"
                  ? ""
                  : setPriceFormat(`${sku.price}`),
              quantity: sku.quantity,
              variant: findVariant(data),
              dimension4: dim4Value,
              dimension5: dim5Value,
              dimension6: skuItem.bestPrice === skuItem.listPrice ? "Not in promo" : "In promo"
            })),
          },
          currencyCode: e.data.currency,
        },
        event: "eec.addToCart",
      });

      return;
    }
    case "vtex:removeFromCart": {
      const { items } = e.data;
      const options = { method: "GET", };
      const url = "/_v/wrapper/api/catalog_system/products/" + e.data.items[0].productId + "/specification";
      const skuUrl = `/api/catalog_system/pub/products/variations/${items[0].productId}`
      let skuData: any = await fetch(skuUrl, options).then((response) => response.json())
      let skuItem = skuData?.skus[0];
      let data = await fetch(url, options).then((response) => response.json())
      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value = findDimension(data, "sellable") == "true" ? "Sellable Online" : "Not Sellable Online";
      let productAPI = await getCategoryFromIdProduct(items[0].productId)
      let values = await getStringCategoryFromId(productAPI.CategoryId)
      push({
        ecommerce: {
          currencyCode: e.data.currency,
          remove: {
            actionField: {
              action: "remove",
            },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              id: sku.variant,
              category: values.AdWordsRemarketingCode,
              name: sku.name,
              price:
                `${sku.price}` == "0"
                  ? ""
                  : setPriceFormat(`${sku.price}`),
              quantity: sku.quantity,
              variant: findVariant(data),
              dimension4: dim4Value,
              dimension5: dim5Value,
              dimension6: skuItem.bestPrice === skuItem.listPrice ? "Not in promo" : "In promo"
            })),
          },
        },
        event: "eec.removeFromCart",
      });
      break;
    }

    case "vtex:cartChanged": {
      let products = e.data.items;
      pushCartState(products);
      return;
    }

    case "vtex:orderPlaced": {
      /* const order = e.data;

       getProductsFromOrderData(e.data, e.data.transactionProducts);

       const ecommerce = {
         purchase: {
           actionField: getPurchaseObjectData(order),
           products: order.transactionProducts.map((product: ProductOrder) =>
             getProductObjectData(product)
           ),
         },
       };

       // Backwards compatible event
       push({
         ecommerce,
         event: "pageLoaded",
       });

       return;*/
    }

    case "vtex:productImpression": {

      if (window.location?.pathname?.includes('product-comparison')) return

      const { currency, impressions } = e.data;

      const parsedImpressions = (impressions || []).map(
        getProductImpressionObjectData()
      );

      Promise.all(parsedImpressions).then((values) => {
        push({
          event: "eec.impressionView",
          ecommerce: {
            currencyCode: currency,
            impressions: values,
          },
        });
      });

      return;
    }

    // const { currency, list, impressions, product, position } = e.data;
    // let oldImpresionFormat: Record<string, any> | null = null;

    // if (product != null && position != null) {
    //   // make it backwards compatible
    //   oldImpresionFormat = [
    //     getProductImpressionObjectData(list)({
    //       product,
    //       position,
    //     }),
    //   ];
    // }
    // if (oldImpresionFormat !== null) {
    //   console.log(oldImpresionFormat, "OLD");
    // }
    // const parsedImpressions = (impressions || []).map(
    //   getProductImpressionObjectData(list)
    // );
    // Promise.all(parsedImpressions).then((values) => {
    //   push({
    //     event: "eec.impressionView",
    //     ecommerce: {
    //       currencyCode: currency,
    //       impressions: values,
    //     },
    //   });
    // });
    // break;
    // }

    case "vtex:cartLoaded": {
      const { orderForm } = e.data;

      push({
        event: "eec.checkout",
        ecommerce: {
          checkout: {
            actionField: {
              step: 1,
            },
            products: orderForm.items.map(getCheckoutProductObjectData),
          },
        },
      });

      break;
    }

    case "vtex:promoView": {
      const { promotions } = e.data;

      push({
        event: "promoView",
        ecommerce: {
          promoView: {
            promotions: promotions,
          },
        },
      });
      break;
    }




    // case "vtex:filterManipulation": {
    //   let filterInteraction = '';

    //    //Si filtra sul dataLayer tutti gli eventi con nome filterManipulation
    //    const filtri =  window.dataLayer?.filter(evento => evento.event== "filterManipulation")
    //    //Se non ci sono eventi con quel nome siamo nel caso del primo filtro selezionato
    //    filtri.map(filtro =>{
    //     if(e.data.items.filterValue==filtro.filterValue && filtro.filterInteraction==="select"){
    //       filterInteraction="remove"
    //     }
    //     if(e.data.items.filterValue==filtro.filterValue && filtro.filterInteraction==="remove"){
    //       filterInteraction="select"
    //     }
    //    })
    //    if(filterInteraction == ""){
    //      filterInteraction="select"
    //    }

    //    getStringCategoryFromId(e.data.items.filterProductCategory).then(
    //      (res) => {
    //        push({
    //          event: e.data.event,
    //          'filterInteraction': filterInteraction,
    //          filterName: e.data.items.filterName.replace(":", "").toLowerCase(),
    //          filterValue: e.data.items.filterValue,
    //          filterProductCategory: res.AdWordsRemarketingCode,
    //          filterProductMacroCategory: getMacroCategory(res?.AdWordsRemarketingCode)
    //          //Verifico che la stringa non inizia o finisce con & e che non contenga &&
    //         //  'filterChainedDetails':  filterChainedDetails[0] =="&" ||  filterChainedDetails[1] =="&" || filterChainedDetails[filterChainedDetails.length-1] =="&" ? filterChainedDetails.replace("&", "") : filterChainedDetails && filterChainedDetails.replace("&&","&")
    //        });

    //      }
    //    );

    //    break;
    //   }


    case "vtex:productComparison": {
      var objsToPush: any[] = [];
      let skus: string[] = e.data.products.map((o: any) => o.skuId);
      const productsInfo = await getProductInfo(skus)
      const hasMultipleCategories = productsInfo.some((o: any) => o.categoryId != productsInfo[0].categoryId);
      const productsCodes = productsInfo.map((product: any) => product.productReference).join(", ")
      if (!hasMultipleCategories) {
        const categoryStringValue = await getStringCategoryFromId(productsInfo[0].categoryId)
        const macroCategory = getMacroCategory(categoryStringValue.AdWordsRemarketingCode)
        objsToPush.push({
          event: "productComparison",
          eventCategory: 'Product Interest',
          eventAction: 'Compare Products',
          'product-code': productsCodes,
          'product-category': categoryStringValue.AdWordsRemarketingCode,
          'product-macrocategory': macroCategory,
          productCompared: productsInfo.length,
        });
        // objsToPush.push({
        //   'event': 'compareProducts',
        //   'eventCategory': 'Product Interest',
        //   'eventAction': 'Compare Products',
        //   'eventLabel': categoryStringValue.AdWordsRemarketingCode+' - '+productsInfo.length // Dynamic + Dynamic
        //   })
      } else {
        const categoryIds = productsInfo.map((product: any) => product.categoryId)
        const uniqueCategories = [...new Set(categoryIds)]
        const categoriesDetails = await Promise.all(uniqueCategories.map((cat: any) => getStringCategoryFromId(cat)))

        const productCategory = categoriesDetails.map(cat => cat.AdWordsRemarketingCode)
        const macroCategory = productCategory.map(cat => getMacroCategory(cat))


        objsToPush.push({
          event: "productComparison",
          eventCategory: 'Product Interest',
          eventAction: 'Compare Products',
          'product-code': productsCodes,
          'product-category': productCategory.join(","),
          'product-macrocategory': macroCategory.join(","),
          productCompared: productsInfo.length,
        });
        // objsToPush.push({
        //   'event': 'compareProducts',
        //   'eventCategory': 'Product Interest', // Fixed value
        //   'eventAction': 'Compare Products', // Fixed value
        //   'eventLabel': productsInfo.length // Dynamic + Dynamic
        //   })
      }
      objsToPush.map((event: any) => push(event))
      break;
    }

    case "vtex:pageComponentInteraction": {
      if (e.data.id == "optin_granted") {
        push({
          event: e.data.id,
        });
      }
      break;
    }

    case "vtex:pdfDownload": {
      let url = e.data.url
      let pCode = e.data.productCode
      let pName = e.data.productName
      const formatUrl = (url: string) => {
        if (e.data.url.includes("www.")) {
          url = url.split("www.")[1]
        } else {
          url = e.data.url.split("://")[1]
        }
        return url.endsWith("/") ? url.slice(0, url.length - 1) : url
      }
      const destinationLink = formatUrl(e.data.url)
      const splittedUrl = e.data.url.split(".")
      const fileExtension = splittedUrl[splittedUrl.length - 1]

      push({
        'event': 'pdfDownload',
        'eventCategory': 'Support',
        'eventAction': 'Download - ' + url,
        'eventLabel': pCode + ' - ' + pName,
        'fileExtension': fileExtension
      })
      push({
        event: 'outbound',
        eventCategory: 'Outbound',
        eventAction: `Go to ${destinationLink}`,
        eventLabel: e.data.url
      })
      break;
    }

    case "vtex:outbound": {

      const formatUrl = (url: string) => {
        if (e.data.url.includes("www.")) {
          url = url.split("www.")[1]
        } else {
          url = e.data.url.split("://")[1]
        }
        return url.endsWith("/") ? url.slice(0, url.length - 1) : url
      }
      const destinationLink = formatUrl(e.data.url)

      push({
        event: 'outbound',
        eventCategory: 'Outbound',
        eventAction: `Go to ${destinationLink}`,
        eventLabel: e.data.url
      })
      break;
    }

    case "vtex:contact_click": {
      push({
        'event': 'contact_click',
        'eventCategory': 'Support',
        'eventAction': 'Contact Click',
        'eventLabel': e.data.data["eventLabel"]
      })
      break;
    }
    case "vtex:formSubmission": {
      push({
        'event': 'formSubmission',
        'eventCategory': 'Form Submission',
        'eventAction': 'Support'
      })
      break;
    }
    case "vtex:LeadGeneration": {
      push({
        'event': 'optin',
        'eventCategory': 'Lead Generation',
        'eventAction': 'Optin granted',
        'eventLabel': e.data.data
      })
      break;
    }
    case "vtex:prodDetailsTab": {
      push({
        'event': 'prodDetailsTab',
        'prodDetailsTabName': e.data.data['prodDetailsTabName'],
      })
      break;
    }
    case "vtex:errorMessage": {
      push({
        'event': "errorMessage",
        'eventCategory': "Error",
        'eventAction': "Error Message",
        'eventLabel': e.data.data,
      })
      break;
    }

    case "vtex:popupInteraction": {
      push({
        'event': "popupInteraction",
        'eventCategory': "Popup",
        'eventAction': e.data.data["eventAction"],
        'eventLabel': e.data.data["eventLabel"],
      })
      break;
    }

    default: {
      break;
    }
  }
}
// Get `list` name for eec.productClick and eec.productDetail
function getListProductClickAndDetail(productId: string, category: string) {

  const impressionViews = window.dataLayer.filter(item => item?.event == "eec.impressionView")
  let allImpViews: any[] = []
  for (let index = 0; index < impressionViews.length; index++) {
    allImpViews.push(impressionViews[index]?.ecommerce?.impressions)
  }
  const flatImpViews: any[] = allImpViews?.flat(Infinity)
  // Find `list` value based on productId from past `eec.impressionView` viewed objects
  const listFromImpView: string = flatImpViews?.find(impView => impView?.id === productId)?.list

  if (listFromImpView) {
    return listFromImpView
  }
  // In case user clicks on product card before `eec.impressionView` analytics event
  else {

    let listNameFallback = "";

    const previousPageViewEvents = window.dataLayer.filter(item => item?.event == "pageView")
    const previousUrlPath = previousPageViewEvents[(previousPageViewEvents.length) - 1]?.page
    const previousPageType = getPageType(previousUrlPath)

    const productCategory = previousPageViewEvents[(previousPageViewEvents.length) - 1]["product-category"]
    const productCategoryForList = category ? getProductCategoryForList(category) : ""

    // Handling accessories pages
    let lastPageViewDetails = getLastDetailOrCategoryPageViewDetails("productClick");
    let lastPageViewDetailsisAccessories = lastPageViewDetails.category ? lastPageViewDetails.category.includes("_AC_") || lastPageViewDetails.macroCategory == "AC" : false;
    let isProductAccessory = productCategory ? productCategory.includes("_AC_") : false;


    if (previousPageType === "home") {
      listNameFallback = "homepage_slider_products_impression_list"; //homepage
    }
    else if (previousPageType === "search") {
      listNameFallback = "search_suggestion_impression_list"
    }
    else if (previousPageType === "category" && lastPageViewDetailsisAccessories) {
      listNameFallback = "accessories_impression_list";
    }
    else if (previousPageType === "category" && !lastPageViewDetailsisAccessories) {
      category ? listNameFallback = `catalog_page_impression_list_${productCategoryForList}` : listNameFallback = "catalog_page_impression_list"
    }
    else if (previousPageType === "detail" && isProductAccessory) {
      listNameFallback = "accessories_cross_selling_impression_list"
    }
    else if (previousUrlPath.includes("account")) {
      listNameFallback = "wishlist_page_impression_list";
    }
    else if (previousPageType === "detail" && productCategory == category) {
      category ? listNameFallback = `product_page_up_selling_impression_list_${productCategoryForList}` : listNameFallback = "product_page_up_selling_impression_list"
    }
    else if (previousPageType === "detail") {
      category ? listNameFallback = `product_page_cross_selling_impression_list_${productCategoryForList}` : listNameFallback = "product_page_cross_selling_impression_list"
    }
    else {
      listNameFallback = "campaign_page_impression_list";
    }
    return listNameFallback
  }
}

function setPriceFormat(price: string) {
  let newPrice = parseInt(price) / 100 + "";
  if (newPrice.indexOf(".") == -1) {
    return parseInt(newPrice).toFixed(2);
  } else {
    let arrayPrice = newPrice.split(".");
    return parseInt(arrayPrice[1]) < 10 ? newPrice + "0" : newPrice;
  }
}

function objectHasEmptyValue(objects: any) {
  let keys = Object.keys(objects[0]);
  let flag = false;
  objects.forEach((e: any) => {
    for (let i = 0; i < keys.length; i++) {
      if (e[keys[i]] === "") {
        flag = true;
      }
    }
  });
  return flag;
}

function checkCart(dataLayer: any, products: any) {
  let results = dataLayer.filter((e: any) => e.event === "cartState");
  if (results.length == 0) {
    return false;
  } else {
    if (
      JSON.stringify(results[results.length - 1].products) ==
      JSON.stringify(products)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
function pushCartState(products: any) {
  if (products.length !== 0) {
    if (objectHasEmptyValue(products)) {
      return;
    }
  }
  let formatForProducts =
    products.length !== 0 ? getProductFromCartState(products) : [];
  if (!checkCart(window.dataLayer, formatForProducts)) {
    push({
      event: "cartState",
      products: formatForProducts,
    });
  }
}
function getProductFromCartState(products: any) {
  let newProducts: any = [];

  products.forEach((element: any) => {
    var obj = {
      id: element.referenceId,
      price:
        element.price == "0" || element.price == 0
          ? ""
          : setPriceFormat(`${element.price}`),
      quantity: element.quantity,
    };
    newProducts.push(obj);
  });
  return newProducts;
}

function findVariant(data: any) {
  const result = data.filter((o: any) => o.Name == "Couleur");
  return result.length > 0 ? result[0].Value[0] : "";
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name == "Couleur");
  return result.length > 0 ? result[0].values[0] : "";
}
function getStringCategoryFromId(idCategory: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then(
    (response) => {
      return response.json();
    }
  );
}
async function getCategoryFromIdProduct(productId: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };


  return await fetch(
    "/_v/wrapper/api/product/" + productId + "/category",
    options
  ).then((response) => {
    return response.json();
  });
}
async function getProductInfo(skus: string[]) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const queryParam = skus.map(sku => `fq=skuId:${sku}`).join("&")

  return await fetch(
    "/api/catalog_system/pub/products/search?" + queryParam,
    options
  ).then((response) => {
    return response.json();
  });
}

function getPurchaseObjectData(order: Order) {
  return {
    affiliation: order.transactionAffiliation,
    coupon: order.coupon ? order.coupon : null,
    id: order.orderGroup,
    revenue: order.transactionTotal,
    shipping: order.transactionShipping,
    tax: order.transactionTax,
  };
}

function getProductObjectData(product: ProductOrder) {
  return {
    brand: product.brand,
    //@ts-ignore
    category: product.properties ? getCategoryID(product) : product.categoryId || "additionalServices",
    id: product.sku,
    name: product.name,
    price: product.price == 0 ? "" : product.price,
    quantity: product.quantity,
    variant: product.skuName,
    //dimension4: getDimension(product, 4),
    //dimension5: getDimension(product, 5),
    dimension6: product.sellingPrice === product.originalPrice ? "Not in promo" : "In promo"
  };
}

function getCategoryID(product: any) {
  const categoryId = product.properties.filter(
    (obj: any) => obj.name.toLowerCase() === "adwordsMarketingCode"
  );
  return categoryId;
}
// Transform this: "/Apparel & Accessories/Clothing/Tops/"
// To this: "Apparel & Accessories/Clothing/Tops"

function getDimension(product: any, dimension: number) {
  let accountType = getVipCompany();
  if (dimension === 4) {
    let result;
    switch (accountType) {
      case "ff": result =
        product.properties.filter(
          (obj: any) => obj.name === "sellableFF" || obj.Name === "sellableFF"
        )
        break
      case "epp":
        result = product.properties.filter(
          (obj: any) => obj.name === "sellableEPP" || obj.Name === "sellableEPP"
        )
        break
      default: result = product.properties.filter(
        (obj: any) => obj.name === "sellableVIP" || obj.Name === "sellableVIP"
      )
    }
    if (result.length > 0) {
      let value = result[0].values ? result[0].values[0] == "true" : result[0].Value[0] == "true";

      return value ? "Sellable Online" : "Not Sellable Online";
    }
    return "";
  } else {
    const result = product.properties.filter(
      (obj: any) => obj.name == "constructionType"
    );
    if (result.length > 0) {
      return costructionType(result[0].values[0]);
    }
    return "";
  }
}

function getProductImpressionObjectData() {
  return ({ product, position }: Impression) =>

    product.categoryId !== undefined
      ? getStringCategoryFromId(product.categoryId).then((respone) => {
        const commercialOffer = product.sku.sellers[0].commertialOffer;
        const list: string = getListImpressionView(respone)
        return {
          brand: product.brand,
          category: respone.AdWordsRemarketingCode,
          id: product.sku.name,
          list,
          name: product.productName,
          position,
          price:
            `${product.sku.seller!.commertialOffer.Price}` == "0"
              ? ""
              : `${product.sku.seller!.commertialOffer.Price}`,
          variant: findVariantImpression(product.properties),
          dimension4: getDimension(product, 4),
          dimension5: getDimension(product, 5),
          dimension6: commercialOffer.ListPrice === commercialOffer.Price ? "Not in promo" : "In promo",

        };
      })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
        getStringCategoryFromId(prodAPI.CategoryId).then((respone) => {
          const commercialOffer = product.sku.sellers[0].commertialOffer;
          const list: string = getListImpressionView(respone)
          return {
            brand: product.brand,
            category: respone.AdWordsRemarketingCode,
            id: product.sku.name,
            list,
            name: product.productName,
            position,
            price:
              `${product.sku.seller!.commertialOffer.Price}` == "0"
                ? ""
                : `${product.sku.seller!.commertialOffer.Price}`,
            variant: findVariantImpression(product.properties),
            dimension4: getDimension(product, 4),
            dimension5: getDimension(product, 5),
            dimension6: commercialOffer.ListPrice === commercialOffer.Price ? "Not in promo" : "In promo",
          };
        })
      );
}

function findDimension(data: any, nameKey: string) {
  let result = data.filter((obj: any) => obj.Name == nameKey);
  return result[0] ? result[0].Value[0] : "";
}
function costructionType(cType: string) {
  if (cType.indexOf("Free ") !== -1) {
    let cTypeArray = cType.split(" ");
    return cTypeArray[0] + cTypeArray[1].toLowerCase();
  } else {
    return cType.replace(" ", "-");
  }
}
function getSpecificationFromProduct(productId: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  return fetch(
    "/_v/wrapper/api/catalog_system/products/" + productId + "/specification",
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

function getValuefromSpecifications(specifications: any, name: string) {
  const result = specifications.filter((s: any) => s.Name === name);
  if (result.length === 0) {
    return "";
  } else {
    return specifications.filter((s: any) => s.Name === name)[0].Value[0];
  }
}

async function getProductsFromOrderData(data: any, transactionProducts: any) {
  const productsFromOrder: any = [];
  const addServiceFromOrder: any = [];
  transactionProducts.map((product: any) => {
    product.type === 'additionalService' ? addServiceFromOrder.push(product) : productsFromOrder.push(product);
  })
  var products: any[] = [];
  addServiceFromOrder.map((service: any) => {
    var serviceTemp = {
      name: service.name,
      quantity: service.quantity,
      id: service.id,
      price: service.price == 0 || service.price == "0" ? "" : (service.price / 100),
      category: 'additionalServices'
    }
    products.push(serviceTemp)
  })

  await Promise.all(
    productsFromOrder.map(async (value: any) => {
      let values = [
        await getSpecificationFromProduct(value.id),
        await getStringCategoryFromId(value.categoryId),
      ];
      var obj = {
        name: removeRefIdFromProductName(value.name, value.skuRefId),
        id: value.skuRefId,
        price:
          value.sellingPrice == "0" || value.sellingPrice == 0
            ? ""
            : value.sellingPrice,
        brand: value.brand,
        category: values[1].AdWordsRemarketingCode,
        variant: getValuefromSpecifications(values[0], "Colore"),
        quantity: value.quantity,
        dimension4:
          getValuefromSpecifications(values[0], "sellable") === "true"
            ? "Sellable Online"
            : "Not Sellable Online",
        dimension5: costructionType(
          findDimension(values[0], "constructionType")
        ),
        dimension6: value.originalPrice && value.originalPrice > value.price ? "In promo" : "Not in promo"
      };
      products.push(obj);
    })
  );
  if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
    window.dataLayer.push({ ecommerce: null })
    push({
      event: "eec.purchase",
      ecommerce: {
        currencyCode: data.transactionCurrency,
        purchase: {
          actionField: {
            id: data.transactionId,
            affiliation: data.transactionAffiliation,
            revenue: data.transactionTotal,
            tax: data.transactionTax,
            shipping: data.transactionShipping,
            coupon: data.coupon !== undefined ? data.coupon : "",
          },
          products,
        },
      },
    });
  }



}



function isPushedPurchase(dataLayer: any, transactionId: string) {
  return (
    dataLayer.filter(
      (e: any) =>
        e.event === "eec.purchase" &&
        e.ecommerce.purchase.actionField.id === transactionId
    ).length > 0
  );
}

function removeRefIdFromProductName(name: string, refId: string) {
  if (name.indexOf(" " + refId) !== -1) {
    return name.replace(" " + refId, "");
  } else if (name.indexOf(refId) !== -1) {
    return name.replace(refId, "");
  } else {
    return name;
  }
}

function getCheckoutProductObjectData(
  item: CartItem
): AnalyticsEcommerceProduct {
  return {
    id: item.id,
    name: item.name,
    category: Object.keys(item.productCategories ?? {}).reduce(
      (categories, category) =>
        categories ? `${categories}/${category}` : category,
      ""
    ),
    brand: item.additionalInfo?.brandName ?? "",
    variant: item.skuName,
    price: item.sellingPrice / 100,
    quantity: item.quantity,
  }
}

// Get `list` name for eec.impressionView
function getListImpressionView(values: any) {
  let nameList = ""
  let url = window.location.pathname + window.location.search
  let hash = window.location.hash

  const pageType: string = getPageType(url)
  /// Raw product-category from from API call
  const adWordsRemarketingCode = values?.AdWordsRemarketingCode
  const productCategory = window?.dataLayer?.find(cat => cat?.event == "pageView")["product-category"] || ""
  const productCategoryForList = adWordsRemarketingCode ? getProductCategoryForList(adWordsRemarketingCode) : ""

  // Accessories related variables
  const isProductAccessory: boolean = productCategory && productCategory.includes("_AC_")
  const isAccessoriesPage: boolean = url?.includes("accessoires")

  // To handle filtered search page for `search_suggestion_impression_list`
  const previousPageViewEvents = window.dataLayer.filter(item => item?.event == "pageView")
  const previousUrlPath = previousPageViewEvents[(previousPageViewEvents.length) - 1].page
  const previousPageType = getPageType(previousUrlPath)

  if (pageType === "home") {
    nameList = "homepage_slider_products_impression_list"
  }
  else if (pageType === "search" || previousPageType === "search") {
    nameList = "search_suggestion_impression_list";
  }
  else if (hash.includes("wishlist")) {
    nameList = "wishlist_page_impression_list"
  }
  else if (pageType === "category" && isAccessoriesPage) {
    nameList = "accessories_impression_list";
  }
  else if (pageType === "category" && !isAccessoriesPage) { // PLP
    adWordsRemarketingCode ? nameList = `catalog_page_impression_list_${productCategoryForList}` : nameList = "catalog_page_impression_list"
  }
  else if (pageType === "detail" && isProductAccessory) {
    nameList = "accessories_cross_selling_impression_list"
  }
  else if (pageType === "detail" && productCategory === adWordsRemarketingCode) {
    nameList = "product_page_up_selling_impression_list";
  }
  else if (pageType === "detail" && productCategory !== adWordsRemarketingCode) {
    nameList = "product_page_cross_selling_impression_list";
  }
  else {
    nameList = "campaign_page_impression_list"
  }
  return nameList
}

function getLastDetailOrCategoryPageViewDetails(eventType: string) {
  let pageViews = window.dataLayer.filter(cat => cat.event == "pageView" && (cat.pageType == "category" || cat.pageType == "detail" || cat.pageType == "home"))
  if (eventType === "productDetail") {
    pageViews.pop();
  }
  let lastEventDetails = {
    category: pageViews[pageViews.length - 1] ? pageViews[pageViews.length - 1]["product-category"] : "",
    macroCategory: pageViews[pageViews.length - 1] ? pageViews[pageViews.length - 1]["product-macrocategory"] : "",
    type: pageViews[pageViews.length - 1] ? pageViews[pageViews.length - 1]["pageType"] : "",
  };
  return lastEventDetails;
}
