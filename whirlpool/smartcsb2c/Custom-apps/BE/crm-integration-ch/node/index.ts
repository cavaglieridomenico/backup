import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

//Clients and middlewares
import { Clients } from './clients'
import { createUpdateUser } from './middlewares/createUpdateUser'
import { getUser } from './middlewares/getUser'
import { updateAddress } from './middlewares/updateAddress'

const TIMEOUT_MS = 4000

// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const createUpdateUserCache = new LRUCache<string, any>({ max: 5000 })
metrics.trackCache('createUpdateUserCache', createUpdateUserCache)

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
    // This key will be merged with the default options and add this cache to our Status client.
    createUpdateCrmUser:
    {
      memoryCache: createUpdateUserCache
    }
  }
}

declare global
{
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service(
{
  clients,
  routes:
  {
    //Maps the routes to an array of middleware resolvers while also specifying which resolver to use for each method (GET, POST etc...).
    createUpdateUser: method({ POST: [createUpdateUser] }),
    getUser: method({ GET: [getUser] }),
    updateAddress: method({ POST: [updateAddress] })
  }
})
