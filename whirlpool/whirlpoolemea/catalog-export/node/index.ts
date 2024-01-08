//@ts-nocheck

import { ClientsConfig, RecorderState, ServiceContext, CacheLayer, LRUCache, method, Service } from '@vtex/api'
import { exportCatalog } from './middlewares/exportCatalog'
import { Clients } from './clients/index'
import { AppSettings } from './types/typing'

const TIMEOUT_MS = 1000*30;
const memoryCache: CacheLayer<string, any> = new LRUCache({max: 5000, maxSize: 5000, ttl: 1000*60*8});
metrics.trackCache('status', memoryCache);

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 3,
      timeout: TIMEOUT_MS,
      memoryCache
    },
    status: {
      memoryCache
    }
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>
  interface State extends RecorderState {
    appSettings: AppSettings
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes:{
    exportCatalog:  method({
      GET: [exportCatalog]
    })
  }
})
