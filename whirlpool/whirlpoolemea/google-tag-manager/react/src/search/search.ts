import { PixelMessage, SearchPageInfoData } from '../../typings/events'
import push from '../utils/push'
import { getProductCategory } from '../utils/product-utils'
import type { CategoryInfos } from '../../typings/CategoryInfos'
import { pushWithoutDuplicates } from '../utils/product-utils'

export async function sendSearchEvents(e: PixelMessage) {
  // eslint-disable-next-line default-case
  switch (e.data.eventName) {
    //GA4FUNREQ52
    case 'vtex:autocomplete': {
      const { eventType } = e.data

      if (eventType === 'search') {
          const searchTerm = e.data?.search?.text
          const searchResult = e.data?.search?.match.toString()

          push({
            event: 'view_search_results',
            type: 'suggestions',
            search_results: searchResult,
            search_term: searchTerm,
          })
        }
      break
    }

    //GA4FUNREQ35
    case 'vtex:ga4-reviews-view_search_results': {
      const { type, searchResult, searchQuery } = e.data
      push({
        event: 'view_search_results',
        type: type,
        search_results: searchResult.toString(),
        search_query: searchQuery,
      })
      break
    }

    //GA4FUNREQ18
    case 'vtex:ga4-view_search_results': {
      const { type, searchTerm } = e.data
      const viewSerachResultsEvent = {
        event: 'view_search_results',
        type: type,
        search_term: searchTerm,
      }
      pushWithoutDuplicates(viewSerachResultsEvent)
      break
    }

    case 'vtex:pageInfo': {
      const { eventType } = e.data

      switch (eventType) {
        case 'emptySearchView':

        // eslint-disable-next-line no-fallthrough
        case 'internalSiteSearchView': {
          const data = e.data as SearchPageInfoData

          //GA4FUNREQ51
          push({
            event: 'view_search_results',
            type: 'internal',
            search_term: data.search?.term,
            search_results: data.search?.results.toString(),
          })

          //GA4FUNREQ57
          if (data?.search?.results === 0) {
            push({
              event: 'custom_error',
              type: 'error pages',
              description: '404'
            });    
          }

          break
        }

        default: {
          break
        }
      }
      break
    }

    //GA4FUNREQ31
    case 'vtex:compareProducts': {
      const { action, products } = e.data

      const productsInfos: any[] = await Promise.all(
        products?.map(async (product: any): Promise<any> => {
          return await getProductCategory(
            product?.linkText ? 'slug' : 'sku',
            product?.linkText || product?.skuId
          )
        })
      )

      products?.map((product: any) => {
        const productInfo = productsInfos?.find(
          (prod) => prod?.productId == product?.productId
        )
        push({
          event: 'compare_products',
          action: action,
          item_id: product?.items?.[0]?.itemId || product?.skuId,
          item_name: product?.productName || productInfo?.productName,
          item_category: productInfo?.category,
          item_macrocategory: productInfo?.macroCategory,
        })
      })
      break
    }

    //GA4FUNREQ32
    case 'vtex:productComparison': {
      const { products } = e.data
      const productsNumber = products?.length
      const productIds = products
        ?.map((product: any) => product?.skuId)
        .join(',')

      const categoryInfos: CategoryInfos = await getProductCategory(
        'sku',
        products?.[0].skuId
      )

      products &&
        push({
          event: 'compare_products',
          action: 'compare',
          item_compared: productsNumber,
          item_id: productIds,
          item_category: categoryInfos?.category,
          item_macrocategory: categoryInfos?.macroCategory,
        })
      break
    }
  }
}
