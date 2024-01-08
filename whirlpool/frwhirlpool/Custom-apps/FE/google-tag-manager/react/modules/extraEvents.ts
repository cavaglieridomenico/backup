import push from './push'
import { PixelMessage } from '../typings/events'
import { getStringCategoryFromId } from './enhancedEcommerceEvents'
// import { pushErrorPageEvent } from './ErrorPageEvent'
import {
  // getPathFromUrl,
  // isErrorPage,
  // isProductErrorPage,
  normalizeString,
} from '../utils/generic'

export async function sendExtraEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    // case 'vtex:pageView': {
    //   const urlShort = e.data.pageUrl.replace(e.origin, '')
    //   const isPdpError = isProductErrorPage()
    //   const pageType = setPageTypeFromUrl(e.data.pageUrl)
    //   let userStatus = await getUserIsLogged()
    //   const userType =
    //     userStatus === 'authenticated' ? await getUserType() : 'prospect'
    //   let urlWithoutQuery = e.data.pageUrl.split('?')[0]
    //   let productCode = isPdpError ? '' : setProductCode(urlWithoutQuery)
    //   let productName = isPdpError ? '' : setProductName(urlWithoutQuery)
    //   //let productCategory = !isPdpError && isProductPage ? await getCategory(productCode) : ""
    //   let categoryPaths = e.data.pageUrl
    //     .replace(e.origin, '')
    //     .substr(1)
    //     .split('?')[0]
    //     .split('/')
    //   if (categoryPaths[categoryPaths.length - 1] == '') {
    //     categoryPaths.pop()
    //   }

    //   let productCategory = ''

    //   const productCategoryPath = decodeURI(
    //     categoryPaths[categoryPaths.length - 1]
    //   )

    //   switch (productCategoryPath) {
    //     case 'refrigerateurs-multi-portes': {
    //       productCategory = 'SC_WP_FG_CO_Cooling'
    //       break
    //     }
    //     default: {
    //       productCategory = await getProductCategory(
    //         pageType,
    //         productCategoryPath,
    //         urlShort
    //       )
    //     }
    //   }

    //   const contentGrouping = getContentGrouping(urlShort)

    //   push({
    //     event: 'pageView',
    //     // location: e.data.pageUrl,
    //     // page: urlShort,
    //     // referrer: e.data.referrer,
    //     status: userStatus,
    //     userType,
    //     'product-code': productCode,
    //     'product-name': productName,
    //     'product-category': productCategory,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: contentGroupingSecond(),
    //   })
    //   push({
    //     event: 'feReady',
    //     status: userStatus,
    //     userType,
    //     'product-code': productCode,
    //     'product-name': productName,
    //     'product-category': productCategory,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: contentGroupingSecond(),
    //   })

    //   if (pageType === 'error' || isPdpError) {
    //     pushErrorPageEvent()

    //     //GA4FUNREQ57
    //     push({
    //       event: 'custom_error',
    //       type: 'error pages',
    //       description: '404',
    //     })
    //   }

    //   return
    // }

    case 'vtex:userData': {
      const { data } = e
      if (!data.isAuthenticated) {
        return
      }
      fetch('/api/sessions?items=*', { method: 'GET' })
        .then(response => response.json())
        .then(json => {
          fetch('/_v/wrapper/api/user/userinfo', {
            method: 'GET',
          })
            .then(response => response.json())
            .then(user => {
              push({
                event: 'userData',
                userId: data.id,
                genere: user.gender ? user.gender : '',
                email: json.namespaces.profile.email.value,
              })
            })
            .catch(err => {
              console.error(err)
            })
        })

      return
    }
  }

  // async function getUserIsLogged() {
  //   let logType: string = ''
  //   await fetch('/_v/wrapper/api/user/userinfo', {
  //     method: 'GET',
  //     headers: {},
  //   }).then(async response => {
  //     let userInfo = await response.json()
  //     logType = userInfo.length > 0 ? 'authenticated' : 'anonymous'
  //   })
  //   return logType
  // }
}

// function setPageTypeFromUrl(url: string) {
//   const urlWithoutQueryStrings = getPathFromUrl(url)
//   const isContact = url.includes('services') || url.includes('faq')
//   const isFilteredCategory = url.includes('&searchState')
//   const isCategory =
//     urlWithoutQueryStrings.includes('produits') ||
//     urlWithoutQueryStrings.includes('accessoires') ||
//     isFilteredCategory
//   const isError = isErrorPage()

//   let pageType = 'other'

//   if (isCategory) pageType = 'category'
//   else if (url.includes('map=')) {
//     pageType = 'search'
//   } else if (urlWithoutQueryStrings.endsWith('/p') || isProductErrorPage())
//     pageType = 'detail'
//   else if (urlWithoutQueryStrings.endsWith('/cart')) pageType = 'cart'
//   else if (
//     urlWithoutQueryStrings.includes('checkout') &&
//     !urlWithoutQueryStrings.includes('orderPlaced')
//   )
//     pageType = 'checkout'
//   else if (
//     urlWithoutQueryStrings.includes('checkout') &&
//     urlWithoutQueryStrings.includes('orderPlaced')
//   )
//     pageType = 'purchase'
//   else if (isContact) {
//     if (
//       urlWithoutQueryStrings.includes('/services/pieces-detachees-d-origine')
//     ) {
//       return 'other'
//     }
//     pageType = 'contact'
//   } else if (urlWithoutQueryStrings.includes('lave-linge-supreme-silence'))
//     pageType = 'campaign'
//   else if (
//     urlWithoutQueryStrings.includes('wcollection') ||
//     urlWithoutQueryStrings.includes('nouveautes')
//   )
//     pageType = 'story'
//   else if (isError) {
//     pageType = 'error'
//   } else if (urlWithoutQueryStrings.endsWith('/')) pageType = 'home'
//   return pageType
// }

//Function to get content grouping
// function getContentGrouping(url: string) {
//   const urlWithoutQueryStrings = getPathFromUrl(url)
//   const isFilteredCategory = url.includes('&searchState')
//   const isCatalog =
//     urlWithoutQueryStrings.endsWith('/p') ||
//     urlWithoutQueryStrings.includes('produits') ||
//     urlWithoutQueryStrings.includes('product-comparison') ||
//     isFilteredCategory
//   //const emptySearchState = sessionStorage.getItem("isErrorEmptySearch")
//   const isMarketing =
//     urlWithoutQueryStrings.includes('nouveautes') ||
//     urlWithoutQueryStrings.includes('seche-linge-supreme-silence') ||
//     urlWithoutQueryStrings.includes('lave-linge-supreme-silence') ||
//     urlWithoutQueryStrings.includes(
//       'les-nouvelles-classes-efficacite-energetiques'
//     )
//   const isSupport =
//     urlWithoutQueryStrings.includes('services') ||
//     urlWithoutQueryStrings.includes('faq') ||
//     urlWithoutQueryStrings.includes('conseils-dentretien-et-dinstallation')
//   const isPromotions =
//     urlWithoutQueryStrings.includes('promotions') ||
//     urlWithoutQueryStrings.includes('offres-de-remboursement')
//   const isPdpError = isProductErrorPage()
//   const isError = isErrorPage()
//   const isSearchPage =
//     window.history?.state?.state?.navigationRoute?.id === 'store.search'

//   if (isCatalog && !isPdpError) {
//     return 'Catalog'
//   } else if (urlWithoutQueryStrings.includes('pages')) {
//     return 'Company'
//   } else if (isMarketing) {
//     return 'Marketing'
//   } else if (
//     urlWithoutQueryStrings.includes('account') ||
//     urlWithoutQueryStrings.includes('login')
//   ) {
//     //I'm in personal area page
//     return 'Personal'
//   } else if (isPromotions) {
//     return 'Promotions'
//   } else if (urlWithoutQueryStrings.includes('recettes')) {
//     return 'Recipes'
//   } else if (
//     urlWithoutQueryStrings.includes('wcollection') ||
//     urlWithoutQueryStrings.includes('pack-cuisine-equipee')
//   ) {
//     return 'W Collections'
//   } else if (
//     urlWithoutQueryStrings.includes('accessoires') ||
//     urlWithoutQueryStrings.includes('/services/pieces-detachees-d-origine')
//   ) {
//     return 'Accessories & Spare Parts'
//   } else if (
//     urlWithoutQueryStrings.includes('wellbeing') ||
//     urlWithoutQueryStrings.includes('bien-etre')
//   ) {
//     return 'Well-Being'
//   } else if (isSupport) {
//     return 'Support'
//   } else if (urlWithoutQueryStrings === '/') {
//     return 'Homepage'
//   } else if (isSearchPage) {
//     const notFoundTextElements = document.getElementsByClassName(
//       'lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--notFound vtex-rich-text-0-x-paragraph--center'
//     )
//     if (notFoundTextElements?.length > 0) {
//       // Handling search page when there is an empty search
//       return 'Errors'
//     }
//     return '(Other)'
//   } else if (isError || isPdpError) {
//     return 'Errors'
//   }
//   return '(Other)'
// }

//Function to get content grouping second
// function contentGroupingSecond() {
//   let urlWithoutQueryStrings = window.location.pathname
//   let breadcrumb = document.getElementsByClassName(
//     'frwhirlpool-breadcrumb-custom-0-x-catLink'
//   )
//   let category = breadcrumb[1]?.innerHTML

//   if (
//     urlWithoutQueryStrings.includes('/cuisson') ||
//     (urlWithoutQueryStrings.endsWith('/p') && category == 'cuisson')
//   ) {
//     //I'm in cooking
//     return 'Cooking'
//   } else if (
//     urlWithoutQueryStrings.includes('/lavage') ||
//     (urlWithoutQueryStrings.endsWith('/p') && category == 'lavage')
//   ) {
//     //I'm in laundry
//     return 'Laundry'
//   } else if (
//     urlWithoutQueryStrings.includes('/froid') ||
//     (urlWithoutQueryStrings.endsWith('/p') && category == 'froid')
//   ) {
//     //I'm in cooling
//     return 'Cooling'
//   } else if (
//     urlWithoutQueryStrings.includes('/climatiseurs') ||
//     (urlWithoutQueryStrings.endsWith('/p') && category == 'Climatiseurs')
//   ) {
//     //I'm in Air Conditioning
//     return 'Air Conditioning'
//   } else if (
//     urlWithoutQueryStrings.includes('/lave-vaisselle') ||
//     (urlWithoutQueryStrings.endsWith('/p') && category == 'lave-vaisselle')
//   ) {
//     //I'm in dishwash
//     return 'Dishwashing'
//   } else {
//     return ''
//   }
// }

function setProductCode(url: any) {
  if (!url.endsWith('/p')) return ''
  let code = url
    .split('/')
    .reverse()[1]
    .split('-')
    .reverse()[0]
  return code
}

// function setProductName(url: any) {
//   if (!url.endsWith('/p')) return ''
//   let code = url
//     .split('/')
//     .reverse()[1]
//     .split('-')
//     .slice(0, -1)
//     .join('-')
//   return code
// }

//Functions to get all category
async function getAllCategory(deepLevel = 10) {
  const url = '/api/catalog_system/pub/category/tree/' + deepLevel
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }

  return await fetch(url, options).then(async res => await res.json())
}

async function getCategoryFromProductCode(prodCode: string) {
  let productCategoryId: string = await fetch(
    '/_v/wrapper/api/catalog_system/products/productgetbyrefid/' +
    prodCode +
    '-WER',
    {
      method: 'GET',
      headers: {},
    }
  ).then(async response => {
    let product = await response.json()
    return product.CategoryId
  })
  let categoryObj = await getStringCategoryFromId(productCategoryId?.toString())
  return categoryObj?.AdWordsRemarketingCode ?? ''
}

const flattenCategories = (obj: any) => {
  const array = Array.isArray(obj) ? obj : [obj]
  return array.reduce((acc, value) => {
    acc.push(value)
    if (value.children) {
      acc = acc.concat(flattenCategories(value.children))
      delete value.children
    }
    return acc
  }, [])
}

// Function that is able to retrive a category id from an ordered list of category
// For example
// [dep]
// [dep, cat]
// [dep, cat, subcat]
async function getIdCategory(categoryPath: string) {
  let categories = await getAllCategory()
  let isAccessories = window.location.href.includes('accessoires')
  let cleanCategories = flattenCategories(
    isAccessories ? categories[1] : categories[0]
  )

  const isDishwashing =
    window.location.pathname.includes('lave-vaisselle') ||
    window.location.pathname.includes('lave-linge')
  if (isDishwashing && !isAccessories) {
    categoryPath = 'lave-vaisselle'
  }

  // replace function replaces all occurrences of " " with "-"
  let category = cleanCategories.filter(
    (cat: any) =>
      normalizeString(cat.name).replace(/\s/g, '-') ==
      normalizeString(categoryPath)
  )[0]
  const otherProductCategoryId = 8 // Can be found in: https://frwhirlpool.myvtex.com/admin/Site/Categories.aspx

  return category ? category.id : otherProductCategoryId
}

//Function to get product category
//@ts-ignore
async function getProductCategory(
  pageType: string,
  categoryPath: string,
  url: string
) {
  if (pageType === 'detail') {
    //I'm in pdp
    let productCode: string = setProductCode(url)
    const categoryId = await getCategoryFromProductCode(productCode)
    return categoryId ?? ''
  } else if (pageType === 'category') {
    //I'm in plp
    let categoryId = await getIdCategory(categoryPath)
    const categoryObj = categoryId
      ? await getStringCategoryFromId(categoryId)
      : ''
    return categoryObj?.AdWordsRemarketingCode ?? ''
  } else {
    return ''
  }
}

//Function to get user type
// async function getUserType() {
//   let type: string = ''
//   await fetch('/_v/wrapper/api/HotCold', {
//     method: 'GET',
//     headers: {},
//   })
//     .then(async response => await response.json())
//     .then(data => {
//       type = data.UserType
//     })
//     .catch(err => {
//       console.error(err)
//     })
//   return type
// }
