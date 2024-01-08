//PageView Call
export const getPageView = async (url: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const pageViewInfos = fetch(
    `/v1/api/analytics/pageview?path=${url}`,
    options
  ).then((res) => {
    return res.json()
  })

  return await pageViewInfos
}

//Get a full url
export const getUrlToPush = (url: string) => {
  if (url.includes('http') || url.includes('www')) return url
  const urlLocation = window.location.origin
  return `${urlLocation}/${url.charAt(0) == '/' ? url.replace('/', '') : url}`
}

//Get property from Session Storage
export const getUserCompany = (propName: string): string => {
  let propValue = sessionStorage.getItem(propName)
  return propValue && typeof propValue === 'string' ? propValue : ''
}

/**
 * Get path from URL
 * @param {string} url - URL
 * @return {string} URL without path
 * Example input:  https://samplePage--itwhirlpool.myvtex.com/?gclwE&gclsrc=aw.ds
 * Returnns: https://samplePage--itwhirlpool.myvtex.com/
 */
// function getPathFromUrl(url: string) {
//   return url?.split('?')[0]
// }

// Check if you are in PDP error page
export function isProductErrorPage() {
  const currentRouteId: string =
    window.history.state?.state?.navigationRoute?.id
  const isProductPageError = currentRouteId === 'store.not-found#product'
  return isProductPageError
}

//Check if you are in error page
export function isErrorPage() {
  const currentRouteId: string =
    window.history.state?.state?.navigationRoute?.id
  const isError = currentRouteId === 'store.not-found#search'
  return isError
}

//Error page analytics
export function pushErrorPageEvent() {
  //FUNREQ09A
  window.dataLayer.push({
    event: 'errorPage',
    pagePath: window.location.pathname,
    errorType: '404'
  })
}

export function pushErrorPageEventEmptySearch() {
  const query = window.location.pathname.replace('/', '')

  window.dataLayer.push({
    event: 'errorPage',
    errorType: 'No Search Result',
    errorQuery: query.replace('%20', ''),
  })
}
