//@ts-nocheck

import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { exportCatalog } from './middlewares/exportCatalog'
import { Clients } from './clients/index'
import { AppSettings } from './typings/configs'
import { GetAdditionalServices } from './resolvers/getProductServices'

const TIMEOUT_MS = 20000

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    }
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    appSettings: AppSettings,
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        additionalServices: GetAdditionalServices
      }
    }
  },
  routes:{
    exportCatalog:  method({ GET: [exportCatalog] }),
  }
})
