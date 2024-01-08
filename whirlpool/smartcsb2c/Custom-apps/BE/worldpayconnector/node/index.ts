import { ClientsConfig, LRUCache, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { Clients } from './clients'
import { CancelPayment } from './middlewares/CancelPayment'
import { CapturePayment } from './middlewares/CapturePayment'
import { CheckCredentials } from './middlewares/CheckCredentials'
import { CreatePayment } from './middlewares/CreatePayment'
import { GetPaymentMethods } from './middlewares/PaymentMethods'
import { GetProviderManifest } from './middlewares/ProviderManifest'
import { RefundPayment } from './middlewares/RefundPayment'
import { HelperPage } from './middlewares/HelperPage'
import { NotificationHandler } from './middlewares/Notification'
import { PaymentDenied } from './middlewares/PaymentDenied'
import { NotificationProxy } from './middlewares/NotificationProxy'
import { GetSapData } from './middlewares/GetSapData'
import { vtexPing } from './middlewares/vtex_ping'

const TIMEOUT_MS = 10000

const memoryCache = new LRUCache<string, any>({ max: 100, maxAge: 1000 * 60, stale: true })

metrics.trackCache('masterdata', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 3,
      timeout: TIMEOUT_MS,
    },
    vtexAPI: {
      memoryCache
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
    paymentmethods: method({
      GET: [GetPaymentMethods],
    }),
    providermanifest: method({
      GET: [GetProviderManifest],
    }),
    createpayment: method({
      POST: [CheckCredentials, CreatePayment],
    }),
    capturepayment: method({
      POST: [CheckCredentials, CapturePayment]
    }),
    cancelpayment: method({
      POST: [CheckCredentials, CancelPayment]
    }),
    refundpayment: method({
      POST: [CheckCredentials, RefundPayment]
    }),
    notification: method({
      POST: [NotificationProxy, NotificationHandler]
    }),
    paymentdenied: method({
      POST: [PaymentDenied]
    }),
    helperpage: method({
      GET: [HelperPage]
    }),
    sapdata: method({
      GET: [GetSapData]
    }),
    vtexPing: method({
      GET: [vtexPing]
    })
  },
})
