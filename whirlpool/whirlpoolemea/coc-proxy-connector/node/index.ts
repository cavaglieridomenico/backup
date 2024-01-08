import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
// import { test } from './middlewares/status'
import { GetAppSettings } from './middlewares/GetAppSettings'
import { CheckCredentials } from './middlewares/validate'
import { WorldPayProxy } from './middlewares/WorldpayProxy'
import { CustomLogger } from './utils/Logger'
import { InitLogger } from './middlewares/InitLogger'
import { onAppInstalledEvent } from './events/OnAppInstalledEvent'
import { ping } from './middlewares/ping'

const TIMEOUT_MS = 5000

// Create a LRU memory cache for the Status client.
// The 'max' parameter sets the size of the cache.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
// Note that the response from the API being called must include an 'etag' header
// or a 'cache-control' header with a 'max-age' value. If neither exist, the response will not be cached.
// To force responses to be cached, consider adding the `forceMaxAge` option to your client methods.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 5,
      timeout: TIMEOUT_MS,
    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    settings: any,
    logger: CustomLogger
  }
}
//coc-proxy-connector
export default new Service({
  clients,
  routes: {
    worldpay: method({
      POST: [InitLogger, GetAppSettings, CheckCredentials, WorldPayProxy]
    }),
    ping: [ping]
  },
  events: {
    onAppInstalled: onAppInstalledEvent
  }
})
