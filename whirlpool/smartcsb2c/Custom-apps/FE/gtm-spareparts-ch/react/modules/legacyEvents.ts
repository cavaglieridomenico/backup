import push from './push'
import {
  PixelMessage, SearchPageInfoData,
} from '../typings/events'
import { pushErrorPageEventEmptySearch } from './errorPageEvent'


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

        // case 'emptySearchView':
        case 'internalSiteSearchView': {
          const data = e.data as SearchPageInfoData
          sessionStorage.setItem('isErrorEmptySearch', 'false')
          const urlParams = new URLSearchParams(window.location.search);
          const from = urlParams.get('from');
              //FUNREQSPARE13
          push({
            event: 'searchSuggestions',
            eventAction: data.search?.term,
            eventCategory: "Spare Parts Search Suggestion",
            eventLabel: data.search?.results + " - " + from,
          })
          if (data?.search?.results === 0) {
            sessionStorage.setItem('isErrorEmptySearch', 'true')
            pushErrorPageEventEmptySearch()
          }
          break
        }

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
