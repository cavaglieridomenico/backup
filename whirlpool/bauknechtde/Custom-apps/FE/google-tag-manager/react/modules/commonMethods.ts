import {
    getPathFromUrl,
    isErrorPage,
    isProductErrorPage,
  } from '../utils/generic'

interface WindowRuntime extends Window {
    __RUNTIME__: any
}

export function getContentGrouping(url: string) {
    const urlWithoutQueryStrings = getPathFromUrl(url)
    const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
    const isFilteredCategory = url.includes('&searchState')
    const isCatalog = urlWithoutQueryStrings.endsWith('/p') ||
        urlWithoutQueryStrings.includes('hausgeraete') ||
        urlWithoutQueryStrings.includes('product-comparison') ||
        urlWithoutQueryStrings?.toLowerCase()?.includes('herd-und-backofensets') ||
        isFilteredCategory
    const emptySearchState = sessionStorage.getItem('isErrorEmptySearch')
    const isPdpError = isProductErrorPage()
    const isError = isErrorPage()

    if (isCatalog && !isPdpError) {
        return 'Catalog'
    } else if (url.includes('map=ft')) {
        return '(Other)'
    } else if (isError && isError != '(Other)') {
        return 'Errors'
    } else if (urlWithoutQueryStrings.includes('haendlersuche')) {
        return 'Support'
    } else if (urlWithoutQueryStrings.includes('seiten')) {
        return 'Company'
    } else if (urlWithoutQueryStrings.includes('ersatzteile')) {
        return 'Accessories & Spare Parts'
    } else if (
        urlWithoutQueryStrings.includes('kundencenter') ||
        urlWithoutQueryStrings.includes('faq')
    ) {
        return 'Support'
    } else if (urlWithoutQueryStrings.includes('innovation')) {
        return 'Marketing'
    } else if (
        urlWithoutQueryStrings.includes('account') ||
        urlWithoutQueryStrings.includes('login')
    ) {
        return 'Personal'
    } else if (urlWithoutQueryStrings.includes('aktionen')) {
        return 'Promotions'
    } else if (urlWithoutQueryStrings.includes('magazin')) {
        return 'News'
    } else if (urlWithoutQueryStrings.includes('rezepte')) {
        return 'Recipes'
    } else if (urlWithoutQueryStrings?.toLocaleLowerCase()?.includes('zubehoer')) {
       return 'Accessories & Spare Parts'
    } else if (urlWithoutQueryStrings === '/') {
        return 'Homepage'
    } else if (
        runtime?.route?.id === 'store.not-found#search' ||
        emptySearchState === 'true' ||
        runtime?.route?.id === 'store.not-found#product'
    ) {
        if (emptySearchState === 'true') {
            sessionStorage.setItem('isErrorEmptySearch', 'false')
        }
        return 'Errors'
    }else if (urlWithoutQueryStrings.includes('pre-order-page') ){
      return 'Marketing'
  }
    return '(Other)'
}
