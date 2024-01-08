//@ts-nocheck
import push from './push'
import { PixelMessage } from '../typings/events'
import {
  getSession,
  getUserInfo,
  getUserOrders,
  userType,
  getProdName,
  getProdCode,
  getCategoryStringFromId,
  getCategory,
  getIdCategory,
  getVipCompany,
  getData,
  getUserCompany,
} from '../utils/utilityFunctionPageView'
import { getPathFromUrl } from '../utils/urlUtils'
import { WindowRuntime } from './interfaces'
import { pushErrorPageEvent } from './errorPageEvent'
import { isErrorPage } from '../utils/generic'

//Function to get user status
//@ts-ignore
async function getUserStatus() {
  let session = await getSession() //Get session info
  let statusNotLogged =
    session?.namespaces == undefined ||
    session?.namespaces?.profile == undefined ||
    session?.namespaces?.profile?.isAuthenticated?.value === 'false'
  return !statusNotLogged ? 'authenticated' : 'anonymous'
}
//Function to getProductCode
//@ts-ignore
function getProductCode(url: string) {
  let pageType: string = getPageType(url)
  if (pageType !== 'detail') {
    //I need productCode only in pdp
    return ''
  }
  return getProdCode(url)
}
//Function to getProductName
//@ts-ignore
async function getProductName(url: string) {
  let pageType: string = getPageType(url)
  if (pageType !== 'detail') {
    //I need productCode only in pdp
    return ''
  }
  let productCode: string = getProductCode(url)
  let productName: string = await getProdName(productCode)
  return productName
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
    let productCode: string = getProdCode(url)
    return await getCategory(productCode)
  } else if (pageType === 'category') {
    //I'm in plp
    let categoryId = await getIdCategory(categoryPath)
    return categoryId ? await getCategoryStringFromId(categoryId) : ''
  } else {
    return ''
  }
}
//Function to get user type
//@ts-ignore
async function getUserType() {
  let session = await getSession() //Get session info
  let userInfo =
    session?.namespaces !== undefined &&
    session?.namespaces?.profile !== undefined && //Get userInfo
    !(session?.namespaces?.profile?.isAuthenticated?.value === 'false')
      ? await getUserInfo()
      : ''
  let userOrders = userInfo !== '' ? await getUserOrders() : '' //Get info about user orders
  return userOrders !== ''
    ? userType(userOrders, userInfo[0]?.isNewsletterOptIn)
    : 'guest'
}
//Function to get pageType
export function getPageType(url: string) {
  // const splittedUrl = url.split(/[\s/]+/);
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isFilteredCategory = url?.includes('&searchState')
  const isCategory =
    urlWithoutQueryStrings?.includes('produits') ||
    urlWithoutQueryStrings?.includes('accessoires') ||
    isFilteredCategory
  //const isCampaignPage = urlWithoutQueryStrings?.includes("cashback-lavatrici-2022") || urlWithoutQueryStrings?.includes("promozioni-brand")
  const isError = isErrorPage()

  // To handle filtered PLP and filtered search page
  const previousPageViewEvents = window.dataLayer.filter(
    (item) => item?.event == 'pageView'
  )
  const previousPageType: string = previousPageViewEvents
    ? previousPageViewEvents[previousPageViewEvents.length - 1]?.pageType
    : ''

  // Handling search
  const searchParams = window?.location?.search

  if (urlWithoutQueryStrings?.endsWith('/p')) {
    //I'm in pdp
    return 'detail'
  } else if (searchParams?.includes('_q') || previousPageType === 'search') {
    return 'search'
  } else if (isCategory || previousPageType === 'category') {
    return 'category'
  } else if (isError) {
    return 'error'
  } else if (urlWithoutQueryStrings?.endsWith('/cart')) return 'cart'
  else if (
    urlWithoutQueryStrings?.includes('checkout') &&
    !urlWithoutQueryStrings?.includes('orderPlaced')
  )
    return 'checkout'
  else if (
    urlWithoutQueryStrings?.includes('checkout') &&
    urlWithoutQueryStrings?.includes('orderPlaced')
  )
    return 'purchase'
  else if (urlWithoutQueryStrings?.includes('support')) {
    //I'm in contact page
    return 'contact'
  }
  // else if (isCampaignPage) {
  //   return "campaign"
  // }
  else if (urlWithoutQueryStrings?.includes('wcollection')) {
    return 'story'
  } else if (urlWithoutQueryStrings?.endsWith('/')) {
    //I'm in home
    return 'home'
  } else if (
    urlWithoutQueryStrings?.includes('login') ||
    urlWithoutQueryStrings?.includes('account')
  ) {
    //I'm in contact page
    return 'personal'
  }
  return 'other'
}
function getContentGroupingSecond(category): string {
  let catSplit = category?.split('_')
  const urlPath = window.location.pathname
  const pageType = getPageType(urlPath)
  let isAccesories = catSplit?.some((value) => value === 'AC')

  const mappedCategoriesFromProductCategory = {
    Laundry: 'Laundry',
    Cooking: 'Cooking',
    Cooling: 'Cooling',
    Dishwashing: 'Dishwash',
    Dishwashers: 'Dishwash',
    AirConditioning: 'Air conditioner',
    WashingMachines: 'Laundry',
    Dryers: 'Laundry',
    WasherDryers: 'Laundry',
    Fridges: 'Cooling',
    Freezing: 'Cooling',
    Freezers: 'Cooling',
    Ovens: 'Cooking',
    Microwaves: 'Cooking',
    Hobs: 'Cooking',
    Hoods: 'Cooking',
    Cookers: 'Cooking',
    Kitchen: 'Small kitchen appliances',
  }

  const mappedCategoriesFromUrl = {
    cuisson: 'Cooking',
    froid: 'Cooling',
    climatiseurs: 'Air conditioner',
    'petits-electromenagers-cuisine': 'Small kitchen appliances',
    'chauffe-plats': 'Small kitchen appliances',
    'autres-produits': 'Other products',
    lavage: 'Laundry',
    'lave-vaisselle': 'Dishwash',
    accessoires: 'Wpro Accessories',
  }

  if (isAccesories || category.toLowerCase().includes('accessories')) {
    return 'Wpro Accessories'
  } else if (category) {
    const contentGroupingFromProductCategory =
      mappedCategoriesFromProductCategory[catSplit[catSplit.length - 1]]
    return contentGroupingFromProductCategory ?? ''
  }

  // For PLP based on URL - fallback in case there is no product-category
  else if (pageType === 'category') {
    const splittedUrl = window.location.pathname.split('/')
    const contentGroupingFromUrl =
      mappedCategoriesFromUrl[splittedUrl?.[splittedUrl?.length - 2]]
    return contentGroupingFromUrl ?? ''
  }

  return ''
}
function getContentGrouping(url: string) {
  // const splittedUrl = url.split(/[\s/]+/);
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)

  // Handling search
  const searchParams = window?.location?.search

  const previousPageViewEvents = window.dataLayer.filter(
    (item) => item?.event == 'pageView'
  )
  const previousContentGrouping: string = previousPageViewEvents
    ? previousPageViewEvents[previousPageViewEvents.length - 1]?.contentGrouping
    : ''
  const previousPageType: string = previousPageViewEvents
    ? previousPageViewEvents[previousPageViewEvents.length - 1]?.pageType
    : ''

  if (searchParams?.includes('_q') || previousPageType === 'search') {
    return '(Other)'
  } else if (
    urlWithoutQueryStrings?.includes('produits') ||
    urlWithoutQueryStrings?.includes('accessoires') ||
    previousContentGrouping === 'Catalog'
  ) {
    //I'm in plp
    return 'Catalog'
  } else if (
    urlWithoutQueryStrings?.endsWith('/p') &&
    runtime?.route?.id === 'store.not-found#product'
  ) {
    return 'Errors'
  } else if (urlWithoutQueryStrings?.endsWith('/p')) {
    //I'm in pdp
    return 'Catalog'
  } else if (
    urlWithoutQueryStrings?.includes('spare-parts') ||
    urlWithoutQueryStrings?.includes('cleaning-and-care')
  ) {
    //I'm in plp
    return 'Catalog'
  } else if (urlWithoutQueryStrings?.includes('support')) {
    //I'm in contact page
    return 'Support'
  } else if (runtime?.route?.id === 'store.not-found#search') {
    return 'Errors'
  } else if (urlWithoutQueryStrings?.endsWith('/')) {
    //I'm in home
    return 'Homepage'
  }
  return '(Other)'
}
async function getUserIsLogged() {
  let logType: string = ''
  await fetch('/_v/wrapper/api/user/userinfo', {
    method: 'GET',
    headers: {},
  }).then(async (response) => {
    let userInfo = await response.json()
    logType = userInfo.length > 0 ? 'authenticated' : 'anonymous'
  })
  return logType
}

export function getMacroCategory(category) {
  let catSplit = category?.split('_')
  let isAccesories = catSplit?.filter((value) => value === 'AC')
  if (isAccesories.length > 0) {
    return catSplit[catSplit.length - 3] + '_' + catSplit[catSplit.length - 2]
  } else if (category.toLowerCase().includes('accessories')) {
    return 'AC'
  } else {
    return catSplit[catSplit.length - 2]
  }
}
export async function sendExtraEvents(e: PixelMessage) {
  //alternative message if the data is not available
  const alternativeValue: string = ''

  switch (e.data.eventName) {
    //NUOVO PAGEVIEW
    //GA4FUNREQ-CC-03
    // case 'vtex:pageView': {
    //   const pageType = getPageType(e.data.pageUrl)
    //   let urlShort = e.data.pageUrl.replace(e.origin, '')
    //   let categoryPaths = e.data.pageUrl
    //     .replace(e.origin, '')
    //     .substr(1)
    //     .split('?')[0]
    //     .split('/')
    //   if (categoryPaths[categoryPaths.length - 1] == '') {
    //     categoryPaths.pop()
    //   }
    //   const status = await getUserIsLogged()
    //   const contentGrouping = getContentGrouping(e.data.pageUrl)
    //   let productCategory = ''

    //   const productCategoryPath = decodeURI(
    //     categoryPaths[categoryPaths.length - 1]
    //   )

    //   switch (productCategoryPath) {
    //     case 'refrigerateurs-multi-portes': {
    //       productCategory = 'SC_D2C_FR_FG_CO_Cooling'
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

    //   const macroCategory = getMacroCategory(productCategory)
    //   const contentGroupingSecond = getContentGroupingSecond(productCategory)

    //   let url = '/api/vtexid/pub/authenticated/user'
    //   let userData = await (await fetch(url)).json()

    //   if (userData && userData.userId) {
    //     push({
    //       event: 'userId',
    //       user_id: userData.userId,
    //     })
    //   }

    //   push({
    //     event: 'pageView',
    //     status: await getUserStatus(),
    //     userType: await getUserType(),
    //     'product-code': getProductCode(urlShort),
    //     'product-name': await getProductName(urlShort),
    //     'product-category': productCategory,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: contentGroupingSecond || '',
    //     ...(e.data.pageTitle && {
    //       title: e.data.pageTitle,
    //     }),
    //     user_company: getData(getUserCompany('userCluster'), alternativeValue),
    //     // location: e.data.pageUrl,
    //     // page: urlShort,
    //     // referrer: e.data.referrer,
    //     // 'product-macrocategory': macroCategory || '',
    //     // 'vip-company': getVipCompany(),
    //   })
    //   push({
    //     event: 'feReady',
    //     status: await getUserStatus(),
    //     userType: await getUserType(),
    //     'product-code': getProductCode(urlShort),
    //     'product-name': await getProductName(urlShort),
    //     'product-category': productCategory,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: contentGroupingSecond || '',
    //     ...(e.data.pageTitle && {
    //       title: e.data.pageTitle,
    //     }),
    //     user_company: getData(getUserCompany('userCluster'), alternativeValue),
    //     // location: e.data.pageUrl,
    //     // page: urlShort,
    //     // referrer: e.data.referrer,
    //     // 'product-macrocategory': macroCategory || '',
    //     // 'vip-company': getVipCompany(),
    //   })

    //   if (pageType === 'error') {
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
      fetch('/api/sessions?items=*', {
        method: 'GET',
        headers: {},
      })
        .then((response) => response.json())
        .then((json) => {
          fetch('/_v/wrapper/api/user/userinfo', {
            method: 'GET',
          })
            .then((response) => response.json())
            .then((user) => {
              push({
                event: 'userData',
                userId: data.id,
                genere: user.gender ? user[0].gender : '',
                email: json.namespaces.profile.email.value,
              })
            })
            .catch((err) => {
              console.error(err)
            })
        })

      return
    }
  }
}
