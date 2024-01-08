//Functions for User type ---//
//Function to get session
export async function getSession() {
  let response = await fetch('/api/sessions?items=*', {
    method: 'GET',
    headers: {},
  })
  let session = await response.json()
  return session
}
//Function to get user info
export async function getUserInfo() {
  let response = await fetch('/_v/wrapper/api/user/userinfo', {
    method: 'GET',
  })
  let userInfo = await response.json()
  return userInfo
}
//Function to get user orders
export async function getUserOrders() {
  let response = await fetch('/_v/wrapper/api/hotCold', {
    method: 'GET',
  })
  let userOrders = await response.json()
  return userOrders
}
//Function to check user type
export function userType(orders: any) {
  // - guest
  // - lead (logged in user that did not give the opt in)
  // - prospect (logged in user that gave the consent to be contacted / OPTIN)
  // - customer (logged in user that purchased at least 1 item in the past)>
  const dateCheck = (orders: any) => {
    const lastYearDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    const orderDate = new Date(orders[0]?.creationDate)
    return lastYearDate.getTime() < orderDate?.getTime()
  }
  let userTypeValue = ''
  if (orders.UserType == 'prospect') {
    userTypeValue = 'prospect'
  } else {
    dateCheck(orders)
      ? (userTypeValue = 'hot customer')
      : (userTypeValue = 'cold customer')
  }
  return userTypeValue
}
//Functions for product ---//
//Function to get product name
export async function getProdName(prodCode: string) {
  let response = await fetch(
    '/_v/wrapper/api/catalog_system/products/productgetbyrefid/' + prodCode,
    {
      method: 'GET',
      headers: {},
    }
  )
  let product = await response.json()
  return product?.Name
}
//Function to get product code
export function getProdCode(url: string) {
  let temp: string = url.substring(url.lastIndexOf('-') + 1, url.length)
  let productCode: string = temp.substring(0, temp.lastIndexOf('/'))
  return productCode
}
//Functions for product category---//
//Function to get product category took by url
export async function getCategoryByUrl(url: string) {
  // let category = url.split(/[\s/]+/)[2] || url.split(/[\s/]+/)[1]

  switch (url) {
    // --------Products-------

    // macrocategories
    case '/hausgeraete/waschen---trocknen': // previously used to have three --- in URL
      return getCategoryStringFromId('3')
    case '/hausgeraete/waschen-trocknen':
      return getCategoryStringFromId('3')
    case '/hausgeraete/kuehlen---gefrieren': // previously used to have three --- in URL
      return getCategoryStringFromId('4')
    case '/hausgeraete/kuehlen-gefrieren':
      return getCategoryStringFromId('4')
    case '/hausgeraete/kochen---backen': // previously used to have three --- in URL
      return getCategoryStringFromId('5')
    case '/hausgeraete/kochen-backen':
      return getCategoryStringFromId('5')

    // sub categories
    case '/hausgeraete/waschmaschinen':
      return getCategoryStringFromId('13')
    case '/hausgeraete/waeschetrockner':
      return getCategoryStringFromId('14')
    case '/hausgeraete/waschtrockner':
      return getCategoryStringFromId('15')
    case '/hausgeraete/kuehl-gefrierkombinationen':
      return getCategoryStringFromId('16')
    case '/hausgeraete/kuehlschraenke':
      return getCategoryStringFromId('17')
    case '/hausgeraete/gefriergeraete':
      return getCategoryStringFromId('18')
    case '/hausgeraete/herde-backoefen':
      return getCategoryStringFromId('19')
    case '/hausgeraete/herde---backofen': // previously used to have three --- in URL
      return getCategoryStringFromId('19')
    case '/hausgeraete/mikrowellen':
      return getCategoryStringFromId('20')
    case '/hausgeraete/kochfelder':
      return getCategoryStringFromId('21')
    case '/hausgeraete/dunstabzugshauben':
      return getCategoryStringFromId('22')
    case '/hausgeraete/standherde':
      return getCategoryStringFromId('23')
    case '/hausgeraete/einbau-kompaktgeraete':
      return getCategoryStringFromId('24')
    case '/hausgeraete/geschirrspueler/geschirrspueler':
      return getCategoryStringFromId('25')
    case '/hausgeraete/klimaanlagen/klimaanlagen':
      return getCategoryStringFromId('26')

    // --------Accessories---------

    // macro categories
    case '/zubehoer/waschen---trocknen': // previously used to have three --- in URL
      return getCategoryStringFromId('8')
    case '/zubehoer/waschen-trocknen':
      return getCategoryStringFromId('8')
    case '/zubehoer/kuehlen---gefrieren': // previously used to have three --- in URL
      return getCategoryStringFromId('9')
    case '/zubehoer/kuehlen-gefrieren':
      return getCategoryStringFromId('9')
    case '/zubehoer/kochen---backen': // previously used to have three --- in URL
      return getCategoryStringFromId('10')
    case '/zubehoer/kochen-backen':
      return getCategoryStringFromId('10')

    // sub categories
    case '/zubehoer/geschirrspueler/geschirrspueler':
      return getCategoryStringFromId('38')
    case '/zubehoer/klimaanlagen/klimaanlagen':
      return getCategoryStringFromId('39')

    case '/hausgeraete':
      return getCategoryStringFromId('1')
    case '/zubehoer':
      return getCategoryStringFromId('2')

    // bundles
    case '/landings/herd-und-backofensets':
      return 'SC_BK_FG_CK_Bundles' // Currently the value is empty from catalogue: https://bauknechtde.myvtex.com/admin/Site/CategoriaForm.aspx?Acao=Alterar&Id=40
    default:
      return ''
  }
}
//Function to get Category with API call
export async function getCategory(prodCode: string) {
  let response = await fetch(
    '/_v/wrapper/api/catalog_system/products/productgetbyrefid/' + prodCode,
    {
      method: 'GET',
      headers: {},
    }
  )
  let product = await response.json()
  let productCategoryId = product?.CategoryId
  let productCategory =
    productCategoryId !== undefined
      ? await getCategoryStringFromId(productCategoryId.toString())
      : ''
  return productCategory
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
  let response = await fetch('/_v/wrapper/api/catalog/category/' + id, options)
  let category = await response.json()
  return category?.AdWordsRemarketingCode
}

/**
 * Get path from URL
 * @param {string} url - URL
 * @return {string} URL without path
 * Example input:  https://samplePage--itwhirlpool.myvtex.com/?gclwE&gclsrc=aw.ds
 * Returnns: https://samplePage--itwhirlpool.myvtex.com/
 */
export function getPathFromUrl(url: string) {
  return url?.split('?')[0]
}

// Check if you are in error page
export function isErrorPage() {
  const currentRouteId: string = window.history.state.state.navigationRoute.id
  const isError = currentRouteId === 'store.search'
  const errorSearch = window.dataLayer.filter((el) => el.event == 'errorPage')
  if (errorSearch.length == 0) {
    return '(Other)'
  } else {
    return isError
  }
}

// Check if you are in PDP error page
export function isProductErrorPage() {
  const currentRouteId: string = window.history.state.state.navigationRoute.id
  const isProductPageError = currentRouteId === 'store.not-found#product'
  return isProductPageError
}
// Function to get product category for list param 
export function getProductCategoryForList(productCategory: string) {
  
  const productCategoryForList = productCategory?.split('_')[productCategory.split('_').length - 1].toLowerCase();
  return productCategoryForList
}