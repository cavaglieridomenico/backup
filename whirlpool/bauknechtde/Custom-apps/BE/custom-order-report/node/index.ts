import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getOrdersByRangeTimeMid } from './middlewares/gerOrdersByDateRange'

const TIMEOUT_MS = 20000


//metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 5,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    // `status` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
    getOrdersByRangeTime: method({
      GET: [getOrdersByRangeTimeMid],
    }),
  },
})
