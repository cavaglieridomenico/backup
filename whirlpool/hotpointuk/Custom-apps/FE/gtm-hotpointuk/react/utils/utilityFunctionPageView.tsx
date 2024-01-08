import { WindowRuntime } from '../modules/interfaces'
import { getPathFromUrl } from './urlUtils'

//Functions for User type ---//
//Function to get session
export async function getSession() {
  return await fetch('/api/sessions?items=*', {
    method: 'GET',
    headers: {},
  }).then((response) => {
    return response.json()
  })
}
//Function to get user info
export async function getUserInfo() {
  return await fetch('/_v/wrapper/api/user/userinfo', {
    method: 'GET',
  }).then((response) => {
    return response.json()
  })
}
//Function to get user orders
export async function getUserOrders() {
  return await fetch('/_v/wrapper/api/user/hasorders', {
    method: 'GET',
  }).then((response) => {
    return response.json()
  })
}
//Function to check user type
export function userType(orders: any, isNewsletterOptin: Boolean) {
  // - guest
  // - lead (logged in user that did not give the opt in)
  // - prospect (logged in user that gave the consent to be contacted / OPTIN)
  // - customer (logged in user that purchased at least 1 item in the past)>
  let userTypeValue = isNewsletterOptin ? 'prospect' : 'lead'
  orders?.toString() == 'true' ? (userTypeValue = 'customer') : null
  return userTypeValue
}
//Functions for product ---//
//Function to get product name
export async function getProdName(prodCode: string) {
  return await fetch(
    '/_v/wrapper/api/catalog_system/products/productgetbyrefid/' + prodCode,
    {
      method: 'GET',
      headers: {},
    }
  ).then(async (response) => {
    let product = await response.json()
    return product.Name
  })
}
//Function to get product code
export function getProdCode(url: string) {
  let temp: string = url.substring(url.lastIndexOf('-') + 1, url.length)
  let productCode: string = temp.substring(0, temp.lastIndexOf('/'))
  return productCode
}

//Function to get Categpry with API call
export async function getCategory(prodCode: string) {
  let productCategoryId: string = await fetch(
    '/_v/wrapper/api/catalog_system/products/productgetbyrefid/' + prodCode,
    {
      method: 'GET',
      headers: {},
    }
  ).then(async (response) => {
    let product = await response.json()
    return product.CategoryId
  })
  return await getCategoryStringFromId(productCategoryId?.toString())
}
//Functions to get category from category id
export async function getCategoryStringFromId(id: string) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  return await fetch('/_v/wrapper/api/catalog/category/' + id, options).then(
    async (response) => {
      let category = await response.json()
      return category.AdWordsRemarketingCode
    }
  )
}
//Functions to get all category
async function getAllCategory(deepLevel = 10) {
  const url = '/api/catalog_system/pub/category/tree/' + deepLevel
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }

  return await fetch(url, options).then(async (res) => await res.json())
}
// Function that is able to search a son among sibilings
function choiseBranchCategory(categories: [any], dep: string) {
  let newDep = dep.replace(/-/g, ' ')
  let i = 0
  let indexFinded = -1
  while (indexFinded == -1 || i < categories.length) {
    if (newDep == categories?.[i]?.name) {
      indexFinded = i
    }
    i += 1
  }
  let branch = indexFinded == -1 ? null : categories[indexFinded]
  return branch
}
// Function that retrive the correct level inside a category tree (sibilings)
function searchLevel(categories: any, categoryPath: [string], level: number) {
  if (level == 0) {
    // se si sta cercando l'id del dip
    return categories
  } else {
    let temp: any = {}
    for (let i = 0; i < level; i++) {
      if (i == 0) {
        temp = categories.children
      } else {
        temp = choiseBranchCategory(temp, categoryPath[i])?.children
      }
    }
    return temp
  }
}
// Function that is able to retrive a category id from an ordered list of category
// For example
// [dep]
// [dep, cat]
// [dep, cat, subcat]
export async function getIdCategory(categoryPath: [string]) {
  let categories = await getAllCategory()
  let deepLevel = categoryPath.length
  let branch = choiseBranchCategory(categories, categoryPath[0])
  if (branch == null) {
    //se non viene trovato il branch del dipartimento
    return ''
  }
  let categoryLevel = searchLevel(branch, categoryPath, deepLevel - 1)
  return choiseBranchCategory(categoryLevel, categoryPath[deepLevel - 1]).id
}

// Check if you are in PDP error page
export function isProductErrorPage() {
  const currentRouteId: string =
    window.history.state?.state?.navigationRoute?.id
  const isProductPageError = currentRouteId === 'store.not-found#product'
  return isProductPageError
}

// Check if you are in error page
export function isErrorPage() {
  const currentRouteId: string =
    window.history.state?.state?.navigationRoute?.id
  const isError = currentRouteId === 'store.not-found#search'
  return isError
}

//Function to get pageType
export function getPageType(url: string) {
  // const splittedUrl = url.split(/[\s/]+/);
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isFilteredCategory = url.includes('&searchState')
  const isCategory =
    urlWithoutQueryStrings.includes('appliances') ||
    urlWithoutQueryStrings.includes('accessories') ||
    isFilteredCategory
  const isCampaignPage = urlWithoutQueryStrings.includes('promotions')
  const isSupport =
    urlWithoutQueryStrings.includes('support') ||
    urlWithoutQueryStrings.includes('faq')
  const isError = isErrorPage()

  // Handling search
  const searchParams = window?.location?.search

  if (urlWithoutQueryStrings.endsWith('/p')) {
    //I'm in pdp
    return 'detail'
  } else if (isCategory) {
    //I'm in plp
    return 'category'
  } else if (searchParams?.includes('_q')) {
    return 'search'
  } else if (urlWithoutQueryStrings.endsWith('/cart')) return 'cart'
  else if (
    urlWithoutQueryStrings.includes('checkout') &&
    !urlWithoutQueryStrings.includes('orderPlaced')
  )
    return 'checkout'
  else if (
    urlWithoutQueryStrings.includes('checkout') &&
    urlWithoutQueryStrings.includes('orderPlaced')
  )
    return 'purchase'
  else if (isSupport) {
    //I'm in contact page
    if (urlWithoutQueryStrings.includes('spare-parts')) {
      return 'other'
    }
    return 'contact'
  } else if (isCampaignPage) {
    return 'campaign'
  } else if (urlWithoutQueryStrings.endsWith('/')) {
    //I'm in home
    return 'home'
  }
  // Avoid pages being classified as "error" as when landing on Error page and then click on footer OR header URLs classified as "other",
  // runtime?.route?.id === "store.not-found#search" OR runtime?.route?.id === "store.not-found#product
  else if (runtime?.route?.id === 'store.not-found#search') {
    return 'error'
  } else if (isError) {
    return 'error'
  }

  return 'other'
}
