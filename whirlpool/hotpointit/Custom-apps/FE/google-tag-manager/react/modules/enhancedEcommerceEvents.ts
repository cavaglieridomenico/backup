import push from "./push";
import {
  //Order,
  PixelMessage,
  //ProductOrder,
  Impression,
  CartItem,
} from "../typings/events";
import { AnalyticsEcommerceProduct } from "../typings/gtm";
import { getContentGrouping } from './commonMethods'

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {

  switch (e.data.eventName) {
    //Old analytics event:
    // case "vtex:servicesPurchase":{
    //   getProductsFromOrderData(e.data.data, e.data.data.transactionProducts);

    //   const ecommerce = {
    //     purchase: {
    //       actionField: getPurchaseObjectData(e.data.data),
    //       products: e.data.data.transactionProducts.map((product: ProductOrder) =>
    //         getProductObjectData(product)
    //       ),
    //     },
    //   };

    //   // Backwards compatible event
    //   push({
    //     ecommerce,
    //     event: "pageLoaded",
    //   });

    //   return;
    // }

    //Old analytics event:
    // case "vtex:addToWishlist": {
    //   push({
    //     event: 'wishlist',
    //     eventCategory: 'Intention to Buy',
    //     eventAction: 'Add to Wishlist',
    //     eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`
    //   })
    //   return;
    // }
    // case "vtex:removeToWishlist": {
    //   push({
    //     event: 'wishlist',
    //     eventCategory: 'Intention to Buy',
    //     eventAction: 'Remove from Wishlist',
    //     eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`
    //   })
    //   return;
    // }

    case "vtex:productView": {
      const { selectedSku, productName, brand } = e.data.product;
      const { currency } = e.data;

      let price: any;
      const options = {
        method: "GET"
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
            let dim4Value =
              findDimension(data, "sellable") == "true"
                ? "Sellable Online"
                : "Not Sellable Online";
            const dimension8 = getDimension8(e.data?.product, dim4Value)

            getStringCategoryFromId(e.data.product.categoryId).then(
              (response) => {
                const pr = {
                  ecommerce: {
                    currencyCode: currency,
                    detail: {
                      actionField: {
                        list: setListProductDetail(),
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
                          dimension8,
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
              }
            );
          })
        )
        .catch((err) => console.error(err));

      return;
    }

    case "vtex:unsellableProductView": {

      const { currency } = e.data;
      const { brand, categoryId, productId, productName, productReference, items } = e.data.product;

      push({ ecommerce: null }); // Clear the previous ecomm object

      const productSpecifications = await getSpecificationFromProduct(productId)

      const price = items[0]?.sellers[0]?.commertialOffer?.Price ?? 0

      const dim5Value = costructionType(
        findDimension(productSpecifications, "constructionType")
      );

      const productCategoryObj = await getStringCategoryFromId(categoryId)

      const pr = {
        ecommerce: {
          currencyCode: currency,
          detail: {
            products: [
              {
                name: productName,
                id: productReference,
                price,
                brand,
                category: productCategoryObj?.AdWordsRemarketingCode,
                variant: findVariant(productSpecifications),
                dimension4: "Not Sellable Online",
                dimension5: dim5Value,
                dimension8: "Not Sellable Online",

              },
            ],
          },
        },
        event: "eec.productDetail",
      };

      push(pr);

      break;
    }


    case "vtex:productClick": {
      const { productName, brand, sku } = e.data.product;
      const { currency } = e.data;
      const position = e.data.position ? { position: e.data.position } : {}
      let price: any;
      const options = {
        method: "GET"
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
            let dim4Value =
              findDimension(data, "sellable") == "true"
                ? "Sellable Online"
                : "Not Sellable Online";
            getStringCategoryFromId(e.data.product.categoryId).then(
              (values) => {
                let list = getListProductClick2(
                  values.AdWordsRemarketingCode
                );
                const product = {
                  event: "eec.productClick",
                  ecommerce: {
                    currencyCode: currency,
                    click: {
                      ...list,
                      products: [
                        {
                          brand,
                          category: values.AdWordsRemarketingCode,
                          id: sku.name,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value,
                          price:
                            price !== undefined && (price == 0 || price == "0")
                              ? ""
                              : price,
                          ...position
                        },
                      ],
                    },
                  },
                };
                push(product);
              }
            );
          })
        )
        .catch((err) => console.error(err));
      return;
    }

    case "vtex:addToCart": {
      const { items } = e.data;
      const options = {
        method: "GET"
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.items[0].productId +
        "/specification";
      fetch(url, options).then((response) =>
        response.json().then((data) => {
          let dim5Value = costructionType(
            findDimension(data, "constructionType")
          );
          let dim4Value =
            findDimension(data, "sellable") == "true"
              ? "Sellable Online"
              : "Not Sellable Online";
          getCategoryFromIdProduct(items[0].productId).then((productAPI) => {
            getStringCategoryFromId(productAPI.CategoryId).then((values) => {
              push({
                ecommerce: {
                  add: {
                    products: items.map((sku: any) => ({
                      brand: sku.brand,
                      category: values.AdWordsRemarketingCode,
                      id: sku.variant,
                      name: sku.name,
                      price: `${sku.price}` == "0" ? "" : setPriceFormat(`${sku.price}`),
                      quantity: sku.quantity,
                      variant: findVariant(data),
                      dimension4: dim4Value,
                      dimension5: dim5Value,
                    })),
                  },
                  currencyCode: e.data.currency,
                },
                event: "eec.addToCart",
              });
            });
          });
        })
      );

      return;
    }

    case "vtex:removeFromCart": {
      const { items } = e.data;
      const options = {
        method: "GET"
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.items[0].productId +
        "/specification";
      fetch(url, options).then((response) =>
        response.json().then((data) => {
          let dim5Value = costructionType(
            findDimension(data, "constructionType")
          );
          let dim4Value =
            findDimension(data, "sellable") == "true"
              ? "Sellable Online"
              : "Not Sellable Online";
          getCategoryFromIdProduct(items[0].productId).then((productAPI) => {
            getStringCategoryFromId(productAPI.CategoryId).then((values) => {
              push({
                ecommerce: {
                  currencyCode: e.data.currency,
                  remove: {
                    products: items.map((sku: any) => ({
                      brand: sku.brand,
                      id: sku.variant,
                      category: values.AdWordsRemarketingCode,
                      name: sku.name,
                      price: `${sku.price}` == "0" ? "" : setPriceFormat(`${sku.price}`),
                      quantity: sku.quantity,
                      variant: findVariant(data),
                      dimension4: dim4Value,
                      dimension5: dim5Value,
                    })),
                  },
                },
                event: "eec.removeFromCart",
              });
            });
          });
        })
      );
      break;
    }

    case "vtex:cartChanged": {
      let products = e.data.items;
      pushCartState(products);
      return;
    }

    //Old analytics event:
    // case "vtex:orderPlaced": {
    //   const order = e.data;

    //   getProductsFromOrderData(e.data, e.data.transactionProducts);

    //   const ecommerce = {
    //     purchase: {
    //       actionField: getPurchaseObjectData(order),
    //       products: order.transactionProducts.map((product: ProductOrder) =>
    //         getProductObjectData(product)
    //       ),
    //     },
    //   };

    //   push({
    //     // @ts-ignore
    //     event: "orderPlaced",
    //     ...order,
    //     ecommerce,
    //   });

    //   // Backwards compatible event
    //   push({
    //     ecommerce,
    //     event: "pageLoaded",
    //   });

    //   return;
    // }

    case "vtex:productImpression": {
      const { currency, impressions, product, position } = e.data;
      let oldImpresionFormat: Record<string, any> | null = null;

      if (product != null && position != null) {
        // make it backwards compatible
        oldImpresionFormat = [
          getProductImpressionObjectData()({
            product,
            position,
          }),
        ];
      }
      if (oldImpresionFormat !== null) {
        console.log(oldImpresionFormat, "OLD");
      }
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
      break;
    }

    case "vtex:cartLoaded": {
      const { orderForm, currency } = e.data;

      push({
        event: "eec.checkout",
        ecommerce: {
          currencyCode: currency,
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
      push({ ecommerce: null });
      const { promotions } = e.data;

      push({
        event: "eec.promotionView",
        ecommerce: {
          promoView: {
            promotions: promotions,
          },
        },
      });
      break;
    }

    case "vtex:promotionClick": {
      push({ ecommerce: null });

      const { promotions } = e.data;

      push({
        event: "eec.promotionClick",
        ecommerce: {
          promoClick: {
            promotions: promotions,
          },
        },
      });
      break;
    }

    //Old analytics event:
    // case "vtex:filterManipulation": {
    //   getStringCategoryFromId(e.data.items.filterProductCategory)
    //   .then(res =>{
    //     push({
    //       event: e.data.event,
    //       filterName: e.data.items.filterName,
    //       filterProductCategory: res.AdWordsRemarketingCode,
    //       filterValue: e.data.items.filterValue,
    //     });
    //   })

    //   break;
    // }

    case "vtex:productComparison": {
      var allPromise: any[] = [];
      e.data.products.map((o: any) => {
        allPromise.push(getCategoryFromIdProduct(o.productId));
      });
      Promise.all(allPromise).then((values) => {
        const catId = getCategoryIdFromProducts(values);
        if (catId != null) {
          getStringCategoryFromId(catId).then((response) => {
            push({
              event: "productComparison",
              compareProductN: values.length,
              compareCategory: response.AdWordsRemarketingCode,
            });
          });
        } else {
          push({
            event: "productComparison",
            compareProductN: values.length,
            compareCategory: "",
          });
        }
      });
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

    case "vtex:cs_contact": {
      if (e.data && e.data.eventData[0]) {
        let eventName = e.data.event
        let eventCategory = e.data.eventData[0]?.eventCategory
        let eventAction = e.data.eventData[0]?.eventAction
        let eventValue = e.data.eventData[0]?.eventValue
        push({
          event: eventName,
          eventCategory: eventCategory,
          eventAction: eventAction,
          eventValue: eventValue
        })
      }
      break;
    }
    case "vtex:ctaClicks": {
      if (e.data && e.data.data[0]) {
        const objEvent = {
          "event": "ctaClicks",
          "eventCategory": "CTA Click",
          "eventAction": "Support",
          "eventLabel": `Call now Popup`
        }
        push(objEvent)
      }
      break;
    }

    case 'vtex:newsletterLink': {
      const urlPath = window?.location?.pathname

      push({
        "event": "cta_click",
        "eventCategory": "CTA Click",
        "eventAction": getContentGrouping(urlPath),
        "eventLabel": `newsletter_box_bottom`,

        "link_url": window?.location?.href,
        "link_text": e.data.text,
        "checkpoint": `1`,
        "area": getContentGrouping(urlPath),
        "type": e.data.text
      })

      break;
    }

    case 'vtex:newsletterSubscription': {
      const urlPath = window?.location?.pathname

      push({
        "event": "cta_click",
        "eventCategory": "CTA Click",
        "eventAction": getContentGrouping(urlPath),
        "eventLabel": `newsletter_overlay_box`,

        "link_url": window?.location?.href,
        "link_text": e.data.text,
        "checkpoint": `1`,
        "area": getContentGrouping(urlPath),
        "type": e.data.text
      })
      break;
    }

    case 'vtex:newsletterAutomaticSubscription': {
      const urlPath = window?.location?.pathname

      push({
        "event": "cta_click",
        "eventCategory": "CTA Click",
        "eventAction": getContentGrouping(urlPath),
        "eventLabel": `newsletter_automatic_popup`,

        "link_url": window?.location?.href,
        "link_text": e.data.text,
        "checkpoint": `1`,
        "area": getContentGrouping(urlPath),
        "type": e.data.text
      })
      break;
    }
    case "vtex:accountCreation": {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_clicks',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: 'account_registration',

        "link_url": window?.location?.href,
        "link_text": e.data.text,
        "checkpoint": `1`,
        "area": getContentGrouping(urlPath),
        "type": e.data.text
      })
      break
    }
    case 'vtex:availabilitySubscribe': {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: 'oos-notification',

        link_url: window?.location?.href,
        link_text: e.data.text,
        checkpoint: `1`,
        area: getContentGrouping(urlPath),
        type: e.data.type,
      })
      break
    }

    default: {
      break;
    }
  }
}
// function getListProductClick(values: any) {
//   let nameList = ""
//   let accessoriesList = ["15", "13", "11", "14", "18", "17", "12", "16", "2"]
//   let url = window.location.href
//   const productCategory = window.dataLayer.find(cat => cat.event == "pageView")["product-category"]
//   const AdWordsRemarketingCode = values.AdWordsRemarketingCode
//   if(url.endsWith("/"))
//     nameList = "homepage_impression_list"
//   else if(url.includes("elettrodomestici")){
//     values.AdWordsRemarketingCode === undefined ? nameList = "catalog_page_impression_list" : nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split("_").pop().toLowerCase()}`
//   }
//   else if(url.includes("wishlist"))
//     nameList = "wishlist_page_impression_list"
//   else if(url.endsWith("/p") && accessoriesList.includes((values.FatherCategoryId).toString()))
//     nameList = "accessories_cross_selling_impression_list"
//   else if(url.endsWith("/p") && productCategory == AdWordsRemarketingCode)
//     nameList = "product_page_up_selling_impression_list"
//     else if(url.endsWith("/p"))
//     nameList = "product_page_cross_selling_impression_list"
//   else if(url.includes("accessori"))
//     nameList = "accessories_impression_list"
//   else
//     nameList = "campaign_page_impression_list"
//   return nameList
// }

function setPriceFormat(price: string) {
  let newPrice = (parseInt(price) / 100) + ""
  if (newPrice.indexOf('.') == -1) {
    return parseInt(newPrice).toFixed(2)
  } else {
    let arrayPrice = newPrice.split('.')
    return parseInt(arrayPrice[1]) < 10 ? newPrice + '0' : newPrice
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
      price: element.price == "0" || element.price == 0 ? "" : setPriceFormat(`${element.price}`),
      quantity: element.quantity,
    };
    newProducts.push(obj);
  });
  return newProducts;
}

function findVariant(data: any) {
  const result = data.filter((o: any) => o.Name == "Colore");
  return result.length > 0 ? result[0].Value[0] : "";
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name == "Colore");
  return result.length > 0 ? result[0].values[0] : "";
}
function getStringCategoryFromId(idCategory: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
  };

  return fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then(
    (response) => {
      return response.json();
    }
  );
}
function getCategoryIdFromProducts(products: any) {
  const firstCategory = products[0].CategoryId;
  const result = products.filter((o: any) => o.CategoryId != firstCategory);
  return result.length == 0 ? firstCategory : null;
}
function getCategoryFromIdProduct(productId: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
  };

  return fetch("/_v/wrapper/api/product/" + productId + "/category", options).then(
    (response) => {
      return response.json();
    }
  );
}
// function getPurchaseObjectData(order: Order) {
//   return {
//     affiliation: order.transactionAffiliation,
//     coupon: order.coupon ? order.coupon : null,
//     id: order.orderGroup,
//     revenue: order.transactionTotal,
//     shipping: order.transactionShipping,
//     tax: order.transactionTax,
//   };
// }

// function getProductObjectData(product: ProductOrder) {
//   return {
//     brand: product.brand,
//     category: getCategoryID(product),
//     id: product.sku,
//     name: product.name,
//     price: product.price == 0 ? "" : product.price,
//     quantity: product.quantity,
//     variant: product.skuName,
//     dimension4: getDimension(product, 4),
//     dimension5: getDimension(product, 5),
//   };
// }

// function getCategoryID(product: any) {
//   const categoryId = product.properties.filter(
//     (obj: any) => obj.name.toLowerCase() === "adwordsMarketingCode"
//   );
//   return categoryId;
// }
// Transform this: "/Apparel & Accessories/Clothing/Tops/"
// To this: "Apparel & Accessories/Clothing/Tops"

function getDimension(product: any, dimension: number) {
  if (dimension === 4) {
    const result = product.properties.filter(
      (obj: any) => obj.name.toLowerCase() === "sellable"
    );
    if (result.length > 0) {
      let sellable: string;
      result[0].values[0] === true
        ? (sellable = "Not Sellable Online")
        : (sellable = "Sellable Online");
      return sellable;
    }
    return "";
  } else {
    const result = product.properties.filter(
      (obj: any) => obj.name == "constructionType"
    );
    if (result.length > 0) {
      return costructionType(result[0].values[0])
    }
    return "";
  }
}

// function getList(list: string, categories: string[], category: string) {
//   let ImpressionList = "";
//   switch (list) {
//     case "Search result":
//       if (categories.includes("/accessori/")) {
//         ImpressionList = "accessories_impression_list";
//       } else {
//         ImpressionList = "catalog_page_impression_list_" + category;
//       }
//       break;
//     default:
//       if(list !== "List of products"){
//         ImpressionList = list
//       }else{
//         if (window.location.href.indexOf("/p") !== -1) {
//           ImpressionList = "product_page_up_selling_impression_list";
//         } else {
//           ImpressionList = "campaign_page_impression_list";
//         }
//       }
//       break;
//   }
//   return ImpressionList;
// }

function getProductImpressionObjectData() {
  return ({ product, position }: Impression) =>
    product.categoryId !== undefined
      ? getStringCategoryFromId(product.categoryId).then((respone) => {
        return {
          brand: product.brand,
          category: respone.AdWordsRemarketingCode,
          id: product.sku.name,
          list: setCurrentListFromUrl(respone),
          name: product.productName,
          position,
          price:
            `${product.sku.seller!.commertialOffer.Price}` == "0"
              ? ""
              : `${product.sku.seller!.commertialOffer.Price}`,
          variant: findVariantImpression(product.properties),
          dimension4: getDimension(product, 4),
          dimension5: getDimension(product, 5),
        };
      })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
        getStringCategoryFromId(prodAPI.CategoryId).then((respone) => {
          return {
            brand: product.brand,
            category: respone.AdWordsRemarketingCode,
            id: product.sku.name,
            list: setCurrentListFromUrl(respone),
            name: product.productName,
            position,
            price:
              `${product.sku.seller!.commertialOffer.Price}` == "0"
                ? ""
                : `${product.sku.seller!.commertialOffer.Price}`,
            variant: findVariantImpression(product.properties),
            dimension4: getDimension(product, 4),
            dimension5: getDimension(product, 5),
          };
        })
      );
}

function findDimension(data: any, nameKey: string) {
  let result = data.filter((obj: any) => obj.Name == nameKey);
  return result[0].Value[0];
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
      Accept: "application/json"
    }
  };
  return fetch(
    "/_v/wrapper/api/catalog_system/products/" + productId + "/specification",
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

// function getValuefromSpecifications(specifications: any, name: string) {
//   const result = specifications.filter((s: any) => s.Name === name);
//   if (result.length === 0) {
//     return "";
//   } else {
//     return specifications.filter((s: any) => s.Name === name)[0].Value[0];
//   }
// }

// async function getProductsFromOrderData(data: any, productsFromOrder: any) {
//   var products: any[] = [];
//   await Promise.all(
//     productsFromOrder.map(async (value: any) => {
//       let values = [
//         await getSpecificationFromProduct(value.id),
//         await getStringCategoryFromId(value.categoryId),
//       ];
//       var obj = {
//         name: removeRefIdFromProductName(value.name, value.skuRefId),
//         id: value.skuRefId,
//         price:
//           value.sellingPrice == "0" || value.sellingPrice == 0
//             ? ""
//             : value.sellingPrice,
//         brand: value.brand,
//         category: values[1].AdWordsRemarketingCode,
//         variant: getValuefromSpecifications(values[0], "Colore"),
//         quantity: value.quantity,
//         dimension4: costructionType(
//           findDimension(values[0], "constructionType")
//         ),
//         dimension5:
//           getValuefromSpecifications(values[0], "sellable") === "true"
//             ? "Sellable Online"
//             : "Not Sellable Online",
//       };
//       products.push(obj);
//     })
//   );
//   if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
//     push({
//       event: "eec.purchase",
//       ecommerce: {
//         currencyCode: data.currency,
//         purchase: {
//           actionField: {
//             id: data.transactionId,
//             affiliation: data.transactionAffiliation,
//             revenue: data.transactionTotal,
//             tax: data.transactionTax,
//             shipping: data.transactionShipping,
//             coupon: data.coupon !== undefined ? data.coupon : "",
//           },
//           products,
//         },
//       },
//     });
//   }
// }

// function isPushedPurchase(dataLayer: any, transactionId: string) {
//   return (
//     dataLayer.filter(
//       (e: any) =>
//         e.event === "eec.purchase" &&
//         e.ecommerce.purchase.actionField.id === transactionId
//     ).length > 0
//   );
// }

// function removeRefIdFromProductName(name:string,refId:string){
//   if(name.indexOf(' '+refId) !== -1){
//     return name.replace(' '+refId,'')
//   }else if(name.indexOf(refId) !== -1){
//     return name.replace(refId,'')
//   }else{
//     return name
//   }
// }

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
  };
}

function getListProductClick2(category: string) {
  const locationArray = window.dataLayer.filter(item => item.event == "pageView")
  const location = locationArray[(locationArray.length) - 1].page
  const productCategory = locationArray[(locationArray.length) - 1]["product-category"]
  var listName = "";

    if(location?.split('?')[0] == '/') {
      listName = "homepage_impression_list"; //homepage
    }
    else if(location?.includes("elettrodomestici")){
      listName = "catalog_page_impression_list_" + category.split('_')[category.split('_').length-1]; //plp
    }
    else if (location?.includes("wishlist")) {
      listName = "wishlist_page_impression_list";
    }
    else if(location?.endsWith("/p") && productCategory == category){
      listName = "product_page_up_selling_impression_list"
    }
    else if(location?.endsWith("/p")){
      listName = "product_page_cross_selling_impression_list"
    }
    else if (location?.includes("accessori")) {
      listName = "accessories_impression_list";
    }
    else {
      listName = "campaign_page_impression_list";
    }
  return { actionField: { list: listName.toLowerCase() } };
}

function setListProductDetail() {
  const categoryArray = window.dataLayer.filter(item => item.event == "eec.productClick")
  let list = ''
  if (categoryArray.length <= 0) {
    list = "product_page_up_selling_impression_list"
  }
  list = categoryArray[(categoryArray.length) - 1]?.ecommerce?.click?.actionField?.list?.toLowerCase() ?? ""

  return list;
}

function setCurrentListFromUrl(values: any) {
  let nameList = ""
  let accessoriesList = ["15", "13", "11", "14", "18", "17", "12", "16", "2"]
  let url = window.location.pathname
  const productCategory = window.dataLayer.find(cat => cat.event == "pageView")["product-category"]
  const AdWordsRemarketingCode = values.AdWordsRemarketingCode
  if (url == "/") {
    nameList = "homepage_impression_list"
  }
  else if (url.includes("elettrodomestici")) {
    values.AdWordsRemarketingCode === undefined ? nameList = "catalog_page_impression_list" : nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split("_").pop().toLowerCase()}`
  }
  else if (url.includes("wishlist"))
    nameList = "wishlist_page_impression_list"
  else if (url.endsWith("/p") && accessoriesList.includes((values.FatherCategoryId).toString()))
    nameList = "accessories_cross_selling_impression_list"
  else if (url.endsWith("/p") && productCategory == AdWordsRemarketingCode)
    nameList = "product_page_up_selling_impression_list"
  else if (url.endsWith("/p"))
    nameList = "product_page_cross_selling_impression_list"
  else if (url.includes("accessori"))
    nameList = "accessories_impression_list"
  else
    nameList = "campaign_page_impression_list"
  return nameList
}

function getDimension8(productData: any, dim4: string) {
  if (dim4 === "Not Sellable Online") {
    return dim4;
  }
  let availableQuantity = productData?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity
  return availableQuantity > 0 ? "In Stock" : "Out of Stock"
}
