import push from './push'
import {
  PixelMessage, SearchPageInfoData,
} from '../typings/events'

export function sendLegacyEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:pageInfo': {
      const { eventType } = e.data

      switch (eventType) {
        case 'homeView': {
          push({
            event: 'homeView',
          })
          break
        }

        case 'categoryView': {
          const data = e.data as SearchPageInfoData
          push({
            event: 'categoryView',
            departmentId: data.department?.id,
            departmentName: data.department?.name,
            categoryId: data.category?.id,
            categoryName: data.category?.name,
          })
          break
        }

        case 'departmentView': {
          const data = e.data as SearchPageInfoData

          push({
            event: 'departmentView',
            departmentId: data.department?.id,
            departmentName: data.department?.name,
          })
          break
        }

        // case 'emptySearchView': {
        //   const data = e.data as SearchPageInfoData
        //   var searchParameters = window.location.search;
        //   const ErrorQuery404 = window.location.pathname;


        //   // if(data?.search?.results===0){
        //   //   push({
        //   //     event: 'errorPage',
        //   //     errorType: 'No Search Results',
        //   //     errorQuery: data.search?.term,
        //   //     // siteSearchTerm: data.search?.term,
        //   //     // siteSearchForm: window.location.href,
        //   //     // siteSearchCategory: data.search?.category?.id,
        //   //     // siteSearchResults: data.search?.results,
        //   //   });

        //   //   push({
        //   //     event: "feReady",
        //   //     status: "anonymous",
        //   //     "product-code": "",
        //   //     "product-name": "",
        //   //     "product-category": "",
        //   //     userType: "guest",
        //   //     pageType: "search",
        //   //     "contentGrouping": "Errors"
        //   //   })
        //   // }
        //   if(searchParameters == ""){
        //     push({
        //       event: 'errorPage',
        //       errorType: '404',
        //       errorQuery: ErrorQuery404,
        //       // siteSearchTerm: data.search?.term,
        //       // siteSearchForm: window.location.href,
        //       // siteSearchCategory: data.search?.category?.id,
        //       // siteSearchResults: data.search?.results,
        //     });

        //     push({
        //       event: "feReady",
        //       status: "anonymous",
        //       "product-code": "",
        //       "product-name": "",
        //       "product-category": "",
        //       userType: "guest",
        //       pageType: "search",
        //       "contentGrouping": "Errors"
        //     })
        //   }else{
        //   if(data?.search?.results===0){
        //     push({
        //       event: 'errorPage',
        //       errorType: 'No Search Results',
        //       errorQuery: data.search?.term,
        //       // siteSearchTerm: data.search?.term,
        //       // siteSearchForm: window.location.href,
        //       // siteSearchCategory: data.search?.category?.id,
        //       // siteSearchResults: data.search?.results,
        //     });

        //     push({
        //       event: "feReady",
        //       status: "anonymous",
        //       "product-code": "",
        //       "product-name": "",
        //       "product-category": "",
        //       userType: "guest",
        //       pageType: "search",
        //       "contentGrouping":"Errors"
        //     })
        //   }}
        //   break
        // }


        // case 'internalSiteSearchView': {
        //   const data = e.data as SearchPageInfoData
        //   push({
        //     event: 'feReady',
        //     siteSearchTerm: data.search?.term,
        //     siteSearchForm: window.location.href,
        //     siteSearchCategory: data.search?.category?.id,
        //     siteSearchResults: data.search?.results,
        //     status: "anonymous",
        //     "product-code": "",
        //     "product-name": "",
        //     "product-category": "",
        //     "userType": "guest",
        //     "pageType": "search",
        //     "page": window.location.href,
        //     contentGrouping: "Other"
        //   })
        //   break
        // }

        case 'productView': {
          push({
            event: 'productView',
          })
          break
        }

        default: {
          push({
            event: 'otherView',
          })
          break
        }
      }

      return
    }
  }
}
