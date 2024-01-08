//@ts-nocheck
import push from "./push";
import {
  Order,
  PixelMessage,
  ProductOrder,
  Impression,
  CartItem,
} from "../typings/events";
import { AnalyticsEcommerceProduct } from "../typings/gtm";

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case "vtex:promoView":{
      let promotions = e.data.promotions
      push({
        'event': 'eec.promotionView',
        'ecommerce': {
          'promoView': {
            promotions
          }
        }
      })
      return
    }
    case "vtex:promotionClick":{
      let promotions = e.data.promotions
      push({
        'event': 'eec.promotionClick',
        'ecommerce':{
          'promoClick':{
            promotions
          }
        }
      })
      return
    }
    case "vtex:addToWishlist": {
      let category = await getStringCategoryFromId(
        e.data.items.product.categoryId
      );

      push({
        event: "add_to_wishlist",
        ecommerce: {
          items: [
            {
              item_name: e.data.items.product.productName,
              item_id: e.data.items.product.items[0].name,
              price:
                e.data.items.product.items[0].sellers[0].commertialOffer.Price.toString(),
              item_brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
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
              item_brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
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
      const { selectedSku, productName } = e.data.product;

      let price: any;
      const options = {
        method: "GET",
      };
      const url =
        "/v1/productSpecification/" +
        e.data.product.productId 
      fetch(url, options)
        .then((response) =>
          response.json().then((data) => {
            try {
              price = e.data.product.items[0].sellers[0].commertialOffer.Price;
            } catch {
              price = undefined;
            }
            let dim5Value = ""
            let dim4Value = getDimension( {properties: [...data]}, 4)
            getStringCategoryFromId(e.data.product.categoryId).then(
              (response) => {
                const pr = {
                  ecommerce: {
                    currencyCode: e.data.currency,
                    detail: {
                      actionField: {'list': 'catalog_page_impression_list'}, 
                      products: [
                        {
                          brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
                          category: e.data.product.categories[0].split("/")[4],
                          id: selectedSku.itemId,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
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
                push({ ecommerce: null })
                push(pr);
              }
            );
          })
        )
        .catch((err) => console.error(err));

      return;
    }

    case "vtex:productClick": {
      const { productName, sku } = e.data.product;
      const position = e.data.position ? { position: e.data.position } : {};
      let price: any;
      const options = {
        method: "GET",
      };
      const url =
        "/v1/productSpecification/" +
        e.data.product.productId 
      fetch(url, options)
        .then((response) =>
          response.json().then((data) => {
            try {
              price = e.data.product.items[0].sellers[0].commertialOffer.Price;
            } catch {
              price = undefined;
            }
            let dim5Value = ""
            let dim4Value = getDimension( e.data.product, 4)
            getStringCategoryFromId(e.data.product.categoryId).then(
              (values) => {
                let list = getListProductClick(
                  values.AdWordsRemarketingCode
                );
                const product = {
                  event: "eec.productClick",
                  ecommerce: {
                    currencyCode: e.data.currency,
                    click: {
                      ...list,
                      products: [
                        {
                          brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
                          category: e.data.list,
                          id: sku.itemId,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          position: e.data.position,
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
                push({ ecommerce: null })
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
        method: "GET",
      };
      const url = "/v1/productSpecification/" + e.data.items[0].productId;
      let data : any = await fetch(url, options).then((response) => response.json());
      let dim5Value = ""/*costructionType(findDimension(data, "constructionType"));*/
      let dim4Value = findDimension(data, "status") == "in stock" ? "Sellable Online" : "Not Sellable Online";
      let productAPI = "TO DO"/*await getCategoryFromIdProduct(items[0].productId)*/
      let values = "TO DO"/*await getStringCategoryFromId(productAPI.CategoryId)*/
              push({
                ecommerce: {
                  add: {
                    actionField: {'list': 'catalog_page_impression_list'}, 
                    products: items.map((sku: any) => ({
                      brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
                      category: sku.category.split("/")[3],
                      id: sku.productId,
                      name: sku.name,
                      price:
                        `${sku.price}` == "0"
                          ? ""
                          : setPriceFormat(`${sku.price}`),
                      quantity: sku.quantity,
                      variant: ""/*findVariant(data)*/,
                      dimension4: dim4Value,
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
      const options = {
        method: "GET",
      };
      const url = "/v1/productSpecification/" + e.data.items[0].productId;
      let data : any = await fetch(url, options).then((response) => response.json());
      let dim5Value = ""/*costructionType(findDimension(data, "constructionType"));*/
      let dim4Value = findDimension(data, "status") == "in stock" ? "Sellable Online" : "Not Sellable Online";
      let productAPI = "TO DO"/*await getCategoryFromIdProduct(items[0].productId)*/
      let values = "TO DO"/*await getStringCategoryFromId(productAPI.CategoryId)*/
              push({
                ecommerce: {
                  remove: {
                    products: items.map((sku: any) => ({
                      brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
                      category: sku.category.split("/")[3],
                      id: sku.productId,
                      name: sku.name,
                      price:
                        `${sku.price}` == "0"
                          ? ""
                          : setPriceFormat(`${sku.price}`),
                      quantity: sku.quantity,
                      variant: ""/*findVariant(data)*/,
                      dimension4: dim4Value,
                    })),
                  },
                  currencyCode: e.data.currency,
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

    //Duplicate event:
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

    //   // Backwards compatible event
    //   push({
    //     ecommerce,
    //     event: "pageLoaded",
    //   });

    //   return;
    // }

    case "vtex:productImpression": {
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

    case "vtex:promotionClick": {
      const { promotions } = e.data;

      push({
        event: "promotionClick",
        ecommerce: {
          promoClick: {
            promotions: promotions,
          },
        },
      });
      break;
    }

    case "vtex:filterManipulation": {
      getStringCategoryFromId(e.data.items.filterProductCategory).then(
        (res) => {
          push({
            event: e.data.event,
            filterName: e.data.items.filterName,
            filterProductCategory: res.AdWordsRemarketingCode,
            filterValue: e.data.items.filterValue,
          });
        }
      );

      break;
    }

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

    default: {
      break;
    }
  }
}
function getListProductClick(category: string) {
  const locationArray = window.dataLayer.filter(item => item.event == "pageView")
  const location = locationArray[(locationArray.length) -1].page
  const productCategory = locationArray[(locationArray.length) -1]["product-category"]
  var listName = "";

    if(location.split('?')[0] == '/') {
      listName = "homepage_impression_list"; //homepage
    }
    else if(location.includes("prodotti")){
      listName = "catalog_page_impression_list_" + category.split('_')[category.split('_').length-1]; //plp
    }
    else if (location.includes("account")) {
      listName = "catalog_page_impression_list";
    }
    else if(location.endsWith("/p") && productCategory == category){
      listName = "catalog_page_impression_list"
    }
    else if(location.endsWith("/p")){
      listName = "catalog_page_impression_list"
    }
    else if (location.includes("accessori")) {
      listName = "catalog_page_impression_list";
    }
    else {
      listName = "catalog_page_impression_list";
    }
  return { actionField: { list: listName.toLowerCase() } };
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
      Accept: "application/json",
    },
  };

  return fetch("/v1/category/" + idCategory, options).then(
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
    brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
    category: getCategoryID(product),
    id: product.sku,
    name: product.name,
    price: product.price == 0 ? "" : product.price,
    quantity: product.quantity,
    variant: product.skuName,
    dimension4: getDimension(product, 4),
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
  if (dimension === 4) {
    const result = product.properties.filter(
      (obj: any) => obj["name"] ? obj["name"].toLowerCase() === "status" : obj["Name"].toLowerCase() === "status"
    );
    if (result.length > 0) {
      let sellable: string;
      try {
        result[0].values[0] !== "in stock"
        ? (sellable = "Not Sellable Online")
        : (sellable = "Sellable Online");
      return sellable;
      } catch (error) {
        result[0].Value[0] !== "in stock"
        ? (sellable = "Not Sellable Online")
        : (sellable = "Sellable Online");
      return sellable;
      }
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


function setCurrentListFromUrl(values:any){
  let nameList = ""
  let accessoriesList = ["39", "33", "32", "37", "34", "35", "36", "42", "41", "40", "30", "31", "29", "38","15"]
  let url = window.location.pathname
  let hash = window.location.hash
  const productCategory = window.dataLayer.find(cat => cat.event == "pageView")["product-category"]
  const AdWordsRemarketingCode = values.AdWordsRemarketingCode

  if(url == "/"){
    nameList = "homepage_impression_list"
  }
  else if(url.includes("spare-parts")){
    !values.AdWordsRemarketingCode  ? nameList = "catalog_page_impression_list" : nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split("_").pop().toLowerCase()}`
  }
  else if(hash.includes("wishlist"))
    nameList = "catalog_page_impression_list"
  else if(url.endsWith("/p") && accessoriesList.includes((values.FatherCategoryId).toString()))
    nameList = "catalog_page_impression_list"
  else if(url.endsWith("/p") && productCategory == AdWordsRemarketingCode)
    nameList = "catalog_page_impression_list"
    else if(url.endsWith("/p"))
    nameList = "catalog_page_impression_list"
  else if(url.includes("accessori"))
    nameList = "catalog_page_impression_list"
  else
    nameList = "catalog_page_impression_list"
  return nameList
}

function getProductImpressionObjectData() {
  return ({ product, position }: Impression) =>
    product.categoryId !== undefined
      ? getStringCategoryFromId(product.categoryId).then((respone) => {
          return {
            brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
            category: respone.Description,
            id: product.sku.itemId,
            list: setCurrentListFromUrl(respone),
            name: product.productName,
            position,
            price:
              `${product.sku.seller!.commertialOffer.Price}` == "0"
                ? ""
                : `${product.sku.seller!.commertialOffer.Price}`,
            variant: findVariantImpression(product.properties),
            dimension4: getDimension(product, 4),
          };
        })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
          getStringCategoryFromId(prodAPI.CategoryId).then((respone) => {
            return {
              brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
              category: respone.AdWordsRemarketingCode,
              id: product.sku.itemId,
              list:setCurrentListFromUrl(respone),
              name: product.productName,
              position,
              price:
                `${product.sku.seller!.commertialOffer.Price}` == "0"
                  ? ""
                  : `${product.sku.seller!.commertialOffer.Price}`,
              variant: findVariantImpression(product.properties),
              dimension4: getDimension(product, 4),
            };
          })
        );
}

function findDimension(data: any, nameKey: string) {
  let result = data.filter((obj: any) => obj.Name == nameKey);
  return result[0] ?  result[0].Value[0] : "";
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
    "/v1/productSpecification/" + productId,
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
//         id: value.id,
//         price:
//           value.sellingPrice == "0" || value.sellingPrice == 0
//             ? ""
//             : value.sellingPrice,
//         brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
//         category: value.category,
//         variant: "",
//         quantity: value.quantity,
//         dimension4: getValuefromSpecifications(values[0], "status") === "in stock"
//         ? "Sellable Online"
//         : "Not Sellable Online"
         
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
    brand: document.location.href.includes("hotpoint") ? "Hotpoint" : "Indesit",
    variant: item.skuName,
    price: item.sellingPrice / 100,
    quantity: item.quantity,
  };
}
