//@ts-nocheck
import push from "./push"
import { PixelMessage } from "../typings/events"
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
} from "../utils/utilityFunctionPageView"
import { getPathFromUrl } from "../utils/urlUtils"
import { WindowRuntime } from "./interfaces"
import { pushErrorPageEvent } from "./errorPageEvent"
import { isErrorPage } from "../utils/generic"

//Function to get user status
//@ts-ignore
async function getUserStatus() {
  let session = await getSession() //Get session info
  let statusNotLogged =
    session?.namespaces == undefined ||
    session?.namespaces?.profile == undefined ||
    session?.namespaces?.profile?.isAuthenticated?.value === "false"
  return !statusNotLogged ? "authenticated" : "anonymous"
}
//Function to getProductCode
//@ts-ignore
function getProductCode(url: string) {
  let pageType: string = getPageType(url)
  if (pageType !== "detail") {
    //I need productCode only in pdp
    return ""
  }
  return getProdCode(url)
}
//Function to getProductName
//@ts-ignore
async function getProductName(url: string) {
  let pageType: string = getPageType(url)
  if (pageType !== "detail") {
    //I need productCode only in pdp
    return ""
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
  if (pageType === "detail") {
    //I'm in pdp
    let productCode: string = getProdCode(url)
    return await getCategory(productCode)
  } else if (pageType === "category") {
    //I'm in plp
    let categoryId = await getIdCategory(categoryPath)
    return categoryId ? await getCategoryStringFromId(categoryId) : ""
  } else {
    return ""
  }
}
//Function to get user type
//@ts-ignore
async function getUserType() {
  let type: string = ""
  await fetch("/_v/wrapper/api/HotCold", {
    method: "GET",
    headers: {},
  })
    .then(async (response) => await response.json())
    .then((data) => {
      type = data.UserType
    })
    .catch(() => {})
  return type
}

//Function to get pageType
export function getPageType(url: string) {
  // const splittedUrl = url.split(/[\s/]+/);
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isFilteredCategory = url?.includes("&searchState")
  const isCategory =
    urlWithoutQueryStrings?.includes("appliances") ||
    urlWithoutQueryStrings?.includes("accessories") ||
    isFilteredCategory
  //const isCampaignPage = urlWithoutQueryStrings.includes("cashback-lavatrici-2022") || urlWithoutQueryStrings.includes("promozioni-brand")
  const isError = isErrorPage()

  // To handle filtered PLP and filtered search page
  const previousPageViewEvents = window.dataLayer.filter(
    (item) => item?.event == "pageView"
  )
  const previousPageType: string = previousPageViewEvents
    ? previousPageViewEvents[previousPageViewEvents.length - 1]?.pageType
    : ""

  // Handling search
  const searchParams = window?.location?.search

  if (isError) {
    //I'm in pdp
    return "error"
  } else if (searchParams?.includes("_q") || previousPageType === "search") {
    return "search"
  } else if (isCategory || previousPageType === "category") {
    return "category"
  } else if (urlWithoutQueryStrings?.endsWith("/p")) {
    return "detail"
  } else if (urlWithoutQueryStrings?.endsWith("/cart")) return "cart"
  else if (
    urlWithoutQueryStrings?.includes("checkout") &&
    !urlWithoutQueryStrings?.includes("orderPlaced")
  )
    return "checkout"
  else if (
    urlWithoutQueryStrings?.includes("checkout") &&
    urlWithoutQueryStrings?.includes("orderPlaced")
  )
    return "purchase"
  else if (urlWithoutQueryStrings?.includes("support")) {
    //I'm in contact page
    return "contact"
  }
  // else if (isCampaignPage) {
  //   return "campaign"
  // }
  else if (urlWithoutQueryStrings?.includes("wcollection")) {
    return "story"
  } else if (urlWithoutQueryStrings?.endsWith("/")) {
    //I'm in home
    return "home"
  } else if (
    urlWithoutQueryStrings?.includes("login") ||
    urlWithoutQueryStrings?.includes("account")
  ) {
    //I'm in contact page
    return "personal"
  }
  return "other"
}
function getContentGroupingSecond(category) {
  let catSplit = category?.split("_")
  let isAccesories = catSplit?.some((value) => value === "AC")
  if (isAccesories || category.toLowerCase().includes("accessories")) {
    return "Wpro Accessories"
  } else if (category != "") {
    return mappedContentGrouping[catSplit[catSplit.length - 1]]
  } else {
    if (window.location.pathname.includes("produits")) {
      const splittedUrl = window.location.pathname.split("/")
      return mappedCategories[splittedUrl?.[splittedUrl?.length - 1]]
    }
  }
}

const mappedContentGrouping = {
  Laundry: "Laundry",
  Cooking: "Cooking",
  Cooling: "Cooling",
  Dishwashing: "Dishwashing",
  AirConditioning: "AirConditioning",
  WashingMachines: "Laundry",
  Dryers: "Laundry",
  WasherDryers: "Laundry",
  Fridges: "Cooling",
  Freezers: "Cooling",
  Ovens: "Cooking",
  Microwaves: "Cooking",
  Hobs: "Cooking",
  Hoods: "Cooking",
  Cookers: "Cooking",
}

const mappedCategories = {
  cuisson: "Cooking",
  froid: "Cooling",
  climatiseurs: "Air conditioner",
  "petits-electromenagers-cuisine": "Small kitchen appliances",
  "chauffe-plats": "Small kitchen appliances",
  "autres-produits": "Other products",
  lavage: "Laundry",
  "lave-vaisselle": "Dishwash",
  accessoires: "Wpro Accessories",
}
function getContentGrouping(url: string) {
  // const splittedUrl = url.split(/[\s/]+/);
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)

  // Handling search
  const searchParams = window?.location?.search

  const previousPageViewEvents = window.dataLayer.filter(
    (item) => item?.event == "pageView"
  )
  const previousContentGrouping: string = previousPageViewEvents
    ? previousPageViewEvents[previousPageViewEvents.length - 1]?.contentGrouping
    : ""
  const previousPageType: string = previousPageViewEvents
    ? previousPageViewEvents[previousPageViewEvents.length - 1]?.pageType
    : ""

  if (searchParams?.includes("_q") || previousPageType === "search") {
    return "(Other)"
  } else if (urlWithoutQueryStrings.includes("/cart")) {
    //I'm in cart
    return "Cart"
  } else if (urlWithoutQueryStrings.includes("/checkout")) {
    //I'm in checkout
    return "Checkout"
  } else if (
    urlWithoutQueryStrings.includes("produits") ||
    urlWithoutQueryStrings.includes("accessoires") ||
    previousContentGrouping === "Catalog"
  ) {
    //I'm in plp
    return "Catalog"
  } else if (
    urlWithoutQueryStrings.endsWith("/p") &&
    runtime?.route?.id === "store.not-found#product"
  ) {
    return "Errors"
  } else if (urlWithoutQueryStrings.endsWith("/p")) {
    //I'm in pdp
    return "Catalog"
  } else if (
    urlWithoutQueryStrings.includes("spare-parts") ||
    urlWithoutQueryStrings.includes("cleaning-and-care")
  ) {
    //I'm in plp
    return "Catalog"
  } else if (urlWithoutQueryStrings.includes("support")) {
    //I'm in contact page
    return "Support"
  } else if (runtime?.route?.id === "store.not-found#search") {
    return "Errors"
  } else if (
    urlWithoutQueryStrings.includes("login") ||
    urlWithoutQueryStrings.includes("account")
  ) {
    //I'm in login/my-account page
    return "personal"
  } else if (urlWithoutQueryStrings.endsWith("/")) {
    //I'm in home
    return "Homepage"
  }
  return "(Other)"
}
async function getUserIsLogged() {
  let logType: string = ""
  await fetch("/_v/wrapper/api/user/userinfo", {
    method: "GET",
    headers: {},
  }).then(async (response) => {
    let userInfo = await response.json()
    logType = userInfo.length > 0 ? "authenticated" : "anonymous"
  })
  return logType
}

export function getMacroCategory(category) {
  let catSplit = category?.split("_")
  let isAccesories = catSplit?.filter((value) => value === "AC")
  if (isAccesories.length > 0) {
    return catSplit[catSplit.length - 3] + "_" + catSplit[catSplit.length - 2]
  } else if (category.toLowerCase().includes("accessories")) {
    return "AC"
  } else {
    return catSplit[catSplit.length - 2]
  }
}
export async function sendExtraEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    //NUOVO PAGEVIEW
    // case "vtex:pageView": {
    //   const pageType = getPageType(e.data.pageUrl)

    //   let urlShort = e.data.pageUrl.replace(e.origin, "")
    //   let categoryPaths = e.data.pageUrl
    //     .replace(e.origin, "")
    //     .substr(1)
    //     .split("?")[0]
    //     .split("/")
    //   if (categoryPaths[categoryPaths.length - 1] == "") {
    //     categoryPaths.pop()
    //   }
    //   const status = await getUserIsLogged()
    //   const contentGrouping = getContentGrouping(e.data.pageUrl)
    //   let productCategory = ""
    //   switch (decodeURI(categoryPaths[categoryPaths.length - 1])) {
    //     case "refrigerateurs-multi-portes": {
    //       productCategory = "SC_D2C_FR_FG_CO_Cooling"
    //       break
    //     }
    //     default: {
    //       productCategory = await getProductCategory(
    //         pageType,
    //         decodeURI(categoryPaths[categoryPaths.length - 1]),
    //         urlShort
    //       )
    //     }
    //   }

    //   const macroCategory = getMacroCategory(productCategory)
    //   const contentGroupingSecond = getContentGroupingSecond(productCategory)

    //   let url = "/api/vtexid/pub/authenticated/user"
    //   fetch(url)
    //     .then((response) => response.json())
    //     .then(async (data) => {
    //       if (data && data.userId) {
    //         push({
    //           event: "userId",
    //           user_id: data.userId,
    //         })
    //       }

    //       push({
    //         event: "pageView",
    //         location: e.data.pageUrl,
    //         page: urlShort,
    //         referrer: e.data.referrer,
    //         status: await getUserStatus(),
    //         "product-code": getProductCode(urlShort),
    //         "product-name": await getProductName(urlShort),
    //         "product-category": productCategory,
    //         "product-macrocategory": macroCategory || "",
    //         "vip-company": getVipCompany(),
    //         userType: await getUserType(),
    //         pageType,
    //         contentGrouping,
    //         contentGroupingSecond: contentGroupingSecond || "",
    //         ...(e.data.pageTitle && {
    //           title: e.data.pageTitle,
    //         }),
    //       })
    //       push({
    //         event: "feReady",
    //         status,
    //         "product-code": getProductCode(urlShort),
    //         "product-name": await getProductName(urlShort),
    //         "product-category": productCategory,
    //         "product-macrocategory": macroCategory || "",
    //         "vip-company": getVipCompany(),
    //         userType: await getUserType(),
    //         pageType,
    //         contentGrouping,
    //         contentGroupingSecond: contentGroupingSecond || "",
    //         ...(e.data.pageTitle && {
    //           title: e.data.pageTitle,
    //         }),
    //       })
    //     })
    //   if (pageType === "error") {
    //     pushErrorPageEvent()
    //   }

    //   return
    // }

    case "vtex:userData": {
      // const { data } = e
      // if (!data.isAuthenticated) {
      //   return
      // }
      // fetch("/api/sessions?items=*", {
      //   method: "GET",
      //   headers: {},
      // })
      //   .then((response) => response.json())
      //   .then((json) => {
      //     fetch("/_v/wrapper/api/user/userinfo", {
      //       method: "GET",
      //     })
      //       .then((response) => response.json())
      //       .then((user) => {
      //         push({
      //           event: "userData",
      //           userId: data.id,
      //           genere: user.gender ? user[0].gender : "",
      //           email: json.namespaces.profile.email.value,
      //         })
      //       })
      //       .catch((err) => {
      //         console.error(err)
      //       })
      //   })

      return
    }
  }
}
