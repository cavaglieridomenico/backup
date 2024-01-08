import push from './push'
import { PixelMessage } from '../typings/events'
// import {
//   getSession,
//   getProdName,
//   getProdCode,
//   getCategoryStringFromId,
//   getCategory,
//   getIdCategory,
//   isProductErrorPage,
//   getPageType,
// } from '../utils/utilityFunctionPageView'
// import { getPathFromUrl } from '../utils/urlUtils'
// import { WindowRuntime } from './interfaces'
// import { pushErrorPageEvent } from './errorPageEvent'

//Function to get user status

// async function getUserStatus() {
//   let session = await getSession() //Get session info
//   let statusNotLogged =
//     session?.namespaces == undefined ||
//     session?.namespaces?.profile == undefined ||
//     session?.namespaces?.profile?.isAuthenticated?.value === 'false'
//   return !statusNotLogged ? 'authenticated' : 'anonymous'
// }

//Function to getProductCode

// function getProductCode(url: string) {
//   let pageType: string = getPageType(url)
//   if (pageType !== 'detail') {
//     //I need productCode only in pdp
//     return ''
//   }
//   return getProdCode(url)
// }

//Function to getProductName

// async function getProductName(url: string) {
//   let pageType: string = getPageType(url)
//   if (pageType !== 'detail') {
//     //I need productCode only in pdp
//     return ''
//   }
//   let productCode: string = getProductCode(url)
//   let productName: string = await getProdName(productCode)
//   return productName
// }

//Function to get product category

// async function getProductCategory(url: string, categoryPath: [string]) {
//   let pageType: string = getPageType(url)
//   if (pageType === 'detail') {
//     //I'm in pdp
//     let productCode: string = getProdCode(url)
//     return await getCategory(productCode)
//   } else if (pageType === 'category') {
//     let categoryId = await getIdCategory(categoryPath)
//     return await getCategoryStringFromId(categoryId)
//   } else {
//     return ''
//   }
// }

// //Function to get pageType
// function getContentGrouping(url: string){
//   // const splittedUrl = url.split(/[\s/]+/);
//   const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
//   const urlWithoutQueryStrings = getPathFromUrl(url)
//   const isFilteredCategory = url.includes("&searchState")
//   const isSupport = urlWithoutQueryStrings.includes("supporto") || urlWithoutQueryStrings.includes("faq")
//   const isCatalog = urlWithoutQueryStrings.includes("prodotti") || urlWithoutQueryStrings.includes("product-comparison")  || isFilteredCategory
//   const isAccessories = urlWithoutQueryStrings.includes("accessori") || urlWithoutQueryStrings.includes("ricambi-originali")
//   const emptySearchState = sessionStorage.getItem("isErrorEmptySearch")
//   if (urlWithoutQueryStrings.endsWith("/p") || isCatalog) {  //I'm in pdp
//     return "Catalog"
//   }
//   else if(urlWithoutQueryStrings.includes("pagine")){
//     return "Company"
//   }
//   else if(isAccessories) { //I'm in accessories page
//     return "Accessories & Spare Parts"
//   }
//   else if(isSupport) { //I'm in contact page
//     return "Support"
//   }
//   else if(urlWithoutQueryStrings.includes("innovazione")) { //I'm in marketing page
//     return "Marketing"
//   }
//   else if(urlWithoutQueryStrings.includes("account") || (urlWithoutQueryStrings.includes("login"))) { //I'm in personal area page
//     return "Personal"
//   }
//   else if(urlWithoutQueryStrings.includes("promozioni") || urlWithoutQueryStrings.includes("offerta")) {
//     return "Promotions"
//   }
//   else if(urlWithoutQueryStrings.includes("ricette")) { //I'm in recipe page
//     return "Recipes"
//   }
//   else if(urlWithoutQueryStrings.includes("wcollection")) {
//     return "W Collections"
//   }
//   else if(urlWithoutQueryStrings === "/") { //I'm in home
//     return "Homepage"
//   }
//   else if(runtime?.route?.id === "store.not-found#search" || emptySearchState === "true" || runtime?.route?.id === "store.not-found#product") {
//     if(emptySearchState === "true") {
//       sessionStorage.setItem("isErrorEmptySearch", "false")
//     }
//     return "Errors"
//   }
//   return "(Other)"
// }

// async function getUserIsLogged() {
//   let logType: string = ''
//   await fetch('/_v/wrapper/api/user/userinfo', {
//     method: 'GET',
//     headers: {},
//   }).then(async (response) => {
//     let userInfo = await response.json()
//     logType = userInfo[0]?.email != undefined ? 'authenticated' : 'anonymous'
//   })
//   return logType
// }

//Function to get user type

// async function getUserType() {
//   let type: string = ''
//   await fetch('/_v/wrapper/api/HotCold', {
//     method: 'GET',
//     headers: {},
//   })
//     .then(async (response) => await response.json())
//     .then((data) => {
//       type = data.UserType
//     })
//     .catch(() => {})
//   return type
// }

//Function to get categoryPath
// function getCategoryPath(urlPath: string) {
//   let catPath: any = ['']
//   //Check if mapped
//   if (urlPath.includes('?')) {
//     catPath = urlPath.substring(1, urlPath.indexOf('?')).split('/')
//   } else {
//     catPath = urlPath.substring(1).split('/')
//   }

//   return catPath
// }

export async function sendExtraEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    //pageView feReady
    // case 'vtex:pageView': {
    //   let urlShort = e.data.pageUrl.replace(e.origin, '')
    //   const isPdpError = isProductErrorPage()
    //   const pageType = getPageType(e.data.pageUrl)
    //   let categoryPath = getCategoryPath(urlShort)
    //   const status = await getUserIsLogged()
    //   const userType = await getUserType()
    //   const productCode = isPdpError ? '' : getProductCode(urlShort)
    //   const productName = isPdpError ? '' : await getProductName(urlShort)
    //   const productCategory = isPdpError
    //     ? ''
    //     : await getProductCategory(urlShort, categoryPath)
    //   const contentGrouping = await getContentGrouping(e.data.pageUrl)

    //   push({
    //     event: 'pageView',
    //     status,
    //     userType,
    //     'product-code': productCode,
    //     'product-name': productName,
    //     'product-category': productCategory,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: contentGroupingSecond(),
    //   })
    //   push({
    //     event: 'feReady',
    //     status,
    //     'product-code': productCode,
    //     'product-name': productName,
    //     'product-category': productCategory,
    //     userType,
    //     pageType,
    //     contentGrouping,
    //     contentGroupingSecond: contentGroupingSecond(),
    //   })

    //   if (pageType === 'error' || isPdpError) {
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
      fetch('/api/sessions?items=*', {
        method: 'GET',
        headers: {},
      })
        .then((response) => response.json())
        .then((json) => {
          fetch('/_v/wrapper/api/user/userinfo', {
            method: 'GET',
          })
            .then((response) => response.json())
            .then((user) => {
              push({
                event: 'userData',
                userId: data.id,
                genere: user.gender ? user[0].gender : '',
                email: json.namespaces.profile.email.value,
              })
            })
            .catch((err) => {
              console.error(err)
            })
        })

      return
    }
  }
  //function to get content grouping. works only in plp or pdp
  // async function getContentGrouping(url: any) {
  //   const urlWithoutQueryStrings = getPathFromUrl(url)
  //   const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  //   const isCatalog =
  //     urlWithoutQueryStrings.includes('prodotti') ||
  //     urlWithoutQueryStrings.endsWith('/p') ||
  //     urlWithoutQueryStrings.includes('product-comparison')
  //   //  const notFound = document.getElementsByClassName("vtex-rich-text-0-x-paragraph--notFound");
  //   const isPdpError = isProductErrorPage()
  //   const emptySearchState = sessionStorage.getItem('isErrorEmptySearch')

  //   if (urlWithoutQueryStrings.endsWith('/')) {
  //     return 'Homepage'
  //   } else if (urlWithoutQueryStrings.includes('account')) {
  //     return 'Personal'
  //   } else if (isCatalog && !isPdpError) {
  //     return 'Catalog'
  //   } else if (urlWithoutQueryStrings.includes('whirlpool-italia-srl')) {
  //     return 'Company'
  //   } else if (
  //     urlWithoutQueryStrings.includes('ricambi-originali') ||
  //     urlWithoutQueryStrings.includes('accessori')
  //   ) {
  //     return 'Accessories & Spare Parts'
  //   } else if (urlWithoutQueryStrings.includes('wcollection')) {
  //     return 'W Collections'
  //   } else if (urlWithoutQueryStrings.includes('promozioni')) {
  //     return 'Promotions'
  //   } else if (urlWithoutQueryStrings.includes('ricette')) {
  //     return 'Recipes'
  //   } else if (
  //     urlWithoutQueryStrings.includes('supporto') ||
  //     urlWithoutQueryStrings.includes('esperto-per-te')
  //   ) {
  //     return 'Support'
  //   } else if (
  //     urlWithoutQueryStrings.includes('wellbeing') ||
  //     urlWithoutQueryStrings.includes('benessere')
  //   ) {
  //     return 'Well-Being'
  //   } else if (urlWithoutQueryStrings.includes('fuorisalone')) {
  //     return 'Events'
  //   }
  //   // else if(urlWithoutQueryStrings.includes("esperto-per-te")) {
  //   //   return "Support"
  //   // }
  //   else if (urlWithoutQueryStrings.endsWith('/cart')) {
  //     return 'cart'
  //   } else if (
  //     urlWithoutQueryStrings.includes('checkout') &&
  //     !urlWithoutQueryStrings.includes('orderPlaced')
  //   ) {
  //     return 'checkout'
  //   } else if (
  //     runtime?.route?.id === 'store.not-found#search' ||
  //     emptySearchState === 'true' ||
  //     runtime?.route?.id === 'store.not-found#product'
  //   ) {
  //     if (emptySearchState === 'true') {
  //       sessionStorage.setItem('isErrorEmptySearch', 'false')
  //     }
  //     return 'Errors'
  //   }
  //   // else if(notFound.length > 0) {
  //   //   return "Errors"
  //   // }
  //   else return 'Other'
  // }

  // function contentGroupingSecond() {
  //   let urlWithoutQueryStrings = window.location.pathname
  //   let breadcrumb = document.getElementsByClassName(
  //     'itwhirlpool-breadcrumb-custom-0-x-catLink'
  //   )
  //   let category = breadcrumb[1]?.innerHTML

  //   if (
  //     urlWithoutQueryStrings.includes('/cottura') ||
  //     (urlWithoutQueryStrings.endsWith('/p') && category == 'cottura')
  //   ) {
  //     //I'm in cooking
  //     return 'Cooking'
  //   } else if (
  //     urlWithoutQueryStrings.includes('/lavaggio-e-asciugatura') ||
  //     (urlWithoutQueryStrings.endsWith('/p') &&
  //       category == 'lavaggio e asciugatura')
  //   ) {
  //     //I'm in laundry
  //     return 'Laundry'
  //   } else if (
  //     urlWithoutQueryStrings.includes('/aria-condizionata') ||
  //     (urlWithoutQueryStrings.endsWith('/p') && category == 'aria condizionata')
  //   ) {
  //     //I'm in cooling
  //     return 'Cooling'
  //   } else if (
  //     urlWithoutQueryStrings.includes('/lavastoviglie') ||
  //     (urlWithoutQueryStrings.endsWith('/p') && category == 'lavastoviglie')
  //   ) {
  //     //I'm in dishwash
  //     return 'Dishwashing'
  //   } else if (urlWithoutQueryStrings.includes('/ricette')) {
  //     return 'Other'
  //   } else {
  //     return ''
  //   }
  // }
}
