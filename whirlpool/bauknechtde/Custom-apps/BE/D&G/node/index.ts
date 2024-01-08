//@ts-nocheck

import {
  ClientsConfig,
  Service,
  ServiceContext,
  EventContext,
  method,
  RecorderState,
  LRUCache
} from '@vtex/api'

import { Clients } from './clients'
import { getAppSettings } from './middlewares/getAppSettings'
import { RedirectToDnG } from './middlewares/redirectToDnG'
import { sendDataToDnG } from './middlewares/sendDataToDnG'
import { AppSettings } from './typings/config'
import { checkVtexCredentials } from './middlewares/checkCredentials'
import { getDnGLinks } from './middlewares/getDnGLinks'

const TIMEOUT_MS = 30000
const memoryCache = new LRUCache<string, any>({max: 5000, maxSize: 5000, ttl: 1000*60*8});
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
    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface StatusChangeContext extends EventContext<Clients, State> {
    body: {
      domain: string
      orderId: string
      currentState: string
      lastState: string
      currentChangeDate: string
      lastChangeDate: string
    }
  }

  interface State extends RecorderState {
    appSettings: AppSettings
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    orderCreated: [getAppSettings, sendDataToDnG]
  },
  routes: {
    redirectToDnG: method({
      GET: [getAppSettings, RedirectToDnG]
    }),
    sendOrGetOrderData: method({
      POST: [getAppSettings, checkVtexCredentials, sendDataToDnG], // backup API
      GET: [getAppSettings, getDnGLinks]
    })
  }
})
