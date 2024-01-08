import getProductInfos from '../../graphql/product.graphql'
import getProdCategory from '../../graphql/getProductCategory.graphql'
import {
  ProductSpecification,
  SecondaryRatingsAverages,
} from '../../typings/ProductTypes'
import push from '../../src/utils/push'

let product: any = undefined

// Get product data
export const getProduct = async () => {
  const savedProduct = await product
  let path = window.location.pathname
  if(path?.startsWith("/de/") || path?.startsWith("/it/") || path?.startsWith("/fr/"))
    path = path.substring(3)
  const slug = path.match(/^\/?([\w-]*)(\/p)?$/)?.[1]

  if (
    window?.history?.state?.state?.navigationRoute?.id == 'store.product' && //This check is more accurate then window.location.includes("/p")
    (!product || savedProduct?.data?.productData?.linkText !== slug)
  ) {
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
            value: slug,
          },
        },
      }),
    }

    product = fetch('/_v/private/graphql/v1', options).then(res => {
      return res.json()
    })
    return await product
  }

  return savedProduct
}

// Get product category
export function getStringCategoryFromId(idCategory: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  return !idCategory || idCategory == ''
    ? Promise.resolve('')
    : fetch(`/_v/wrapper/api/catalog/category/${idCategory}`, options).then(
        response => {
          return response.json()
        }
      )
}

// Get the desired value if it is available or an alternative message
export const getData = (value: any, message: string = 'Data not available') =>
  value ? value : message

// Get product properties values
export const getPropertyValues = (
  properties: ProductSpecification[],
  property: string
): string => {
  if (!properties) return getData(null)
  const values: string | undefined = properties
    .find(item => item.name === property)
    ?.values.join(', ')
  return getData(values)
}

// Get score values
export const getScoreValues = (
  secondaryRatingAvg: SecondaryRatingsAverages[],
  property: string
): string => {
  if (!secondaryRatingAvg) return getData(null)
  const value: string | undefined = secondaryRatingAvg
    .find(item => item.Id === property)
    ?.AverageRating.toFixed(1)
  return getData(value)
}

// Get image file name from pdp url
const getFileName = (url: string) => {
  let splittedUrl = url.split('/')
  let fileName = splittedUrl[splittedUrl.length - 2]
  let fileExtension = splittedUrl[splittedUrl.length - 1]
    .split('?')[0]
    .split('.')[1]
  return `${fileName}.${fileExtension}`
}

// Get product image properties for GA4
export const getProductImageProps = (isVideo: boolean, url: string) => {
  if (isVideo) return 'video'
  if (url) return getFileName(url)
  return 'Unknown Asset'
}

// Push into dataLayer without duplicates
export const pushWithoutDuplicates = (dataToPush: any): void => {
  const isDuplicateEvent =
    window.dataLayer[window.dataLayer.length - 1].event === dataToPush.event
  !isDuplicateEvent && push(dataToPush)
}

// Get analytic wrapper data
export const getAnalyticWrapperData = (
  dataList: any,
  property: string,
  message: string = 'Data not available'
): string => {
  if (!dataList && !Array.isArray(dataList)) return getData(null)
  let value: string | undefined
  dataList.forEach(
    (item: any) => (value = property in item ? item[property] : '')
  )
  return getData(value, message)
}

//Get dimension 10
const getDimension10 = (category: string) => {
  if (!category || category == '') return 'Data not available'
  if(category?.includes("_FG_")){
    return "finished goods"
  } else if (category?.includes("_AC_")){
    return "accessories"
  } else {
    return "spare parts"
  }
}

export const variantNames = [
  'colour', //EN
  'color', //EN
  'colore', //IT
  'couleur', //FR
  'kolor', //PL
  'farbe', //DE
]

export async function getProductsFromOrderData(
  data: any,
  products: any,
  additionalServices: any
) {

  const productsToPush = products.map((product: any) => {
    const transactionProduct = data.transactionProducts.find(
      (transactionProduct: any) => transactionProduct.id == product.productId
    )
    const dim4 = getData(
      product.properties?.find((prop: any) => prop.name == 'sellable')
        ?.values?.[0],
      ''
    )
    const purchaseProductInfos = {
      name: product.productName, // prod name OR service name , see next slide
      id: getData(product.productReference?.split('-')?.[0], ''), // prod ID OR service id, see next slide
      price: transactionProduct.price, // prod price OR service price, see next slide
      brand: getData(product.brand, ''), // prod brand e.g.'whirlpool'
      category: getData(product.category, ''), // prod category
      variant: getData(
        product.properties?.find((prop: any) =>
          variantNames.includes(prop.name?.toLowerCase())
        )?.values?.[0], ''
      ), // prod variant
      quantity: transactionProduct.quantity, // quantity added to cart
      dimension4:
        dim4 == 'true'
          ? 'Sellable Online'
          : dim4 == 'false'
          ? 'Not Sellable Online'
          : dim4,
      dimension5: getData(
        product.properties?.find((prop: any) => prop.name == 'constructionType')
          ?.values?.[0], ''
      ),
      dimension6:
        transactionProduct.originalPrice &&
        transactionProduct.originalPrice > transactionProduct.price
          ? 'In promo'
          : 'Not in promo',
    }
    if(data.hasDim10) {
      return {...purchaseProductInfos, dimension10: getDimension10(product.category)}
    } else {
      return purchaseProductInfos
    }
  })

  const addServicesToPush = additionalServices.map((addService: any) => {
    return {
      name: addService.name,
      quantity: addService.quantity,
      id: addService.id,
      price:
        addService.price === '0' || addService.price === ''
          ? 0
          : addService.price / 100,
      category: 'additionalServices',
    }
  })

  if (!isPushedPurchase(window.dataLayer, data.transactionId)) {
    const isBauknecht = window?.location?.href?.includes('bauknecht')
    const isWHFR = window?.location?.href?.includes('whirlpool.fr')
    const isHPUK = window?.location?.href?.includes('hotpoint.co.uk')
    window.dataLayer.push({ ecommerce: null })
    const ecommerce = {
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
        products: [...productsToPush, ...addServicesToPush],
      },
    }
    if(isBauknecht|| isWHFR || isHPUK){
      push({
        event: 'eec.purchase',
        ecommerce,
        userFirstName:data.visitorContactInfo[1],
        userLastName:data.visitorContactInfo[2],
        userEmail:data.visitorContactInfo[0],
        userPhoneNumber:data.visitorContactPhone,
        userPostcode: data.visitorAddressPostalCode,
        userStreet:data.visitorAddressStreet,
        userCity:data.visitorAddressCity,
        userRegion:data.visitorAddressState,
        userCountry:data.visitorAddressCountry.slice(0, -1)
      })
    }else{

      push({
        event: 'eec.purchase',
        ecommerce,
      })
    }

    // Backwards compatible event
    push({
      event: 'pageLoaded',
      ecommerce,
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

export const getProductCategory = async (field: string, value: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getProdCategory,
      variables: {
        identifier: {
          field: field,
          value: value,
        },
      },
    }),
  }

  const product = await fetch('/_v/private/graphql/v1', options).then(res =>
    res.json()
  )

  return product?.data?.productData
}

export const getRecipeAppliance = (filterChainedDetails: string) => {
  const dataLayerfilterChainedDetailsList: string[] = filterChainedDetails?.split(
    '&filters '
  )

  const targetFilter = dataLayerfilterChainedDetailsList.find(item =>
    item.includes('appliances=')
  )
  return targetFilter?.replace('filters ', '').replace('appliances=', '')
}

export const getBinding = (window: any) => {
  const bindingObject = window?.__RUNTIME__?.binding?.canonicalBaseAddress

  return bindingObject?.includes('epp')
    ? 'EPP'
    : bindingObject?.includes('ff')
    ? 'FF'
    : bindingObject?.includes('vip')
    ? 'VIP'
    : ''
}
