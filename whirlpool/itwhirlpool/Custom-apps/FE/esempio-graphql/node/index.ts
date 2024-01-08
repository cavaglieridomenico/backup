import { ClientsConfig, LRUCache, Service, ServiceContext } from '@vtex/api'

import { Clients } from './clients'

import { queries as productQuery } from './resolvers/product'

const TIMEOUT_MS = 100000

const memoryCache = new LRUCache<string, any>({max: 5000})
metrics.trackCache('status', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        ...productQuery
      },
    },
  },
})
