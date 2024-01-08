import push from './push'
import { PixelMessage } from '../typings/events'
// import {
//   getSession,
//   getUserInfo,
//   getUserOrders,
//   getProdName,
//   getProdCode,
//   getCategoryByUrl,
//   getCategory,
//   getPathFromUrl,
//   isErrorPage,
//   isProductErrorPage,
//   userType,
// } from '../utils/generic'
// import { pushErrorPageEvent } from './errorPageEvent'
import product from '../graphql/products.graphql'

// interface WindowRuntime extends Window {
//   __RUNTIME__: any
// }

export async function sendExtraEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    // case 'vtex:pageView': {
    //   let urlShort = e.data.pageUrl.replace(e.origin, '')
    //   // if (
    //   //   urlShort?.toLowerCase()?.includes('kundencenter') &&
    //   //   !urlShort?.toLowerCase()?.includes('haeufige-fragen') &&
    //   //   !urlShort?.toLowerCase()?.includes('ersatzteile')
    //   // ) {
    //   //   return
    //   // }

    //   const urlPath = window?.location?.pathname
    //   const isPdpError = isProductErrorPage()

    //   let pageType = await getPageType(urlShort)
    //   let session = await getSession() //Get session info
    //   let userStatus = await getUserStatus(session)
    //   let userType = await getUserType(session)
    //   let productCode = isPdpError ? '' : await getProductCode(urlShort)
    //   let productName = isPdpError ? '' : await getProductName(urlPath)
    //   let productCategory = isPdpError ? '' : await getProductCategory(urlPath)
    //   const contentGrouping = getContentGrouping(urlShort)

    //   const contentGroupingSecond = getContentGroupingSecond(productCategory)

    //   push({
    //     event: 'pageView',
    //     location: e.data.pageUrl,
    //     page: urlShort,
    //     status: userStatus,
    //     'product-code': productCode,
    //     'product-name': productName,
    //     'product-category': productCategory,
    //     userType: userType,
    //     pageType: pageType,
    //     contentGrouping,
    //     contentGroupingSecond: contentGroupingSecond,
    //   })

    //   push({
    //     event: 'feReady',
    //     status: userStatus,
    //     'product-code': productCode,
    //     'product-name': productName,
    //     'product-category': productCategory,
    //     userType,
    //     pageType,
    //     contentGrouping,
    //     //contentGroupingSecond: contentGroupingSecond || '',
    //     ...(e.data.pageTitle && {
    //       title: e.data.pageTitle,
    //     }),
    //   })

    //   if (pageType === 'error' || isPdpError) {
    //     pushErrorPageEvent()
    //   }

    //   return
    // }

    case 'vtex:userData': {
      const { data } = e

      const productId = window?.sessionStorage?.wishlist_addAfterLogin
      if (productId) {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: product,
            variables: {
              identifier: {
                field: 'id',
                value: productId,
              },
            },
          }),
        }

        const {
          data: {
            product: { productName, productReference },
          },
        } = await fetch('/_v/private/graphql/v1', options).then((res) =>
          res.json()
        )

        push({
          event: 'wishlist',
          eventCategory: 'Intention to Buy',
          eventAction: 'Add to Wishlist',
          eventLabel: `${productReference} - ${productName}`,
        })
      }

      // const skuUrl = `/api/catalog_system/pub/products/variations/${productId}`
      // let skuData: any = await fetch(skuUrl).then((response) => response.json())

      const hasAlreadyPushed = sessionStorage.getItem('personalAreaPush')
      let logged = false

      if (!hasAlreadyPushed && !data.isAuthenticated) {
        window.sessionStorage.setItem('personalAreaPush', 'false')
      }

      if (!data.isAuthenticated) {
        if (hasAlreadyPushed == 'true') {
          window.sessionStorage.setItem('personalAreaPush', 'false')
        }
        return
      }

      if (!hasAlreadyPushed && data.isAuthenticated) {
        logged = true
        window.sessionStorage.setItem('personalAreaPush', 'true')
      }

      if (hasAlreadyPushed != 'true' && !logged) {
        fetch('/api/sessions?items=*', { method: 'GET' })
          .then((response) => response.json())
          .then(() => {
            fetch('/_v/wrapper/api/user/userinfo', {
              method: 'GET',
            })
              .then((response) => response.json())
              .then(() => {
                window.sessionStorage.setItem('personalAreaPush', 'true')
                push({
                  event: 'personalArea',
                  eventCategory: 'Personal Area', // Fixed value
                  eventAction: 'Login',
                  eventLabel: `Login from Personal Area`,
                })
                push({
                  event: 'emailForSalesforce',
                  eventCategory: 'Email for Salesforce',
                  eventAction: 'Email from login',
                  email: data.email,
                })
                // if (productId) {
                //   push({
                //     event: 'wishlist',
                //     eventCategory: 'Intention to Buy',
                //     eventAction: 'Add to Wishlist',
                //     // eventLabel: `${productReference} - ${productName}`,
                //   })
                // }
              })
              .catch((err) => {
                console.error(err)
              })
          })
      }
      return
    }
  }

  //Function to get user status
  // async function getUserStatus(session: any) {
  //   return session?.namespaces?.profile?.isAuthenticated?.value === 'true'
  //     ? 'authenticated'
  //     : 'anonymous'
  // }

  //Function to get user type
  // async function getUserType(session: any) {
  //   // let session = await getSession()  //Get session info
  //   let userInfo: any =
  //     session?.namespaces !== undefined &&
  //     session?.namespaces?.profile !== undefined && //Get userInfo
  //     !(session?.namespaces?.profile?.isAuthenticated?.value === 'false')
  //       ? await getUserInfo()
  //       : ''
  //   let userOrders = userInfo !== '' ? await getUserOrders() : '' //Get info about user orders
  //   return userOrders !== '' ? userType(userOrders) : 'prospect'
  // }

  //Function to getProductCode
  // async function getProductCode(url: string) {
  //   let pageType: string = await getPageType(url)
  //   if (pageType !== 'detail') {
  //     //I need productCode only in pdp
  //     return ''
  //   }
  //   return getProdCode(url)
  // }

  //Function to getProductName
  // async function getProductName(url: string) {
  //   let pageType: string = await getPageType(url)
  //   if (pageType !== 'detail') {
  //     //I need productCode only in pdp
  //     return ''
  //   }
  //   let productCode: string = await getProductCode(url)
  //   let productName: string = await getProdName(productCode)
  //   return productName ? productName : ''
  // }

  //Function to get product category
  // async function getProductCategory(url: string) {
  //   let pageType: string = await getPageType(url)
  //   if (pageType === 'detail') {
  //     //I'm in pdp
  //     let productCode: string = getProdCode(url)
  //     let productCategory = await getCategory(productCode)
  //     return productCategory
  //   } else if (pageType === 'category') {
  //     //I'm in plp
  //     return await getCategoryByUrl(url)
  //   } else {
  //     return ''
  //   }
  // }

  //Function to get pageType - WHP IT
  // async function getPageType(url: string) {
  //   // const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  //   const urlWithoutQueryStrings = getPathFromUrl(url)
  //   const isStory = url.includes('innovation')
  //   const isCampaign = url.includes('aktionen')
  //   const isMagazin = url.includes('magazin')
  //   const isFilteredCategory = url.includes('&searchState')
  //   const isCategory =
  //     urlWithoutQueryStrings?.toLowerCase()?.includes('hausgeraete') ||
  //     urlWithoutQueryStrings?.toLowerCase()?.includes('bundles') ||
  //     urlWithoutQueryStrings?.toLowerCase()?.includes('zubehoer') ||
  //     urlWithoutQueryStrings?.toLowerCase()?.includes('herd-und-backofensets') // PLP for bundles
  //   isFilteredCategory
  //   const isContact = url.includes('kundencenter') || url.includes('faq')
  //   const isError = isErrorPage()

  //   if (urlWithoutQueryStrings.endsWith('/p') || isProductErrorPage()) {
  //     //I'm in pdp
  //     return 'detail'
  //   } else if (isCategory) {
  //     //I'm in plp
  //     return 'category'
  //   } else if (url.includes('map=')) {
  //     //I'm in search page
  //     return 'search'
  //   } else if (urlWithoutQueryStrings.endsWith('/cart')) return 'cart'
  //   else if (
  //     urlWithoutQueryStrings.includes('checkout') &&
  //     !urlWithoutQueryStrings.includes('orderPlaced')
  //   )
  //     return 'checkout'
  //   else if (
  //     urlWithoutQueryStrings.includes('checkout') &&
  //     urlWithoutQueryStrings.includes('orderPlaced')
  //   ) {
  //     return 'purchase'
  //   } else if (isContact) {
  //     //I'm in contact page
  //     return 'contact'
  //   } else if (isCampaign) {
  //     //I'm in campaign page
  //     return 'campaign'
  //   } else if (
  //     isMagazin ||
  //     urlWithoutQueryStrings.includes('haendlersuche') ||
  //     urlWithoutQueryStrings.includes('login')
  //   ) {
  //     //I'm in magazin page
  //     return 'other'
  //   } else if (isStory) {
  //     return 'story'
  //   } else if (urlWithoutQueryStrings === '/') {
  //     //I'm in home
  //     return 'home'
  //   }
  //   // Avoid pages being classified as "error" as when landing on Error page and then click on footer OR header URLs classified as "other",
  //   // runtime?.route?.id === "store.not-found#search" OR runtime?.route?.id === "store.not-found#product
  //   // else if (isFooterOtherPages || isHeaderOtherPages) {
  //   //   return "other"
  //   // }
  //   else if (isError != '(Other)') {
  //     return 'error'
  //   }
  //   return 'other'
  // }

  //Function to get content grouping
  // function getContentGrouping(url: string) {
  //   const urlWithoutQueryStrings = getPathFromUrl(url)
  //   const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
  //   const isFilteredCategory = url.includes('&searchState')
  //   const isCatalog =
  //     urlWithoutQueryStrings.endsWith('/p') ||
  //     urlWithoutQueryStrings.includes('hausgeraete') ||
  //     urlWithoutQueryStrings.includes('produktvergleich') ||
  //     urlWithoutQueryStrings
  //       ?.toLowerCase()
  //       ?.includes('herd-und-backofensets') ||
  //     isFilteredCategory
  //   const emptySearchState = sessionStorage.getItem('isErrorEmptySearch')
  //   const isPdpError = isProductErrorPage()
  //   const isError = isErrorPage()

  //   if (isCatalog && !isPdpError) {
  //     //I'm in pdp
  //     return 'Catalog'
  //   } else if (url.includes('map=ft')) {
  //     return '(Other)'
  //   } else if (isError && isError != '(Other)') {
  //     return 'Errors'
  //   } else if (urlWithoutQueryStrings.includes('haendlersuche')) {
  //     return 'Support'
  //   } else if (urlWithoutQueryStrings.includes('seiten')) {
  //     return 'Company'
  //   } else if (urlWithoutQueryStrings.includes('ersatzteile')) {
  //     return 'Accessories & Spare Parts'
  //   } else if (
  //     urlWithoutQueryStrings.includes('kundencenter') ||
  //     urlWithoutQueryStrings.includes('faq')
  //   ) {
  //     //I'm in contact page
  //     return 'Support'
  //   } else if (urlWithoutQueryStrings.includes('innovation')) {
  //     //I'm in marketing page
  //     return 'Marketing'
  //   } else if (
  //     urlWithoutQueryStrings.includes('account') ||
  //     urlWithoutQueryStrings.includes('login')
  //   ) {
  //     //I'm in personal area page
  //     return 'Personal'
  //   } else if (urlWithoutQueryStrings.includes('aktionen')) {
  //     //I'm in promtions page
  //     return 'Promotions'
  //   } else if (urlWithoutQueryStrings.includes('magazin')) {
  //     //I'm in promtions page
  //     return 'News'
  //   } else if (urlWithoutQueryStrings.includes('rezepte')) {
  //     //I'm in recipe page
  //     return 'Recipes'
  //   } else if (
  //     urlWithoutQueryStrings?.toLocaleLowerCase()?.includes('zubehoer')
  //   ) {
  //     //I'm in accessories page
  //     return 'Accessories & Spare Parts'
  //   } else if (urlWithoutQueryStrings === '/') {
  //     //I'm in home
  //     return 'Homepage'
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
  //   return '(Other)'
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

  //   if (urlWithoutQueryStrings.includes('/hausgeraete'))
  //   {
  //     if(urlWithoutQueryStrings.includes('/waschen-trocknen'))
  //       return 'Laundry'
  //     else if(urlWithoutQueryStrings.includes('/kuehlen-gefrieren'))
  //       return 'Cooling'
  //     else if(urlWithoutQueryStrings.includes('/kochen-backen'))
  //       return 'Cooking'
  //     else if(urlWithoutQueryStrings.includes('/geschirrspueler'))
  //       return 'Dishwashing'
  //     else if(urlWithoutQueryStrings.includes('/klimaanlagen'))
  //       return 'Air Conditioning'
  //   }
  //   else if(urlWithoutQueryStrings.includes('/zubehoer'))
  //       return 'Accessories'
  //   else if(urlWithoutQueryStrings.includes('/rezepte'))
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
