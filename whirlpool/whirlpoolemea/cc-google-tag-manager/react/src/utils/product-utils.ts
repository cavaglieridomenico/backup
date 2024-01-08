import getProductInfos from '../../graphql/product.graphql'
import getProdCategory from '../../graphql/getProductCategory.graphql'
import {isErrorPage} from '../../src/utils/page-utils'
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
    push({
      event: 'eec.purchase',
      ecommerce,
    })

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

// Get `list` name for eec.productClick and eec.productDetail
export function getListProductClickAndDetail(productId: string, category: string) {

  const impressionViews = window.dataLayer.filter(item => item?.event == "eec.impressionView")
  let allImpViews: any[] = []
  for (let index = 0; index < impressionViews.length; index++) {
    allImpViews.push(impressionViews[index]?.ecommerce?.impressions)
  }
  const flatImpViews: any[] = (allImpViews as any).flat(Infinity)
  // Find `list` value based on productId from past `eec.impressionView` viewed objects
  const listFromImpView: string = flatImpViews?.find(impView => impView?.id === productId)?.list

  if (listFromImpView) {
    return listFromImpView
  }
  // In case user clicks on product card before `eec.impressionView` analytics event
  else {

    let listNameFallback = "";

    const previousPageViewEvents = window.dataLayer.filter(item => item?.event == "pageView")
    const previousPageType = previousPageViewEvents[(previousPageViewEvents.length) - 1]?.pageType

    const productCategory = previousPageViewEvents[(previousPageViewEvents.length) - 1]["product-category"]
    const productCategoryForList = category ? getProductCategoryForList(category) : ""

    // Handling accessories pages
    let lastPageViewDetails = getLastDetailOrCategoryPageViewDetails("productClick");
    let lastPageViewDetailsisAccessories = lastPageViewDetails.category ? lastPageViewDetails.category.includes("_AC_") || lastPageViewDetails.macroCategory == "AC" : false;
    let isProductAccessory = productCategory ? productCategory.includes("_AC_") : false;


    if (previousPageType === "home") {
      listNameFallback = "homepage_slider_products_impression_list"; //homepage
    }
    else if (previousPageType === "search") {
      listNameFallback = "search_suggestion_impression_list"
    }
    else if (previousPageType === "category" && lastPageViewDetailsisAccessories) {
      listNameFallback = "accessories_impression_list";
    }
    else if (previousPageType === "category" && !lastPageViewDetailsisAccessories) {
      category ? listNameFallback = `catalog_page_impression_list_${productCategoryForList}` : listNameFallback = "catalog_page_impression_list"
    }
    else if (previousPageType === "detail" && isProductAccessory) {
      listNameFallback = "accessories_cross_selling_impression_list"
    }
    else if (previousPageType ===  "account") {
      listNameFallback = "wishlist_page_impression_list";
    }
    else if (previousPageType === "detail" && productCategory == category) {
      category ? listNameFallback = `product_page_up_selling_impression_list_${productCategoryForList}` : listNameFallback = "product_page_up_selling_impression_list"
    }
    else if (previousPageType === "detail") {
      category ? listNameFallback = `product_page_cross_selling_impression_list_${productCategoryForList}` : listNameFallback = "product_page_cross_selling_impression_list"
    }
    else {
      listNameFallback = "campaign_page_impression_list";
    }
    return listNameFallback
  }
}

export function getProductCategoryForList(productCategory: string) {

  const productCategoryForList = productCategory?.split('_')[productCategory.split('_').length - 1].toLowerCase();
  return productCategoryForList
}

export function getLastDetailOrCategoryPageViewDetails(eventType: string) {
  let pageViews = window.dataLayer.filter(cat => cat.event == "pageView" && (cat.pageType == "category" || cat.pageType == "detail" || cat.pageType == "home"))
  if (eventType === "productDetail") {
    pageViews.pop();
  }
  let lastEventDetails = {
    category: pageViews[pageViews.length - 1] ? pageViews[pageViews.length - 1]["product-category"] : "",
    macroCategory: pageViews[pageViews.length - 1] ? pageViews[pageViews.length - 1]["product-macrocategory"] : "",
    type: pageViews[pageViews.length - 1] ? pageViews[pageViews.length - 1]["pageType"] : "",
  };
  return lastEventDetails;
}

//Function to get pageType
export function getPageType(url: string) {
  // const splittedUrl = url.split(/[\s/]+/);
  // const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isFilteredCategory = url?.includes("&searchState")
  const isCategory = urlWithoutQueryStrings?.includes("produits") || urlWithoutQueryStrings?.includes("accessoires") || isFilteredCategory
  //const isCampaignPage = urlWithoutQueryStrings?.includes("cashback-lavatrici-2022") || urlWithoutQueryStrings?.includes("promozioni-brand")
  const isError = isErrorPage()

  // To handle filtered PLP and filtered search page
  const previousPageViewEvents = window.dataLayer.filter(item => item?.event == "pageView")
  const previousPageType: string = previousPageViewEvents ? previousPageViewEvents[(previousPageViewEvents.length) - 1]?.pageType : ""

  // Handling search
  const searchParams = window?.location?.search

  if (urlWithoutQueryStrings?.endsWith("/p")) {  //I'm in pdp
    return "detail"
  }
  else if (searchParams?.includes("_q") || previousPageType === "search") {
    return "search"
  }
  else if(isCategory || previousPageType === "category") {
    return "category"
  }
  else if (isError) {
    return "error"
  }
  else if (urlWithoutQueryStrings?.endsWith("/cart"))
    return "cart"
  else if (urlWithoutQueryStrings?.includes("checkout") && !(urlWithoutQueryStrings?.includes("orderPlaced")))
    return "checkout"
  else if (urlWithoutQueryStrings?.includes("checkout") && urlWithoutQueryStrings?.includes("orderPlaced"))
    return "purchase"

  else if (urlWithoutQueryStrings?.includes("support")) { //I'm in contact page
    return "contact"
  }
  // else if (isCampaignPage) {
  //   return "campaign"
  // }
  else if (urlWithoutQueryStrings?.includes("wcollection")) {
    return "story"
  }
  else if (urlWithoutQueryStrings?.endsWith("/")) { //I'm in home
    return "home"
  }
  else if (urlWithoutQueryStrings?.includes("login") || urlWithoutQueryStrings?.includes("account")) { //I'm in contact page
    return "personal"
  }
  return "other"
}

export function getPathFromUrl(url: string) {
  return url?.split("?")[0];
}

export function costructionType(cType: string) {
  if (cType.indexOf("Free ") !== -1) {
    let cTypeArray = cType.split(" ");
    return cTypeArray[0] + cTypeArray[1].toLowerCase();
  } else {
    return cType.replace(" ", "-");
  }
}

export function findDimension(data: any, nameKey: string) {
  let result = data.filter((obj: any) => obj.Name == nameKey);
  return result[0] ? result[0].Value[0] : "";
}
export function getVipCompany() {
  //@ts-ignore
  let id = __RUNTIME__.binding.id
  if (id === '17564333-171d-4290-998d-276aae4a3ee5') {
    if (
      document.location.pathname !== '/login' &&
      !sessionStorage['userCluster']
    ) {
      return ''
    }
    return sessionStorage['userCluster']
  } else if (id === '1bbaf935-b5b4-48ae-80c0-346623d9c0c9') {
    return 'epp'
  } else if (id === 'b9f7bf3a-c865-4169-8950-4fbb8b55ec09') {
    return 'ff'
  }
  return 'ff'
}
export function getDimension(product: any, dimension: number) {
  let accountType = getVipCompany();
  if (dimension === 4) {
    let result;
    switch (accountType) {
      case "ff": result =
        product.properties.filter(
          (obj: any) => obj.name === "sellableFF" || obj.Name === "sellableFF"
        )
        break
      case "epp":
        result = product.properties.filter(
          (obj: any) => obj.name === "sellableEPP" || obj.Name === "sellableEPP"
        )
        break
      default: result = product.properties.filter(
        (obj: any) => obj.name === "sellableVIP" || obj.Name === "sellableVIP"
      )
    }
    if (result.length > 0) {
      let value = result[0].values ? result[0].values[0] == "true" : result[0].Value[0] == "true";

      return value ? "Sellable Online" : "Not Sellable Online";
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
