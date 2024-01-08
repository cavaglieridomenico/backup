import { LRUCache, method } from '@vtex/api'
import { Service } from '@vtex/api/lib/service/worker/runtime/Service'
import { ClientsConfig, ServiceContext } from '@vtex/api/lib/service/worker/runtime/typings'
import { Clients } from './clients'
import { doesItFit_resolver } from './resolvers/PDP/doesItFit'
import { getBomCodes_resolver} from './resolvers/LandingPage/getBomCodes'
import { getBomImage_resolver } from './resolvers/BOM/getBomImage'
import { getFamilyGroup_resolver } from './resolvers/BOM/getFamilyGroup'
import { getFitsIn_resolver } from './resolvers/PDP/getFitsIn'
import { getJcodeForBom_resolver } from './resolvers/BOM/getJcodeForBom'
import { getSpareByIndustrialWithFilterPAG_resolver } from './resolvers/BOM/getSpareByIndustrialWithFilterPAG'
import { getSupportVideos_resolver } from './resolvers/PDP/getSupportVideos'
import { changeProductScore } from './middlewares/productScore'


const TIMEOUT_MS = 20000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}


// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        getBomCodes: getBomCodes_resolver,
        getFitsIn: getFitsIn_resolver,
        doesItFit: doesItFit_resolver,
        getBomImage: getBomImage_resolver,
        getJcodeForBom: getJcodeForBom_resolver,
        getSpareByIndustrialWithFilterPAG: getSpareByIndustrialWithFilterPAG_resolver,
        getFamilyGroup: getFamilyGroup_resolver,
        getSupportVideos: getSupportVideos_resolver
      },
    },
  },
  routes: {
    productUpdateScore: method({
      POST: [changeProductScore]
    })
  }
})
