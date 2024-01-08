import push from './push'
import {
  Order,
  PixelMessage,
  ProductOrder,
  Impression,
  CartItem,
} from '../typings/events'
import { AnalyticsEcommerceProduct } from '../typings/gtm'
import { getPageType } from '../utils/utilityFunctionPageView'
import { getProductCategoryForList } from '../utils/generic'

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:servicesPurchase': {
      getProductsFromOrderData(e.data.data, e.data.data.transactionProducts)

      const ecommerce = {
        purchase: {
          actionField: getPurchaseObjectData(e.data.data),
          products: e.data.data.transactionProducts.map(
            (product: ProductOrder) => getProductObjectData(product)
          ),
        },
      }

      // Backwards compatible event
      push({
        ecommerce,
        event: 'pageLoaded',
      })

      return
    }
    case 'vtex:productImageClick': {
      push({
        event: e.data.event,
        ...e.data.data,
      })
      break
    }
    case 'vtex:productRegistration': {
      push({
        event: 'productRegistration',
      })
      break
    }
    case 'vtex:promoView': {
      let promotions = e.data.promotions
      window.dataLayer.push({ ecommerce: null })
      push({
        event: 'eec.promotionView',
        ecommerce: {
          promoView: {
            promotions,
          },
        },
      })
      break
    }
    case 'vtex:promotionClick': {
      let promotions = e.data.promotions
      window.dataLayer.push({ ecommerce: null })
      push({
        event: 'eec.promotionClick',
        ecommerce: {
          promoClick: {
            promotions,
          },
        },
      })
      break
    }

    case 'vtex:addToWishlist': {
      window.dataLayer.push({ ecommerce: null })
      push({
        event: 'wishlist',
        eventCategory: 'Intention to Buy',
        eventAction: 'Add to Wishlist',
        eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`,
      })
      break
    }

    case 'vtex:removeToWishlist': {
      window.dataLayer.push({ ecommerce: null })
      push({
        event: 'wishlist',
        eventCategory: 'Intention to Buy',
        eventAction: 'Remove from Wishlist',
        eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`,
      })
      break
    }

    case 'vtex:productView': {
      const { currency } = e.data
      const { selectedSku, productName, brand } = e.data.product
      push({
        event: 'contentIndex',
        contentIndex: document.getElementsByClassName(
          'hotpointuk-video-player-thron-pdp-0-x-figure hotpointuk-video-player-thron-pdp-0-x-figure--productPage'
        ).length,
      })

      let price: any
      const options = {
        method: 'GET',
      }
      const url =
        '/_v/wrapper/api/catalog_system/products/' +
        e.data.product.productId +
        '/specification'
      fetch(url, options)
        .then((response) =>
          response.json().then((data) => {
            try {
              price = e.data.product.items[0].sellers[0].commertialOffer.Price
            } catch {
              price = undefined
            }
            let dim5Value = costructionType(
              findDimension(data, 'constructionType')
            )
            let dim4Value =
              findDimension(data, 'sellable') == 'true'
                ? 'Sellable Online'
                : 'Not Sellable Online'
            let dim6Value = getDimension({ items: [{ ...selectedSku }] }, 6)
            const dim8Value =
              e.data.product.selectedSku.sellers[0].commertialOffer
                .AvailableQuantity > 0
                ? 'In stock'
                : 'Out of stock'

            getStringCategoryFromId(e.data.product.categoryId).then(
              (response) => {
                window.dataLayer.push({ ecommerce: null })
                const pr = {
                  ecommerce: {
                    currencyCode: currency,
                    detail: {
                      products: [
                        {
                          brand,
                          category: response.AdWordsRemarketingCode,
                          id: selectedSku.name,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value,
                          dimension6: dim6Value,
                          dimension8: dim8Value,
                          price:
                            price !== undefined && (price == 0 || price == '0')
                              ? ''
                              : price,
                        },
                      ],
                    },
                  },
                  event: 'eec.productDetail',
                }
                push(pr)
              }
            )
          })
        )
        .catch((err) => console.error(err))

      break
    }

    case 'vtex:unsellableProductView': {
      const { currency } = e.data
      const {
        brand,
        categoryId,
        productId,
        productName,
        productReference,
        items,
      } = e.data.product

      const numImages: number = items[0]?.images?.length ?? 0
      const numVideos: number = items[0]?.videos?.length ?? 0

      push({
        event: 'contentIndex',
        contentIndex: numImages + numVideos,
      })

      push({ ecommerce: null }) // Clear the previous ecomm object

      const productSpecifications = await getSpecificationFromProduct(productId)

      const price = items[0]?.sellers[0]?.commertialOffer?.Price ?? 0

      const dim5Value = costructionType(
        findDimension(productSpecifications, 'constructionType')
      )

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
                dimension4: 'Not Sellable Online',
                dimension5: dim5Value,
                dimension6: 'Not in Promo',
                dimension8: 'Not Sellable Online',
              },
            ],
          },
        },
        event: 'eec.productDetail',
      }

      push(pr)

      break
    }

    case 'vtex:productClick': {
      const { productName, brand, sku } = e.data.product
      const position = e.data.position ? { position: e.data.position } : {}
      let price: any
      const options = {
        method: 'GET',
      }
      const url =
        '/_v/wrapper/api/catalog_system/products/' +
        e.data.product.productId +
        '/specification'
      fetch(url, options)
        .then((response) =>
          response.json().then((data) => {
            try {
              price = e.data.product.items[0].sellers[0].commertialOffer.Price
            } catch {
              price = undefined
            }
            let dim5Value = costructionType(
              findDimension(data, 'constructionType')
            )
            let dim4Value =
              findDimension(data, 'sellable') == 'true'
                ? 'Sellable Online'
                : 'Not Sellable Online'
            let dim6Value = getDimension({ items: [{ ...sku }] }, 6)
            getStringCategoryFromId(e.data.product.categoryId).then(
              (values) => {
                const list = getListProductClick(
                  sku?.name,
                  values.AdWordsRemarketingCode
                )

                window.dataLayer.push({ ecommerce: null })

                const product = {
                  event: 'eec.productClick',
                  ecommerce: {
                    click: {
                      actionField: {
                        list,
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
                          dimension6: dim6Value,
                          price:
                            price !== undefined && (price == 0 || price == '0')
                              ? ''
                              : price,
                          ...position,
                        },
                      ],
                    },
                  },
                }
                push(product)
              }
            )
          })
        )
        .catch((err) => console.error(err))
      break
    }

    case 'vtex:addToCart': {
      const { items } = e.data
      const options = {
        method: 'GET',
      }
      const url =
        '/_v/wrapper/api/catalog_system/products/' +
        e.data.items[0].productId +
        '/specification'
      const skuUrl = `/api/catalog_system/pub/products/variations/${items[0].productId}`
      let data: any = await fetch(url, options).then((response) =>
        response.json()
      )
      let skuData: any = await fetch(skuUrl, options).then((response) =>
        response.json()
      )
      const { skus } = skuData
      let dim5Value = costructionType(findDimension(data, 'constructionType'))
      let dim4Value =
        findDimension(data, 'sellable') == 'true'
          ? 'Sellable Online'
          : 'Not Sellable Online'
      let dim6Value = getDimension({ items: [{ ...skus }] }, 6)
      let productAPI = await getCategoryFromIdProduct(items[0].productId)
      let values = await getStringCategoryFromId(productAPI.CategoryId)
      window.dataLayer.push({ ecommerce: null })
      push({
        ecommerce: {
          add: {
            actionField: {
              action: 'add',
            },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              category: values.AdWordsRemarketingCode,
              id: sku.variant,
              name: sku.name,
              price:
                `${sku.price}` == '0' ? '' : setPriceFormat(`${sku.price}`),
              quantity: sku.quantity,
              variant: findVariant(data),
              dimension4: dim4Value,
              dimension5: dim5Value,
              dimension6: dim6Value,
            })),
          },
          currencyCode: e.data.currency,
        },
        event: 'eec.addToCart',
      })

      break
    }
    case 'vtex:removeFromCart': {
      const { items } = e.data
      const options = { method: 'GET' }
      const url =
        '/_v/wrapper/api/catalog_system/products/' +
        e.data.items[0].productId +
        '/specification'
      let data = await fetch(url, options).then((response) => response.json())
      const skuUrl = `/api/catalog_system/pub/products/variations/${items[0].productId}`
      let skuData: any = await fetch(skuUrl, options).then((response) =>
        response.json()
      )
      const { skus } = skuData
      let dim5Value = costructionType(findDimension(data, 'constructionType'))
      let dim4Value =
        findDimension(data, 'sellable') == 'true'
          ? 'Sellable Online'
          : 'Not Sellable Online'
      let dim6Value = getDimension({ items: [{ ...skus }] }, 6)
      let productAPI = await getCategoryFromIdProduct(items[0].productId)
      let values = await getStringCategoryFromId(productAPI.CategoryId)
      window.dataLayer.push({ ecommerce: null })
      push({
        ecommerce: {
          currencyCode: e.data.currency,
          remove: {
            actionField: {
              action: 'remove',
            },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              id: sku.variant,
              category: values.AdWordsRemarketingCode,
              name: sku.name,
              price:
                `${sku.price}` == '0' ? '' : setPriceFormat(`${sku.price}`),
              quantity: sku.quantity,
              variant: findVariant(data),
              dimension4: dim4Value,
              dimension5: dim5Value,
              dimension6: dim6Value,
            })),
          },
        },
        event: 'eec.remove',
      })
      break
    }

    case 'vtex:cartChanged': {
      let products = e.data.items
      pushCartState(products)
      break
    }

    case 'vtex:orderPlaced': {
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
      window.dataLayer.push({ecommerce:null})
      push({
        ecommerce,
        event: "pageLoaded",
      });

      return;*/
      break
    }

    case 'vtex:productImpression': {
      const { currency, impressions } = e.data

      const parsedImpressions = (impressions || []).map(
        getProductImpressionObjectData()
      )

      Promise.all(parsedImpressions).then((values) => {
        window.dataLayer.push({ ecommerce: null })
        push({
          event: 'eec.impressionView',
          ecommerce: {
            currencyCode: currency,
            impressions: values,
          },
        })
      })

      break
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

    case 'vtex:cartLoaded': {
      const { orderForm } = e.data

      window.dataLayer.push({ ecommerce: null })
      push({
        event: 'eec.checkout',
        ecommerce: {
          checkout: {
            actionField: {
              step: 1,
            },
            products: orderForm.items.map(getCheckoutProductObjectData),
          },
        },
      })

      break
    }

    case 'vtex:promoView': {
      const { promotions } = e.data

      window.dataLayer.push({ ecommerce: null })
      push({
        event: 'promoView',
        ecommerce: {
          promoView: {
            promotions: promotions,
          },
        },
      })
      break
    }

    case 'vtex:promotionClick': {
      const { promotions } = e.data

      window.dataLayer.push({ ecommerce: null })
      push({
        event: 'promotionClick',
        ecommerce: {
          promoClick: {
            promotions: promotions,
          },
        },
      })
      break
    }

    case 'vtex:emptySearchView': {
      const query = window.location.pathname.replace('/', '')

      window.dataLayer.push({
        event: 'errorPage',
        errorType: 'No Search Result',
        errorQuery: query.replace('%20', ''),
      })

      break
    }

    // case 'vtex:menuFooter': {
    //   let eventLabel = window.location.origin + e.data.props[0]['eventLabel']

    //   push({
    //     event: 'menuFooter',
    //     eventCategory: 'Menu and Footer Clicks',
    //     eventLabel,
    //     eventAction: e.data.props[0]['eventAction'],
    //   })

    //   break
    // }

    // case 'vtex:funnelStepSpareUK': {
    //   push({
    //     event: 'funnelStepUK',
    //     eventCategory: 'Spare Parts LP Funnel',
    //     eventLabel: e.data.eventLabel,
    //     eventAction: e.data.eventAction,
    //   })

    //   break
    // }

    // case 'vtex:secondaryLevelMenuUk': {
    //   let eventAction = window.location.origin + e.data.props[0]['eventAction']

    //   push({
    //     event: 'secondaryLevelMenuUk',
    //     eventCategory: 'Search by FG Category',
    //     eventLabel: e.data.props[0]['eventLabel'],
    //     eventAction,
    //   })
    //   break
    // }
    // case 'vtex:drawingZoomUkSpare': {
    //   push({
    //     event: 'drawingZoomUk',
    //     eventCategory: 'Technical Drawing',
    //     eventAction: 'Zoom',
    //     eventLabel: e.data.eventLabel,
    //   })
    //   break
    // }
    // case 'vtex:searchZoomUkSpare': {
    //   push({
    //     event: 'searchZoomUk',
    //     eventCategory: 'Technical Drawing',
    //     eventLabel: e.data.eventLabel,
    //     eventAction: e.data.eventAction,
    //   })
    //   break
    // }

    // case 'vtex:myModelNumberUkSpare': {
    //   let url = window.location.href
    //   let originLength = window.location.origin.length

    //   let category = url.substring(originLength + 1)

    //   if (e.data.props[0].isPlp === true || category === 'spare-parts') {
    //     category = category.toLowerCase().replace(/\//g, ' - ')
    //     push({
    //       event: 'myModelNumberUk',
    //       eventCategory: 'Where do I Find my Model Number',
    //       eventAction: category,
    //       eventLabel: `Accessories & Spare Parts - ${url}`,
    //     })
    //   } else {
    //     let collectionBreadcrumb = document.getElementsByClassName(
    //       'hotpointuk-bredcrumbs-0-x-catLink'
    //     )
    //     if (collectionBreadcrumb.length == 0) {
    //       collectionBreadcrumb = document.getElementsByClassName(
    //         'hotpointuk-bredcrumbs-0-x-catLink'
    //       )
    //     }
    //     let categoryBread: any = []
    //     let singleCollection = Array.from(collectionBreadcrumb)
    //     let categoryFinal
    //     singleCollection.map((productCategory: any) => {
    //       categoryBread.push(productCategory?.text)
    //       categoryFinal = categoryBread.slice(1).join('- ')
    //       categoryFinal = categoryFinal.toLowerCase().replace(' parts', '')
    //     })

    //     push({
    //       event: 'myModelNumberUk',
    //       eventCategory: 'Where do I Find my Model Number',
    //       eventAction: categoryFinal,
    //       eventLabel: `Accessories & Spare Parts - ${url}`,
    //     })
    //   }

    //   break
    // }
    // case 'vtex:seeSubstituteUkSpare': {
    //   push({
    //     event: 'seeSubstituteUk',
    //     eventCategory: 'See Substitute',
    //     eventAction: e.data.eventAction,
    //   })
    //   break
    // }

    case 'vtex:productComparison': {
      var allPromise: any[] = []
      var objsToPush: any[] = []
      e.data.products.map((o: any) => {
        allPromise.push(getCategoryFromIdProduct(o.productId))
      })
      let values = await Promise.all(allPromise)
      const catId = values[0].CategoryId

      if (e.data.eventType == 'showDifferences') {
        let categoryStringValue
        if (catId !== null) {
          categoryStringValue = await getStringCategoryFromId(catId)
        } else {
          categoryStringValue = ''
        }
        push({
          event: 'showDifferences',
          showDifferenceStatus:
            e.data.showDifferenceStatus == false ? 'OFF' : 'ON',
          productCategoryComparator: categoryStringValue.AdWordsRemarketingCode,
        })
        return
      }
      // if(e.data.)
      if (catId != null) {
        let categoryStringValue = await getStringCategoryFromId(catId)
        objsToPush.push({
          event: 'productComparison',
          compareProductN: values.length,
          compareCategory: categoryStringValue.AdWordsRemarketingCode,
        })
        // objsToPush.push({
        //   event: 'compareProducts',
        //   eventCategory: 'Product Interest',
        //   eventAction: 'Compare Products',
        //   eventLabel:
        //     categoryStringValue.AdWordsRemarketingCode + ' - ' + values.length, // Dynamic + Dynamic
        // })
      } else {
        objsToPush.push({
          event: 'productComparison',
          compareProductN: values.length,
          compareCategory: '',
        })
        // objsToPush.push({
        //   event: 'compareProducts',
        //   eventCategory: 'Product Interest', // Fixed value
        //   eventAction: 'Compare Products', // Fixed value
        //   eventLabel: values.length, // Dynamic + Dynamic
        // })
      }
      objsToPush.map((event: any) => push(event))
      break
    }

    case 'vtex:pageComponentInteraction': {
      if (e.data.id == 'optin_granted') {
        push({
          event: e.data.id,
        })
      }
      break
    }

    case 'vtex:pdfDownload': {
      let url = e.data.url
      let pCode = e.data.productCode
      let pName = e.data.productName
      push({
        event: 'pdfDownload',
        eventCategory: 'Support',
        eventAction: 'Download - ' + url,
        eventLabel: pCode + ' - ' + pName,
      })
      break
    }

    case 'vtex:prodDetailsTab': {
      let tabName = window.location.href.split('#')[1]

      if (tabName === 'dettagli-tecnici') {
        push({
          event: 'prodDetailsTab',
          prodDetailsTabName: 'techData',
        })
        return
      }
      if (tabName === 'main-features') {
        push({
          event: 'prodDetailsTab',
          prodDetailsTabName: 'specialFeatures',
        })
        return
      }
      if (tabName === 'reviews') {
        push({
          event: 'prodDetailsTab',
          prodDetailsTabName: 'reviews',
        })
        return
      }
      if (tabName === 'documents') {
        push({
          event: 'prodDetailsTab',
          prodDetailsTabName: 'documents',
        })
        return
      }
      break
    }

    case 'vtex:wellBeing_discoverMore': {
      if (e.data.type && e.data.type === 'customCategory') {
        if (e.data.url.includes('prodotti')) {
          push({
            event: 'wellBeing_discoverMore',
            eventCategory: 'WB to LP CTA',
            eventAction: window.location.origin + e.data.url,
            eventLabel: window.location.href,
          })
          return
        }
        push({
          event: 'wellBeing_discoverMore',
          eventCategory: 'WB Card CTA',
          eventAction: window.location.origin + e.data.url,
          eventLabel: window.location.href,
        })
        return
      }

      let eventCategory = ''
      let eventAction = window.location.origin + e.data.promo[0].href
      if (eventAction.includes('prodotti')) {
        eventCategory = 'WB to LP CTA'
      } else {
        eventCategory = 'WB Card CTA'
      }

      const linkClassInfocard =
        'vtex-store-components-3-x-infoCardCallActionContainer--wellbeingSecondBanner'
      const linkClassSidebanner =
        'vtex-store-components-3-x-infoCardCallActionContainer--differentButtonArticle'
      const linkClassLabel =
        'hotpointuk-store-link-custom-0-x-link--secondColLink'
      let dataLayerLenght = window.dataLayer.length
      let lastEventClasses =
        window.dataLayer[dataLayerLenght - 1]['gtm.elementClasses']

      if (
        lastEventClasses.includes(linkClassInfocard) ||
        lastEventClasses.includes(linkClassSidebanner) ||
        lastEventClasses.includes(linkClassLabel)
      ) {
        push({
          event: 'wellBeing_discoverMore',
          eventCategory: eventCategory,
          eventAction: eventAction,
          eventLabel: window.location.href,
        })
        return
      }
      break
    }

    case 'vtex:wellBeing_categoryCTA': {
      const linkClass =
        'vtex-store-components-3-x-infoCardCallActionContainer--wellbeingSecondBanner'
      let dataLayerLenght = window.dataLayer.length
      let lastEventClasses =
        window.dataLayer[dataLayerLenght - 1]['gtm.elementClasses']
      if (lastEventClasses.includes(linkClass)) {
        push({
          event: 'wellBeing_categoryCTA',
          eventCategory: 'WB 6 Sense Category',
          eventAction: e.data.promo[0].Category,
        })
      }

      break
    }

    case 'vtex:stripeBanner_clickCTA': {
      let device = ''
      if (window) {
        window.innerWidth > 1024 ? (device = 'desk') : (device = 'mob')
      }
      const objEvent = {
        event: 'stripeBanner_clickCTA',
        eventCategory: 'CTA Click',
        eventAction: e.data.data[0].section,
        eventLabel: `click_info_stripe_${device}`,
      }
      push(objEvent)

      break
    }
    case 'vtex:ctaClicks': {
      if (e.data) {
        const objEvent = {
          event: 'ctaClicks',
          eventCategory: 'CTA Click',
          eventAction: 'Support',
          eventLabel: `Call now Popup`,
        }
        push(objEvent)
      }
      break
    }
    default: {
      break
    }
  }
}

// Old
// function getListProductClick(category: string) {
//   const locationArray = window.dataLayer.filter(item => item.event == "pageView")
//   const location = locationArray[(locationArray.length) -1].page
//   const productCategory = locationArray[(locationArray.length) -1]["product-category"]
//   var listName = "";

//     if(location?.split('?')[0] == '/') {
//       listName = "homepage_impression_list"; //homepage
//     }
//     else if(location?.includes("prodotti")){
//       listName = "catalog_page_impression_list_" + category.split('_')[category.split('_').length-1]; //plp
//     }
//     else if (location?.includes("account")) {
//       listName = "wishlist_page_impression_list";
//     }
//     else if(location?.endsWith("/p") && productCategory == category){
//       listName = "product_page_up_selling_impression_list"
//     }
//     else if(location?.endsWith("/p")){
//       listName = "product_page_cross_selling_impression_list"
//     }
//     else if (location?.includes("accessori")) {
//       listName = "accessories_impression_list";
//     }
//     else {
//       listName = "campaign_page_impression_list";
//     }
//   return { actionField: { list: listName.toLowerCase() } };
// }

// Get `list` name for eec.productClick
function getListProductClick(productId: string, category: string) {
  const impressionViews = window.dataLayer.filter(
    (item) => item?.event == 'eec.impressionView'
  )
  let allImpViews = []
  for (let index = 0; index < impressionViews.length; index++) {
    allImpViews.push(impressionViews[index]?.ecommerce?.impressions)
  }
  const flatImpViews: any[] = allImpViews?.flat(Infinity)
  // Find `list` value based on productId from past `eec.impressionView` viewed objects
  const listFromImpView: string = flatImpViews?.find(
    (impView) => impView?.id === productId
  )?.list

  if (listFromImpView) {
    return listFromImpView
  }
  // In case user clicks on product card before `eec.impressionView` analytics event
  else {
    const previousPageViewEvents = window.dataLayer.filter(
      (item) => item?.event == 'pageView'
    )

    const previousPageType: string = previousPageViewEvents
      ? previousPageViewEvents[previousPageViewEvents.length - 1]?.pageType
      : ''

    const previousContentGrouping: string = previousPageViewEvents
      ? previousPageViewEvents[previousPageViewEvents.length - 1]
        ?.contentGrouping
      : ''

    const productCategory = previousPageViewEvents
      ? previousPageViewEvents[previousPageViewEvents?.length - 1][
      'product-category'
      ]
      : ''
    const productCategoryForList = category
      ? getProductCategoryForList(category)
      : ''
    let listNameFallback = ''

    if (previousPageType === 'home') {
      listNameFallback = 'homepage_impression_list' //homepage
    } else if (previousPageType === 'search') {
      listNameFallback = 'search_suggestion_impression_list'
    } else if (previousContentGrouping === 'Accessories & Spare Parts') {
      listNameFallback = 'accessories_impression_list'
    } else if (previousPageType === 'category') {
      category
        ? (listNameFallback = `catalog_page_impression_list_${productCategoryForList}`)
        : (listNameFallback = 'catalog_page_impression_list')
    } else if (previousContentGrouping == 'Personal') {
      listNameFallback = 'wishlist_page_impression_list'
    } else if (previousPageType === 'detail' && productCategory == category) {
      category
        ? (listNameFallback = `product_page_up_selling_impression_list_${productCategoryForList}`)
        : (listNameFallback = 'product_page_up_selling_impression_list')
    } else if (previousPageType === 'detail') {
      category
        ? (listNameFallback = `product_page_cross_selling_impression_list_${productCategoryForList}`)
        : (listNameFallback = 'product_page_cross_selling_impression_list')
    } else {
      listNameFallback = 'campaign_page_impression_list'
    }
    return listNameFallback
  }
}

function setPriceFormat(price: string) {
  let newPrice = parseInt(price) / 100 + ''
  if (newPrice.indexOf('.') == -1) {
    return parseInt(newPrice).toFixed(2)
  } else {
    let arrayPrice = newPrice.split('.')
    return parseInt(arrayPrice[1]) < 10 ? newPrice + '0' : newPrice
  }
}

function objectHasEmptyValue(objects: any) {
  let keys = Object.keys(objects[0])
  let flag = false
  objects.forEach((e: any) => {
    for (let i = 0; i < keys.length; i++) {
      if (e[keys[i]] === '') {
        flag = true
      }
    }
  })
  return flag
}

function checkCart(dataLayer: any, products: any) {
  let results = dataLayer.filter((e: any) => e.event === 'cartState')
  if (results.length == 0) {
    return false
  } else {
    if (
      JSON.stringify(results[results.length - 1].products) ==
      JSON.stringify(products)
    ) {
      return true
    } else {
      return false
    }
  }
}
function pushCartState(products: any) {
  if (products.length !== 0) {
    if (objectHasEmptyValue(products)) {
      return
    }
  }
  let formatForProducts =
    products.length !== 0 ? getProductFromCartState(products) : []
  if (!checkCart(window.dataLayer, formatForProducts)) {
    push({
      event: 'cartState',
      products: formatForProducts,
    })
  }
}
function getProductFromCartState(products: any) {
  let newProducts: any = []

  products.forEach((element: any) => {
    var obj = {
      id: element.referenceId,
      price:
        element.price == '0' || element.price == 0
          ? ''
          : setPriceFormat(`${element.price}`),
      quantity: element.quantity,
    }
    newProducts.push(obj)
  })
  return newProducts
}

function findVariant(data: any) {
  const result = data.filter((o: any) => o.Name == 'Colour')
  return result.length > 0 ? result[0].Value[0] : ''
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name == 'Colour')
  return result.length > 0 ? result[0].values[0] : ''
}
function getStringCategoryFromId(idCategory: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  return !idCategory || idCategory == ''
    ? Promise.resolve('')
    : fetch('/_v/wrapper/api/catalog/category/' + idCategory, options).then(
      (response) => {
        return response.json()
      }
    )
}
// function getCategoryIdFromProducts(products: any) {
//   const firstCategory = products[0].CategoryId;
//   const result = products.filter((o: any) => o.CategoryId != firstCategory);
//   console.log(result)
//   return result.length == 0 ? firstCategory : null;
// }
async function getCategoryFromIdProduct(productId: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  return await fetch(
    '/_v/wrapper/api/product/' + productId + '/category',
    options
  ).then((response) => {
    return response.json()
  })
}
function getPurchaseObjectData(order: Order) {
  return {
    affiliation: order.transactionAffiliation,
    coupon: order.coupon ? order.coupon : null,
    id: order.orderGroup,
    revenue: order.transactionTotal,
    shipping: order.transactionShipping,
    tax: order.transactionTax,
  }
}

function getProductObjectData(product: ProductOrder) {
  return {
    brand: product.brand,
    category: getCategoryID(product),
    id: product.sku,
    name: product.name,
    price: product.price == 0 ? '' : product.price,
    quantity: product.quantity,
    variant: product.skuName,
    dimension4: getDimension(product, 4),
    dimension5: getDimension(product, 5),
    dimension6: getDimension(product, 6),
  }
}

function getCategoryID(product: any) {
  const categoryId = product.properties.filter(
    (obj: any) => obj.name.toLowerCase() === 'adwordsMarketingCode'
  )
  return categoryId
}
// Transform this: "/Apparel & Accessories/Clothing/Tops/"
// To this: "Apparel & Accessories/Clothing/Tops"

function getDimension(product: any, dimension: number) {
  if (dimension === 4) {
    const result = product.properties.filter(
      (obj: any) => obj.name.toLowerCase() === 'sellable'
    )
    if (result.length > 0) {
      let sellable: string
      result[0].values[0] === true
        ? (sellable = 'Not Sellable Online')
        : (sellable = 'Sellable Online')
      return sellable
    }
    return ''
  }

  if (dimension === 6) {
    let ListPrice, price

    if (product.items[0].sellers) {
      ListPrice = product.items[0].sellers[0].commertialOffer.ListPrice
      price = product.items[0].sellers[0].commertialOffer.Price
    } else {
      ListPrice = product.items[0][0].listPrice
      price = product.items[0][0].bestPrice
    }

    if (price < ListPrice) {
      return 'In Promo'
    } else {
      return 'Not in Promo'
    }
  } else {
    const result = product.properties.filter(
      (obj: any) => obj.name == 'constructionType'
    )
    if (result.length > 0) {
      return costructionType(result[0].values[0])
    }
    return ''
  }
}

// function setCurrentListFromUrl(values:any){
//   let nameList = ""
//   let accessoriesList = ["39", "33", "32", "37", "34", "35", "36", "42", "41", "40", "30", "31", "29", "38","15"]
//   let url = window.location.pathname
//   let hash = window.location.hash
//   const productCategory = window.dataLayer.find(cat => cat.event == "pageView")["product-category"]
//   const AdWordsRemarketingCode = values.AdWordsRemarketingCode

//   if(url == "/"){
//     nameList = "homepage_impression_list"
//   }
//   else if(url.includes("prodotti")){
//     values.AdWordsRemarketingCode === undefined ? nameList = "catalog_page_impression_list" : nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split("_").pop().toLowerCase()}`
//   }
//   else if(hash.includes("wishlist"))
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

// Get `list` name for eec.impressionView
function getListImpressionView(values: any) {
  let nameList = ''
  const accessoriesList = [
    '39',
    '33',
    '32',
    '37',
    '34',
    '35',
    '36',
    '42',
    '41',
    '40',
    '30',
    '31',
    '29',
    '38',
    '15',
  ]
  let url = window.location.pathname + window.location.search
  const pageType = getPageType(url)
  let hash = window.location.hash
  const productCategory = window.dataLayer.find(
    (cat) => cat?.event == 'pageView'
  )['product-category']
  const adWordsRemarketingCode = values?.AdWordsRemarketingCode
  const productCategoryForList = adWordsRemarketingCode
    ? getProductCategoryForList(adWordsRemarketingCode)
    : ''

  // To handle filtered search page for `search_suggestion_impression_list`
  const previousPageViewEvents = window.dataLayer.filter(
    (item) => item?.event == 'pageView'
  )
  const previousPageType: string = previousPageViewEvents
    ? previousPageViewEvents[previousPageViewEvents.length - 1].pageType
    : ''
  //const previousPageType: string = previousUrlPath ? getPageType(previousUrlPath): ""

  if (pageType === 'home') {
    nameList = 'homepage_impression_list'
  }

  // Naming of this list might change once new analytics guidelines released
  else if (pageType === 'search' || previousPageType === 'search') {
    nameList = 'search_suggestion_impression_list'
  } else if (url?.includes('accessori')) {
    nameList = 'accessories_impression_list'
  } else if (pageType === 'category') {
    // PLP
    adWordsRemarketingCode
      ? (nameList = `catalog_page_impression_list_${productCategoryForList}`)
      : (nameList = 'catalog_page_impression_list')
  } else if (hash.includes('wishlist')) {
    nameList = 'wishlist_page_impression_list'
  } else if (
    pageType === 'detail' &&
    accessoriesList.includes(values?.FatherCategoryId?.toString())
  )
    nameList = 'accessories_cross_selling_impression_list'
  else if (pageType === 'detail' && productCategory == adWordsRemarketingCode) {
    adWordsRemarketingCode
      ? (nameList = `product_page_up_selling_impression_list_${productCategoryForList}`)
      : (nameList = 'product_page_up_selling_impression_list')
  } else if (
    pageType === 'detail' &&
    productCategory !== adWordsRemarketingCode
  ) {
    adWordsRemarketingCode
      ? (nameList = `product_page_cross_selling_impression_list_${productCategoryForList}`)
      : (nameList = 'product_page_cross_selling_impression_list')
  } else {
    nameList = 'campaign_page_impression_list'
  }
  return nameList
}

function getProductImpressionObjectData() {
  return ({ product, position }: Impression) =>
    product.categoryId !== undefined
      ? getStringCategoryFromId(product?.categoryId)?.then((respone) => {
        return {
          brand: product.brand,
          category: respone.AdWordsRemarketingCode,
          id: product.sku.name,
          list: getListImpressionView(respone),
          name: product.productName,
          position,
          price:
            `${product.sku.seller!.commertialOffer.Price}` == '0'
              ? ''
              : `${product.sku.seller!.commertialOffer.Price}`,
          variant: findVariantImpression(product.properties),
          dimension4: getDimension(product, 4),
          dimension5: getDimension(product, 5),
          dimension6: getDimension(product, 6),
        }
      })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
        getStringCategoryFromId(prodAPI.CategoryId).then((respone) => {
          return {
            brand: product.brand,
            category: respone.AdWordsRemarketingCode,
            id: product.sku.name,
            list: getListImpressionView(respone),
            name: product.productName,
            position,
            price:
              `${product.sku.seller!.commertialOffer.Price}` == '0'
                ? ''
                : `${product.sku.seller!.commertialOffer.Price}`,
            variant: findVariantImpression(product.properties),
            dimension4: getDimension(product, 4),
            dimension5: getDimension(product, 5),
            dimension6: getDimension(product, 6),
          }
        })
      )
}

function findDimension(data: any, nameKey: string) {
  let result = data.filter((obj: any) => obj.Name == nameKey)
  return result[0] ? result[0].Value[0] : ''
}
function costructionType(cType: string) {
  if (cType.indexOf('Free ') !== -1) {
    let cTypeArray = cType.split(' ')
    return cTypeArray[0] + cTypeArray[1].toLowerCase()
  } else {
    return cType.replace(' ', '-')
  }
}
function getSpecificationFromProduct(productId: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
  return fetch(
    '/_v/wrapper/api/catalog_system/products/' + productId + '/specification',
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err))
}

function getValuefromSpecifications(specifications: any, name: string) {
  const result = specifications.filter((s: any) => s.Name === name)
  if (result.length === 0) {
    return ''
  } else {
    return specifications.filter((s: any) => s.Name === name)[0].Value[0]
  }
}

async function getProductsFromOrderData(data: any, transactionProducts: any) {
  const productsFromOrder: any = []
  const addServiceFromOrder: any = []
  transactionProducts.map((product: any) => {
    product.type === 'additionalService'
      ? addServiceFromOrder.push(product)
      : productsFromOrder.push(product)
  })
  var products: any[] = []
  addServiceFromOrder.map((service: any) => {
    var serviceTemp = {
      name: service.name,
      quantity: service.quantity,
      id: service.id,
      price:
        service.price == 0 || service.price == '0' ? '' : service.price / 100,
      category: 'additionalServices',
    }
    products.push(serviceTemp)
  })

  await Promise.all(
    productsFromOrder.map(async (value: any) => {
      let values = [
        await getSpecificationFromProduct(value.id),
        await getStringCategoryFromId(value.categoryId),
      ]
      var obj = {
        name: removeRefIdFromProductName(value.name, value.skuRefId),
        id: value.skuRefId,
        price:
          value.sellingPrice == '0' || value.sellingPrice == 0
            ? ''
            : value.sellingPrice,
        brand: value.brand,
        category: values[1].AdWordsRemarketingCode,
        variant: getValuefromSpecifications(values[0], 'Colour'),
        quantity: value.quantity,
        dimension4:
          getValuefromSpecifications(values[0], 'sellable') === 'true'
            ? 'Sellable Online'
            : 'Not Sellable Online',
        dimension5: costructionType(
          findDimension(values[0], 'constructionType')
        ),
        dimension6:
          value.originalPrice && value.originalPrice > value.price
            ? 'In promo'
            : 'Not in promo',
      }
      products.push(obj)
    })
  )
  if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
    window.dataLayer.push({ ecommerce: null })
    push({
      event: 'eec.purchase',
      ecommerce: {
        currencyCode: data.transactionCurrency,
        purchase: {
          actionField: {
            id: data.transactionId,
            affiliation: data.transactionAffiliation,
            revenue: data.transactionTotal,
            tax: data.transactionTax,
            shipping: data.transactionShipping,
            coupon: data.coupon !== undefined ? data.coupon : '',
          },
          products,
        },
      },
    })
  }
}

function isPushedPurchase(dataLayer: any, transactionId: string) {
  return (
    dataLayer.filter(
      (e: any) =>
        e.event === 'eec.purchase' &&
        e.ecommerce.purchase.actionField.id === transactionId
    ).length > 0
  )
}

function removeRefIdFromProductName(name: string, refId: string) {
  if (name.indexOf(' ' + refId) !== -1) {
    return name.replace(' ' + refId, '')
  } else if (name.indexOf(refId) !== -1) {
    return name.replace(refId, '')
  } else {
    return name
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
      ''
    ),
    brand: item.additionalInfo?.brandName ?? '',
    variant: item.skuName,
    price: item.sellingPrice / 100,
    quantity: item.quantity,
  }
}
