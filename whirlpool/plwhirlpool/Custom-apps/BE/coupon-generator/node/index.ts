//@ts-nocheck

import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { GenerateCoupon } from './middlewares/GenerateCoupons'
import { Clients } from './clients/index'
import { GetCouponFile } from './middlewares/GetCouponFile'

const TIMEOUT_MS = 10000

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
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    generatecoupon: method({ POST: [GenerateCoupon] })
    // getcoupons: method({ GET: [GetCouponFile] })
  }
})
