import {
  PixelMessage
} from '../typings/events'
// import {
//   getCategory, getCategoryByUrl, getPathFromUrl, getProdCode, getProdName, getSession,
//   getUserInfo,
//   getUserOrders, isErrorPage,
//   isProductErrorPage, userType
// } from "../utils/generic"
// import { pushErrorPageEvent } from './errorPageEvent'
import push from './push'

// interface WindowRuntime extends Window  {
//   __RUNTIME__:any
// }

export async function sendExtraEvents(e: PixelMessage) {

  switch (e.data.eventName) {
    // case 'vtex:pageView': {
    //   let urlShort = e.data.pageUrl.replace(e.origin, '')
    //   const isPdpError = isProductErrorPage()

    //   let pageType = getPageType(urlShort)
    //   let session = await getSession()  //Get session info
    //   let userStatus = getUserStatus(session)
    //   let userType = await getUserType(session)
    //   let productCode = isPdpError ? "" : getProductCode(urlShort)
    //   let productName = isPdpError ? "" : await getProductName(urlShort)
    //   let productCategory = isPdpError ? "" : await getProductCategory(urlShort)
    //   const contentGrouping = getContentGrouping(urlShort)

    //   push({
    //     event: 'pageView',
    //     // location: e.data.pageUrl,
    //     // page: urlShort,
    //     // referrer: e.data.referrer === undefined ? "" : e.data.referrer,
    //     status: userStatus,
    //     userType: userType,
    //     "product-code": productCode,
    //     "product-name": productName,
    //     "product-category": productCategory,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: getContentGroupingSecond(productCategory)
    //   })

    //   push({
    //     event: 'feReady',
    //     status: userStatus,
    //     userType,
    //     "product-code": productCode,
    //     "product-name": productName,
    //     "product-category": productCategory,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: getContentGroupingSecond(productCategory)
    //   })

    //   if(pageType === "error" || isPdpError) {
    // 	  pushErrorPageEvent()

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
      // const section = window.location.pathname.replace("/", "")
      const { data } = e
      if (!data.isAuthenticated) {
        return
      }
      fetch("/api/sessions?items=*", { method: "GET", })
        .then(response => response.json())
        .then(json => {
          fetch("/_v/wrapper/api/user/userinfo", {
            method: 'GET',
          }).then(response => response.json())
            .then(user => {
              push({
                event: 'personalArea',
                eventCategory: 'Personal Area', // Fixed value
                eventAction: 'Login',
                eventLabel: `Login from Personal Area`,
                type: 'login'
              }),
              push({
                event: 'userData',
                userId: data.id,
                "genere": user.gender ? user[0].gender : '',
                email: json.namespaces.profile.email.value
              })
            }).catch(err => {
              console.error(err);
            });
        });

      return


    }
  }

  //Function to get user status
  // function getUserStatus(session: any) {
  //   return session?.namespaces?.profile?.isAuthenticated?.value === "true" ? "authenticated" : "anonymous"
  // }

  //Function to get user type
  // async function getUserType(session: any) {
  //   let userInfo: any = session?.namespaces !== undefined && session?.namespaces?.profile !== undefined && //Get userInfo
  //     !(session?.namespaces?.profile?.isAuthenticated?.value === "false") ?
  //     await getUserInfo()
  //     :
  //     ""
  //   let userOrders = userInfo !== "" ? await getUserOrders() : "" //Get info about user orders
  //   return  userOrders !== "" ? userType(userOrders) : "prospect"
  // }

  //Function to getProductCode
  // function getProductCode(url: string) {
  //   let pageType: string = getPageType(url)
  //   if(pageType !== "detail") { //I need productCode only in pdp
  //     return "";
  //   }
  //   return getProdCode(url)
  // }

  //Function to getProductName
  // async function getProductName(url: string) {
  //   let pageType: string = getPageType(url)
  //   if(pageType !== "detail") { //I need productCode only in pdp
  //     return ""
  //   }
  //   let productCode: string = getProductCode(url)
  //   let productName: string = await getProdName(productCode)
  //   return productName
  // }

  //Function to get product category
  // async function getProductCategory(url: string) {
  //   let pageType: string = getPageType(url)
  //   if(pageType === "detail") { //I'm in pdp
  //     let productCode: string = getProdCode(url)
  //     let productCategory = await getCategory(productCode)
  //     return productCategory
  //   } else if(pageType === "category") {  //I'm in plp
  //     return await getCategoryByUrl(url)
  //   } else {
  //     return ""
  //   }
  // }

  //Function to get pageType - WHP IT
  // function getPageType(url: string){
  //   // const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  //   const urlWithoutQueryStrings = getPathFromUrl(url)
  //   const isStory = url.includes("innovazioni") || url.includes("gate-freddo") || url.includes("barbieri-con-hotpoint") || url.includes("masterchef") || url.includes("promo-collaudo")
  //   const isCampaign =  url.includes("promozioni")
  //   const isFilteredCategory = url.includes("&searchState")
  //   const isCategory = urlWithoutQueryStrings.includes("elettrodomestici") || urlWithoutQueryStrings.includes("accessori") || urlWithoutQueryStrings.includes("Accessori") || isFilteredCategory
  //   const isContact = url.includes("assistenza") || url.includes("contattaci") || url.includes("faq") || url.includes("esperto-per-te")
  //   const isError = isErrorPage()

  //   if (urlWithoutQueryStrings.endsWith("/p") || isProductErrorPage()) {  //I'm in pdp
  //     return "detail"
  //   }
  //   else if (isCategory) {  //I'm in plp
  //     return "category"
  //   }
  //   else if(url.includes("map=")) { //I'm in search page
  //     return "search"
  //   }
  //   else if(urlWithoutQueryStrings.endsWith("/cart"))
  //     return "cart"
  //   else if(urlWithoutQueryStrings.includes("checkout") && !(urlWithoutQueryStrings.includes("orderPlaced")))
  //     return "checkout"
  //   else if(urlWithoutQueryStrings.includes("checkout") && urlWithoutQueryStrings.includes("orderPlaced"))
  //     return "purchase"
  //   else if(isContact) { //I'm in contact page
  //     return "contact"
  //   }
  //   else if(isCampaign) { //I'm in campaign page
  //     return "campaign"
  //   }
  //   else if(isStory) {
  //     return "story"
  //   }
  //   else if(urlWithoutQueryStrings === "/") { //I'm in home
  //     return "home"
  //   }
  //   // Avoid pages being classified as "error" as when landing on Error page and then click on footer OR header URLs classified as "other",
  //   // runtime?.route?.id === "store.not-found#search" OR runtime?.route?.id === "store.not-found#product
  //   // else if (isFooterOtherPages || isHeaderOtherPages) {
  //   //   return "other"
  //   // }
  //   else if (isError) {
  //     return "error"
  //   }
  //   return "other"
  //   }


  //Function to get content grouping
  //  function getContentGrouping(url: string){
  //   const urlWithoutQueryStrings = getPathFromUrl(url)
  //   const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  //   const isFilteredCategory = url.includes("&searchState")
  //   const isCatalog = urlWithoutQueryStrings.endsWith("/p") || urlWithoutQueryStrings.includes("elettrodomestici") || urlWithoutQueryStrings.includes("product-comparison") || isFilteredCategory
  //   const emptySearchState = sessionStorage.getItem("isErrorEmptySearch")
  //   const isPdpError = isProductErrorPage()

  //   if(isCatalog && !isPdpError) {  //I'm in pdp
  //     return "Catalog"
  //   }
  //   else if(urlWithoutQueryStrings.includes("pagine")){
  //     return "Company"
  //   }
  //   else if(urlWithoutQueryStrings.includes("contattaci") || urlWithoutQueryStrings.includes("assistenza" || urlWithoutQueryStrings.includes("faq")) || urlWithoutQueryStrings.includes("esperto-per-te"))  { //I'm in contact page
  //     return "Support"
  //   }
  //   else if(urlWithoutQueryStrings.includes("innovazioni") || urlWithoutQueryStrings.includes("masterchef")) { //I'm in marketing page
  //     return "Marketing"
  //   }
  //   else if(urlWithoutQueryStrings.includes("account") || (urlWithoutQueryStrings.includes("login"))) { //I'm in personal area page
  //     return "Personal"
  //   }
  //   else if(urlWithoutQueryStrings.includes("promozioni")) {
  //     if (urlWithoutQueryStrings.includes("black-friday")) return "Marketing";
  //     return "Promotions" //I'm in promtions page
  //   }
  //   else if(urlWithoutQueryStrings.includes("ricette")) { //I'm in recipe page
  //     return "Recipes"
  //   }
  //   else if(urlWithoutQueryStrings.includes("accessori") || urlWithoutQueryStrings.includes("Accessori") || urlWithoutQueryStrings.includes("ricambi-originali")) { //I'm in accessories page
  //     return "Accessories & Spare Parts"
  //   }
  //   else if(urlWithoutQueryStrings === "/") { //I'm in home
  //     return "Homepage"
  //   }
  //   else if(urlWithoutQueryStrings.includes("black-friday")) {
  //     return "Marketing";
  //   }
  //   else if(runtime?.route?.id === "store.not-found#search" || emptySearchState === "true" || runtime?.route?.id === "store.not-found#product") {
  //     if(emptySearchState === "true") {
  //       sessionStorage.setItem("isErrorEmptySearch", "false")
  //     }
  //     return "Errors"
  //   }
  //   return "(Other)"
  // }


  // function getContentGroupingSecond(category: any): string {

  //   const mappedCategoriesFromProductCategory = new Map<string, string>([
  //     ["Laundry", "Laundry"],
  //     ["Cooking", "Cooking"],
  //     ["Cooling", "Cooling"],
  //     ["Dishwashing", "Dishwash"],
  //     ["Dishwashers", "Dishwash"],
  //     ["AirConditioning", "Air conditioner"],
  //     ["WashingMachines","Laundry"],
  //     ["Dryers","Laundry"],
  //     ["WasherDryers","Laundry"],
  //     ["Fridges","Cooling"],
  //     ["Freezing","Cooling"],
  //     ["Freezers","Cooling"],
  //     ["Ovens", "Cooking"],
  //     ["Microwaves", "Cooking"],
  //     ["Hobs", "Cooking"],
  //     ["Hoods", "Cooking"],
  //     ["Cookers", "Cooking"],
  //     ["Kitchen", "Small kitchen appliances"],

  //     ["AirConditioners", "Air Conditioning"]
  //   ]);
  //   let urlWithoutQueryStrings = window.location.pathname

  //   if (urlWithoutQueryStrings.includes('/elettrodomestici'))
  //   {
  //     if(urlWithoutQueryStrings.includes('/lavaggio-e-asciugatura'))
  //       return 'Laundry'
  //     else if(urlWithoutQueryStrings.includes('/frigoriferi'))
  //       return 'Cooling'
  //     else if(urlWithoutQueryStrings.includes('/cottura'))
  //       return 'Cooking'
  //     else if(urlWithoutQueryStrings.includes('/lavastoviglie'))
  //       return 'Dishwashing'
  //     else if(urlWithoutQueryStrings.includes('/congelatori'))
  //       return 'Cooling'
  //   }
  //   else if(urlWithoutQueryStrings.includes('/accessori'))
  //       return 'Accessories'
  //   else if(urlWithoutQueryStrings.includes('/ricette'))
  //     return 'Other'


  //   else if (category) {
  //     let catSplit = category.split("_");
  //     if(catSplit?.some( (value: string) => value === "AC"))
  //       return 'Accessories'
  //     else
  //     {
  //       const contentGroupingFromProductCategory = mappedCategoriesFromProductCategory.get(catSplit[catSplit.length - 1]);
  //       return contentGroupingFromProductCategory ?? ""
  //     }
  //   }

  //   return ''
  // }
}

