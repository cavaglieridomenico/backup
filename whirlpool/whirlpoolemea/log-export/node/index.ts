//@ts-nocheck

import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { exportLogs } from './middlewares/exportLogs'
import { Clients } from './clients/index'
import { deleteLogs } from './middlewares/deleteLogs'
import { Config } from './typings/config'
import { getConfig } from './middlewares/getConfig'
import { checkCredentials } from './middlewares/checkCredentials'

const TIMEOUT_MS = 1000*60*6

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
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
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    config: Config
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes:{
    exportLogs:  method({
      GET: [getConfig, exportLogs]
    }),
    deleteLogs: method({
      POST: [getConfig, checkCredentials, deleteLogs]
    })
  }
})
