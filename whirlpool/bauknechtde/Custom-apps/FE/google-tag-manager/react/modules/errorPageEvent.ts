export function pushErrorPageEvent() {
  // const path = window.location.pathname

  window.dataLayer.push({
    event: 'custom_error',
    type: 'error pages',
    description: '404',
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
