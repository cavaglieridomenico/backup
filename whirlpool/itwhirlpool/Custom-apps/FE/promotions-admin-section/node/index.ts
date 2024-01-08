import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

//Clients and middlewares
import { Clients } from './clients'
import { GetPromotions } from './middlewares/GetPromotions'

const TIMEOUT_MS = 5000


// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> =
{
  // We pass our custom implementation of the clients bag, containing the clients.
  implementation: Clients,
  options:
  {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default:
    {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  }
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    promotionsList: method({
      GET: [GetPromotions],
    })
  }
})
