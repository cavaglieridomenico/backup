import push from "./push";
import {
  Order,
  PixelMessage,
  ProductOrder,
  Impression,
  CartItem,
} from "../typings/events";
import { AnalyticsEcommerceProduct } from "../typings/gtm";
interface WindowRuntime extends Window  {
  __RUNTIME__:any
}
function getCookie(cname: string) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case "vtex:productView": {
      const { selectedSku, productName, brand } = e.data.product;

      let price: any;
      const options = {
        method: "GET",
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.product.productId +
        "/specification";
      let response = await fetch(url, options);
      let data = await response.json();
      try {
        price = e.data.product.items[0].sellers[0].commertialOffer.Price;
      } catch {
        price = undefined;
      }
      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value =
        (await findSellable(data)) == "true"
          ? "Sellable Online"
          : "Not Sellable Online";
      let cat = await getStringCategoryFromId(e.data.product.categoryId);
      // let list = getListProductClick(e.data, cat.AdWordsRemarketingCode) ?? {}
      const pr = {
        event: "eec.productDetail",
        ecommerce: {
          currencyCode: e.data.currency,
          detail: {
            // actionField: list.actionField,
            products: [
              {
                brand,
                category: cat.AdWordsRemarketingCode,
                id: selectedSku.name,
                name: productName,
                variant: findVariant(data),
                dimension4: dim4Value,
                dimension5: dim5Value,
                price:
                  price !== undefined && (price == 0 || price == "0")
                    ? ""
                    : price,
              },
            ],
          },
        },
      };
      push(pr);

      return;
    }

    case "vtex:productClick": {
      const { productName, brand, sku } = e.data.product;
      let price: any;
      const options = {
        method: "GET",
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.product.productId +
        "/specification";
      let response = await fetch(url, options);
      let data = await response.json();

      try {
        price = e.data.product.items[0].sellers[0].commertialOffer.Price;
      } catch {
        price = undefined;
      }
      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value =
        (await findSellable(data)) == "true"
          ? "Sellable Online"
          : "Not Sellable Online";
      let values = await getStringCategoryFromId(e.data.product.categoryId);
      let list = getListProductClick(e.data, values.AdWordsRemarketingCode) ?? {}
      const product = {
        event: "eec.productClick",
        ecommerce: {
          currencyCode: e.data.currency,
          click: {
            actionField: list.actionField,
            products: [
              {
                brand,
                category: values.AdWordsRemarketingCode,
                id: sku.name,
                name: productName,
                variant: findVariant(data),
                position: e.data.position ? e.data.position : 'Unknown position',
                dimension4: dim4Value,
                dimension5: dim5Value,
                price:
                  price !== undefined && (price == 0 || price == "0")
                    ? ""
                    : price,
              },
            ],
          },
        },
      };
      push(product);

      return;
    }

    case "vtex:addToCart": {
      const { items } = e.data;
      const options = {
        method: "GET",
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.items[0].productId +
        "/specification";
      let response = await fetch(url, options);
      let data = await response.json();

      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value =
        (await findSellable(data)) == "true"
          ? "Sellable Online"
          : "Not Sellable Online";
      let productAPI = await getCategoryFromIdProduct(items[0].productId);
      let values = await getStringCategoryFromId(productAPI.CategoryId);

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
                `${sku.price}` == "0" ? "" : setPriceFormat(`${sku.price}`),
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

      return;
    }

    case "vtex:removeFromCart": {
      const { items } = e.data;
      const options = {
        method: "GET",
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" +
        e.data.items[0].productId +
        "/specification";
      let response = await fetch(url, options);
      let data = await response.json();

      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value =
        (await findSellable(data)) == "true"
          ? "Sellable Online"
          : "Not Sellable Online";
      let productAPI = await getCategoryFromIdProduct(items[0].productId);
      let values = await getStringCategoryFromId(productAPI.CategoryId);
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
                `${sku.price}` == "0" ? "" : setPriceFormat(`${sku.price}`),
              quantity: sku.quantity,
              variant: findVariant(data),
              dimension4: dim4Value,
              dimension5: dim5Value,
            })),
          },
        },
        event: "eec.remove",
      });
      break;
    }

    case "vtex:cartChanged": {
      let products = e.data.items;
      pushCartState(products);
      return;
    }

    case "vtex:orderPlaced": {
      const order = e.data;

      getProductsFromOrderData(e.data, e.data.transactionProducts);

      const ecommerce = {
        purchase: {
          actionField: getPurchaseObjectData(order),
          products: order.transactionProducts.map((product: ProductOrder) =>
            getProductObjectData(product)
          ),
        },
      };

      push({
        // @ts-ignore
        event: "orderPlaced",
        ...order,
        ecommerce,
      });

      // Backwards compatible event
      push({
        ecommerce,
        event: "pageLoaded",
      });

      return;
    }

    case "vtex:productImpression": {
      const { currency, list, impressions, product, position } = e.data;
      let oldImpresionFormat: Record<string, any> | null = null;

      if (product != null && position != null) {
        // make it backwards compatible
        oldImpresionFormat = [
          getProductImpressionObjectData(list)({
            product,
            position,
          }),
        ];
      }
      if (oldImpresionFormat !== null) {
        console.log(oldImpresionFormat, "OLD");
      }
      const parsedImpressions = (impressions || []).map(
        getProductImpressionObjectData(list)
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

    // case "vtex:filterManipulation": {
    //   getStringCategoryFromId(e.data.items.filterProductCategory).then((response) => {
    //     push({
    //       event: e.data.event,
    //       filterName: e.data.items.filterName,
    //       filterValue: e.data.items.filterValue,
    //       filterProductCategory: response.AdWordsRemarketingCode,
    //       filterInteraction: e.data.items.filterInteraction
    //     });
    //   });
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

    default: {
      break;
    }
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
  const result = data.filter((o: any) => o.Name === "Colour:");
  return result.length > 0 ? result[0].Value[0] : "";
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name === "Colour");
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
      Accept: "application/json",
    },
  };

  return fetch(
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
    brand: product.brand,
    category: getCategoryID(product),
    id: product.sku,
    name: product.name,
    price: product.price == 0 ? "" : product.price,
    quantity: product.quantity,
    variant: product.skuName,
    dimension4: getDimension(product, 4),
    dimension5: getDimension(product, 5),
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
      return costructionType(result[0].values[0]);
    }
    return "";
  }
}

function getListProductClick(data: any, category: string) {
  var listName = "";
  if (data.list !== undefined) {
    listName = "catalog_page_impression_list"
  } else if (data.map !== undefined) {
    if (data.query.split("/").includes("accessori")) {
      listName = "accessories_impression_list";
    } else {
      listName = "catalog_page_impression_list_" + category;
    }
  } else {
    listName = "product_page_up_selling_impression_list";
  }
  return  { actionField: { list: listName } };
}

function getList(list: string, categories: string[], category: string) {
  let ImpressionList = "";
  switch (list) {
    case "Search result":
      if (categories.includes("/accessori/")) {
        ImpressionList = "accessories_impression_list";
      } else {
        ImpressionList = "catalog_page_impression_list_" + category;
      }
      break;
    default:
      if(list !== "List of products"){
        // ImpressionList = list
        ImpressionList = "catalog_page_impression_list";
      }else{
        if (window.location.href.indexOf("/p") !== -1) {
          ImpressionList = "product_page_up_selling_impression_list";
        } else {
          ImpressionList = "campaign_page_impression_list";
        }
      }
      break;
  }
  return ImpressionList;
}

function getProductImpressionObjectData(list: string) {
  return ({ product, position }: Impression) =>
    product.categoryId !== undefined
      ? getStringCategoryFromId(product.categoryId).then(async (respone) => {
          return {
            name: product.productName,
            id: product.sku.name,
            price: `${product.sku.seller!.commertialOffer.Price}` === "0" ? "" : `${product.sku.seller!.commertialOffer.Price}`,
            brand: product.brand,
            category: respone.AdWordsRemarketingCode,
            variant: findVariantImpression(product.properties),
            list: getList(
              list,
              product.categories,
              respone.AdWordsRemarketingCode
            ),
            position,
            dimension4:
              (await findSellable("name")) == "true"
                ? "Sellable Online"
                : "Not Sellable Online",
            dimension5: getDimension(product, 5),
          };
        })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
          getStringCategoryFromId(prodAPI.CategoryId).then(async (respone) => {
            return {
              name: product.productName,
              id: product.sku.name,
              price: `${product.sku.seller!.commertialOffer.Price}` == "0" ? "" : `${product.sku.seller!.commertialOffer.Price}`,
              brand: product.brand,
              category: respone.AdWordsRemarketingCode,
              variant: findVariantImpression(product.properties),

              list: getList(
                list,
                product.categories,
                respone.AdWordsRemarketingCode
              ),
              position,
              dimension4:
                (await findSellable("name")) == "true"
                  ? "Sellable Online"
                  : "Not Sellable Online",
              dimension5: getDimension(product, 5),
            };
          })
        );
}

// function getSellableRegion(value: any) {
//   switch (value) {
//     case "2":
//       return "A2";
//     case "3":
//       return "GE";
//     case "4":
//       return "ANE";
//     default:
//       return "A1";
//   }
// }

// async function findSellable(data: any, name: string = "Name") {
async function findSellable(name: string = "Name") {
  let runtime = (window as unknown as WindowRuntime).__RUNTIME__
  // @ts-ignore
  let channel = ''
  if(JSON.parse(atob(runtime.segmentToken)).channel === null){
  let response = await fetch("/api/sessions/?items=*", { method: "GET" });
  let session = await response.json();
  channel = session.namespaces.store.channel.value
  } else {
    channel = JSON.parse(atob(runtime.segmentToken)).channel
  }
  // let attribute = "sellable" + getSellableRegion(channel);
  if (name == "name") {
    // let result = data.filter((obj: any) => obj.name == attribute);
    // return result[0].values[0];
    return "false";
  }
  // let result = data.filter((obj: any) => obj.Name == attribute);
  // return result[0].Value[0];
  return "false"
}
function findDimension(data: any, nameKey: string) {
  let result = data.filter((obj: any) => obj.Name == nameKey);
  if (result.length === 0) {
    return "";
  }
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

function getProductsFromOrderData(data: any, productsFromOrder: any) {
  var products: any[] = [];
  var forEachAsync = new Promise<void>((resolve) => {
    productsFromOrder.forEach((value: any, index: any, array: any) => {
      Promise.all([
        getSpecificationFromProduct(value.id),
        getStringCategoryFromId(value.categoryId),
      ]).then((values) => {
        var obj = {
          name: remove12ncName(value.name, value.skuRefId),
          id: value.skuRefId,
          price:
            value.sellingPrice == "0" || value.sellingPrice == 0
              ? ""
              : value.sellingPrice,
          brand: value.brand,
          category: values[1].AdWordsRemarketingCode,
          variant: getValuefromSpecifications(values[0], "Цвет"),
          quantity: value.quantity,
          dimension4: costructionType(
            findDimension(values[0], "constructionType")
          ),
          dimension5:
            getValuefromSpecifications(values[0], "sellable") === "true"
              ? "Sellable Online"
              : "Not Sellable Online",
        };
        products.push(obj);
        if (index === array.length - 1) {
          resolve();
        }
      });
    });
  });
  forEachAsync.then(() => {
    if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
      let deduplication_cookie = getCookie('deduplication_cookie') //tmp line
      push({
        event: "eec.purchase",
        ecommerce: {
          currencyCode: data.currency,
          purchase: {
            actionField: {
              id: data.transactionId,
              affiliation: data.transactionAffiliation,
              revenue: data.transactionTotal,
              tax: data.transactionTax,
              shipping: data.transactionShipping,
              coupon: data.coupon !== undefined ? data.coupon : "",
              transactionChannel: deduplication_cookie && deduplication_cookie.length > 0 && deduplication_cookie === 'admitad' ? "adm" : "none"
            },
            products,
          },
        },
      });
    }
  });
}
function remove12ncName(name: string, code: string) {
  if (name.indexOf(code) !== -1) {
    return name.replace(code, "").trim();
  } else {
    return name;
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
