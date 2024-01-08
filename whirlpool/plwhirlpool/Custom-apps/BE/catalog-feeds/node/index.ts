import { ClientsConfig, LRUCache, method, RecorderState, ServiceContext } from '@vtex/api'
import { Service } from '@vtex/api'
import { Clients } from './clients'
import { ping } from './middlewares/ping'
import { ConvertToMillis } from './utils/commonFunctions'
import { AppSettings } from './typings/configs'
import { getPing } from './utils/ping'
import { AwinFeed } from './middlewares/Awin'
import { Product } from './typings/productDetails'
import { GetCatalog } from './middlewares/GetCatalog'
import { CeneoPLFeed } from './middlewares/CeneoPL'


const TIMEOUT_MS = 5000
const memoryCache = new LRUCache<string, any>({ max: 5000, maxAge: 1000 * 60 * 60 * 2, stale: true });
// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 3,
      timeout: TIMEOUT_MS

    },
    vtexAPI: {
      memoryCache: memoryCache
    }
  },
}

declare global {

  interface State extends RecorderState {
    settings: AppSettings,
    products: Product[]
  }

  type Context = ServiceContext<Clients, State>
}

setInterval(async () => {
  await getPing()
}, ConvertToMillis(15, 'minutes'))

export default new Service({
  clients,
  routes: {
    ping: [ping],
    awin: method({
      GET: [GetCatalog, AwinFeed]
    }),
    ceneo: method({
      GET: [GetCatalog, CeneoPLFeed]
    }),
  }
})
