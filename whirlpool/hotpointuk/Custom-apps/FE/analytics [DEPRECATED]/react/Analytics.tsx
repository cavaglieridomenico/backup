//@ts-nocheck
import { product } from 'ramda';
import React, { useEffect } from 'react';
import { useProduct } from "vtex.product-context";
import { canUseDOM, useRuntime } from 'vtex.render-runtime';
import NotFoundEvent from './NotFoundEvent';
import push from "./push";
import {
  CartItem, Impression, Order,
  PixelMessage,
  ProductOrder
} from "./typings/events";
import { AnalyticsEcommerceProduct } from "./typings/gtm";
import { isErrorPage, isProductErrorPage } from "./utils/generic";
interface AnalyticsProps {
  pageType: 'staticPage' | 'plp' | 'pdp'
  pageTypeEvent: 'home' | 'search' | 'contact' | 'detail' | 'category' | 'cart' | 'checkout' | 'purchase' | 'other' | 'error'
}
interface WindowGTM extends Window { dataLayer: any[]; }
interface WindowRuntime extends Window {
  __RUNTIME__: any
}

let productCategoryIdForPdp = ""

const Analytics: StorefrontFunctionComponent<AnalyticsProps> = ({ pageType = 'staticPage', pageTypeEvent = "other" }) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];

  const { product } = useProduct();

  useEffect(() => {
    const urlPath = window?.location?.pathname
    const pageTypeVar = setPageTypeFromUrl(urlPath)

    if (pageTypeVar === "detail") {
      productCategoryIdForPdp = product?.categoryId
    }
  }, [product]);

  return <>
    {/* <FeReady dataLayer={dataLayer} pageType={pageType} pageTypeEvent={pageTypeEvent}></FeReady> */}
    <NotFoundEvent dataLayer={dataLayer} pageType={pageTypeEvent}></NotFoundEvent>
  </>
}
if (canUseDOM) {
  window.addEventListener('message', (e) => {
    sendEnhancedEcommerceEvents(e)
  });
}
async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {

    case 'vtex:pageView': {

      const isUnsellable = history?.state?.state.navigationRoute?.id === "store.custom#unsellable-products"

      // Due to the productContext created from useProduct hook being initialized after pageView and feReady being triggered
      // Added a push pageView and feReady in the `vtex:unsellableProductView` page
      if (isUnsellable) return

      const urlShort = e.data.pageUrl.replace(e.origin, '')
      const urlWithoutQueryParams = getPathFromUrl(e.data.pageUrl)

      const isPdpError = isProductErrorPage()
      const pageType = setPageTypeFromUrl(e.data.pageUrl)
      const prodCode = isPdpError ? "" : setProductCode(urlWithoutQueryParams)
      const prodName = isPdpError ? "" : setProductName(urlWithoutQueryParams)

      const prodCategory = isPdpError ? "" : await getProductCategory(urlShort)

      const isSpare = prodCategory.includes("_SP_");
      const isAccessory =  prodCategory.includes("_AC_");
      const contentGrouping = getContentGrouping(urlShort)

      const referrer = e.data.referrer === undefined ? "" : e.data.referrer
      const eventData = {
        bubbles: true,
        detail: {
          currentUrl: () => window.location.href,
          currentTitle: () => document.title,
        }
      }
      const omniEvent = new CustomEvent('react-omnipageview', eventData);

      push({
        event: 'pageView',
        location: e.data.pageUrl,
        page: e.data.pageUrl.replace(e.origin, ''),
        referrer,
        status: "anonymous",
        "product-code": prodCode,
        "product-name": prodName,
        "product-category": prodCategory,
        userType: "prospect",
        pageType,
        "contentGrouping": isSpare || isAccessory ? "Accessories & Spare Parts" : contentGrouping,
        contentGroupingSecond: isSpare ? "Spare Parts" : isAccessory ? "Accessories" : getContentGroupingSecond(prodCategory),
        ...(e.data.pageTitle && {
          title: e.data.pageTitle,
        }),
      })

      push({
        event: 'feReady',
        status: "anonymous",
        "product-code": prodCode,
        "product-name": prodName,
        "product-category": prodCategory,
        userType: "prospect",
        pageType,
      })

      switch (pageType) {
        case "category":
          window.dispatchEvent(omniEvent);
          console.log("--- OMNI FE READY --- PLP ---")
          break;
        case "home":
          window.dispatchEvent(omniEvent);
          console.log("--- OMNI FE READY --- HOME ---")
          break;
        case "detail":
          window.dispatchEvent(omniEvent);
          console.log("--- OMNI FE READY --- PDP EVENT ---")
          break;
        default:
          window.dispatchEvent(omniEvent);
          console.log("--- OMNI FE READY --- CONTENT PAGE ---")

      }

      return
    }

    case "vtex:productView": {
      const { selectedSku, productName, brand, productId } = e.data.product;

      const productSpecifications = await getSpecificationFromProduct(productId)

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

      const dimension8 = getDimension8(e.data?.product, dim4Value)

      let cat = await getStringCategoryFromId(e.data.product.categoryId);
      let isSpare = e.data.product.categories[0].includes("Spare Parts")

      const pr = {
        ecommerce: {
          detail: {
            products: [
              {
                brand,
                category: cat.AdWordsRemarketingCode,
                id: isSpare ? selectedSku.referenceId[0].Value : selectedSku.name,
                name: productName,
                variant: findVariant(productSpecifications),
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
      window.dataLayer.push({ ecommerce: null });
      push(pr);

      return;
    }

    case "vtex:unsellableProductView": {

      const { currency } = e.data;
      const { brand, categoryId, productId, productName, productReference, items } = e.data.product;

      // pageView and feReady for unsellable products
      const productCategoryObj = await getStringCategoryFromId(categoryId)

      const pageUrl = window.location.href
      const urlPath = window.location.pathname + window.location.search
      const urlWithoutQueryParams = getPathFromUrl(pageUrl)

      const referrer = document.referrer === pageUrl ? "" : document.referrer

      const prodCode = setProductCode(urlWithoutQueryParams)
      const prodName = setProductName(urlWithoutQueryParams)
      const prodCategory = productCategoryObj?.AdWordsRemarketingCode

      const pageTitle = document.title

      const eventData = {
        bubbles: true,
        detail: {
          currentUrl: () => window.location.href,
          currentTitle: () => document.title,
        }
      }
      const omniEvent = new CustomEvent('react-omnipageview', eventData);

      push({
        event: 'pageView',
        location: pageUrl,
        page: urlPath,
        referrer,
        status: "anonymous",
        "product-code": prodCode,
        "product-name": prodName,
        "product-category": prodCategory,
        userType: "prospect",
        pageType: "detail",
        contentGrouping: "Catalog",
        title: pageTitle
      })

      push({
        event: 'feReady',
        status: "anonymous",
        "product-code": prodCode,
        "product-name": prodName,
        "product-category": prodCategory,
        userType: "prospect",
        pageType: "detail",
      })

      window.dispatchEvent(omniEvent);
      console.log("--- OMNI FE READY --- PDP EVENT ---")


      // productDetail for unsellable products
      push({ ecommerce: null }); // Clear the previous ecomm object

      const productSpecifications = await getSpecificationFromProduct(productId)


      const price = items[0]?.sellers[0]?.commertialOffer?.Price ?? 0

      const dim5Value = costructionType(
        findDimension(productSpecifications, "constructionType")
      );


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
                // variant: "",
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
      const { productName, brand, sku, productId } = e.data.product;
      const forceList = e.data.forceList;
      const isProductPage = window.location.pathname.endsWith("/p");

      const position = e.data.position;
      let price: any;
      const options = {
        method: "GET",
      };
      const url =
        "/_v/wrapper/api/catalog_system/products/" + productId + "/specification";
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

      // let values = await getStringCategoryFromId(e.data.product.categoryId);
      // let list = getListProductClick(e.data, values.AdWordsRemarketingCode) ?? {}

      const productAPI = await getCategoryFromIdProduct(productId);
      const values = await getStringCategoryFromId(productAPI.CategoryId);
      // const list = getListCrossOrUpSelling(values.AdWordsRemarketingCode)
      const impList = isProductPage ? getListCrossOrUpSelling(values.AdWordsRemarketingCode) : getListProductClick(e.data, values.AdWordsRemarketingCode, forceList)
      let isSpare = e.data.product.categories[0].includes("Spare Parts")

      const product = {
        event: "eec.productClick",
        ecommerce: {
          click: {
            actionField: {
              list: impList,
            },
            products: [
              {
                brand,
                category: values.AdWordsRemarketingCode,
                id: isSpare ? sku.referenceId.Value : sku.name,
                name: productName,
                variant: findVariant(data),
                dimension4: dim4Value,
                dimension5: dim5Value,
                position,
                price:
                  price !== undefined && (price == 0 || price == "0")
                    ? ""
                    : price,
              },
            ],
          },
        },
      };
      window.dataLayer.push({ ecommerce: null });
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
      window.dataLayer.push({ ecommerce: null });

      push({
        ecommerce: {
          add: {
            actionField: {
              action: "add",
            },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              category: values.AdWordsRemarketingCode,
              id: sku.referenceId,
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
      window.dataLayer.push({ ecommerce: null });
      push({
        ecommerce: {
          currencyCode: e.data.currency,
          remove: {
            actionField: {
              action: "remove",
            },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              id: sku.referenceId,
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
      const { currency, list, impressions, product, position, forceList } = e.data;
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
        getProductImpressionObjectData(list, forceList)
      );
      Promise.all(parsedImpressions).then((values) => {
        window.dataLayer.push({ ecommerce: null });
        push({
          event: "eec.impressionView",
          ecommerce: {
            currencyCode: currency,
            impressions: values,
          },
        });
      });
      setTimeout(() => {
        var elements = document.getElementsByClassName("vtex-rich-text-0-x-paragraph--wtbText");
        for (var i = 0; i < elements.length; i++) {

          if ($(elements[i]).data["checked"] !== "yes") {
            elements[i].addEventListener('click', (ev) => {

              var productName = typeof productContextValue !== "undefined" ? productContextValue.product.productName : $(ev.currentTarget).closest("article").find(".vtex-product-summary-2-x-brandName").text();
              var productCode = typeof productContextValue !== "undefined" ? productContextValue.selectedItem.name : getProductCodeFromImpressions(e.data.impressions, $(ev.currentTarget).closest("article").find(".vtex-product-summary-2-x-brandName").text());

              if (productCode && productCode.length && productName && productName.length) {
                dataLayer.push({ 'event': 'intentionToBuy', 'eventAction': 'Pop Retail List', 'eventLabel': `${productCode} - ${productName}` })

              }
            }, false);
            $(elements[i]).data("checked", "yes");
          }

        }
      }, 3000)
      break;

    }

    case "vtex:cartLoaded": {
      /*  const { orderForm } = e.data;
        window.dataLayer.push({ ecommerce: null });
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
        });*/

      break;
    }

    case "vtex:promoView": {
      const { promotions } = e.data;
      window.dataLayer.push({ ecommerce: null });

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
      window.dataLayer.push({ ecommerce: null });

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

    case "vtex:filterManipulation": {
      let category = await getCategoryObjectFromId(e.data.items.filterProductCategory);
      let filterTriggeredCount = dataLayer.filter((layer) => {
        return layer.event === e.data.event && layer.filterValue === e.data.items.filterValue
      }).length;
      let eventType = filterTriggeredCount % 2 == 0 ? "select" : "remove";

      let manipulationFiltersInteractions = {};
      window.dataLayer.filter((layer, index) => {
        if (layer.event == "filterManipulation") {
          if (!manipulationFiltersInteractions[layer.filterValue]) {
            manipulationFiltersInteractions[layer.filterValue] = {};
            manipulationFiltersInteractions[layer.filterValue].status = layer.filterInteraction;
            manipulationFiltersInteractions[layer.filterValue].value = layer.filterValue;
            manipulationFiltersInteractions[layer.filterValue].family = layer.filterName;
          } else {
            manipulationFiltersInteractions[layer.filterValue].status = layer.filterInteraction;
            manipulationFiltersInteractions[layer.filterValue].value = layer.filterValue;
            manipulationFiltersInteractions[layer.filterValue].family = layer.filterName;
          }
        }
        if (index === window.dataLayer.length - 1) {
          if (!manipulationFiltersInteractions[layer.filterValue]) {
            manipulationFiltersInteractions[e.data.items.filterValue] = {}
            manipulationFiltersInteractions[e.data.items.filterValue].status = eventType;
            manipulationFiltersInteractions[e.data.items.filterValue].value = e.data.items.filterValue;
            manipulationFiltersInteractions[e.data.items.filterValue].family = e.data.items.filterName.replace(":", "");
          } else {
            manipulationFiltersInteractions[e.data.items.filterValue].status = eventType;
            manipulationFiltersInteractions[e.data.items.filterValue].value = e.data.items.filterValue;
            manipulationFiltersInteractions[e.data.items.filterValue].family = e.data.items.filterName.replace(":", "");

          }

          let activeFilters = "";
          for (var filter in manipulationFiltersInteractions) {
            if (manipulationFiltersInteractions[filter].status === "select") {
              activeFilters += `${manipulationFiltersInteractions[filter].family} = ${manipulationFiltersInteractions[filter].value}&`
            }
          }
          push({
            event: e.data.event,
            filterName: e.data.items.filterName.replace(":", ""),
            filterProductCategory: category.Name,
            filterValue: e.data.items.filterValue,
            filterInteraction: eventType,
            filterChainedDetails: activeFilters.slice(-1) == "&" ? activeFilters.substring(0, activeFilters.length - 1) : activeFilters
          });
        }
      })



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

    case 'vtex:emptySearchView': {
      const query = window.location.pathname.replace("/", "");

      window.dataLayer.push({
        event: "errorPage",
        errorType: "No Search Result",
        errorQuery: query.replace("%20", ""),
      });

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

    case 'vtex:ctaShipping': {
      const urlPath = window?.location?.pathname

      push({
        "event": "cta_click",
        "eventCategory": "CTA Click",
        "eventAction": "(Other)",
        "eventLabel": `checkout`,

        "link_url": window?.location?.href,
        "link_text": e.data.text,
        "checkpoint": `1`,
        "area": "(Other)",
        "type": e.data.text
      })

      break;
    }

    case "vtex:coupon": {
      push({
        event: "coupon",
        eventCategory: "Coupon",
        eventAction: e.data.eventAction,
        eventLabel: e.data.isValid,
        couponName: e.data.eventAction,
      })
      break
    }
    case "vtex:eec.checkout": {
      var items = e.data.items || [];
      var products = [];
      if (items.length > 0) {
        var forEachAsync = new Promise((resolve, reject) => {
          items.forEach(async (value, index, array) => {
            const options = {
              method: "GET",
            };
            const url =
              "/_v/wrapper/api/catalog_system/products/" +
              value.productId +
              "/specification";
            let response = await fetch(url, options);
            let productSpecificationsData = await response.json();
            var categoryIdsSplitted = value.productCategoryIds.split("/");
            var isSpare = Object.keys(value.productCategories).filter(val => value.productCategories[val].includes("Spare Parts"))[0]
            Promise.all([
              getCategoryFromIdProduct(value.productId),
              getStringCategoryFromId( categoryIdsSplitted[categoryIdsSplitted.length - 2]),
              findVariant(productSpecificationsData)
            ]).then((values) => {
              var obj = {
                name: getName(value.name, value.skuName, isSpare),
                id: isSpare ? value.refId : value.productId,
                price: value.isGift ? 0 : value.price / 100,
                brand: "Hotpoint",
                category: values[1].AdWordsRemarketingCode,
                variant: values[2],
                quantity: value.quantity,
                dimension5: value.field5,
                dimension4:
                  value.sellable === "true" ? "Sellable Online" : "Not Sellable Online",
              };
              products.push(obj);
              if (index === array.length - 1) {
                push({
                  event: "eec.checkout",
                  ecommerce: {
                    currencyCode: "GBP",
                    checkout: {
                      actionField: {
                        step: e.data.step,
                      },
                      products
                    },
                  },
                })
              }
            });
          });
        });
      } else {
        push({
          event: "eec.checkout",
          ecommerce: {
            currencyCode: "GBP",
            checkout: {
              actionField: {
                step: e.data.step,
              }
            },
          },
        })
      }



      break
    }
    case "vtex:leadGeneration": {
      push({
        event: "leadGeneration",
        eventCategory: "Lead Generation",
        eventAction: "Optin granted",
        eventLabel: "Lead from checkout step1",
        email: e.data.email,
      })
      break
    }
    case "vtex:emailForSalesforce": {
      /*push({
        event: "emailForSalesforce",
        eventCategory: "Email for Salesforce",
        eventAction: "Checkout step 1",
        email: e.data.email,
      })*/
      break
    }
    case "vtex:eec.addToCartEec": {
      const item = e.data.item
      let productAPI = await getCategoryFromIdProduct(item.productId);
      let values = await getStringCategoryFromId(productAPI.CategoryId);
      let productData = await getSpecificationFromProduct(item.productId);
      let cCode = productData?.filter(item => item.Name == "cCode")[0];
      push({
        event: "eec.addToCart",
        ecommerce: {
          currencyCode: "GBP",
          add: {
            actionField: {
              action: "add",
            },
            products: [
              {
                name: item.name,
                id: cCode ? cCode["Value"][0] : item.productId,
                price: `${item.sellingPrice}` == "0" ? "" : `${item.sellingPrice / 100}`,
                brand: item.additionalInfo.brandName,
                category: values.AdWordsRemarketingCode,
                quantity: 1,
                variant: item.name,
                dimension4:
                  item?.sellable === "true"
                    ? "Sellable Online"
                    : "Not Sellable Online",
                dimension5: item?.field5,
              },
            ],
          },
        },
      })
      break
    }
    case "vtex:eec.removeFromCartEec": {
      const item = e.data.item
      let productAPI = await getCategoryFromIdProduct(item.productId);
      let values = await getStringCategoryFromId(productAPI.CategoryId);
      let productData = await getSpecificationFromProduct(item.productId);
      let cCode = productData?.filter(item => item.Name == "cCode")[0];
      push({
        event: "eec.removeFromCart",
        ecommerce: {
          currencyCode: "GBP",
          remove: {
            actionField: {
              action: "remove",
            },
            products: [
              {
                name: item.name,
                id: cCode ? cCode["Value"][0] : item.productId,
                price: `${item.sellingPrice}` == "0" ? "" : `${item.sellingPrice / 100}`,
                brand: item.additionalInfo.brandName,
                category: values.AdWordsRemarketingCode,
                quantity: 1,
                variant: item.name,
                dimension4:
                  item?.sellable === "true"
                    ? "Sellable Online"
                    : "Not Sellable Online",
                dimension5: item?.field5,
              },
            ],
          },
        },
      })
      break
    }
    case "vtex:eec.removeFromCartBulkEec": {
      const item = e.data.item
      let productAPI = await getCategoryFromIdProduct(item.productId);
      let values = await getStringCategoryFromId(productAPI.CategoryId);
      let productData = await getSpecificationFromProduct(item.productId);
      let cCode = productData?.filter(item => item.Name == "cCode")[0];
      push({
        event: "eec.removeFromCart",
        ecommerce: {
          currencyCode: "GBP",
          remove: {
            actionField: {
              action: "remove",
            },
            products: [
              {
                name: item.name,
                id: cCode ? cCode["Value"][0] : item.productId,
                price: `${item.sellingPrice}` == "0" ? "" : `${item.sellingPrice / 100}`,
                brand: item.additionalInfo.brandName,
                category: values.AdWordsRemarketingCode,
                quantity: item.quantity,
                variant: item.name,
                dimension4:
                  item?.sellable === "true"
                    ? "Sellable Online"
                    : "Not Sellable Online",
                dimension5: item?.field5,
              },
            ],
          },
        },
      })
      break
    }
    case "vtex:cartState": {
      const items = e.data?.cartOrderForm?.items
      let product = items?.map((item: any) => ({
        id: item.productId,
        price: item.isGift ? 0 : item.sellingPrice / 100,
        quantity: item.quantity,
      }))

      push({
        event: "cartState",
        product,
      })

      break
    }
    case 'vtex:userData': {
      const { data } = e
      if (!data.isAuthenticated) {
        return
      }
      fetch("/api/sessions?items=*",{ method: "GET", })
          .then(response => response.json())
          .then(json => {
            fetch("/_v/wrapper/api/user/userinfo",{
              method: 'GET',
            }).then(response => response.json())
            .then(user => {
              push({
                event: 'personalArea',
                eventCategory: 'Personal Area', // Fixed value
                eventAction: 'Login',
                eventLabel: `Login from Personal Area`
              });
              push({
                event: 'userData',
                userId: data.id,
                "genere": user.gender? user[0].gender : '',
                email: json.namespaces.profile.email.value
              });
            }).catch(err => {
              console.error(err);
            });
          });
      break;
    }
    case "vtex:menuFooter": {
      console.log(e.data)

      let eventLabel = window.location.origin + e.data.props[0]["eventLabel"];

      push({
        event: "menuFooter",
        eventCategory: "Menu and Footer Clicks",
        eventLabel,
        eventAction: e.data.props[0]["eventAction"]
      })

      break;
    }
    case "vtex:funnelStepSpareUK": {

      push({
        event: "funnelStepUK",
        eventCategory: "Spare Parts LP Funnel",
        eventLabel: e.data.eventLabel,
        eventAction: e.data.eventAction
      })

      break;
    }
    case "vtex:secondaryLevelMenuUk": {
      let eventAction = window.location.origin + e.data.props[0]["eventAction"];

      push({
        event: "secondaryLevelMenuUk",
        eventCategory: "Search by FG Category",
        eventLabel: e.data.props[0]["eventLabel"],
        eventAction
      })
      break;
    }
    case "vtex:drawingZoomUkSpare": {
      push({
        event: "drawingZoomUk",
        eventCategory: "Technical Drawing",
        eventAction: "Zoom",
        eventLabel: e.data.eventLabel
      })
      break;
    }
    case "vtex:searchZoomUkSpare": {
      push({
        event: "searchZoomUk",
        eventCategory: "Technical Drawing",
        eventLabel: e.data.eventLabel,
        eventAction: e.data.eventAction
      })
      break;
    }
    case "vtex:myModelNumberUkSpare": {
      let url = window.location.href;
      let originLength = window.location.origin.length;

      let category = url.substring(originLength + 1);

      if (e.data.props[0].isPlp === true || category === "spare-parts") {
        category = category.toLowerCase().replace(/\//g, " - ")
        push({
          event: "myModelNumberUk",
          eventCategory: "Where do I Find my Model Number",
          eventAction: category,
          eventLabel: `Accessories & Spare Parts - ${url}`
        })
      } else {
        let collectionBreadcrumb = document.getElementsByClassName("hotpointuk-bredcrumbs-0-x-catLink");
        if (collectionBreadcrumb.length == 0) {
          collectionBreadcrumb = document.getElementsByClassName("hotpointuk-bredcrumbs-0-x-catLink");
        }
        let categoryBread = [];
        let singleCollection = Array.from(collectionBreadcrumb);
        let categoryFinal;
        singleCollection.map((productCategory) => {
          categoryBread.push(productCategory.text);
          categoryFinal = categoryBread.slice(1).join("- ");
          categoryFinal = categoryFinal.toLowerCase().replace(" parts", "");

        })

        push({
          event: "myModelNumberUk",
          eventCategory: "Where do I Find my Model Number",
          eventAction: categoryFinal,
          eventLabel: `Accessories & Spare Parts - ${url}`
        })
      }

      break;
    }
    case "vtex:seeSubstituteUkSpare": {
      push({
        event: "seeSubstituteUk",
        eventCategory: "See Substitute",
        eventAction: e.data.eventAction
      })
      break
    }
    case "vtex:emailMeWhenAvailableSpare": {
      push({
        event: 'emailMeWhenAvailableSpare',
        eventCategory: 'Email Me When Available',
        eventAction: e.data.eventAction
      })
      break
    }

    case "vtex:modelClickUkSpare": {
      push({
        event: "modelClickUk",
        eventCategory: "Model Click",
        eventAction: e.data.eventAction
      })
      break
    }
//FUNREQSPARE15
    case "vtex:barCodeSpare": {
      push({
        event: 'barCode',
        eventCategory: 'Barcode Model ID',
        eventAction: e.data.eventAction,
        eventLabel: e.data.eventLabel
      })
      break
    }
    default: {
      break;
    }
  }
}


const getName = (name, skuName, isSpare) => {
  let newName = name.toLowerCase().replace(skuName.toLowerCase(), "").replace(skuName.toLowerCase(), "").trim()
  newName = isSpare ? skuName.toLowerCase() + " " + newName : newName;
  return newName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}

// Get category object from ID
const getCategoryObjectFromId = (
  id: string
) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
  };

  return fetch("/_v/wrapper/api/catalog/category/" + id, options).then((response) => {
    return response.json();
  });
};


//Functions to get category from category id
async function getCategoryStringFromId(id: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
  };
  let response = await fetch("/_v/wrapper/api/catalog/category/" + id, options)
  let category = await response.json()

  return category?.AdWordsRemarketingCode
};

function getProductCodeFromImpressions(impressions, name) {
  if (impressions && name) {
    var productCode = "";
    impressions.filter((impression) => {
      if (impression.product.productName == name.trim()) {
        productCode = impression.product.sku.name;
      }
    });
    return productCode;
  } else {
    return "";
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
  const result = data.filter((o: any) => o.Name == "Colour");
  const variant = result.length ? result[0]?.Value[0] : ""
  return variant;
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name == "Цвет");
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
function getCategoryDetailsFromCategoryid(categoryId: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return fetch(
    "/api/catalog/pvt/category/" + categoryId,
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
  const categoryId = product.properties ? product.properties.filter(
    (obj: any) => obj.name.toLowerCase() === "adwordsMarketingCode"
  ) : null;
  return categoryId;
}
// Transform this: "/Apparel & Accessories/Clothing/Tops/"
// To this: "Apparel & Accessories/Clothing/Tops"

function getDimension(product: any, dimension: number) {
  if (dimension === 4) {
    const result = product.properties ? product.properties.filter(
      (obj: any) => obj.name.toLowerCase() === "sellable"
    ) : "";
    if (result.length > 0) {
      let sellable: string;
      result[0].values[0] === true
        ? (sellable = "Not Sellable Online")
        : (sellable = "Sellable Online");
      return sellable;
    }
    return "";
  } else {
    const result = product.properties ? product.properties.filter(
      (obj: any) => obj.name == "constructionType"
    ) : [];
    if (result.length > 0) {
      return costructionType(result[0].values[0]);
    }
    return "";
  }
}

function getListProductClick(data: any, category: string, forceList: string) {
  var listName = "";
  const locationArray = window.dataLayer.filter(item => item.event == "pageView")
  const location = locationArray[(locationArray.length) - 1].page

  // data.list value of "homepage_impression_list" arrives from cms/site-editor from the Product List component
  const isHomepage = location.split('?')[0] == '/' || data.list === "homepage_impression_list"
  const isSpare = location.includes("spare-parts");
  const isAccessory = location.includes("accessories");

  if (forceList) {
    listName = forceList
  } else if (isSpare) {
    listName = "spare";
  } else if (isAccessory) {
    listName = "accessories_impression_list";
  } else if (isHomepage) {
    listName = "homepage_impression_list"
  }
  else if (data.list) {
    listName = "catalog_page_impression_list_" + data.list.split(" ").join("_");
  }

  // return { actionField: { list: listName } };
  return listName;
}

function getList(list: string, categories: string[], category: string, forceList: string) {
  let ImpressionList = "";
  const pathName = window.location.pathname;
  const isHomepage = pathName.endsWith("/");
  const isSpare = pathName.includes("spare-parts");
  const isAccessory = pathName.includes("accessories");

  if (forceList) {
    ImpressionList = forceList;
  } else if (isSpare) {
    ImpressionList = "spare";
  } else if (isAccessory) {
    ImpressionList = "accessories_impression_list";
  } else if (window.location.href.indexOf("/p") !== -1) {
    ImpressionList = "product_page_up_selling_impression_list";
  } else if (isHomepage) {
    ImpressionList = "homepage_impression_list"
  }
  else {
    ImpressionList = "catalog_page_impression_list_" + list.split(" ").join("_");
  }
  return ImpressionList;
}

function getListCrossOrUpSelling(category: string) {
  const url = window.location.pathname
  const productCategory = window.dataLayer.find(cat => cat.event == "pageView")["product-category"]
  const AdWordsRemarketingCode = category

  if (url.endsWith("/p") && productCategory == AdWordsRemarketingCode) {
    return "product_page_up_selling_impression_list"
  }
  return "product_page_cross_selling_impression_list"
}

function getProductImpressionObjectData(list: string, forceList: string) {
  return ({ product, position }: Impression) =>


    product.categoryId !== undefined
      ? getStringCategoryFromId(product.categoryId).then(async (respone) => {
        let isSpare = product.properties.filter(prop => prop.name === "isSparePart")[0];
        return {
          brand: product.brand,
          category: respone.AdWordsRemarketingCode,
          id: isSpare && isSpare.values[0] == 'true' ? product.sku.referenceId.Value : product.sku.name,
          list: getList(
            list,
            product.categories,
            respone.AdWordsRemarketingCode,
            forceList
          ),
          name: product.productName,
          position,
          price:
            `${product.sku.seller!.commertialOffer.Price}` == "0"
              ? ""
              : `${product.sku.seller!.commertialOffer.Price}`,
          variant: findVariantImpression(product.properties),
          dimension4:
            (await findSellable(product.properties, "name")) == "true"
              ? "Sellable Online"
              : "Not Sellable Online",
          dimension5: getDimension(product, 5),
        };
      })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
        getStringCategoryFromId(prodAPI.CategoryId).then(async (respone) => {
          const list = getListCrossOrUpSelling(respone.AdWordsRemarketingCode),
          return {
            brand: product.brand,
            category: respone.AdWordsRemarketingCode,
            id: product.sku.name,
            // list: getList(
            //   list,
            //   product.categories,
            //   respone.AdWordsRemarketingCode
            // ),
            list,
            name: product.productName,
            position,
            price:
              `${product.sku.seller!.commertialOffer.Price}` == "0"
                ? ""
                : `${product.sku.seller!.commertialOffer.Price}`,
            variant: findVariantImpression(product.properties),
            dimension4:
              (await findSellable(product.properties, "name")) == "true"
                ? "Sellable Online"
                : "Not Sellable Online",
            dimension5: getDimension(product, 5),
          };
        })
      );
}

function getSellableRegion(value: any) {
  switch (value) {
    case "2":
      return "A2";
    case "3":
      return "GE";
    case "4":
      return "ANE";
    default:
      return "A1";
  }
}

async function findSellable(data: any, name: string = "Name") {
  let runtime = (window as unknown as WindowRuntime).__RUNTIME__
  let channel = ''
  if (JSON.parse(atob(runtime.segmentToken)).channel === null) {
    let response = await fetch("/api/sessions/?items=*", { method: "GET" });
    let session = await response.json();
    channel = session.namespaces.store.channel.value
  } else {
    channel = JSON.parse(atob(runtime.segmentToken)).channel
  }
  let attribute =
    "sellable"
  if (name == "name") {
    let result = data.filter((obj: any) => obj.name == attribute);
    return result[0] ? result[0].values[0] : [];
  }
  let result = data.filter((obj: any) => obj.Name == attribute);
  return result[0] ? result[0].Value[0] : {};

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
    return specifications.filter((s: any) => s.Name === name)[0]?.Value[0];
  }
}

function getProductsFromOrderData(data: any, productsFromOrder: any) {
  var products: any[] = [];
  var forEachAsync = new Promise<void>((resolve) => {
    productsFromOrder.forEach((value: any, index: any, array: any) => {
      Promise.all([
        getSpecificationFromProduct(value.id),
        getStringCategoryFromId(value.categoryId),
        getCategoryFromIdProduct(value.id)
      ]).then((values) => {
        let isSpare = false;
        try {
          isSpare = values[0]?.filter(prop => prop.Name === "isSparePart")[0]?.Value[0] == 'true';
        } catch (error) { }
        var obj = {
          name: getName(value.name, value.skuName, isSpare),
          id: value.skuRefId,
          price:
            value.sellingPrice == "0" || value.sellingPrice == 0
              ? ""
              : value.sellingPrice,
          brand: value.brand,
          category: values[1].AdWordsRemarketingCode,
          variant: getValuefromSpecifications(values[0], "Colour"),
          quantity: value.quantity,
          dimension5: costructionType(
            findDimension(values[0], "constructionType")
          ),
          dimension4:
            getValuefromSpecifications(values[0], "sellable") === "true"
              ? "Sellable Online"
              : "Not Sellable Online",
        };
        products.push(obj);
        if (index === array.length - 1) {
          if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
            let deduplication_cookie = getCookie('deduplication_cookie') //tmp line
            window.dataLayer.push({ ecommerce: null });
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
        }
      });
    });
  });

}
function getCookie(cname: string) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
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

//Function to get product category
async function getProductCategory(url: string) {
  let pageType: string = setPageTypeFromUrl(url)

  if (pageType === "detail") { //I'm in pdp

    const productCategory = productCategoryIdForPdp ? await getCategoryStringFromId(productCategoryIdForPdp) : ""
    return productCategory

  } else if (pageType === "category") {  //I'm in plp
    const urlWithoutQueryStrings = getPathFromUrl(url)
    return await getCategoryByUrl(urlWithoutQueryStrings)
  } else {
    return ""
  }
}

// Utils for feReady and pageView
// Get product category for a product - PDP
async function getCategory(prodCode: string) {

  let productCategoryId: string = await fetch("/_v/wrapper/api/catalog_system/products/productgetbyrefid/" + prodCode, {
    //let productCategoryId: string = await fetch("/_v/wrapper/api/catalog_system/products/productgetbyrefid/" + prodCode + "-WER", {
    method: "GET",
    headers: {},
  }).then(async (response) => {
    let product = await response.json()

    return product.CategoryId;
  }).catch((error) => {
    console.log(error);
  });

  let categoryObj = await getStringCategoryFromId(productCategoryId.toString())
  return categoryObj.AdWordsRemarketingCode
}

//Function to get product category took by url for PLP
export async function getCategoryByUrl(url: string) {
  let category = url.split(/[\s/]+/)[3];
  switch (category) {
    // air conditioning
    case "air-conditioners": return getCategoryStringFromId("32")
    // cooking
    case "compacts": return getCategoryStringFromId("30")
    case "cookers": return getCategoryStringFromId("29")
    case "hoods": return getCategoryStringFromId("28")
    case "hobs": return getCategoryStringFromId("27")
    case "microwaves": return getCategoryStringFromId("26")
    case "ovens": return getCategoryStringFromId("25")
    // dishwashing
    case "dishwashers": return getCategoryStringFromId("31")

    // home appliances
    case "steam-irons": return getCategoryStringFromId("38")
    case "vacuum-cleaners": return getCategoryStringFromId("37")

    // kitchen home addition
    case "water-treatment": return getCategoryStringFromId("41")
    case "sinks": return getCategoryStringFromId("40")
    case "faucet": return getCategoryStringFromId("39")

    // laundry
    case "washer-dryers": return getCategoryStringFromId("21")
    case "tumble-dryers": return getCategoryStringFromId("20")
    case "washing-machines": return getCategoryStringFromId("19")

    //refrigeration
    case "freezers": return getCategoryStringFromId("24")
    case "fridges": return getCategoryStringFromId("23")
    case "fridge-freezers": return getCategoryStringFromId("22")

    // small appliances
    case "slow-juicers": return getCategoryStringFromId("36")
    case "breakfast": return getCategoryStringFromId("35")
    case "cooking": return getCategoryStringFromId("34")
    case "food-preparation": return getCategoryStringFromId("33")

    default: return ""
  }
}

function getPathFromUrl(url: string) {
  return url?.split("?")[0];
}

function setPageTypeFromUrl(url: string) {
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isFilteredCategory = url.includes("&searchState")
  const isCategory = urlWithoutQueryStrings.includes("appliances") || isFilteredCategory
  const isContactPage = urlWithoutQueryStrings.includes("contact-us") || urlWithoutQueryStrings.includes("press-enquiries") || urlWithoutQueryStrings.includes("service-locator")
  const isStoryPage = urlWithoutQueryStrings.includes("frost-free-fridge-freezers") || urlWithoutQueryStrings.includes("multiflow-ovens") || urlWithoutQueryStrings.includes("powerful-gentle-power-washing-machine")
  const isError = isErrorPage()
  const isPdpError = isProductErrorPage()

  let pageType = "other"

  if (isCategory) {
    pageType = "category"
  }
  else if (url.includes("map=")) {
    pageType = "search"
  }
  else if (urlWithoutQueryStrings.endsWith("/p") || isPdpError)
    pageType = "detail"
  else if (urlWithoutQueryStrings.endsWith("/cart"))
    pageType = "cart"
  else if (urlWithoutQueryStrings.includes("checkout") && !urlWithoutQueryStrings.includes("orderPlaced"))
    pageType = "checkout"
  else if (urlWithoutQueryStrings.includes("checkout") && urlWithoutQueryStrings.includes("orderPlaced"))
    pageType = "purchase"
  else if (isContactPage)
    pageType = "contact"
  else if (isStoryPage)
    pageType = "story"
  else if (isError) {
    pageType = "error"
  }
  else if (urlWithoutQueryStrings.endsWith("/") || urlWithoutQueryStrings.endsWith("com"))
    pageType = "home"
  return pageType
}

//Function to get content grouping
function getContentGrouping(url: string) {
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isSpareOrAccessories = url.includes("accessories") || url.includes("spare-parts");
  const isBom = url.includes("spare-parts/bom");
  const isFilteredCategory = url.includes("&searchState")
  const isCatalog = urlWithoutQueryStrings.endsWith("/p") || urlWithoutQueryStrings.includes("appliances") || urlWithoutQueryStrings.includes("product-comparison") || isFilteredCategory

  const isCompany = urlWithoutQueryStrings.includes("about-us") || urlWithoutQueryStrings.includes("recycling") || urlWithoutQueryStrings.includes("tax-strategy") || urlWithoutQueryStrings.includes("share-your-content") || urlWithoutQueryStrings.includes("terms-and-conditions") || urlWithoutQueryStrings.includes("privacy-policy") || urlWithoutQueryStrings.includes("cookie-policy")

  const marketingTechUrlPaths = ["/3d-zone-wash", "/self-cleaning-ovens", "/direct-flame-gas-hob", "/flexi-duo", "/cookers", "/direct-injection-technology", "/active-oxygen", "/active-oxygen-fridge", "/multiflow-cookers", "/hoods", "/active-care-washing-machines", "/no-frost-system-freezers", "/stop-and-add", "/free-ariel-laundry", "/frost-free-fridge-freezers", "/day-1-fresher-for-longer", "multiflow-ovens", "/heat-pump-tumble-dryer", "/powerful-gentle-power-washing-machine", "/double-fan-oven", "/integrated-washing-machines", "/integrated-fridge-freezers", "/black-friday", "/common-template-black-friday"];
  const marketingUrlPaths = ["/microwaves", "/tumble-dryers", "/ovens", "/washing-machines", "/hobs", "/washer-dryers", "/fridge-freezers", "fridges", "/freezers", "/dishwashers", "/exclusive-benefits", ...marketingTechUrlPaths];
  const isMarketing = marketingUrlPaths.includes(urlWithoutQueryStrings)

  const isSupport = urlWithoutQueryStrings.includes("contact-us") || urlWithoutQueryStrings.includes("press-enquiries") || urlWithoutQueryStrings.includes("register-my-appliance") || urlWithoutQueryStrings.includes("store-locator") || urlWithoutQueryStrings.includes("-guide");
  const isPromotions = urlWithoutQueryStrings.includes("appliances-sale-and-offers") || urlWithoutQueryStrings.includes("boxing-day-sales") || urlWithoutQueryStrings.includes("free-fairy-2021") || urlWithoutQueryStrings.includes("/black-friday-deals")

  const isPdpError = isProductErrorPage()
  const isError = isErrorPage();
  const isSearchPage = window?.history?.state?.state.navigationRoute.id === "store.search"


  if (isBom) {
    return "Bom"
  } else if (isSpareOrAccessories) {
    return "Accessories & Spare Parts"
  } else if (isPromotions) {
    return "Promotions"
  }
  else if (isCatalog && !isPdpError) {
    return "Catalog"
  }
  else if (isCompany) {
    return "Company"
  }
  else if (isMarketing) {
    return "Marketing"
  }
  // else if(urlWithoutQueryStrings.includes("account") || (urlWithoutQueryStrings.includes("login"))) { //I'm in personal area page
  //   return "Personal"
  // }

  // else if(urlWithoutQueryStrings.includes("recettes")) {
  //   return "Recipes"
  // }
  // else if(urlWithoutQueryStrings.includes("accessoires") || urlWithoutQueryStrings.includes("/services/pieces-detachees-d-origine")) {
  //   return "Accessories & Spare Parts"
  // }
  else if (isSupport) {
    return "Support"
  }
  else if (urlWithoutQueryStrings === "/") {
    return "Homepage"
  }
  else if (isSearchPage) {
    const notFoundTextElements = document.getElementsByClassName("lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--notFound vtex-rich-text-0-x-paragraph--center")
    if (notFoundTextElements?.length > 0) {  // Handling search page when there is an empty search
      return "Errors"
    }
    return "(Other)"
  }
  else if (isError || isPdpError) {
    return "Errors"
  }
  return "(Other)"
}

function setProductCode(url: any) {
  if (!(url.endsWith("/p")))
    return ""
  let code = url.split("/").reverse()[1].split("-").reverse()[0]
  return code
}

function setProductName(url: any) {
  if (!(url.endsWith("/p")))
    return ""
  let code = url.split("/").reverse()[1].split("-").slice(0, -1).join("-")
  return code
}

function getDimension8(productData: any, dim4: string) {
  if (dim4 === "Not Sellable Online") {
    return dim4;
  }
  let availableQuantity = productData?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity
  return availableQuantity > 0 ? "In Stock" : "Out of Stock"
}

function getContentGroupingSecond(category: any): string {

  const mappedCategoriesFromProductCategory = new Map<string, string>([
    ["Laundry", "Laundry"],
    ["Cooking", "Cooking"],
    ["Cooling", "Cooling"],
    ["Dishwashing", "Dishwash"],
    ["Dishwashers", "Dishwash"],
    ["AirConditioning", "Air conditioner"],
    ["WashingMachines", "Laundry"],
    ["Dryers", "Laundry"],
    ["WasherDryers", "Laundry"],
    ["Fridges", "Cooling"],
    ["Freezing", "Cooling"],
    ["Freezers", "Cooling"],
    ["Ovens", "Cooking"],
    ["Microwaves", "Cooking"],
    ["Hobs", "Cooking"],
    ["Hoods", "Cooking"],
    ["Cookers", "Cooking"],
    ["Kitchen", "Small kitchen appliances"],

    ["AirConditioners", "Air Conditioning"],
    ["FFCombi", "Cooling"],
    ["Refrigerators", "Cooling"]
  ]);
  let urlWithoutQueryStrings = window.location.pathname

  if (urlWithoutQueryStrings.includes("accessories")) {
    return "Accessories"
  } else if (urlWithoutQueryStrings.includes("spare-parts")) {
    return "Spare Parts"
  } else if (urlWithoutQueryStrings.includes('/appliances')) {
    if (urlWithoutQueryStrings.includes('/laundry'))
      return 'Laundry'
    else if (urlWithoutQueryStrings.includes('/refrigeration'))
      return 'Cooling'
    else if (urlWithoutQueryStrings.includes('/cooking'))
      return 'Cooking'
    else if (urlWithoutQueryStrings.includes('/dishwashing'))
      return 'Dishwashing'
    else if (urlWithoutQueryStrings.includes('/refrigeration'))
      return 'Cooling'
  }
  else if (urlWithoutQueryStrings.includes('/accessories'))
    return 'Accessories'


  else if (category) {
    let catSplit = category.split("_");
    if (catSplit?.some((value: string) => value === "AC"))
      return 'Accessories'
    else {
      const contentGroupingFromProductCategory = mappedCategoriesFromProductCategory.get(catSplit[catSplit.length - 1]);
      return contentGroupingFromProductCategory ?? ""
    }
  }

  return ''
}

Analytics.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
  },
  pageType: {
    title: "Page type",
    description: "Type of the page, choise among 'staticPage', 'plp', 'pdp'",
    default: "",
    type: "string"
  },
  pageTypeEvents: {
    title: "Page type events",
    description: "Type of page printed on event",
    default: "",
    type: "string"
  }
}

export default Analytics
