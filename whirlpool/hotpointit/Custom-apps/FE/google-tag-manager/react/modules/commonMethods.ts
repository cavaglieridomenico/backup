import { 
    getPathFromUrl,
    isProductErrorPage,
} from '../utils/generic'

interface WindowRuntime extends Window {
    __RUNTIME__: any
}

export function getContentGrouping(url: string){
    const urlWithoutQueryStrings = getPathFromUrl(url)
    const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
    const isFilteredCategory = url.includes("&searchState")
    const isCatalog = urlWithoutQueryStrings.endsWith("/p") || urlWithoutQueryStrings.includes("elettrodomestici") || urlWithoutQueryStrings.includes("product-comparison") || isFilteredCategory
    const emptySearchState = sessionStorage.getItem("isErrorEmptySearch")
    const isPdpError = isProductErrorPage()

    if(isCatalog && !isPdpError) {  //I'm in pdp
      return "Catalog"
    }
    else if(urlWithoutQueryStrings.includes("pagine")){
      return "Company"
    }
    else if(urlWithoutQueryStrings.includes("contattaci") || urlWithoutQueryStrings.includes("assistenza" || urlWithoutQueryStrings.includes("faq")) || urlWithoutQueryStrings.includes("esperto-per-te"))  { //I'm in contact page
      return "Support"
    }
    else if(urlWithoutQueryStrings.includes("innovazioni")) { //I'm in marketing page
      return "Marketing"
    }
    else if(urlWithoutQueryStrings.includes("account") || (urlWithoutQueryStrings.includes("login"))) { //I'm in personal area page
      return "Personal"
    }
    else if(urlWithoutQueryStrings.includes("promozioni")) { //I'm in promtions page
      return "Promotions"
    }
    else if(urlWithoutQueryStrings.includes("ricette")) { //I'm in recipe page
      return "Recipes"
    }
    else if(urlWithoutQueryStrings.includes("accessori") || urlWithoutQueryStrings.includes("Accessori") || urlWithoutQueryStrings.includes("ricambi-originali")) { //I'm in accessories page
      return "Accessories & Spare Parts"
    }
    else if(urlWithoutQueryStrings === "/") { //I'm in home
      return "Homepage"
    }
    else if(runtime?.route?.id === "store.not-found#search" || emptySearchState === "true" || runtime?.route?.id === "store.not-found#product") {
      if(emptySearchState === "true") {
        sessionStorage.setItem("isErrorEmptySearch", "false")
      }
      return "Errors"
    }
    return "(Other)"
  }