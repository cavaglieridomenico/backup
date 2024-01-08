import { getPathFromUrl } from '../utils/urlUtils'
import { isProductErrorPage } from '../utils/utilityFunctionPageView'

interface WindowRuntime extends Window {
    __RUNTIME__: any
}

export function getContentGrouping(url: any) {
    const urlWithoutQueryStrings = getPathFromUrl(url)
    const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
    const isCatalog =
        urlWithoutQueryStrings.includes('prodotti') ||
        urlWithoutQueryStrings.endsWith('/p') ||
        urlWithoutQueryStrings.includes('product-comparison')
    //  const notFound = document.getElementsByClassName("vtex-rich-text-0-x-paragraph--notFound");
    const isPdpError = isProductErrorPage()
    const emptySearchState = sessionStorage.getItem('isErrorEmptySearch')

    if (urlWithoutQueryStrings.endsWith('/')) {
        return 'Homepage'
    } else if (urlWithoutQueryStrings.includes('account')) {
        return 'Personal'
    } else if (isCatalog && !isPdpError) {
        return 'Catalog'
    } else if (urlWithoutQueryStrings.includes('whirlpool-italia-srl')) {
        return 'Company'
    } else if (
        urlWithoutQueryStrings.includes('ricambi-originali') ||
        urlWithoutQueryStrings.includes('accessori')
    ) {
        return 'Accessories & Spare Parts'
    } else if (urlWithoutQueryStrings.includes('wcollection')) {
        return 'W Collections'
    } else if (urlWithoutQueryStrings.includes('promozioni')) {
        return 'Promotions'
    } else if (urlWithoutQueryStrings.includes('ricette')) {
        return 'Recipes'
    } else if (
        urlWithoutQueryStrings.includes('supporto') ||
        urlWithoutQueryStrings.includes('esperto-per-te')
    ) {
        return 'Support'
    } else if (
        urlWithoutQueryStrings.includes('wellbeing') ||
        urlWithoutQueryStrings.includes('benessere')
    ) {
        return 'Well-Being'
    } else if (urlWithoutQueryStrings.includes('fuorisalone')) {
        return 'Events'
    }
    // else if(urlWithoutQueryStrings.includes("esperto-per-te")) {
    //   return "Support"
    // }
    else if (urlWithoutQueryStrings.endsWith('/cart')) {
        return 'cart'
    } else if (
        urlWithoutQueryStrings.includes('checkout') &&
        !urlWithoutQueryStrings.includes('orderPlaced')
    ) {
        return 'checkout'
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
    // else if(notFound.length > 0) {
    //   return "Errors"
    // }
    else return 'Other'
}