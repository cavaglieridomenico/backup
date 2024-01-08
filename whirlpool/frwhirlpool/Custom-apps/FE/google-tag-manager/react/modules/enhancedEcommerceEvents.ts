import push from './push'
import {
  //Order,
  PixelMessage,
  //ProductOrder,
  Impression,
  CartItem,
} from '../typings/events'
import { AnalyticsEcommerceProduct } from '../typings/gtm'
import { getContentGrouping } from './commonMethods'

export function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:productView': {
      const { selectedSku, productName, brand } = e.data.product
      let price: any
      const options = {
        method: 'GET',
      }
      const url =
        '/_v/wrapper/api/catalog_system/products/' +
        e.data.product.productId +
        '/specification'
      fetch(url, options)
        .then(response =>
          response.json().then(data => {
            try {
              price = e.data.product.items[0].sellers[0].commertialOffer.Price
            } catch {
              price = undefined
            }
            let dim6value = findDimension(data, 'Offres')
            let dim5Value = costructionType(
              findDimension(data, 'constructionType')
            )
            let dim4Value =
              findDimension(data, 'sellable') == 'true'
                ? 'Sellable Online'
                : 'Not Sellable Online'
            let dim8Value = getDimension8(e.data.product, dim4Value)
            getStringCategoryFromId(e.data.product.categoryId).then(
              response => {
                setTimeout(() => {
                  let nameList = setListFromUrlNewPDP(response)
                  const pr = {
                    ecommerce: {
                      detail: {
                        actionField: { list: nameList },
                        products: [
                          {
                            brand,
                            category: response.AdWordsRemarketingCode,
                            id: selectedSku.name,
                            name: productName,
                            variant: findVariant(data),
                            dimension4: dim4Value,
                            dimension5: dim5Value,
                            dimension6: dim6value,
                            dimension8: dim8Value,
                            price:
                              price !== undefined &&
                                (price == 0 || price == '0')
                                ? ''
                                : price,
                          },
                        ],
                      },
                    },
                    event: 'eec.productDetail',
                  }
                  push(pr)
                }, 2000)
              }
            )
          })
        )
        .catch(err => console.error(err))

      return
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
        .then(response =>
          response.json().then(data => {
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
            getStringCategoryFromId(e.data.product.categoryId).then(values => {
              let nameList = ''
              nameList = setListFromUrlNew(values, e.data.product)
              setTimeout(() => {
                // let list = getListProductClick(e.data, values.AdWordsRemarketingCode)
                const product = {
                  event: 'eec.productClick',
                  ecommerce: {
                    click: {
                      actionField: { list: nameList },
                      products: [
                        {
                          brand,
                          category: values.AdWordsRemarketingCode,
                          id: sku.name,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value,
                          dimension6: getDimension6(e.data),
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
              }, 2000)
            })
          })
        )
        .catch(err => console.error(err))
      return
    }

    case 'vtex:addToCart': {
      const urlPath = window?.location?.pathname
      // console.log("datalayer 2022_9");

      push({
        "event": "cta_click",
        "eventCategory": "CTA Click",
        "eventAction": getContentGrouping(urlPath),
        "eventLabel": `add to cart mobile`,

        "link_url": window?.location?.href,
        "link_text": "add to cart",
        "checkpoint": `1`,
        "area": getContentGrouping(urlPath),
        "type": "Add To Cart"
      })
      const { items } = e.data
      const options = {
        method: 'GET',
      }
      const url =
        '/_v/wrapper/api/catalog_system/products/' +
        e.data.items[0].productId +
        '/specification'
      fetch(url, options).then(response =>
        response.json().then(data => {
          let dim5Value = costructionType(
            findDimension(data, 'constructionType')
          )
          let dim4Value =
            findDimension(data, 'sellable') == 'true'
              ? 'Sellable Online'
              : 'Not Sellable Online'
          let dim6Value = findDimension(data, 'Offres')
          getCategoryFromIdProduct(items[0].productId).then(productAPI => {
            getStringCategoryFromId(productAPI.CategoryId).then(values => {
              getDiscuontedPriceFromId(items[0].productId).then(priceData => {
                let discountedPrice = priceData[0].items[0].sellers[0].commertialOffer.Price.toString()
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
                          discountedPrice !== undefined ||
                            discountedPrice == '0'
                            ? discountedPrice
                            : `${sku.price}` == '0'
                              ? ''
                              : setPriceFormat(`${sku.price}`),
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
              })
            })
          })
        })
      )

      return
    }

    case 'vtex:removeFromCart': {
      const { items } = e.data
      const options = {
        method: 'GET',
      }
      const url =
        '/_v/wrapper/api/catalog_system/products/' +
        e.data.items[0].productId +
        '/specification'
      fetch(url, options).then(response =>
        response.json().then(data => {
          let dim5Value = costructionType(
            findDimension(data, 'constructionType')
          )
          let dim4Value =
            findDimension(data, 'sellable') == 'true'
              ? 'Sellable Online'
              : 'Not Sellable Online'
          let dim6Value = findDimension(data, 'Offres')
          getCategoryFromIdProduct(items[0].productId).then(productAPI => {
            getStringCategoryFromId(productAPI.CategoryId).then(values => {
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
                        `${sku.price}` == '0'
                          ? ''
                          : setPriceFormat(`${sku.price}`),
                      quantity: sku.quantity,
                      variant: findVariant(data),
                      dimension4: dim4Value,
                      dimension5: dim5Value,
                      dimension6: dim6Value,
                    })),
                  },
                },
                event: 'eec.removeFromCart',
              })
            })
          })
        })
      )
      break
    }

    case 'vtex:cartChanged': {
      let products = e.data.items
      pushCartState(products)
      return
    }

    // case 'vtex:orderPlaced': {
    //   const order = e.data

    //   getProductsFromOrderData(e.data, e.data.transactionProducts)
    //   const ecommerce = {
    //     purchase: {
    //       actionField: getPurchaseObjectData(order),
    //       products: order.transactionProducts.map((product: ProductOrder) =>
    //         getProductObjectData(product)
    //       ),
    //     },
    //   }

    //   push({
    //     // @ts-ignore
    //     event: 'orderPlaced',
    //     ...order,
    //     ecommerce,
    //   })

    //   // Backwards compatible event
    //   push({
    //     ecommerce,
    //     event: 'pageLoaded',
    //   })

    //   return
    // }

    case 'vtex:productImpression': {
      const { currency, impressions, product, position } = e.data
      let oldImpresionFormat: Record<string, any> | null = null
      if (product != null && position != null) {
        // make it backwards compatible
        oldImpresionFormat = [
          getProductImpressionObjectData()({
            product,
            position,
          }),
        ]
      }
      if (oldImpresionFormat !== null) {
        console.log(oldImpresionFormat, 'OLD')
      }
      const parsedImpressions = (impressions || []).map(
        getProductImpressionObjectData()
      )
      Promise.all(parsedImpressions).then(values => {
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
      const { orderForm } = e.data

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
      push({ ecommerce: null })

      push({
        event: 'eec.promotionView',
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
      push({ ecommerce: null })

      push({
        event: 'eec.promotionClick',
        ecommerce: {
          promoClick: {
            promotions: promotions,
          },
        },
      })
      break
    }

    // case 'vtex:filterManipulation': {
    //   setTimeout(() => {
    //     let filterInteraction = 'select'
    //     // get current filter value and remove all accents, spaces and make it in lower case
    //     const currentFilterValue = e.data.items.filterValue
    //       .normalize('NFD')
    //       .replace(/[\u0300-\u036f]/g, '')
    //       .replace(' ', '-')
    //       .toLowerCase()
    //     if (!window.location.href.includes(currentFilterValue)) {
    //       filterInteraction = 'remove'
    //     }
    //     function getFilterChainedDetails(data: any) {
    //       const filtersFromUrl = window.location.href.split('map=')
    //       var filterChainDetails = ''
    //       if (
    //         filtersFromUrl.length > 1 &&
    //         !window.location.href.includes('category-3&query')
    //       ) {
    //         let filterCategories = filtersFromUrl[1]
    //           .split('category-3,')[1]
    //           .split('&query=')[0]
    //           .split(',')
    //         let valuesFromUrl = filtersFromUrl[1]?.split('/')
    //         let filteredVaulesFromUrl = valuesFromUrl?.splice(
    //           4,
    //           valuesFromUrl?.length
    //         )
    //         let lastElement = filteredVaulesFromUrl[
    //           filteredVaulesFromUrl.length - 1
    //         ].split('&searchState')[0]
    //         filteredVaulesFromUrl.pop()
    //         filteredVaulesFromUrl.push(lastElement)
    //         for (let i = 0; i < filteredVaulesFromUrl.length; i++) {
    //           if (i !== filteredVaulesFromUrl.length - 1)
    //             filterChainDetails += `filters ${filterCategories[i].replace(
    //               '-',
    //               ''
    //             )}=${filteredVaulesFromUrl[i]}&`
    //           else
    //             filterChainDetails += `filters ${filterCategories[i].replace(
    //               '-',
    //               ''
    //             )}=${filteredVaulesFromUrl[i]}`
    //         }
    //       }
    //       if (filterChainDetails === '') {
    //         filterChainDetails = `filters ${data.items.filterName}=${data.items.filterValue}`
    //       }
    //       return filterChainDetails
    //     }

    //     getStringCategoryFromId(e.data.items.filterProductCategory).then(
    //       res => {
    //         push({
    //           event: e.data.event,
    //           filterInteraction: filterInteraction,
    //           filterName: e.data.items.filterName,
    //           filterProductCategory: res.AdWordsRemarketingCode,
    //           filterValue: e.data.items.filterValue,
    //           filterChainedDetails: getFilterChainedDetails(e.data),
    //         })
    //       }
    //     )
    //   }, 3000)
    //   break
    // }

    case 'vtex:productComparison': {
      var allPromise: any[] = []
      e.data.products.map((o: any) => {
        allPromise.push(getCategoryFromIdProduct(o.productId))
      })
      Promise.all(allPromise).then(values => {
        const catId = getCategoryIdFromProducts(values)
        if (catId != null) {
          getStringCategoryFromId(catId).then(response => {
            push({
              event: 'productComparison',
              compareProductN: values.length,
              compareCategory: response.AdWordsRemarketingCode,
            })
          })
        } else {
          push({
            event: 'productComparison',
            compareProductN: values.length,
            compareCategory: '',
          })
        }
      })
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

    // case 'vtex:addToWishlist': {
    //   getStringCategoryFromId(e.data.items.product.categoryId).then(values => {
    //     let addToWishlist = {
    //       event: 'add_to_wishlist',
    //       ecommerce: {
    //         items: [
    //           {
    //             item_name: e.data.items.product.productName,
    //             item_id: e.data.items.product.items[0].name,
    //             price: e.data.items.product.items[0].sellers[0].commertialOffer.Price.toString(),
    //             item_brand: e.data.items.product.brand,
    //             item_category: values.AdWordsRemarketingCode,
    //             item_category2: '',
    //             item_category3: '',
    //             item_category4: '',
    //             item_variant:
    //               e.data.items.product.items[0].variations.length == 0
    //                 ? ''
    //                 : e.data.items.product.items[0].variations[0].values[0],
    //             quantity: 1,
    //           },
    //         ],
    //       },
    //     }
    //     push(addToWishlist)
    //   })
    //   return
    // }

    case 'vtex:removeToWishlist': {
      getStringCategoryFromId(e.data.items.product.categoryId).then(values => {
        let removeToWishlist = {
          event: 'remove_from_wishlist',
          ecommerce: {
            items: [
              {
                item_name: e.data.items.product.productName,
                item_id: e.data.items.product.items[0].name,
                price: e.data.items.product.items[0].sellers[0].commertialOffer.Price.toString(),
                item_brand: e.data.items.product.brand,
                item_category: values.AdWordsRemarketingCode,
                item_category2: '',
                item_category3: '',
                item_category4: '',
                item_variant:
                  e.data.items.product.items[0].variations.length == 0
                    ? ''
                    : e.data.items.product.items[0].variations[0].values[0],
                quantity: 1,
              },
            ],
          },
        }
        push(removeToWishlist)
      })
      return
    }

    case 'vtex:wellBeing_discoverMore': {
      const isWellbeingPage = window.location.href?.includes('bien-etre')
      if (!isWellbeingPage) return

      if (e.data.type && e.data.type === 'customCategory') {
        if (e.data.url?.includes('produits')) {
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
      if (eventAction.includes('produits')) {
        eventCategory = 'WB to LP CTA'
      } else {
        eventCategory = 'WB Card CTA'
      }

      const linkClassInfocard =
        'vtex-store-components-3-x-infoCardCallActionContainer--wellbeingSecondBanner'
      const linkClassSidebanner =
        'vtex-store-components-3-x-infoCardCallActionContainer--differentButtonArticle'
      const linkClassLabel =
        'frwhirlpool-store-link-custom-0-x-link--secondColLink'
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

    case 'vtex:FR-filtertest': {
      push({
        eventCategory: 'FR-filtertest',
        eventAction: 'Click',
        eventLabel: `${e.data.Click[0].category} - ${e.data.Click[0].subcategory}`,
      })
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
    /**
     * NEWSLETTER
     */
    case 'vtex:newsletterLink': {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: `newsletter_box_bottom`,

        link_url: window?.location?.href,
        link_text: e.data.text,
        checkpoint: `1`,
        area: getContentGrouping(urlPath),
        type: "Subscribe to our newsletter",
      })

      break
    }

    case 'vtex:newsletterSubscription': {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: `newsletter_overlay_box`,

        link_url: window?.location?.href,
        link_text: e.data.text,
        checkpoint: `1`,
        area: getContentGrouping(urlPath),
        type: e.data.text,
      })
      break
    }

    case 'vtex:newsletterAutomaticSubscription': {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: `newsletter_automatic_popup`,
        link_url: window?.location?.href,
        link_text: e.data.text,
        checkpoint: `1`,
        area: getContentGrouping(urlPath),
        type: e.data.text,
      })
      break
    }

    /**
     * PDP SECTION
     */
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
        type: e.data.text,
      })
      break
    }
    case 'vtex:needAdvice': {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: 'product-advice_top_box',

        link_url: window?.location?.href,
        link_text: 'need advice',
        checkpoint: `1`,
        area: getContentGrouping(urlPath),
        type: 'need advice',
      })
      break
    }
    case 'vtex:needAdviceBox': {
      const urlPath = window?.location?.pathname

      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: 'product-advice_overlay_box',

        link_url: window?.location?.href,
        link_text: e.data.text,
        checkpoint: `1`,
        area: getContentGrouping(urlPath),
        type: e.data.text,
      })
      break
    }

    /**
     * LOGIN SECTION
     */
    case 'vtex:loginSectionRegistration': {
      const urlPath = window?.location?.pathname
      push({
        event: 'cta_click',
        eventCategory: 'CTA Click',
        eventAction: getContentGrouping(urlPath),
        eventLabel: `account_registration`,
        link_url: window?.location?.href,
        link_text: e.data.text,
        checkpoint: `2`,
        area: getContentGrouping(urlPath),
        type: e.data.cta_id,
      })

      break
    }

    default: {
      break
    }
  }
}
// function getListProductClick(data: any, category: string) {
//   var listName = "";
//   if (data.list !== undefined) {
//     listName = data.list;
//   } else if (data.map !== undefined) {
//     if (data.query.split("/").includes("accessori")) {
//       listName = "accessories_impression_list";
//     } else {
//       listName = "catalog_page_impression_list_" + category;
//     }
//   } else {
//     listName = "product_page_up_selling_impression_list";
//   }
//   return { actionField: { list: listName } };
// }

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
  const result = data.filter(
    (o: any) => o.Name == 'Couleur' && !o.Value.includes('Oui')
  )
  return result.length > 0 ? result[0].Value[0] : ''
}
function findVariantImpression(data: any) {
  const result = data.filter((o: any) => o.name == 'Couleur')
  return result.length > 0 ? result[0].values[0] : ''
}
export async function getStringCategoryFromId(idCategory: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  return fetch('/_v/wrapper/api/catalog/category/' + idCategory, options).then(
    response => {
      return response.json()
    }
  )
}
export function getDiscuontedPriceFromId(productId: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  return fetch(
    '/api/catalog_system/pub/products/search?fq=productId:' + productId,
    options
  ).then(response => {
    return response.json()
  })
}
function getCategoryIdFromProducts(products: any) {
  const firstCategory = products[0].CategoryId
  const result = products.filter((o: any) => o.CategoryId != firstCategory)
  return result.length == 0 ? firstCategory : null
}
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
  ).then(response => {
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
      result[0].values[0] === true
        ? (sellable = 'Not Sellable Online')
        : (sellable = 'Sellable Online')
      return sellable
    }
    return ''
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
      ? getStringCategoryFromId(product.categoryId).then(respone => {
        return {
          brand: product.brand,
          category: respone.AdWordsRemarketingCode,
          id: product.sku.name,
          // list: getList(list,product.categories, respone.AdWordsRemarketingCode),
          list: setCurrentListFromUrl(respone),
          name: product.productName,
          position,
          price:
            `${product.sku.seller!.commertialOffer.Price}` == '0'
              ? ''
              : `${product.sku.seller!.commertialOffer.Price}`,
          variant: findVariantImpression(product.properties),
          dimension4: getDimension(product, 4),
          dimension5: getDimension(product, 5),
          dimension6: getDimension6FromProduct(product),
        }
      })
      : getCategoryFromIdProduct(product.productId).then(prodAPI =>
        getStringCategoryFromId(prodAPI.CategoryId.toString()).then(
          respone => {
            return {
              brand: product.brand,
              category: respone.AdWordsRemarketingCode,
              id: product.sku.name,
              // list: getList(list, product.categories, respone.AdWordsRemarketingCode),
              list: setCurrentListFromUrl(respone),
              name: product.productName,
              position,
              price:
                `${product.sku.seller!.commertialOffer.Price}` == '0'
                  ? ''
                  : `${product.sku.seller!.commertialOffer.Price}`,
              variant: findVariantImpression(product.properties),
              dimension4: getDimension(product, 4),
              dimension5: getDimension(product, 5),
              dimension6: getDimension6FromProduct(product),
            }
          }
        )
      )
}

function findDimension(data: any, nameKey: string) {
  if (nameKey === 'Offres') {
    let result = data.filter((obj: any) => obj.Name == nameKey)
    result.length > 0 ? (result = result[0]) : null
    if (result === undefined || result.Value === undefined)
      return 'Not in Promo'
    if (
      result.Value.length > 0 &&
      (result.Value.includes('Offres spéciales') ||
        result.Value.includes('Promotions'))
    )
      return 'In Promo'
    else return 'Not in Promo'
  }
  let result = data.filter((obj: any) => obj.Name == nameKey)
  return result[0].Value[0]
}
function costructionType(cType: string) {
  if (cType.indexOf('Free ') !== -1) {
    let cTypeArray = cType.split(' ')
    return cTypeArray[0] + cTypeArray[1].toLowerCase()
  } else {
    return cType.replace(' ', '-')
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
//     .then(response => response.json())
//     .catch(err => console.error(err))
// }

// function getValuefromSpecifications(specifications: any, name: string) {
//   const result = specifications.filter((s: any) => s.Name === name)
//   if (result.length === 0) {
//     return ''
//   } else {
//     return specifications.filter((s: any) => s.Name === name)[0].Value[0]
//   }
// }

// function getProductsFromOrderData(data: any, productsFromOrder: any) {
//   var products: any[] = []
//   var forEachAsync = new Promise<void>(resolve => {
//     productsFromOrder.forEach((value: any, index: any, array: any) => {
//       Promise.all([
//         getSpecificationFromProduct(value.id),
//         getStringCategoryFromId(value.categoryId),
//       ]).then(values => {
//         var obj = {
//           name: removeRefIdFromProductName(value.name, value.skuRefId),
//           id: value.skuRefId,
//           price:
//             value.sellingPrice == '0' || value.sellingPrice == 0
//               ? ''
//               : value.sellingPrice,
//           brand: value.brand,
//           category: values[1].AdWordsRemarketingCode,
//           variant: getValuefromSpecifications(values[0], 'Colore'),
//           quantity: value.quantity,
//           dimension4:
//             getValuefromSpecifications(values[0], 'sellable') === 'true'
//               ? 'Sellable Online'
//               : 'Not Sellable Online',
//           dimension5: costructionType(
//             findDimension(values[0], 'constructionType')
//           ),
//           dimension6: findDimension(values[0], 'Offres'),
//         }
//         products.push(obj)
//         if (index === array.length - 1) {
//           resolve()
//         }
//       })
//     })
//   })
//   forEachAsync.then(() => {
//     if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
//       push({
//         event: 'eec.purchase',
//         ecommerce: {
//           currencyCode: data.currency,
//           purchase: {
//             actionField: {
//               id: data.transactionId,
//               affiliation: data.transactionAffiliation,
//               revenue: data.transactionTotal,
//               tax: data.transactionTax,
//               shipping: data.transactionShipping,
//               coupon: data.coupon !== undefined ? data.coupon : '',
//             },
//             products,
//           },
//         },
//       })
//     }
//   })
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

function setCurrentListFromUrl(values: any) {
  let nameList = ''
  let accessoriesList = ['13', '11', '10', '14', '9', '12', '2']
  let url = window.location.href
  const productCategory = window.dataLayer.find(cat => cat.event == 'pageView')[
    'product-category'
  ]
  const AdWordsRemarketingCode = values.AdWordsRemarketingCode
  if (url?.endsWith('/')) nameList = 'homepage_impression_list'
  else if (url?.includes('produits')) {
    values.AdWordsRemarketingCode === undefined
      ? (nameList = 'catalog_page_impression_list')
      : (nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split(
        '_'
      )
        .pop()
        .toLowerCase()}`)
  } else if (url?.includes('wishlist'))
    nameList = 'wishlist_page_impression_list'
  else if (
    url?.endsWith('/p') &&
    (values.FatherCategoryId == undefined ||
      accessoriesList.includes(values.FatherCategoryId.toString()))
  )
    nameList = 'accessories_cross_selling_impression_list'
  else if (url?.endsWith('/p') && productCategory == AdWordsRemarketingCode)
    nameList = 'product_page_up_selling_impression_list'
  else if (url?.endsWith('/p'))
    nameList = 'product_page_cross_selling_impression_list'
  else if (url?.includes('accessoires'))
    nameList = 'accessories_impression_list'
  else nameList = 'campaign_page_impression_list'

  return nameList
}

function getDimension6(data: any) {
  let dimension = 'Not in Promo'
  let marketingSpecGroup = data.product.specificationGroups.filter(
    (item: any) => item.name === 'rootFields'
  )
  if (marketingSpecGroup.length > 0) {
    if (
      marketingSpecGroup[0].specifications.filter(
        (item: any) =>
          item.values.includes('Offres spéciales') ||
          item.values.includes('Promotions')
      ).length > 0
    ) {
      dimension = 'In Promo'
    }
  }
  return dimension
}

function getDimension6FromProduct(product: any) {
  let dimension = 'Not in Promo'
  let marketingSpecGroup = product.specificationGroups.filter(
    (item: any) => item.name === 'rootFields'
  )
  if (marketingSpecGroup.length > 0) {
    if (
      marketingSpecGroup[0].specifications.filter(
        (item: any) =>
          item.values.includes('Offres spéciales') ||
          item.values.includes('Promotions')
      ).length > 0
    ) {
      dimension = 'In Promo'
    }
  }
  return dimension
}

function setListFromUrlNew(values: any, pixelData: any) {
  let nameList = ''
  let isAccessory = pixelData.categories
    ? pixelData.categories.includes('/accessoires/')
    : false
  let historyChange = window.dataLayer.filter(item => item.event === 'pageView')
  let accessoriesList = ['13', '11', '10', '14', '9', '12', '2']
  if (historyChange.length === 0) return 'homepage_impression_list'
  let oldUrl: any = historyChange[historyChange.length - 1]?.page
  if (oldUrl?.endsWith('/')) nameList = 'homepage_impression_list'
  else if (oldUrl?.includes('produits')) {
    values.AdWordsRemarketingCode === undefined
      ? (nameList = 'catalog_page_impression_list')
      : (nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split(
        '_'
      )
        .pop()
        .toLowerCase()}`)
  } else if (oldUrl?.includes('accessoires')) {
    nameList = 'accessories_impression_list'
  } else if (
    oldUrl?.endsWith('/p') &&
    (isAccessory ||
      (values.FatherCategoryId &&
        accessoriesList.includes(values.FatherCategoryId.toString())))
  ) {
    nameList = 'accessories_cross_selling_impression_list'
  } else if (oldUrl?.includes('wishlist'))
    nameList = 'wishlist_page_impression_list'
  else if (oldUrl?.endsWith('/p'))
    nameList = 'product_page_cross_selling_impression_list'
  else nameList = 'campaign_page_impression_list'
  return nameList
}

// function for setting the list in productDetail
function setListFromUrlNewPDP(values: any) {
  let nameList = ''
  let historyChange = window.dataLayer.filter(item => item.event === 'pageView')
  let accessoriesList = ['13', '11', '10', '14', '9', '12', '2']
  if (historyChange.length < 2) return 'homepage_impression_list'
  let oldUrl: any = historyChange[historyChange.length - 2]?.page //takes not the last but the second-last item since the url changes immediately
  if (oldUrl?.endsWith('/')) nameList = 'homepage_impression_list'
  else if (oldUrl?.includes('produits')) {
    values.AdWordsRemarketingCode === undefined
      ? (nameList = 'catalog_page_impression_list')
      : (nameList = `catalog_page_impression_list_${values.AdWordsRemarketingCode.split(
        '_'
      )
        .pop()
        .toLowerCase()}`)
  } else if (oldUrl?.includes('accessoires')) {
    nameList = 'accessories_impression_list'
  } else if (
    oldUrl?.endsWith('/p') &&
    accessoriesList.includes(values.FatherCategoryId.toString())
  ) {
    nameList = 'accessories_cross_selling_impression_list'
  } else if (oldUrl?.includes('wishlist'))
    nameList = 'wishlist_page_impression_list'
  else if (oldUrl?.endsWith('/p'))
    nameList = 'product_page_cross_selling_impression_list'
  else nameList = 'campaign_page_impression_list'
  return nameList
}

function getDimension8(productData: any, dim4: string) {
  if (dim4 === 'Not Sellable Online') {
    return dim4
  }
  let availableQuantity =
    productData?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity
  return availableQuantity > 0 ? 'In Stock' : 'Out of Stock'
}
