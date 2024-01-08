import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { LRUCache, Service } from '@vtex/api'
import { Clients } from './clients'
import { getSLCitiesResolver } from './resolver/getSLCities'
import { getSLRegionsResolver } from './resolver/getSLRegions'
import { getSLProvincesResolver } from './resolver/getSLProvinces'
import { getSLServicesResolver } from './resolver/getSLServices'

const TIMEOUT_MS = 5000

const memoryCache = new LRUCache<string, any>({ max: 5000 })

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
        getSLCities: getSLCitiesResolver,
        getSLRegions: getSLRegionsResolver,
        getSLProvinces: getSLProvincesResolver,
        getSLServices: getSLServicesResolver
      },
    },
  },
})
