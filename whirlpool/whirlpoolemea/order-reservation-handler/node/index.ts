import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { LRUCache, Service } from '@vtex/api'

import { Clients } from './clients'
import { handlePendingOrders } from './middlewares/handlePendingOrders'
import { AppSettings } from './typings/global'
import { getAppSettings } from './middlewares/getAppSettings'
import { onAppInstalledEvent } from './events/OnAppInstalledEvent'

const TIMEOUT_MS = 3000

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

// metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    appSettings: AppSettings
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    handlePendingOrders: [getAppSettings, handlePendingOrders]
  },
  events: {
    onAppInstalled: onAppInstalledEvent
  }
})
