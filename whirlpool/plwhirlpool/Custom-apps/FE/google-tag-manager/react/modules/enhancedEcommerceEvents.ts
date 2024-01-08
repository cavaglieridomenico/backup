import push from "./push";
import {
  Order,
  PixelMessage,
  ProductOrder,
  Impression,
  CartItem,
} from "../typings/events";
import { AnalyticsEcommerceProduct } from "../typings/gtm";
import { getContentGrouping } from './commonMethods'

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case "vtex:addToWishlist": {
      push({
        event: 'wishlist',
        eventCategory: 'Intention to Buy',
        eventAction: 'Add to Wishlist',
        eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`
      });
      return;
    }

    case "vtex:removeToWishlist": {
      push({
        event: 'wishlist',
        eventCategory: 'Intention to Buy',
        eventAction: 'Remove from Wishlist',
        eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`
      });
      return;
    }

    case "vtex:prodDetailsTab": {
      let tabName = window.location.href.split('#')[1]
      push({
        event: 'prodDetailsTab',
        prodDetailsTabName: tabName
      })
      return
    }

    case "vtex:productRegistration": {
      push({
        'event': 'productRegistration'
      })
      return
    }

    // case "vtex:storyPageCheckpoint":{
    //   const contentCategory = document.querySelector(".vtex-store-components-3-x-infoCardContainer")?.id
    //   const prodCode = ''
    //   push({
    //     event: 'storyPageCheckpoint',
    //     eventCategory: 'Product Experience Area',
    //     eventAction: `${contentCategory}  Consumed - ex "Editorial Content Consumed"`,
    //     eventLabel: `${prodCode} - `
    //   })
    //   return
    // }

    // case "vtex:redeemAPromo":{
    //   const promoDesc = document.querySelectorAll(".vtex-flex-layout-0-x-flexRowContent--bannerWithPostillaMobile3 h1.vtex-rich-text-0-x-headingLevel1--titleHBannerPostilla")[0].textContent
    //   const promoTitle = document.querySelectorAll(".vtex-flex-layout-0-x-flexRowContent--bannerWithPostillaMobile3 p.lh-copy.vtex-rich-text-0-x-paragraph.vtex-rich-text-0-x-paragraph--descBannerPostilla")[0].textContent

    //   push({
    //     event: 'redeemAPromo',
    //     eventCategory: 'Promo',
    //     eventAction: `Redeem a Promo - ${promoTitle}`,
    //     eventLabel: promoDesc
    //   })
    //   return
    // }

    case "vtex:productView": {
      const { selectedSku, productName, brand } = e.data.product;
      const { currency } = e.data;

      push({
        'event': 'contentIndex',
        'contentIndex': document.getElementsByClassName("plwhirlpool-video-player-thron-pdp-0-x-figure plwhirlpool-video-player-thron-pdp-0-x-figure--productPage").length
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
            let dim4Value =
              findDimension(data, "sellable") == "true"
                ? "Sellable Online"
                : "Not Sellable Online";
            const dimension8 = getDimension8(e.data.product, dim4Value)
            getStringCategoryFromId(e.data.product.categoryId).then(
              (response) => {
                let totPrice = e.data.product.items[0].sellers[0].commertialOffer.ListPrice
                let sellingPrice = e.data.product.items[0].sellers[0].commertialOffer.Price
                const pr = {
                  ecommerce: {
                    currencyCode: currency,
                    detail: {
                      // actionField: {
                      //   list: setListProductDetail(),
                      // },
                      products: [
                        {
                          brand,
                          category: response.AdWordsRemarketingCode,
                          id: selectedSku.name,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value,
                          dimension6: totPrice > sellingPrice ? "In Promo" : "Not In Promo",
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

      const numImages: number = items[0]?.images?.length ?? 0
      const numVideos: number = items[0]?.videos?.length ?? 0

      push({
        'event': 'contentIndex',
        'contentIndex': numImages + numVideos
      })

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
                dimension6: "Not in Promo",
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
      const position = e.data.position ? { position: e.data.position } : {};
      let price: any;
      const options = {
        method: "GET",
      };
      let totPrice = e.data.product.items[0].sellers[0].commertialOffer.ListPrice
      let sellingPrice = e.data.product.items[0].sellers[0].commertialOffer.Price
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
                    currencyCode: e.data.currency,
                    click: {
                      actionField: {
                        list: list
                      },
                      products: [
                        {
                          brand,
                          category: values.AdWordsRemarketingCode,
                          id: sku.name,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value,
                          dimension6: totPrice > sellingPrice ? "In Promo" : "Not In Promo",
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
      const url2 = "/api/catalog_system/pub/products/search?fq=productId:" + e.data.items[0].productId
      let data: any = await fetch(url, options).then((response) => response.json())
      let data2: any = await fetch(url2, options).then((response) => response.json())
      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value = findDimension(data, "sellable") == "true" ? "Sellable Online" : "Not Sellable Online";
      let productAPI = await getCategoryFromIdProduct(items[0].productId)
      let values = await getStringCategoryFromId(productAPI.CategoryId)
      let totPrice = data2[0].items[0].sellers[0].commertialOffer.ListPrice
      let sellingPrice = data2[0].items[0].sellers[0].commertialOffer.Price
      push({
        ecommerce: {
          add: {
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
              dimension6: totPrice > sellingPrice ? "In Promo" : "Not In Promo"
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
      const url2 = "/api/catalog_system/pub/products/search?fq=productId:" + e.data.items[0].productId
      let data = await fetch(url, options).then((response) => response.json())
      let data2: any = await fetch(url2, options).then((response) => response.json())
      let dim5Value = costructionType(findDimension(data, "constructionType"));
      let dim4Value = findDimension(data, "sellable") == "true" ? "Sellable Online" : "Not Sellable Online";
      let productAPI = await getCategoryFromIdProduct(items[0].productId)
      let values = await getStringCategoryFromId(productAPI.CategoryId)
      let totPrice = data2[0].items[0].sellers[0].commertialOffer.ListPrice
      let sellingPrice = data2[0].items[0].sellers[0].commertialOffer.Price
      push({
        ecommerce: {
          currencyCode: e.data.currency,
          remove: {
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
              dimension6: totPrice > sellingPrice ? "In Promo" : "Not In Promo"
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

    case "vtex:servicesPurchase": {
      const order = e.data;

      getProductsFromOrderData(e.data, e.data.data.transactionProducts);
      const ecommerce = {
        purchase: {
          actionField: getPurchaseObjectData(order),
          products: order.data.transactionProducts.map((product: ProductOrder) =>
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

    case "vtex:orderPlaced": {
      // const order = e.data;

      // getProductsFromOrderData(e.data, e.data.transactionProducts);

      // const ecommerce = {
      //   purchase: {
      //     actionField: getPurchaseObjectData(order),
      //     products: order.transactionProducts.map((product: ProductOrder) =>
      //       getProductObjectData(product)
      //     ),
      //   },
      // };

      // // Backwards compatible event
      // push({
      //   ecommerce,
      //   event: "pageLoaded",
      // });

      // return;
    }

    case "vtex:productImpression": {
      const { currency, impressions, product, position } = e.data;
      let oldImpresionFormat: Record<string, any> | null = null;
      // const options = {
      //   method: "GET",
      // };
      // const url3 = "/api/catalog/pvt/collection"
      // let data : any = await fetch(url3, options).then((response) => response.json())
      // console.log(data)

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


    case "vtex:promotionClick": {
      let promotions = e.data.promotions
      push({
        'event': 'eec.promotionClick',
        'ecommerce': {
          'promoClick': {
            promotions
          }
        }
      })
      return
    }

    // case "vtex:filterManipulation": {
    //   let filterInteraction: String = '';
    //   //Si filtra sul dataLayer tutti gli eventi con nome filterManipulation
    //   const filtri = window.dataLayer?.filter(evento => evento.event == "filterManipulation")
    //   let filterChainedDetails = ''
    //   //Se non ci sono eventi con quel nome siamo nel caso del primo filtro selezionato
    //   if (filtri.length == 0) {
    //     filterInteraction = "select"
    //     filterChainedDetails = `filters ${e.data.items.filterName.replace(":", "").toLowerCase()}=${e.data.items.filterValue}`
    //   } else {
    //     // Se ci sono già eventi con quel nome e la stringa aggiunta è la stessa la sostituisco con "" per rimuovere il filtro da filterChainedDetail
    //     if (filtri[filtri.length - 1]?.filterChainedDetails.includes(`filters ${e.data.items.filterName.replace(":", "").toLowerCase()}=${e.data.items.filterValue}`)) {
    //       filterChainedDetails = `${filtri[filtri.length - 1]?.filterChainedDetails.replace(`filters ${e.data.items.filterName.replace(":", "").toLowerCase()}=${e.data.items.filterValue}`, "")}`
    //     }
    //     else {
    //       //se non ci sono eventi con quel nome lo aggiungo
    //       filterChainedDetails = `${filtri[filtri.length - 1]?.filterChainedDetails}&filters ${e.data.items.filterName.replace(":", "").toLowerCase()}=${e.data.items.filterValue}`
    //     }
    //   }

    //   filtri.map(filtro => {
    //     if (e.data.items.filterValue == filtro.filterValue && filtro.filterInteraction === "select") {
    //       filterInteraction = "remove"
    //     }
    //     if (e.data.items.filterValue == filtro.filterValue && filtro.filterInteraction === "remove") {
    //       filterInteraction = "select"
    //     }
    //     if (e.data.items.filterValue == filtro.filterValue && e.data.items.filterName == "CleanFilters") {
    //       filterInteraction = "reset"
    //     }
    //     if (filterInteraction == "") {
    //       filterInteraction = "select"
    //     }
    //   });
    //   if (e.data.items.filterName == "CleanFilters") {
    //     filterInteraction = "reset"
    //   }

    //   let productCategory = e?.data?.items?.filterProductCategory
    //   //if selecting a filter we have more than one category
    //   if (productCategory == "") {
    //     setTimeout(() => {
    //       push({
    //         event: "filterManipulation",
    //         'filterInteraction': filterInteraction,
    //         filterName: filterInteraction !== "reset" ? e.data.items.filterName.replace(":", "").toLowerCase() : "reset",
    //         filterValue: filterInteraction !== "reset" ? e.data.items.filterValue : "",
    //         filterProductCategory: getProductCategory(),
    //         //Verifico che la stringa non inizia o finisce con & e che non contenga &&
    //         'filterChainedDetails': filterInteraction !== "reset" ?
    //           (filterChainedDetails[0] == "&" || filterChainedDetails[1] == "&" || filterChainedDetails[filterChainedDetails.length - 1] == "&" ? filterChainedDetails.replace("&", "") : filterChainedDetails && filterChainedDetails.replace("&&", "&"))
    //           :
    //           ""
    //       });
    //     }, 5000)
    //   } else {
    //     getStringCategoryFromId(productCategory).then(
    //       (res: any) => {
    //         push({
    //           event: "filterManipulation",
    //           'filterInteraction': filterInteraction,
    //           filterName: filterInteraction !== "reset" ? e.data.items.filterName.replace(":", "").toLowerCase() : "reset",
    //           filterValue: filterInteraction !== "reset" ? e.data.items.filterValue : "",
    //           filterProductCategory: productCategory == "" ? "" : res.AdWordsRemarketingCode,
    //           //Verifico che la stringa non inizia o finisce con & e che non contenga &&
    //           'filterChainedDetails': filterInteraction !== "reset" ?
    //             (filterChainedDetails[0] == "&" || filterChainedDetails[1] == "&" || filterChainedDetails[filterChainedDetails.length - 1] == "&" ? filterChainedDetails.replace("&", "") : filterChainedDetails && filterChainedDetails.replace("&&", "&"))
    //             :
    //             ""
    //         });
    //       }
    //     );
    //   }
    // }
    //   break;

    case "vtex:productComparison": {
      var allPromise: any[] = [];
      var objsToPush: any[] = [];
      e.data.products.map((o: any) => {
        allPromise.push(getCategoryFromIdProduct(o.productId));
      });
      let values = await Promise.all(allPromise);
      const catId = getCategoryIdFromProducts(values);
      const checkbox = document.getElementById("id-differences")

      checkbox?.addEventListener("click", async function () {
        const checkedCheckbox = (document.getElementById("id-differences") as HTMLInputElement).value
        let categoryStringValue
        if (catId !== null) {
          categoryStringValue = await getStringCategoryFromId(catId)
        } else {
          categoryStringValue = ""
        }
        push({
          event: "showDifferences",
          'showDifferenceStatus': checkedCheckbox == "true" ? "OFF" : "ON",
          productCategoryComparator: categoryStringValue.AdWordsRemarketingCode,
        })
        return
      })


      if (catId != null) {
        let categoryStringValue = await getStringCategoryFromId(catId)
        // objsToPush.push({
        //   event: "productComparison",
        //   compareProductN: values.length,
        //   compareCategory: categoryStringValue.AdWordsRemarketingCode,
        // });
        objsToPush.push({
          'event': 'compareProducts',
          'eventCategory': 'Product Interest',
          'eventAction': 'Compare Products',
          'eventLabel': categoryStringValue.AdWordsRemarketingCode + ' - ' + values.length // Dynamic + Dynamic
        })
      } else {
        // objsToPush.push({
        //   event: "productComparison",
        //   compareProductN: values.length,
        //   compareCategory: "",
        // });
        objsToPush.push({
          'event': 'compareProducts',
          'eventCategory': 'Product Interest', // Fixed value
          'eventAction': 'Compare Products', // Fixed value
          'eventLabel': values.length // Dynamic + Dynamic
        })
      }
      objsToPush.map((event: any) => push(event))
      break;
    }

    case "vtex:pdfDownload": {
      let url = e.data.url
      let pCode = e.data.productCode
      let pName = e.data.productName
      push({
        'event': 'pdfDownload',
        'eventCategory': 'Support',
        'eventAction': 'Download - ' + url,
        'eventLabel': pCode + ' - ' + pName
      })
    }

    case "vtex:pageComponentInteraction": {
      if (e.data.id == "optin_granted") {
        push({
          event: e.data.id,
        });
      }
      break;
    }

    case "vtex:stripeBanner_clickCTA": {
      let device = "";
      if (window) {
        window.innerWidth > 1024 ? (device = "desk") : (device = "mob")
      }
      const objEvent = {
        "event": "stripeBanner_clickCTA",
        "eventCategory": "CTA Click",
        "eventAction": e.data.data[0].section,
        "eventLabel": `click_info_stripe_${device}`
      }
      push(objEvent)

      break;
    }
    case 'vtex:preOrderPageCtaEvent': {
      const urlPath = window?.location?.pathname
      push({
        event: 'cta_click',
        /* GA4 */
        link_url: window?.location?.href,
        link_text: e.data.linkText.charAt(0).toUpperCase() + e.data.linkText.slice(1).toLowerCase(),
        checkpoint: e.data.checkpoint,
        /* UA */
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: `subscription_pre-order`,
        /*  */
        area: getContentGrouping(urlPath),
        type: e.data.type,
      })

      break
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
        "type": "Subscribe to our newsletter"
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
        "type": "Subscribe to our newsletter"
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
        "type": "Subscribe to our newsletter"
      })
      break;
    }
    case "vtex:accountCreation": {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
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

    default: {
      break;
    }
  }
}

// function getListProductClick(data: any, category: string) {
//   var listName = "";
//   if (data.list !== undefined) {
//     listName = data.list;
//   }
//   if (data.list !== undefined && data.map !== undefined) {
//     if (data.query.split("/").includes("accessori")) {
//       listName = "accessories_impression_list";
//     } else {
//       listName = "catalog_page_impression_list_" + category.split('_')[category.split('_').length-1];
//     }
//   }

//   return { actionField: { list: listName } };
// }

function getListProductClick2(category: string) {
  const locationArray = window.dataLayer.filter(item => item.event == "pageView")
  const location = locationArray[(locationArray.length) - 1].page
  const productCategory = locationArray[(locationArray.length) - 1]["product-category"]
  var listName = "";

  if (location.split('?')[0] == '/') {
    listName = "homepage_impression_list"; //homepage
  }
  else if (location.includes("urzadzenia")) {
    listName = "catalog_page_impression_list_" + category.split('_')[category.split('_').length - 1]; //plp
  }
  else if (location.includes("wishlist")) {
    listName = "wishlist_page_impression_list";
  }
  else if (location.endsWith("/p") && productCategory == category) {
    listName = "product_page_up_selling_impression_list"
  }
  else if (location.endsWith("/p")) {
    listName = "product_page_cross_selling_impression_list"
  }
  else if (location.includes("akcesoria")) {
    listName = "accessories_impression_list";
  }
  else {
    listName = "campaign_page_impression_list";
  }
  return listName.toLowerCase();
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
  const result = data.filter((o: any) => o.Name == "Kolor");
  return result.length > 0 ? result[0].Value[0] : "";
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name == "kolor");
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


function setCurrentListFromUrl(values: any) {
  let nameList = ""
  let accessoriesList = ["15", "13", "11", "14", "18", "17", "12", "16", "2"]
  let url = window.location.pathname
  const productCategory = window.dataLayer.find(cat => cat.event == "pageView")["product-category"]
  const AdWordsRemarketingCode = values.AdWordsRemarketingCode
  if (url == "/") {
    nameList = "homepage_impression_list"
  }
  else if (url.includes("urzadzenia")) {
    nameList = "catalog_page_impression_list_" + values.AdWordsRemarketingCode.split('_')[values.AdWordsRemarketingCode.split('_').length - 1];
  }
  else if (window.location.href.includes("wishlist"))
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
  return nameList.toLowerCase()
}

// function isCategoryList(list: string, categories: string[]) {
//   let truthValue = false;
//   if (!categories) {
//     return false;
//   }
//   categories.forEach((c: string) => {
//     truthValue = truthValue || c.replace("/", " ").includes(list);
//   });
//   return truthValue;
// }

// function getList(list: string, categories: string[], category: string) {
//   let ImpressionList = "";
//   let newList = isCategoryList(list, categories) ? "Search result" : list;
//   switch (newList) {
//     case "Search result":
//       if (categories.includes("/accessori/")) {
//         ImpressionList = "accessories_impression_list";
//       } else {
//         ImpressionList = "catalog_page_impression_list_" + category.split('_')[category.split('_').length-1];
//       }
//       break;
//     case "wishlist":
//       ImpressionList = "wishlist_page_impression_list";
//       break;
//     default:
//       if (list !== "List of products") {
//         ImpressionList = list;
//       } else {
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

// function setListProductDetail() {
//   const categoryArray = window.dataLayer.filter(item => item.event == "eec.productClick")
//   let list = ''
//   if(categoryArray.length <= 0){
//     list = "product_page_up_selling_impression_list"
//   } else{
//     list = categoryArray[(categoryArray.length) -1].ecommerce.click.list.actionField.list
//   }

//   return { actionField: { list: list.toLowerCase() } };
// }

function getProductImpressionObjectData() {
  return ({ product, position }: Impression) =>
    product.categoryId !== undefined
      ? getStringCategoryFromId(product.categoryId).then((respone) => {
        let totPrice = product.items[0].sellers[0].commertialOffer.ListPrice
        let sellingPrice = product.items[0].sellers[0].commertialOffer.Price
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
          dimension6: totPrice > sellingPrice ? "In Promo" : "Not In Promo"
        };
      })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
        getStringCategoryFromId(prodAPI.CategoryId).then((respone) => {
          let totPrice = product.items[0].sellers[0].commertialOffer.ListPrice
          let sellingPrice = product.items[0].sellers[0].commertialOffer.Price
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
            dimension6: totPrice > sellingPrice ? "In Promo" : "Not In Promo"
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
      price: service.price == 0 || service.price == "0" ? "0" : (service.price / 100),
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
        variant: getValuefromSpecifications(values[0], "Kolor"),
        quantity: value.quantity,
        dimension4: costructionType(
          findDimension(values[0], "constructionType")
        ),
        dimension5:
          getValuefromSpecifications(values[0], "sellable") === "true"
            ? "Sellable Online"
            : "Not Sellable Online",
        dimension6: value.originalPrice > value.sellingPrice ? "In Promo" : "Not In Promo",
      };
      products.push(obj);
    })
  );
  if (!isPushedPurchase(window.dataLayer, data.data.transactionId)) {
    push({
      event: "eec.purchase",
      ecommerce: {
        currencyCode: data.currency,
        purchase: {
          actionField: {
            id: data.data.transactionId,
            affiliation: data.data.transactionAffiliation,
            revenue: data.data.transactionTotal,
            tax: data.data.transactionTax,
            shipping: data.data.transactionShipping,
            coupon: data.data.coupon !== undefined ? data.data.coupon : "",
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
  };
}

// function getProductCategory() {
//   const oneCategory = document.querySelectorAll(".vtex-search-result-3-x-filter__container.bb.b--muted-4.vtex-search-result-3-x-filter__container--produkt- label.vtex-checkbox__label.w-100.c-on-base.pointer")

//   if (oneCategory.length <= 1) {
//     if (oneCategory[0]?.textContent == "Lodowki") {
//       return "SC_WP_FG_CO_Cooling"
//     }
//     else if (oneCategory[0]?.textContent == "Zamrazarki") {
//       return "SC_WP_FG_CO_Freezing"
//     }
//     else if (oneCategory[0]?.textContent == "Pralki") {
//       return "SC_WP_FG_LD_WashingMachines"
//     }
//     else if (oneCategory[0]?.textContent == "Suszarki") {
//       return "SC_WP_FG_LD_Dryers"
//     }
//     else if (oneCategory[0]?.textContent == "Pralkosuszarki") {
//       return "SC_WP_FG_LD_WasherDryers"
//     }
//     else if (oneCategory[0]?.textContent == "Piekarniki") {
//       return "SC_WP_FG_CK_Ovens"
//     }
//     else if (oneCategory[0]?.textContent == "Płyty grzewcze") {
//       return "SC_WP_FG_CK_Hobs"
//     }
//     else if (oneCategory[0]?.textContent == "Kuchenki mikrofalowe") {
//       return "SC_WP_FG_CK_Microwaves"
//     }
//     else if (oneCategory[0]?.textContent == "Okapy") {
//       return "SC_WP_FG_CK_Hoods"
//     }
//     else if (oneCategory[0]?.textContent == "Kuchnie wolnostojące") {
//       return "SC_WP_FG_CK_Cookers"
//     }
//     else if (oneCategory[0]?.textContent == "Zmywarki") {
//       return "SC_WP_FG_DW_Dishwashers"
//     }
//     else {
//       return ""
//     }
//   } else {
//     return ""
//   }
// }

function getDimension8(productData: any, dim4: string) {
  if (dim4 === "Not Sellable Online") {
    return dim4;
  }
  let availableQuantity = productData?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity
  return availableQuantity > 0 ? "In Stock" : "Out of Stock"
}

