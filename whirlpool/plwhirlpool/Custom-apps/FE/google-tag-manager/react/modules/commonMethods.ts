import { getPathFromUrl } from '../utils/urlUtils'

interface WindowRuntime extends Window {
  __RUNTIME__: any
}

export function getContentGrouping(url: any) {
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const errorPage = document.querySelectorAll(".lh-copy.vtex-rich-text-0-x-paragraph.vtex-rich-text-0-x-paragraph--notFound.vtex-rich-text-0-x-paragraph--center")
  const pathName = window.location.pathname

  if (urlWithoutQueryStrings.endsWith("/")) {
    return "Homepage"
  }
  else if (urlWithoutQueryStrings.includes("account") ||
    urlWithoutQueryStrings.includes("login")) {
    return "Personal"
  }
  else if (urlWithoutQueryStrings.includes("urzadzenia") ||
    urlWithoutQueryStrings.includes("product") ||
    pathName.endsWith("/p") && errorPage[0]?.innerHTML !== "Wybrana strona nie istnieje") {
    return "Catalog"
  }
  else if (urlWithoutQueryStrings.includes("akcesoria") ||
    urlWithoutQueryStrings.includes("czesci-zamienne")) {
    return "Accessories & Spare Parts"
  }
  else if (urlWithoutQueryStrings.includes("pomoc") ||
    urlWithoutQueryStrings.includes("znajdz-serwis")) {
    return "Support"
  }
  else if (urlWithoutQueryStrings.includes("kolekcje")) {
    return "W Collections"
  }
  else if (urlWithoutQueryStrings.includes("promocje") ||
    urlWithoutQueryStrings.includes("oferty")) {
    return "Promotions"
  }
  else if (urlWithoutQueryStrings.includes("przepisy")) {
    return "Recipes"
  }
  else if (runtime?.route?.id === "store.not-found#search"
    || errorPage[0]?.innerHTML == "Wybrana strona nie istnieje") {
    return "Errors"
  }
  else if (urlWithoutQueryStrings.includes('pre-order-page')) {
    return 'Marketing'
  }
  else return "(Other)"
}