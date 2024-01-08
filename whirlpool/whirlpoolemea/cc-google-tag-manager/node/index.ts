import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getProductDataMid, getProductDataResolver } from './middlewares/getProductData'
import { GetPageViewDataMiddleware/*, GetPageViewDataResolver*/ } from './middlewares/pageViewData'

const TIMEOUT_MS = 5000
const ONE_MINUTE_MS = 1000 * 60

const vtexCache = new LRUCache<string, any>({ max: 100, maxAge: ONE_MINUTE_MS * 30, stale: false, ttl: ONE_MINUTE_MS * 30 })
const searchGraphQLCache = new LRUCache<string, any>({ max: 200, maxAge: ONE_MINUTE_MS * 30, stale: false, ttl: ONE_MINUTE_MS * 30 })
const bazaarvoiceCache = new LRUCache<string, any>({ max: 200, maxAge: ONE_MINUTE_MS * 120, stale: false, ttl: ONE_MINUTE_MS * 120 })

metrics.trackCache('vtex', vtexCache)
metrics.trackCache('searchGql', searchGraphQLCache)
metrics.trackCache('bazaarvoice', bazaarvoiceCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    searchGraphQL: {
      memoryCache: searchGraphQLCache
    },
    vtex: {
      memoryCache: vtexCache
    },
    bazaarvoice: {
      memoryCache: bazaarvoiceCache
    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>
  interface State extends RecorderState {
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        productData: getProductDataResolver
        //pageViewData: GetPageViewDataResolver,
      }
    },

  },
  routes: {
    productData: method({
      GET: [getProductDataMid]
    }),
    pageView: method({
      GET: [GetPageViewDataMiddleware]
    }),
  },
})
