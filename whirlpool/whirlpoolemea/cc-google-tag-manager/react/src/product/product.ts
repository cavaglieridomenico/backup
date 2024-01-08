import push from '../../src/utils/push'
import { PixelMessage,Impression } from '../../typings/events'
import {
  getProductImageProps,
  getProduct,
  getPropertyValues,
  getData,
  getProductsFromOrderData,
  getProductCategory,
  // getScoreValues,
  pushWithoutDuplicates,
  getAnalyticWrapperData,
  getRecipeAppliance,
  getBinding,
  getScoreValues,
} from '../utils/product-utils'
import { getSearchProduct } from '../utils/search-utils'
import { Product } from '../../typings/ProductTypes'

import { getStringCategoryFromId, costructionType, findDimension,getDimension,getListProductClickAndDetail,getPageType,getProductCategoryForList } from '../utils/product-utils'
import getProductInfos from '../../graphql/product.graphql'

export async function sendProductEvents(e: PixelMessage) {
  //Get product data (faster method)
  //const {data: {product}}: {data: {product: Product}} = await getProduct()

  //Get product data
  const productQuery: any = await getProduct()
  const product: Product = productQuery?.data?.productData
  const binding = getBinding(window)

  //alternative message if the data is not available
   const altMessage: string = 'Data not available'

  switch (e.data.eventName) {
    //GA4FUNREQ43
    case 'vtex:extra_info_interaction': {
      const extraInfoInteractionDataList = e.data.extraInfoInteraction
      push({
        event: 'extra_info_interaction',
        item_id: getData(product?.productId),
        item_name: product?.productName,
        item_category: product?.category,
        item_macrocategory: product?.macroCategory,
        type: getAnalyticWrapperData(extraInfoInteractionDataList, 'type'),
      })
      break
    }

    //GA4FUNREQ34
    case 'vtex:ga4-reviews_interaction': {
      const reviewsInteractionEvent = {
        event: 'reviews_interaction',
        type: 'read',
        item_id: getData(product?.productId),
        item_name: product?.productName,
        item_category: product?.category,
        item_macrocategory: product?.macroCategory,
      }
      pushWithoutDuplicates(reviewsInteractionEvent)
      break
    }
    case "vtex:productView": {
      const productInfos: Product = e.data.product

      const {items, selectedSku } = e.data.product;
      const commercialOffer = items.sellers[0].commertialOffer;
      const currencyCode = e.data.currency;
      push({
        'event': 'contentIndex',
        'contentIndex': document.getElementsByClassName("frccwhirlpool-video-player-thron-pdp-0-x-thumbImg--productPage").length
      })

      let price: any;

            let dim5Value = costructionType(
              findDimension(productInfos, "constructionType")
            );
            let dim4Value = getDimension({ properties: productInfos }, 4)
            const category =  await getStringCategoryFromId(e.data.product.categoryId)
                  const list: string = getListProductClickAndDetail(selectedSku?.name, category?.AdWordsRemarketingCode)
                  const pr = {
                    ecommerce: {
                      currencyCode,
                      detail: {
                        actionField: {
                          list,
                        },
                        products: [
                          {
                            brand:productInfos.brand,
                            category: category.AdWordsRemarketingCode,
                            id: productInfos.productId,
                            name: productInfos.productName,
                            variant: findVariant(productInfos),
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

      break;
    }
    case 'vtex:productClick': {
      const { productName, brand, sku } = e.data.product
      const commercialOffer = sku.sellers[0].commertialOffer
      const currencyCode = e.data.currency
      const category =  await getStringCategoryFromId(e.data.product.categoryId)

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
            let dim4Value = getDimension({ properties: data }, 4)

            // getCategoryFromIdProduct(e.data.product.productId).then((value) => {
              // getStringCategoryFromId(value.CategoryId).then((values) => {
                const list: string = getListProductClickAndDetail(
                  sku?.name,
                  category.AdWordsRemarketingCode
                )
                const product = {
                  event: 'eec.productClick',
                  ecommerce: {
                    currencyCode,
                    click: {
                      actionField: { list, action: 'click' },
                      products: [
                        {
                          brand,
                          category: category.AdWordsRemarketingCode,
                          id: sku.name,
                          name: productName,
                          variant: findVariant(data),
                          dimension4: dim4Value,
                          dimension5: dim5Value,
                          dimension6:
                            commercialOffer.ListPrice === commercialOffer.price
                              ? 'Not in promo'
                              : 'In promo',
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
              // })
            // })
          })
        )
        .catch((err) => console.error(err))
      break
    }
    //GA4FUNREQ33
    case 'vtex:productView': {
      const propertyList = product?.properties
      const scoreList = product?.secondaryRatingsAverages
      const getSellableStatus = () => {
        let property: string | undefined = getPropertyValues(
          propertyList,
          `sellable${binding}`
        )

        //compatibility with spare parts
        if (property === 'Data not available') {
          property = getPropertyValues(propertyList, 'status')
        }

        if (property === 'true' || 'in stock' || 'limited availability')
          return 'sellable'
        if (property === 'false' || 'obsolete') return 'not sellable'

        return altMessage
      }

      const getItemType = () => {
        let property: string | undefined = getPropertyValues(
          propertyList,
          'constructionType')

        return property === 'Data not available' ?
          property :
          property.toLowerCase()
            .replace(' ', '-')
      }

      const getGallerySize = () =>
        getData(product?.items[0].images.length.toString())

      const getAvailability = () => {
        let availability: number = product?.items[0].sellers[0].commertialOffer.AvailableQuantity
        if (availability > 0) return 'yes'
        if (availability <= 0) return 'no'
        return altMessage
      }
      const getReviewsNumber = (value: number) =>
        !value ? getData(null) : value.toString()
      const getRating = (value: number) =>
        !value ? getData(null) : value.toFixed(1)

      push({
        event: 'pdp_view',
        item_id: getData(product?.productId),
        item_name: getData(product?.productName),
        item_category: getData(product?.category),
        item_macrocategory: getData(product?.macroCategory),
        item_type: getItemType(),
        sellable_status: getSellableStatus(),
        reviews_number: getReviewsNumber(product?.totalReviews),
        rating: getRating(product?.averageOverallRating),
        quality_score: getScoreValues(scoreList, 'Quality'),
        value_score: getScoreValues(scoreList, 'Value'),
        design_score: getScoreValues(scoreList, 'Performance'),
        gallery_size: getGallerySize(),
        availability: getAvailability(),
      })
      break
    }

    //GA4FUNREQ64
    case 'ga4-thronVideo': {
      const { idVideo, actionType, videoDuration } = e.data
      const thronVideoEvent = {
        event: 'thronVideo',
        eventCategory: 'Product Experience',
        eventAction: `View a Video – ${actionType}`,
        eventLabel: `Product Experience Video - ${idVideo}`,
        video_duration: Math.round(videoDuration).toString(),
        video_title: 'Not available',
      }

      const isDuplicateEvent =
        window.dataLayer[window.dataLayer.length - 1].eventAction ===
        thronVideoEvent.eventAction
      !isDuplicateEvent && push(thronVideoEvent)
      break
    }

    //GA4FUNREQ37
    case 'ga4-productImageClick': {
      const { isVideo, url } = e.data
      push({
        event: 'productImageClick',
        productImageName: product?.productName,
        productImageCode: product?.productReference,
        productImageAsset: getProductImageProps(isVideo, url),
        productImageFile: getProductImageProps(isVideo, url),
        name: getProductImageProps(isVideo, url),
        item_category: product?.category,
        item_macrocategory: product?.macroCategory,
        type: isVideo ? 'video' : 'image',
      })
      break
    }

    //GA4FUNREQ13+14+15+81
    case 'vtex:filterManipulation': {
      const type = e.data?.items?.type

      const isSpareParts = () => window?.location?.href?.includes('spare-parts') || window?.location?.href?.includes('ersatzteile')

      let filterInteraction = ''

      //Filters
      const filters = window.dataLayer?.filter(
        evento => evento.event == 'filterManipulation'
      )

      let filterChainedDetails = ''

      //Se non ci sono eventi con quel nome siamo nel caso del primo filtro selezionato
      if (filters.length == 0) {
        filterChainedDetails = `filters ${e.data.items.filterName
          .replace(':', '')
          .toLowerCase()}=${e.data.items.filterValue}`
      } else {
        // Se ci sono già eventi con quel nome e la stringa aggiunta è la stessa la sostituisco con "" per rimuovere il filtro da filterChainedDetail
        if (
          filters[filters.length - 1]?.filterChainedDetails?.includes(
            `filters ${e.data.items.filterName
              .replace(':', '')
              .toLowerCase()}=${e.data.items.filterValue}`
          )
        ) {
          filterChainedDetails = `${filters[
            filters.length - 1
          ]?.filterChainedDetails?.replace(
            `filters ${e.data.items.filterName
              .replace(':', '')
              .toLowerCase()}=${e.data.items.filterValue}`,
            ''
          )}`
          //HEre chech if another appliance filter is applied (Only for recipes)
        } else if (
          e.data.items.filterName == 'Appliances' &&
          filters[filters.length - 1]?.filterChainedDetails.includes(
            e.data.items.filterName.replace(':', '').toLowerCase()
          )
        ) {
          //RegEx not compatible with Safari:
          // filterChainedDetails = `${filtri[
          //   filtri.length - 1
          // ]?.filterChainedDetails.replace(
          //   //Takes only the part between appliances= and & or the end of the string
          //   /([^&]+)(?=&|$)/,
          //   e.data.items.filterValue
          // )}`

          filterChainedDetails = filters[
            filters.length - 1
          ]?.filterChainedDetails.replace(
            getRecipeAppliance(filters[filters.length - 1]?.filterChainedDetails),
            e.data.items.filterValue
          )
        } else {
          //se non ci sono eventi con quel nome lo aggiungo
          filterChainedDetails = `${filters[filters.length - 1]?.filterChainedDetails
            }&filters ${e.data.items.filterName.replace(':', '').toLowerCase()}=${e.data.items.filterValue}`
        }
      }

      filters.map(filter => {
        if (
          e.data.items.filterValue == filter.filterValue &&
          filter.filterInteraction === 'select'
        ) {
          filterInteraction = 'remove'
        }
        if (
          e.data.items.filterValue == filter.filterValue &&
          filter.filterInteraction === 'remove'
        ) {
          filterInteraction = 'select'
        }
      })
      if (filterInteraction == '') {
        filterInteraction = 'select'
      } else if (filterInteraction == "remove" && filters.length == 0) filterChainedDetails = ''

      const prodCategory = window.dataLayer?.filter(event => event.event == 'pageView')?.[0]?.['product-category']

      push({
        event: e.data.event,
        filterInteraction: filterInteraction,
        filterName: e.data.items.filterName.replace(':', '').toLowerCase(),
        filterValue: e.data.items.filterValue,
        filterProductCategory: prodCategory || '',
        //Verifico che la stringa non inizia o finisce con & e che non contenga &&
        filterChainedDetails:
          filterChainedDetails[0] == '&' ||
            filterChainedDetails[1] == '&' ||
            filterChainedDetails[filterChainedDetails.length - 1] == '&'
            ? filterChainedDetails.replace('&', '')
            : filterChainedDetails && filterChainedDetails.replace('&&', '&'),
        type: type
          ? type
          : isSpareParts()
            ? 'spare_parts'
            : prodCategory
              ? 'product'
              : '',
      })

      break
    }

    //GA4FUNREQ79
    case 'vtex:servicesPurchase': {
      const additionalServices = e.data.data.transactionProducts.filter(
        (transactionProduct: any) => transactionProduct.type
      )

      const productsQuery = e.data.data.transactionProducts
        .filter((transactionProduct: any) => !transactionProduct.type)
        .map((product: any) => {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: getProductInfos,
              variables: {
                identifier: {
                  field: 'slug',
                  value: product?.slug,
                },
              },
            }),
          }
          return fetch('/_v/private/graphql/v1', options).then(res => {
            return res.json()
          })
        })

      const productsToPush = await Promise.all<any>(productsQuery)

      getProductsFromOrderData(
        e.data.data,
        productsToPush.map(product => product.data.productData),
        additionalServices
      )

      break
    }

    //GA4FUNREQ38
    /* @WARNING  For frwhirlpool this event is also triggered in PLP*/
    case 'vtex:intentionToBuy': {
      const productInfos: Product =
        product || (await getSearchProduct(e.data.slug))

      const intentionToBuyEvent = {
        event: 'intentionToBuy',
        eventCategory: 'Intention to Buy',
        eventAction: 'Pop Retail List',
        eventLabel: `${productInfos.productId} - ${productInfos.productName}`,
        item_id: productInfos.productId,
        item_name: productInfos.productName,
        item_category: productInfos.category,
        item_macrocategory: productInfos.macroCategory,
      }

      pushWithoutDuplicates(intentionToBuyEvent)
      break
    }

    //GA4FUNREQ39
    /* @WARNING  For some websites this event is also triggered in PLP*/
    case 'vtex:ga4_retailer_click': {
      const { name } = e.data
      const productInfos: Product =
        product || (await getSearchProduct(e.data.slug))

      push({
        event: 'retailer_click',
        item_id: productInfos.productId,
        item_name: productInfos.productName,
        item_category: productInfos.category,
        item_macrocategory: productInfos.macroCategory,
        name: name,
      })
      break
    }

    //GA4FUNREQ36
    case 'vtex:store_locator_from_product': {
      const productInfos: Product =
        product || (await getSearchProduct(e.data.slug))

      const storeLocatorFromProductEvent = {
        event: 'store_locator_from_product',
        item_id: productInfos.productId,
        item_name: productInfos.productName,
        item_category: productInfos.category,
        item_macrocategory: productInfos.macroCategory,
      }

      pushWithoutDuplicates(storeLocatorFromProductEvent)
      break
    }

    //GA4FUNREQ72
    /* @WARNING This event is also triggered in PLP*/
    case 'vtex:addToWishlist': {

      const product: Product = e.data.items?.product
      const isSellable =
        getPropertyValues(product?.properties, `sellable${binding}`) == 'true'
      const isInPromo =
        product?.items?.[0].sellers?.[0].commertialOffer?.ListPrice >
        product?.items?.[0].sellers?.[0].commertialOffer?.Price
      const availability = !isSellable
        ? 'Not Sellable Online'
        : isSellable &&
          product?.items?.[0].sellers?.[0].commertialOffer?.AvailableQuantity >
          0
          ? 'In stock'
          : 'Out of stock'

      const categoryInfos = await getProductCategory('slug', product?.linkText)

      push({ ecommerce: null }) // Clear the previous ecomm object
      push({
        event: 'add_to_wishlist',
        ecommerce: {
          items: [
            {
              item_id: product?.productId,
              item_name: product?.productName,
              currency: e.data.currency,
              item_brand: product?.brand,
              item_variant: getData(product?.skuSpecifications?.[0]?.values?.[0]?.name),
              item_category: categoryInfos?.category,
              price: product?.items?.[0].sellers?.[0].commertialOffer?.Price,
              quantity: product?.items?.[0].unitMultiplier,
              sell_status: isSellable ? 'Sellable Online' : 'Not Sellable Online',
              product_type: getPropertyValues(product?.properties, 'constructionType'),
              promo_status: isInPromo ? 'In Promo' : 'Not in Promo',
              availability: availability,
            },
          ],
        },
      })

/*      push({
        event: "add_to_wishlist",
        ecommerce: {
          items: [
            {
              item_name: product?.productName,
              item_id: product?.items[0].name,
              price: product?.items?.[0].sellers?.[0].commertialOffer?.Price,
              item_brand: product?.brand,
              item_category: categoryInfos?.category,
              item_category2: "",
              item_category3: "",
              item_category4: "",
              item_variant: getData(product?.skuSpecifications?.[0]?.values?.[0]?.name),
              quantity: product?.items?.[0].unitMultiplier,
            },
          ],
        },
      })*/
      break
    }

    case "vtex:removeToWishlist": {

      const product: Product = e.data.items?.product
      const categoryInfos = await getProductCategory('slug', product?.linkText)

      push({
        event: "remove_from_wishlist",
        ecommerce: {
          items: [
            {
              item_name: product?.productName,
              item_id: product?.items[0].name,
              price: product?.items?.[0].sellers?.[0].commertialOffer?.Price,
              item_brand: product?.brand,
              item_category: categoryInfos?.category,
              item_category2: "",
              item_category3: "",
              item_category4: "",
              item_variant: getData(product?.skuSpecifications?.[0]?.values?.[0]?.name),
              quantity: product?.items?.[0].unitMultiplier,
            },
          ],
        },
      })
      break
    }

    //FUNREQ17
    case "vtex:productRegistration": {
      push({
        event: "productRegistration",
      })
      return
    }

    //FUNREQ14
    case "vtex:pdfDownload": {
      const pCode = e.data.productCode
      const pName = e.data.productName

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
        event: "pdfDownload",
        eventCategory: "Support",
        eventAction: e.data?.label,
        eventLabel: pCode + " - " + pName,
        fileExtension: fileExtension,
      })
      push({
        event: "outbound",
        eventCategory: "Outbound",
        eventAction: `Go to ${destinationLink}`,
        eventLabel: e.data.url,
      })
      break
    }

    case "vtex:prodDetailsTab": {
      push({
        event: "prodDetailsTab",
        prodDetailsTabName: e.data.data?.[0]?.["prodDetailsTabName"],
      })
      break
    }

    case "vtex:accordionInteraction": {
      const { action, product } = e.data

      push({
        event: "accordionInteraction",
        eventCategory: "Product Experience",
        eventAction: `accordion - ${action ? "open" : "close"}`,
        eventLabel: `${product?.productReference} - ${product?.productName}`,
      })
      break
    }
    case "vtex:extendedDescription": {
      const {productCode, productName} = e.data

      push({
        event: 'extendedDescription',
        eventCategory: 'Product Experience',
        eventAction: `Read an Extended Description – Product Description`,
        eventLabel: `${productCode} - ${productName}`,
      })
    }

    case "vtex:readMore": {
      const {productCode, productName, isNotExpand, matchId, thronIdLogo} = e.data

      if(!isNotExpand)
      {
        push({
          event: 'extendedDescription',
          eventCategory: 'Product Experience',
          eventAction: `Read an Extended Description – Matching Technology Name`,
          eventLabel: `${productCode} - ${productName}`,
        })
      }

      push({
        event: 'matchingTechnology',
        eventCategory: 'Matching Technology Tracking',
        eventAction: !isNotExpand ? 'open' : 'close',
        eventLabel: `${productCode} - ${productName}`,
        matchingTechId: matchId,
        matchingTechLogo: thronIdLogo,
      })
      break;
    }
    case 'vtex:productImpression': {
      if (window.location?.pathname?.includes('product-comparison')) return

      const { currency, impressions } = e.data

      const parsedImpressions = (impressions || []).map(
        getProductImpressionObjectData()
      )

      Promise.all(parsedImpressions).then((values) => {
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
  }
  function findVariant(data: any) {
    const result = data.filter((o: any) => o.Name == "Couleur");
    return result.length > 0 ? result[0].Value[0] : "";
  }
  function getProductImpressionObjectData() {
    const product = e.data.product

    return ({ position }: Impression) =>
      getStringCategoryFromId(product.categoryId).then((respone) => {
            const commercialOffer = product.sku.sellers[0].commertialOffer
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
              dimension6:
                commercialOffer.ListPrice === commercialOffer.Price
                  ? "Not in promo"
                  : "In promo",
            }
          })

  }
  function findVariantImpression(data: any) {
    const result = data.filter((o: any) => o.name == "Couleur")
    return result.length > 0 ? result[0].values[0] : ""
  }
  // Get `list` name for eec.impressionView
function getListImpressionView(values: any) {
  let nameList = ""
  let url = window.location.pathname + window.location.search
  let hash = window.location.hash

  const pageType: string = getPageType(url)
  /// Raw product-category from from API call
  const adWordsRemarketingCode = values?.AdWordsRemarketingCode
  const productCategory = window.dataLayer.find(
    (cat) => cat?.event == "pageView"
  )["product-category"]
  const productCategoryForList = adWordsRemarketingCode
    ? getProductCategoryForList(adWordsRemarketingCode)
    : ""

  // Accessories related variables
  const isProductAccessory: boolean =
    productCategory && productCategory.includes("_AC_")
  const isAccessoriesPage: boolean = url?.includes("accessoires")

  // To handle filtered search page for `search_suggestion_impression_list`
  const previousPageViewEvents = window.dataLayer.filter(
    (item) => item?.event == "pageView"
  )
  const previousUrlPath =
    previousPageViewEvents[previousPageViewEvents.length - 1].page
  const previousPageType = getPageType(previousUrlPath)

  if (pageType === "home") {
    nameList = "homepage_slider_products_impression_list"
  } else if (pageType === "search" || previousPageType === "search") {
    nameList = "search_suggestion_impression_list"
  } else if (hash.includes("wishlist")) {
    nameList = "wishlist_page_impression_list"
  } else if (pageType === "category" && isAccessoriesPage) {
    nameList = "accessories_impression_list"
  } else if (pageType === "category" && !isAccessoriesPage) {
    // PLP
    adWordsRemarketingCode
      ? (nameList = `catalog_page_impression_list_${productCategoryForList}`)
      : (nameList = "catalog_page_impression_list")
  } else if (pageType === "detail" && isProductAccessory) {
    nameList = "accessories_cross_selling_impression_list"
  } else if (
    pageType === "detail" &&
    productCategory === adWordsRemarketingCode
  ) {
    nameList = "product_page_up_selling_impression_list"
  } else if (
    pageType === "detail" &&
    productCategory !== adWordsRemarketingCode
  ) {
    nameList = "product_page_cross_selling_impression_list"
  } else {
    nameList = "campaign_page_impression_list"
  }
  return nameList
}
}
