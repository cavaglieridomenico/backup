//@ts-nocheck
import push from './push'
import {
  PixelMessage,
} from '../typings/events'
import {
  getSession,
  getUserInfo,
  getUserOrders,
  userType,
  getProdName,
  getProdCode,
  isErrorPage,
  getCategoryStringFromId,
  //isProductErrorPage,
  getCategory,
  getIdCategory
} from '../utils/utilityFunctionPageView'
import { getPathFromUrl } from '../utils/urlUtils'
import { pushErrorPageEventEmptySearch } from './errorPageEvent'


interface WindowRuntime extends Window  {
  __RUNTIME__:any
}

//Function to get user status
//@ts-ignore
async function getUserStatus() {
  let session = await getSession()  //Get session info
  let statusNotLogged =  session?.namespaces == undefined || session?.namespaces?.profile == undefined || session?.namespaces?.profile?.isAuthenticated?.value === "false"
  return !statusNotLogged ? "authenticated" : "anonymous"
}
//Function to getProductCode
//@ts-ignore
function getProductCode(url: string) {
  let pageType: string = getPageType(url)
  if(pageType !== "detail") { //I need productCode only in pdp
    return "";
  }
  return getProdCode(url)
}
//Function to getProductName
//@ts-ignore
async function getProductName(url: string) {
  let pageType: string = getPageType(url)
  if(pageType !== "detail") { //I need productCode only in pdp
    return ""
  }
  let productCode: string = getProductCode(url)
  let productName: string = await getProdName(productCode)
  return productName
}
//Function to get product category
//@ts-ignore
async function getProductCategory(url: string, categoryPath:[string]) {
  let pageType: string = getPageType(url)
  if(pageType === "detail") { //I'm in pdp
    let productCode: string = getProdCode(url)
    return await getCategory(productCode)
  } else if(pageType === "category") {  //I'm in plp
    return "";
  } else {
    return ""
  }
}
//Function to get user type
//@ts-ignore
async function getUserType() {
  let session = await getSession()  //Get session info
  let userInfo = session.namespaces !== undefined && session.namespaces.profile !== undefined && //Get userInfo
    !(session.namespaces.profile.isAuthenticated.value === "false") ?
    await getUserInfo()
    :
    ""
  let userOrders = userInfo !== "" ? await getUserOrders() : "" //Get info about user orders
  return  userOrders !== "" ? userType(userOrders,userInfo[0].isNewsletterOptIn) : "guest"
}
//Function to get pageType
function getPageType(url: string){
  // const splittedUrl = url.split(/[\s/]+/);
  const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isCampaignPage = urlWithoutQueryStrings.includes("cashback-lavatrici-2022") || urlWithoutQueryStrings.includes("promozioni-brand")

  const isError = isErrorPage()
  

  if(url.includes("map=")) { //I'm in search page
    return "search"
  }
  else if (urlWithoutQueryStrings.endsWith("/p")) {  //I'm in pdp
    return "detail"
  }
  else if (urlWithoutQueryStrings.includes("spare-parts") || urlWithoutQueryStrings.includes("cleaning-and-care")) {  //I'm in plp
    return "category"
  }
  else if(urlWithoutQueryStrings.endsWith("/cart"))
    return "cart"
  else if(urlWithoutQueryStrings.includes("checkout") && !(urlWithoutQueryStrings.includes("orderPlaced")))
    return "checkout"
  else if(urlWithoutQueryStrings.includes("checkout") && urlWithoutQueryStrings.includes("orderPlaced"))
    return "purchase"

  else if(urlWithoutQueryStrings.includes("contattaci")) { //I'm in contact page
    return "contact"
  }
  else if(isCampaignPage) {
    return "campaign"
  }
  else if(urlWithoutQueryStrings.includes("wcollection")) {
    return "story"
  }

  else if(urlWithoutQueryStrings.endsWith("/")) { //I'm in home
    return "Home"
  }else if (isError) {
    return 'error'
  }

  return "(Other)"
}

// function getContentGrouping(url: string){
//   // const splittedUrl = url.split(/[\s/]+/);
//   const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
//   const urlWithoutQueryStrings = getPathFromUrl(url)
//   const isCampaignPage = urlWithoutQueryStrings.includes("cashback-lavatrici-2022") || urlWithoutQueryStrings.includes("promozioni-brand")

//   const products = document.getElementsByClassName("vtex-search-result-3-x-galleryItem");

//   if(url.includes("map=") && products.length === 0) { //I'm in search page
//     return "Errors"
//   } else if(url.includes("map=")) { //I'm in search page
//     return "(Other)"
//   }
//   else if(urlWithoutQueryStrings.endsWith("/p") && runtime?.route?.id === "store.not-found#product"){
//     return "Errors"
//   }
//   else if (urlWithoutQueryStrings.endsWith("/p")) {  //I'm in pdp
//     return "Catalog"
//   }
//   else if (urlWithoutQueryStrings.includes("spare-parts") || urlWithoutQueryStrings.includes("cleaning-and-care")) {  //I'm in plp
//     return "Catalog"
//   }
//   else if(urlWithoutQueryStrings.endsWith("/cart"))
//     return "cart"
//   else if(urlWithoutQueryStrings.includes("checkout") && !(urlWithoutQueryStrings.includes("orderPlaced")))
//     return "checkout"
//   else if(urlWithoutQueryStrings.includes("checkout") && urlWithoutQueryStrings.includes("orderPlaced"))
//     return "purchase"

//   else if(urlWithoutQueryStrings.includes("contattaci")) { //I'm in contact page
//     return "Support"
//   }
//   else if(isCampaignPage) {
//     return "campaign"
//   }
//   else if(urlWithoutQueryStrings.includes("wcollection")) {
//     return "story"
//   }
//   else if (runtime?.route?.id === "store.not-found#search") {
//     return "Errors"
//   }
//   else if(urlWithoutQueryStrings.endsWith("/")) { //I'm in home
//     return "Homepage"
//   }
//   return "(Other)"
// }

export async function sendExtraEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    // case 'vtex:pageView': {
    //   debugger
    //   push({
    //     event: 'pageView',
    //     location: e.data.pageUrl,
    //     page: e.data.pageUrl.replace(e.origin, ''),
    //     referrer: e.data.referrer,
    //     ...(e.data.pageTitle && {
    //       title: e.data.pageTitle,
    //     }),
    //   })

    //   return
    // }
    //NUOVO PAGEVIEW
    // case 'vtex:pageView': {
    //   let urlShort = e.data.pageUrl.replace(e.origin, '')
    //   const isPdpError = isProductErrorPage()
    //   const pageType = getPageType(e.data.pageUrl)
    //   const { pageUrl } = e.data
    //   let categoryPath = e.data.pageUrl.replace(e.origin, '').substr(1,).split('/')
    //   // TODO: Troubleshoot why event is not firing at product page
    //   push({
    //     event: 'pageView',
    //     location: e.data.pageUrl,
    //     page: urlShort,
    //     referrer: e.data.referrer,
    //     status: "anonymous",
    //     "product-code": getProductCode(urlShort),
    //     "product-name": document.getElementsByClassName("vtex-breadcrumb-1-x-term")[0] ? document.getElementsByClassName("vtex-breadcrumb-1-x-term")[0].textContent : "",
    //     "product-category":  getPageType(pageUrl) === "category" ? e.data.pageTitle.split("-")[0] :  getPageType(pageUrl) === "detail" ? document.getElementsByClassName("vtex-breadcrumb-1-x-link--3")[0] ? document.getElementsByClassName("vtex-breadcrumb-1-x-link--3")[0].textContent : "": "",
    //     userType: "prospect",
    //     contentGrouping: getContentGrouping(pageUrl) ,
    //     pageType: getPageType(pageUrl),
    //     ...(e.data.pageTitle && {
    //       title: e.data.pageTitle,
    //     }),
    //   })
    //   push({
    //     event: 'feReady',
    //     status: "anonymous",
    //     "product-code": getProductCode(urlShort),
    //     "product-name": document.getElementsByClassName("vtex-breadcrumb-1-x-term")[0] ? document.getElementsByClassName("vtex-breadcrumb-1-x-term")[0].textContent : "",
    //     "product-category":  getPageType(pageUrl) === "category" ? e.data.pageTitle.split("-")[0] :  getPageType(pageUrl) === "detail" ?  document.getElementsByClassName("vtex-breadcrumb-1-x-link--3")[0] ? document.getElementsByClassName("vtex-breadcrumb-1-x-link--3")[0].textContent : "": "",
    //     contentGrouping: getContentGrouping(pageUrl) ,
    //     userType: "prospect",
    //     pageType: getPageType(pageUrl),
    //     ...(e.data.pageTitle && {
    //       title: e.data.pageTitle,
    //     }),
    //   })
    //   if (pageType === 'errors' || isPdpError) {
    //     pushErrorPageEvent()

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
      const { data } = e
      if (!data.isAuthenticated) {
        return
      }
      // fetch("/crm-sync/vtex/updateuser/"+data.id, {method: "POST"})
      // .then(response => {
      //   console.log(response)
      // })
      fetch("/api/sessions?items=*",{
            "method": "GET",
            "headers": {}
          })
          .then(response => response.json())
          .then(json => {
            fetch("/_v/wrapper/api/user/userinfo",{
              method: 'GET',
            }).then(response => response.json())
            .then(user => {
              push({
                event: 'userData',
                userId: data.id,
                "genere": user.gender? user[0].gender : '',
                email: json.namespaces.profile.email.value
              })
            }).catch(err => {
              console.error(err);
            });
          });

      return
    }
  }
}

