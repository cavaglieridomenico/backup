import push from './push'
import {
  PixelMessage,
} from '../typings/events'
// import {
//   getSession,
//   getUserInfo,
//   getUserOrders,
//   userType,
//   getProdName,
//   getProdCode,
//   getStringCategoryFromId,
//   getCategory,
//   getIdCategory
// } from '../utils/utilityFunctionPageView'
// import { getPathFromUrl } from '../utils/urlUtils'

// interface WindowRuntime extends Window  {
//   __RUNTIME__:any
// }

//Function to get user status

// async function getUserStatus() {
//   let session = await getSession()  //Get session info
//   let statusNotLogged =  session?.namespaces == undefined || session?.namespaces?.profile == undefined || session?.namespaces?.profile?.isAuthenticated?.value === "false"
//   return !statusNotLogged ? "authenticated" : "anonymous"
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

// async function getProductCategory(url: string, categoryPath:[string]) {
//   let pageType: string = getPageType(url)
//   if(pageType === "detail") { //I'm in pdp
//     let productCode: string = getProdCode(url)
//     return await getCategory(productCode)
//   } else if(pageType === "category") {  //I'm in plp
//     let categoryId = await getIdCategory(categoryPath)
//     return await getStringCategoryFromId(categoryId)
//   } else if(pageType === "search") {
//     if(window.location.pathname.includes("lodowki")) {
//       return "SC_WP_FG_CO_Cooling"
//     }
//     else if(window.location.pathname.includes("zamrazarki")) {
//       return "SC_WP_FG_CO_Freezing"
//     }
//     else if(window.location.pathname.includes("pralki")) {
//       return "SC_WP_FG_LD_WashingMachines"
//     }
//     else if(window.location.pathname.includes("suszarki")) {
//       return "SC_WP_FG_LD_Dryers"
//     }
//     else if(window.location.pathname.includes("pralko")) {
//       return "SC_WP_FG_LD_WasherDryers"
//     }
//     else if(window.location.pathname.includes("piekarniki")){
//       return "SC_WP_FG_CK_Ovens"
//     }
//     else if(window.location.pathname.includes("plyty")){
//       return "SC_WP_FG_CK_Hobs"
//     }
//     else if(window.location.pathname.includes("kuchenki")) {
//       return "SC_WP_FG_CK_Microwaves"
//     }
//     else if(window.location.pathname.includes("okapy")){
//       return "SC_WP_FG_CK_Hoods"
//     }
//     else if(window.location.pathname.includes("kuchnie")) {
//       return "SC_WP_FG_CK_Cookers"
//     }
//     else if(window.location.pathname.includes("zmywarki")) {
//       return "SC_WP_FG_DW_Dishwashers"
//     }
//     else {
//       return ""
//     }
//   } else {
//     return ""
//   }
// }
//Function to get user type
// async function getUserType(session:any) {
//   // let session = await getSession()  //Get session info
//   let userInfo: any = session?.namespaces !== undefined && session?.namespaces?.profile !== undefined && //Get userInfo
//       !(session?.namespaces?.profile?.isAuthenticated?.value === "false") ?
//       await getUserInfo()
//       :
//       ""
//     let userOrders = userInfo !== "" ? await getUserOrders() : "" //Get info about user orders
//     return  userOrders !== "" ? userType(userOrders) : "prospect"
// }
//Function to get pageType
// function getPageType(url: string){
//   // const splittedUrl = url.split(/[\s/]+/);
//   const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
//   const urlWithoutQueryStrings = getPathFromUrl(url)
//   const isCampaignPage = urlWithoutQueryStrings.includes("cashback-lavatrici-2022") || urlWithoutQueryStrings.includes("promozioni-brand")

//   if (urlWithoutQueryStrings.includes("urzadzenia") || urlWithoutQueryStrings.includes("akcesoria")) {  //I'm in plp
//     return "category"
//   }
//   else if(url.includes("map=")) { //I'm in search page
//     return "search"
//   }
//   else if (urlWithoutQueryStrings.endsWith("/p")) {  //I'm in pdp
//     return "detail"
//   }
//   else if(urlWithoutQueryStrings.endsWith("/cart"))
//     return "cart"
//   else if(urlWithoutQueryStrings.includes("checkout") && !(urlWithoutQueryStrings.includes("orderPlaced")))
//     return "checkout"
//   else if(urlWithoutQueryStrings.includes("checkout") && urlWithoutQueryStrings.includes("orderPlaced"))
//     return "purchase"

//   else if(urlWithoutQueryStrings.includes("skontaktuj-sie-z-nami") ||
//   urlWithoutQueryStrings.includes("znajdz-serwis") ||
//   urlWithoutQueryStrings.includes("pomoc")) { //I'm in contact page
//     return "contact"
//   }
//   else if(isCampaignPage) {
//     return "campaign"
//   }
//   else if(urlWithoutQueryStrings.includes("wcollection")) {
//     return "story"
//   }
//   else if (runtime?.route?.id === "store.not-found#search") {
//     return "error"
//   }
//   else if(urlWithoutQueryStrings.endsWith("/")) { //I'm in home
//     return "home"
//   }
//   return "other"
// }

// function to know if the user is logged. not used anymore
// async function getUserIsLogged() {
//   let logType:string = ""
//   await fetch("/_v/wrapper/api/user/userinfo", {
//     method: "GET",
//     headers: {},
//   }).then(async (response) => {
//     let userInfo = await response.json()
//     logType = ((userInfo.length>0) ?  "authenticated":"anonymous")
//   });
//   return logType
// }


export async function sendExtraEvents(e: PixelMessage) {
  switch (e.data.eventName) {

    //NUOVO PAGEVIEW
    // case 'vtex:pageView': {
    //   let urlShort = e.data.pageUrl.replace(e.origin, '')
    //   let session = await getSession()  //Get session info
    //   let categoryPath = e.data.pageUrl.replace(e.origin, '').substr(1,).split('?')[0].split('/')
    //   const pageType = getPageType(e.data.pageUrl)
    //   let userType = await getUserType(session)
    //   let prodCode = setProductCode(e.data.pageUrl)
    //   const locationArray = window.dataLayer.filter(item => item.event == "pageView")

    //   if(window.location.pathname.includes("account")) {
    //     if(!locationArray[(locationArray.length) -1]?.page.includes("account")) {
    //       push({
    //         event: 'pageView',
    //         //location: e.data.pageUrl,
    //         status: await getUserStatus(),
    //         userType: userType,
    //         page: urlShort,
    //         "product-code": prodCode,
    //         "product-name": setProductName(e.data.pageUrl),
    //         "product-category": (e.data.pageUrl.endsWith("/p"))? await getCategory(prodCode) : "",
    //         pageType,
    //         contentGrouping: contentGrouping(e.data.pageUrl),
    //         contentGroupingSecond: await contentGroupingSecond()
    //       })
    //       push({
    //         event: 'feReady',
    //         //location: e.data.pageUrl,
    //         status: await getUserStatus(),
    //         userType: userType,
    //         page: urlShort,
    //         "product-code": prodCode,
    //         "product-name": setProductName(e.data.pageUrl),
    //         "product-category": (e.data.pageUrl.endsWith("/p"))? await getCategory(prodCode) : "",
    //         pageType,
    //         contentGrouping: contentGrouping(e.data.pageUrl),
    //         contentGroupingSecond: await contentGroupingSecond()
    //       })
    //       // TODO: Comment out "analytics" blocks from whirlpool-it theme
    //       return
    //     }
    //   } else if(window.location.pathname.includes("inne")) {
    //     const errorPage = document.querySelectorAll(".lh-copy.vtex-rich-text-0-x-paragraph.vtex-rich-text-0-x-paragraph--notFound.vtex-rich-text-0-x-paragraph--center")
    //     push({
    //       event: 'pageView',
    //       //location: e.data.pageUrl,
    //       status: await getUserStatus(),
    //       userType: userType,
    //       page: urlShort,
    //       "product-code": prodCode,
    //       "product-name": setProductName(e.data.pageUrl),
    //       // "product-category": (e.data.pageUrl.endsWith("/p") && errorPage[0] == undefined)? await getCategory(prodCode) : "",
    //       "product-category": await getProductCategory(urlShort,categoryPath),
    //       pageType,
    //       contentGrouping: contentGrouping(e.data.pageUrl),
    //       contentGroupingSecond: await contentGroupingSecond()
    //     })
    //     push({
    //       event: 'feReady',
    //       //location: e.data.pageUrl,
    //       status: await getUserStatus(),
    //       userType: userType,
    //       page: urlShort,
    //       "product-code": prodCode,
    //       "product-name": setProductName(e.data.pageUrl),
    //       "product-category": (e.data.pageUrl.endsWith("/p") && errorPage[0] == undefined)? await getCategory(prodCode) : "",
    //       pageType,
    //       contentGrouping: contentGrouping(e.data.pageUrl),
    //       contentGroupingSecond: await contentGroupingSecond()
    //     })
    //     // TODO: Comment out "analytics" blocks from whirlpool-it theme
    //     return
    //   } else if(window.location.pathname.includes("urzadzenia") ||
    //   window.location.pathname.includes("akcesoria") ||
    //   window.location.pathname.endsWith("/p")) {
    //     const errorPage = document.querySelectorAll(".lh-copy.vtex-rich-text-0-x-paragraph.vtex-rich-text-0-x-paragraph--notFound.vtex-rich-text-0-x-paragraph--center")
    //     push({
    //       event: 'pageView',
    //       //location: e.data.pageUrl,
    //       status: await getUserStatus(),
    //       userType: userType,
    //       page: urlShort,
    //       "product-code": prodCode,
    //       "product-name": setProductName(e.data.pageUrl),
    //       "product-category": (e.data.pageUrl.endsWith("/p") && errorPage[0] == undefined)? await getCategory(prodCode) : "",
    //       // "product-category": await getProductCategory(urlShort,categoryPath),
    //       pageType,
    //       contentGrouping: contentGrouping(e.data.pageUrl),
    //       contentGroupingSecond: await contentGroupingSecond()
    //     })
    //     push({
    //       event: 'feReady',
    //       //location: e.data.pageUrl,
    //       status: await getUserStatus(),
    //       userType: userType,
    //       page: urlShort,
    //       "product-code": prodCode,
    //       "product-name": setProductName(e.data.pageUrl),
    //       "product-category": (e.data.pageUrl.endsWith("/p") && errorPage[0] == undefined)? await getCategory(prodCode) : "",
    //       pageType,
    //       contentGrouping: contentGrouping(e.data.pageUrl),
    //       contentGroupingSecond: await contentGroupingSecond()
    //     })
    //     // TODO: Comment out "analytics" blocks from whirlpool-it theme
    //     return
    //   } else {
    //     push({
    //       event: 'pageView',
    //       //location: e.data.pageUrl,
    //       status: await getUserStatus(),
    //       userType: userType,
    //       page: urlShort,
    //       "product-code": prodCode,
    //       "product-name": setProductName(e.data.pageUrl),
    //       "product-category": await getProductCategory(urlShort,categoryPath),
    //       pageType,
    //       contentGrouping: contentGrouping(e.data.pageUrl),
    //       contentGroupingSecond: await contentGroupingSecond()
    //     })
    //     push({
    //       event: 'feReady',
    //       //location: e.data.pageUrl,
    //       status: await getUserStatus(),
    //       userType: userType,
    //       page: urlShort,
    //       "product-code": prodCode,
    //       "product-name": setProductName(e.data.pageUrl),
    //       "product-category": (e.data.pageUrl.endsWith("/p"))? await getCategory(prodCode) : "",
    //       pageType,
    //       contentGrouping: contentGrouping(e.data.pageUrl),
    //       contentGroupingSecond: await contentGroupingSecond()
    //     })
    //     // TODO: Comment out "analytics" blocks from whirlpool-it theme
    //     return
    //   }
    // }

    case 'vtex:userData': {
      const { data } = e
      if (!data.isAuthenticated) {
        return
      }
      let userDataEvent = window.dataLayer.filter(item => item.event == "userData")
      // fetch("/crm-sync/vtex/updateuser/"+ data.id, {method: "POST"})
      // .then(response => {
      //   console.log(response)
      // })
      fetch("/api/sessions?items=*", {
        "method": "GET",
        "headers": {}
      })
        .then(response => response.json())
        .then(json => {
          fetch("/_v/wrapper/api/user/userinfo", {
            method: 'GET',
          }).then(response => response.json())
            .then(user => {
              if (userDataEvent.length <= 0) {
                push({
                  event: 'userData',
                  userId: data.id,
                  "genere": user.gender ? user[0].gender : '',
                  email: json.namespaces.profile.email.value
                })
              }
            }).catch(err => {
              console.error(err);
            });
        });
      return
    }
  }
}

// function to get content grouping. works only in plp or pdp
// function contentGrouping(url: any) {
//   const urlWithoutQueryStrings = getPathFromUrl(url)
//   const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
//   const errorPage = document.querySelectorAll(".lh-copy.vtex-rich-text-0-x-paragraph.vtex-rich-text-0-x-paragraph--notFound.vtex-rich-text-0-x-paragraph--center")
//   const pathName = window.location.pathname

//   if(urlWithoutQueryStrings.endsWith("/")) {
//     return "Homepage"
//   }
//   else if(urlWithoutQueryStrings.includes("account") ||
//   urlWithoutQueryStrings.includes("login")) {
//     return "Personal"
//   }
//   else if(urlWithoutQueryStrings.includes("urzadzenia") ||
//   urlWithoutQueryStrings.includes("product") ||
//   pathName.endsWith("/p") && errorPage[0]?.innerHTML !== "Wybrana strona nie istnieje") {
//     return "Catalog"
//   }
//   else if(urlWithoutQueryStrings.includes("akcesoria") ||
//   urlWithoutQueryStrings.includes("czesci-zamienne")) {
//     return "Accessories & Spare Parts"
//   }
//   else if(urlWithoutQueryStrings.includes("pomoc") ||
//   urlWithoutQueryStrings.includes("znajdz-serwis")) {
//     return "Support"
//   }
//   else if(urlWithoutQueryStrings.includes("kolekcje")) {
//     return "W Collections"
//   }
//   else if(urlWithoutQueryStrings.includes("promocje") ||
//   urlWithoutQueryStrings.includes("oferty")) {
//     return "Promotions"
//   }
//   else if(urlWithoutQueryStrings.includes("przepisy")) {
//     return "Recipes"
//   }
//   else if (runtime?.route?.id === "store.not-found#search"
//   || errorPage[0]?.innerHTML == "Wybrana strona nie istnieje")
//    {
//     return "Errors"
//   }
//   else return "(Other)"
// }

// function to get content grouping second. works only in plp or pdp
// async function contentGroupingSecond() {
//   let urlWithoutQueryStrings = window.location.pathname;
//   let breadcrumb = document.querySelectorAll(".plwhirlpool-bredcrumbs-0-x-catLink")
//   let category = breadcrumb[1]?.innerHTML
//   const searchCategory = document.querySelectorAll(".vtex-checkbox__label.w-100.c-on-base.pointer")

//   if (urlWithoutQueryStrings.includes("/gotowanie") ||
//   searchCategory[0]?.innerHTML == "gotowanie" ||
//   urlWithoutQueryStrings.includes("/piekarniki") ||
//   urlWithoutQueryStrings.includes("/plyty") ||
//   urlWithoutQueryStrings.includes("/kuchenki") ||
//   urlWithoutQueryStrings.includes("/okapi") ||
//   urlWithoutQueryStrings.includes("/kuchnie") ||
//   urlWithoutQueryStrings.endsWith("/p") && category == "gotowanie"){  //I'm in cooking
//     return "Cooking"
//   }
//   else if (urlWithoutQueryStrings.includes("/pranie") ||
//   searchCategory[0]?.innerHTML == "pranie" ||
//   urlWithoutQueryStrings.includes("/pralki") ||
//   urlWithoutQueryStrings.includes("/suszarki") ||
//   urlWithoutQueryStrings.includes("/pralko") ||
//   urlWithoutQueryStrings.endsWith("/p") && category == "pranie") {  //I'm in laundry
//     return "Laundry"
//   }
//   else if (urlWithoutQueryStrings.includes("/chlodnictwo") ||
//   searchCategory[0]?.innerHTML == "chlodnictwo" ||
//   urlWithoutQueryStrings.includes("/lodowki") ||
//   urlWithoutQueryStrings.includes("/zamrazarki") ||
//   urlWithoutQueryStrings.endsWith("/p") && category == "chlodnictwo") {  //I'm in cooling
//     return "Cooling"
//   }
//   else if (urlWithoutQueryStrings.includes("/zmywanie") ||
//   searchCategory[0]?.innerHTML == "zmywanie" ||
//   urlWithoutQueryStrings.includes('/zmiwarki') ||
//     urlWithoutQueryStrings.endsWith("/p") && category == "zmywanie") {  //I'm in dishwashing
//     return "Dishwashing";
//   } else if (urlWithoutQueryStrings.includes("/przepisy")) {
//     return "Other";
//   } else {
//     return ""
//   }
// }

// function setProductCode(url:any){
//   if(!(url.endsWith("/p")))
//     return ""
//   let code = url.split("/").reverse()[1].split("-").reverse()[0]
//   return code
// }

// function setProductName(url: any){
//   if(!(url.endsWith("/p")))
//   return ""
//   let code = url.split("/").reverse()[1].split("-").slice(0, -1).join("-")
//   return code

// }
