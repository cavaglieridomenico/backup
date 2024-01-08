import push from './push'
import {
  // Order,
  PixelMessage,
  // ProductOrder,
  Impression,
  CartItem,
} from '../typings/events'
import { AnalyticsEcommerceProduct } from '../typings/gtm'
import { getProductCategoryForList } from '../utils/generic'
import { getContentGrouping } from './commonMethods'

export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {

    // case 'vtex:servicesPurchase': {
    //   getProductsFromOrderData(e.data.data, e.data.data.transactionProducts)

    //   const ecommerce = {
    //     purchase: {
    //       actionField: getPurchaseObjectData(e.data.data),
    //       products: e.data.data.transactionProducts.map(
    //         (product: ProductOrder) => getProductObjectData(product)
    //       ),
    //     },
    //   }

    //   // Backwards compatible event
    //   push({
    //     ecommerce,
    //     event: 'pageLoaded',
    //   })

    //   return
    // }

    // case 'vtex:addToWishlist': {
    //   push({
    //     event: 'wishlist',
    //     eventCategory: 'Intention to Buy',
    //     eventAction: 'Add to Wishlist',
    //     eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`,
    //   })
    //   return
    // }
    case 'vtex:removeToWishlist': {
      push({
        event: 'wishlist',
        eventCategory: 'Intention to Buy',
        eventAction: 'Remove from Wishlist',
        eventLabel: `${e.data.items.product.items[0].name} - ${e.data.items.product.items[0].complementName}`,
      })
      return
    }

    case 'vtex:productView': {
      const { selectedSku, productName, brand } = e.data.product
      const { currency } = e.data

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
              price =
                price !== undefined && (price == 0 || price == '0')
                  ? ''
                  : `${e.data.product.items[0].sellers[0].commertialOffer.Price}` ==
                    '3000'
                  ? ''
                  : `${e.data.product.items[0].sellers[0].commertialOffer.Price}` ==
                    '9999'
                  ? ''
                  : `${e.data.product.items[0].sellers[0].commertialOffer.Price}`
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
            let dim8Value =
              e.data.product.selectedSku.sellers[0].commertialOffer
                .AvailableQuantity > 0
                ? 'In stock'
                : findDimension(data, 'sellable') != 'true'
                ? 'Not Sellable Online'
                : 'Out of Stock'

            getStringCategoryFromId(e.data.product.categoryId).then(
              (response) => {
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
                          category: response.AdWordsRemarketingCode || "",
                          id: e.data?.product?.productReference,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value || "",
                          dimension6: dim6Value,
                          dimension8: dim8Value,
                          dimension10: getDimension10(response.AdWordsRemarketingCode),
                          price:
                            price !== undefined && (price == 0 || price == '0')
                              ? ''
                              : `${e.data.product.items[0].sellers[0].commertialOffer.Price}` ==
                                '3000'
                              ? ''
                              : `${e.data.product.items[0].sellers[0].commertialOffer.Price}` ==
                                '9999'
                              ? ''
                              : `${e.data.product.items[0].sellers[0].commertialOffer.Price}`,
                        },
                      ],
                    },
                  },
                  event: 'eec.productDetail',
                }
                push({ecommerce: null})
                push(pr)
              }
            )
          })
        )
        .catch((err) => console.error(err))

      return
    }

    case 'vtex:productClick': {
      const { productName, brand, sku, properties } = e.data.product
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
                  values.AdWordsRemarketingCode,
                  properties
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
                          category: values.AdWordsRemarketingCode || "",
                          id: e.data?.product?.productReference,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value || '',
                          dimension6: dim6Value,
                          dimension10: getDimension10(values.AdWordsRemarketingCode),
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

    case 'vtex:pdfDownload': {
      let url = e.data.url
      let pCode = e.data.productCode
      let pName = e.data.productName?.split(' ').slice(0, -1).join(' ')
      if (window.location.pathname !== '/landings/herd-und-backofensets') {
        push({
          event: 'pdfDownload',
          eventCategory: 'Support',
          eventAction: 'Download - ' + url,
          eventLabel: pCode + ' - ' + pName,
        })
        break
      }
    }

    // case 'vtex:redeemAPromo': {
    //   console.log(e.data, 'REDEEEEM')
    //   push({
    //     event: 'redeemAPromo',
    //     eventCategory: 'Promo',
    //     eventAction: 'Redeem a Promo - ' + e.data.promo[0].promoDesc,
    //     eventLabel: e.data.promo[0].promoName,
    //   })

    //   break
    // }

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
            // actionField: {
            //   action: 'add',
            // },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              category: values.AdWordsRemarketingCode || '',
              id: sku.productRefId,
              name: sku.name,
              price:
                `${sku.price}` == '0' ? '' : setPriceFormat(`${sku.price}`),
              quantity: sku.quantity,
              variant: findVariant(data),
              dimension4: dim4Value,
              dimension5: dim5Value || "",
              dimension6: dim6Value,
              dimension10: getDimension10(values.AdWordsRemarketingCode),
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
            // actionField: {
            //   action: 'remove',
            // },
            products: items.map((sku: any) => ({
              brand: sku.brand,
              id: sku.productRefId,
              category: values.AdWordsRemarketingCode || "",
              name: sku.name,
              price:
                `${sku.price}` == '0' ? '' : setPriceFormat(`${sku.price}`),
              quantity: sku.quantity,
              variant: findVariant(data),
              dimension4: dim4Value,
              dimension5: dim5Value || "",
              dimension6: dim6Value,
              dimension10: getDimension10(values.AdWordsRemarketingCode),
            })),
          },
        },
        event: 'eec.removeFromCart',
      })
      break
    }

    case 'vtex:cartChanged': {
      let products = e.data.items
      pushCartState(products)
      return
    }

    case 'vtex:orderPlaced': {
      // const order = e.data

      // getProductsFromOrderData(e.data, e.data.transactionProducts)

      // const ecommerce = {
      //   purchase: {
      //     actionField: getPurchaseObjectData(order),
      //     products: order.transactionProducts.map((product: ProductOrder) =>
      //       getProductObjectData(product)
      //     ),
      //   },
      // }

      // push({
      //   // @ts-ignore
      //   event: 'orderPlaced',
      //   ...order,
      //   ecommerce,
      // })

      // // Backwards compatible event
      // push({
      //   ecommerce,
      //   event: 'pageLoaded',
      // })

      // return
      break
    }

    case 'vtex:productImpression': {
      const { currency, impressions } = e.data

      const forceList = e.data.forceList

      const parsedImpressions = (impressions || []).map(
        getProductImpressionObjectData(forceList)
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

    case 'vtex:cartLoaded': {
      const { orderForm, currency } = e.data

      push({
        event: 'eec.checkout',
        ecommerce: {
          currencyCode: currency,
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

    case 'vtex:productImageClick': {
      push({
        event: e.data.event,
        ...e.data.data,
      })
      break
    }

    // case 'vtex:promoView': {
    //   push({ ecommerce: null })
    //   const { promotions } = e.data

    //   push({
    //     event: 'eec.promotionView',
    //     ecommerce: {
    //       promoView: {
    //         promotions: promotions,
    //       },
    //     },
    //   })
    //   break
    // }

    // case 'vtex:promotionClick': {
    //   push({ ecommerce: null })

    //   const { promotions } = e.data

    //   push({
    //     event: 'eec.promotionClick',
    //     ecommerce: {
    //       promoClick: {
    //         promotions: promotions,
    //       },
    //     },
    //   })
    //   break
    // }

    case 'vtex:productRegistration': {
      push({
        event: 'productRegistration',
      })
      break
    }

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

    case 'vtex:cs_contact': {
      if (e.data && e.data.eventData[0]) {
        let eventName = e.data.event
        let eventCategory = e.data.eventData[0]?.eventCategory
        let eventAction = e.data.eventData[0]?.eventAction
        let eventValue = e.data.eventData[0]?.eventValue
        push({
          event: eventName,
          eventCategory: eventCategory,
          eventAction: eventAction,
          eventValue: eventValue,
        })
      }
      break
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
    case "vtex:newsletterLink": {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: 'newsletter_box_bottom',

        "link_url": window?.location?.href,
        "link_text": e.data.text ?? "Subscribe to Newsletter",
        "checkpoint": `1`,
        "area": getContentGrouping(urlPath),
        "type": e.data.text ?? "Subscribe to Newsletter"
      })
      break
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
    case 'vtex:newsletterAutomatic': {
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
    case "vtex:newsletterSubscription": {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: 'newsletter_subscription_page',

        "link_url": window?.location?.href,
        "link_text": e.data.text,
        "checkpoint": `1`,
        "area": getContentGrouping(urlPath),
        "type": e.data.text
      })
      break
    }

    default: {
      break
    }
  }
}

function getListProductClick(productId: string, category: string, properties: any[]) {
  const isSpare = properties?.find((prop: any) => prop.name == "isSparePart")?.values?.[0] == "true"
  const impressionViews = window.dataLayer.filter(
    (item) => item?.event == 'eec.impressionView'
  )
  let allImpViews = []
  for (let index = 0; index < impressionViews.length; index++) {
    allImpViews.push(impressionViews[index]?.ecommerce?.impressions)
  }
  const flatImpViews: any[] = (allImpViews as any)?.flat(Infinity)
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
    } else if (previousContentGrouping === 'Accessories & Spare Parts' && isSpare) {
      listNameFallback = 'spare'
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
    if (!products.some((product: any) => product.quantity > 50)) {
      push({
        event: 'cartState',
        products: formatForProducts,
      })
    }
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
  const result = data.filter((o: any) => o.Name == 'Farbe')
  return result.length > 0 ? result[0].Value[0] : ''
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name == 'Farbe')
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

  return fetch('/_v/wrapper/api/catalog/category/' + idCategory, options).then(
    (response) => {
      return response.json()
    }
  )
}
// function getCategoryIdFromProducts(products: any) {
//   const firstCategory = products[0].CategoryId
//   const result = products.filter((o: any) => o.CategoryId != firstCategory)
//   return result.length == 0 ? firstCategory : null
// }

function getCategoryFromIdProduct(productId: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  return fetch(
    '/_v/wrapper/api/product/' + productId + '/category',
    options
  ).then((response) => {
    return response.json()
  })
}
// function getPurchaseObjectData(order: Order) {
//   return {
//     affiliation: order.transactionAffiliation,
//     coupon: order.coupon ? order.coupon : null,
//     id: order.orderGroup,
//     revenue: order.transactionTotal,
//     shipping: order.transactionShipping,
//     tax: order.transactionTax,
//   }
// }

// function getProductObjectData(product: ProductOrder) {
//   return {
//     brand: product.brand,
//     category: getCategoryID(product),
//     id: product.sku,
//     name: product.name,
//     price: product.price == 0 ? '' : product.price,
//     quantity: product.quantity,
//     variant: product.skuName,
//     dimension4: getDimension(product, 4),
//     dimension5: getDimension(product, 5),
//     dimension6: getDimension(product, 6),
//   }
// }

// function getCategoryID(product: any) {
//   const categoryId = product.properties.filter(
//     (obj: any) => obj.name.toLowerCase() === 'adwordsMarketingCode'
//   )
//   return categoryId
// }
// Transform this: "/Apparel & Accessories/Clothing/Tops/"
// To this: "Apparel & Accessories/Clothing/Tops"

function getDimension(product: any, dimension: number) {
  if (dimension === 4) {
    const result = product.properties.filter(
      (obj: any) => obj.name.toLowerCase() === 'sellable'
    )
    if (result.length > 0) {
      let sellable: string
      result[0].values[0] == 'false'
        ? (sellable = 'Not Sellable Online')
        : (sellable = 'Sellable Online')
      return sellable
    }
    return ''
  }

  if (dimension === 6) {
    let ListPrice, price

    if (product.items[0].sellers) {
      ListPrice = product.items[0]?.sellers[0].commertialOffer.ListPrice
      price = product.items[0]?.sellers[0].commertialOffer.Price
    } else {
      ListPrice = product.items[0][0]?.listPrice
      price = product.items[0][0]?.bestPrice
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

const getDimension10 = (category: string) => {
  if (!category || category == '') return ''
  if(category?.includes("_FG_")){
    return "finished goods"
  } else if (category?.includes("_AC_")){
    return "accessories"
  } else {
    return "spare parts"
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

function getProductImpressionObjectData(forceList: string) {
  return ({ product, position }: Impression) =>
    product.categoryId !== undefined
      ? getStringCategoryFromId(product.categoryId).then((respone) => {
          return {
            brand: product.brand,
            category: respone.AdWordsRemarketingCode || respone.Name,
            id: product.productReference,
            list: setCurrentListFromUrl(respone, forceList),
            name: product.productName,
            position,
            price:
              `${product.sku.seller.commertialOffer.Price}` == '3000'
                ? ''
                : `${product.sku.seller.commertialOffer.Price}` == '9999'
                ? ''
                : `${product.sku.seller!.commertialOffer.Price}`,
            variant: findVariantImpression(product.properties),
            dimension4: getDimension(product, 4),
            dimension5: getDimension(product, 5),
            dimension6: getDimension(product, 6),
            dimension10: getDimension10(respone?.AdWordsRemarketingCode)
          }
        })
      : getCategoryFromIdProduct(product.productId).then((prodAPI) =>
          getStringCategoryFromId(prodAPI.CategoryId).then((respone) => {
            return {
              brand: product.brand,
              category: respone.AdWordsRemarketingCode,
              id: product.sku.name,
              list: setCurrentListFromUrl(respone, undefined),
              name: product.productName,
              position,
              price:
                `${product.sku.seller.commertialOffer.Price}` == '3000'
                  ? ''
                  : `${product.sku.seller.commertialOffer.Price}` == '9999'
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
  return result[0]?.Value[0]
}
function costructionType(cType: string) {
  if (cType != 'Free Standing') {
    return cType?.replace(' ', '-')
  } else {
    return cType
  }
}
// function getSpecificationFromProduct(productId: string) {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//   }
//   return fetch(
//     '/_v/wrapper/api/catalog_system/products/' + productId + '/specification',
//     options
//   )
//     .then((response) => response.json())
//     .catch((err) => console.error(err))
// }

// function getValuefromSpecifications(specifications: any, name: string) {
//   const result = specifications.filter((s: any) => s.Name === name)
//   if (result.length === 0) {
//     return ''
//   } else {
//     return specifications.filter((s: any) => s.Name === name)[0].Value[0]
//   }
// }costructionType

// async function getProductsFromOrderData(data: any, transactionProducts: any) {
//   const productsFromOrder: any = []
//   const addServiceFromOrder: any = []
//   transactionProducts.map((product: any) => {
//     product.type === 'additionalService'
//       ? addServiceFromOrder.push(product)
//       : productsFromOrder.push(product)
//   })
//   var products: any[] = []
//   addServiceFromOrder.map((service: any) => {
//     var serviceTemp = {
//       name: service.name,
//       quantity: service.quantity,
//       id: service.id,
//       price:
//         service.price == 0 || service.price == '0' ? '' : service.price / 100,
//       category: 'additionalServices',
//     }
//     products.push(serviceTemp)
//   })

//   await Promise.all(
//     productsFromOrder.map(async (value: any) => {
//       let values = [
//         await getSpecificationFromProduct(value.id),
//         await getStringCategoryFromId(value.categoryId),
//       ]
//       var obj = {
//         name: removeRefIdFromProductName(value.name, value.skuRefId),
//         id: value.skuRefId,
//         price:
//           value.sellingPrice == '0' || value.sellingPrice == 0
//             ? ''
//             : value.sellingPrice,
//         brand: value.brand,
//         category: values[1].AdWordsRemarketingCode || "",
//         variant: getValuefromSpecifications(values[0], 'Farbe'),
//         quantity: value.quantity,
//         dimension4:
//           getValuefromSpecifications(values[0], 'sellable') === 'true'
//             ? 'Sellable Online'
//             : 'Not Sellable Online',
//         dimension5: costructionType(
//           findDimension(values[0], 'constructionType')
//         ) || "",
//         dimension6:
//           value.originalPrice && value.originalPrice > value.price
//             ? 'In promo'
//             : 'Not in promo',
//             dimension10: getDimension10(values[1].AdWordsRemarketingCode)
//       }
//       products.push(obj)
//     })
//   )
//   if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
//     window.dataLayer.push({ ecommerce: null })
//     push({
//       event: 'eec.purchase',
//       ecommerce: {
//         currencyCode: data.transactionCurrency,
//         purchase: {
//           actionField: {
//             id: data.transactionId,
//             affiliation: data.transactionAffiliation,
//             revenue: data.transactionTotal,
//             tax: data.transactionTax,
//             shipping: data.transactionShipping,
//             coupon: data.coupon !== undefined ? data.coupon : '',
//           },
//           products,
//         },
//       },
//     })
//   }
// }

// function isPushedPurchase(dataLayer: any, transactionId: string) {
//   return (
//     dataLayer.filter(
//       (e: any) =>
//         e.event === 'eec.purchase' &&
//         e.ecommerce.purchase.actionField.id === transactionId
//     ).length > 0
//   )
// }

// function removeRefIdFromProductName(name: string, refId: string) {
//   if (name.indexOf(' ' + refId) !== -1) {
//     return name.replace(' ' + refId, '')
//   } else if (name.indexOf(refId) !== -1) {
//     return name.replace(refId, '')
//   } else {
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
      ''
    ),
    brand: item.additionalInfo?.brandName ?? '',
    variant: item.skuName,
    price: item.sellingPrice / 100,
    quantity: item.quantity,
  }
}

function setCurrentListFromUrl(values: any, forceList: string | undefined) {
  let nameList = ''
  let accessoriesList = [
    '11',
    '12',
    '10',
    '9',
    '8',
    '38',
    '39',
    '35',
    '37',
    '32',
    '34',
    '33',
    '33',
    '36',
    '31',
    '30',
    '27',
    '28',
    '29',
  ]

  let url = window.location.pathname
  let hash = window.location.hash
  let href = window.location.href
  const productCategory = window.dataLayer.find(
    (cat) => cat.event == 'pageView'
  )['product-category']
  const AdWordsRemarketingCode = values.AdWordsRemarketingCode
  const productDetail = window.dataLayer.find(
    (el) => el.event == 'eec.productDetail'
  )
  const product =
    productDetail?.ecommerce.detail.products[0].category.includes('SC_BK_FG_')

  if (url == '/') {
    nameList = 'homepage_impression_list'
  } else if(url.includes("ersatzteile")){
    nameList = 'spare'
  } else if (href.includes('map=ft'))
    nameList = 'search_suggestion_impression_list'
  else if (url.includes('hausgeraete')) {
    //values.AdWordsRemarketingCode === undefined
    // nameList = `catalog_page_impression_list`
    nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split(
      '_'
    )
      .pop()
      .toLowerCase()}`
  } else if (hash.includes('wishlist'))
    nameList = 'wishlist_page_impression_list'
  else if (url.endsWith('/p') && productCategory == AdWordsRemarketingCode)
    nameList = 'product_page_up_selling_impression_list'
  else if (
    url.endsWith('/p') &&
    product &&
    accessoriesList.includes(values?.FatherCategoryId?.toString())
  )
    nameList = 'product_page_cross_selling_impression_list'
  else if (
    url.endsWith('/p') &&
    accessoriesList.includes(values?.FatherCategoryId?.toString())
  ) {
    //nameList = 'accessories_cross_selling_impression_list'
    nameList = 'product_page_cross_selling_impression_list'
  } else if (url.endsWith('/p'))
    nameList = 'product_page_cross_selling_impression_list'
  else if (url.includes('zubehoer')) {
    nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split(
      '_'
    ).slice(-1)}`
  }
  // else if (url.includes('herd-und-backofensets'))
  //   nameList = 'bundle_impression_list'
  else nameList = 'campaign_page_impression_list'
  return forceList ? forceList : nameList.toLowerCase()
}
