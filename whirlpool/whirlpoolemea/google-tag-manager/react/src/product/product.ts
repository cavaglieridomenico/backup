import push from '../../src/utils/push'
import { PixelMessage } from '../../typings/events'
import {
  getProductImageProps,
  getProduct,
  getPropertyValues,
  getData,
  getProductsFromOrderData,
  getProductCategory,
  getScoreValues,
  pushWithoutDuplicates,
  getAnalyticWrapperData,
  getRecipeAppliance,
  getBinding,
} from '../utils/product-utils'
import { getSearchProduct } from '../utils/search-utils'
import { Product } from '../../typings/ProductTypes'

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
        let availability: number =
          product?.items[0].sellers[0].commertialOffer.AvailableQuantity
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
              item_variant: getData(
                product?.skuSpecifications?.[0]?.values?.[0]?.name
              ),
              item_category: categoryInfos?.category,
              price: product?.items?.[0].sellers?.[0].commertialOffer?.Price,
              quantity: product?.items?.[0].unitMultiplier,
              sell_status: isSellable
                ? 'Sellable Online'
                : 'Not Sellable Online',
              product_type: getPropertyValues(
                product?.properties,
                'constructionType'
              ),
              promo_status: isInPromo ? 'In Promo' : 'Not in Promo',
              availability: availability,
            },
          ],
        },
      })
      break
    }
  }
}
