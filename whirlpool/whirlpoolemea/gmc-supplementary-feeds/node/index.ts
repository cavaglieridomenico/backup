import type { ClientsConfig, ServiceContext, RecorderState, EventContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getEligibleSKUS } from './middlewares/filterElegibleSkus'
import { AppSettings, FeedSettings } from './typings/configs'
import { CustomLogger } from './utils/Logger'
import { getAppSettings } from './middlewares/getAppSettings'
import { initLogger } from './middlewares/initLogger'
import { GetSkuContextResponse } from '@vtex/clients'
import { buildDeliveryPriceXMLFeed } from './middlewares/BuildDeliveryPriceFeed'
import { createCronJob } from './middlewares/createCronJob'
import { ping } from './middlewares/ping'

const TIMEOUT_MS = 10 * 1000;

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

  interface InstalledContextEvent extends EventContext<Clients, State> {
    body: {
    }
  }

  interface State extends RecorderState {
    appSettings: AppSettings
    feedSettings: FeedSettings | undefined
    logger: CustomLogger
    eligibleSkusContext: GetSkuContextResponse[]
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    getShippingPriceSupplementaryFeed: method({
      GET: [initLogger, getAppSettings, getEligibleSKUS, buildDeliveryPriceXMLFeed],
    }),
    ping: [initLogger, ping]
  },
  events: {
    onAppInstalled: [initLogger, createCronJob]
  }
})
