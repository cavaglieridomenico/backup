import { ClientsConfig, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { GetAccessToken } from './middlewares/GetAccessToken'
import { GetAuthCode } from './middlewares/GetAuthCode'
import { GetUserInfo } from './middlewares/GetUserInfo'
import { ReceiveAuthCode } from './middlewares/ReceiveAuthCode'

const TIMEOUT_MS = 20000

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options:
  {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default:
    {
      retries: 2,
      timeout: TIMEOUT_MS,
    }
  }
}

declare global {
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    getAuthCode: method({
      GET: [GetAuthCode]
    }),
    authCodeRedirect: method({
      GET: [ReceiveAuthCode]
    }),
    getAccessToken: method({
      POST: [GetAccessToken]
    }),
    getUserInfo: method({
      GET: [GetUserInfo]
    }),
  }
})
