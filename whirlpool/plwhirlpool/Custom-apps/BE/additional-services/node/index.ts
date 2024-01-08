import {
    ClientsConfig,
    LRUCache,
    Service,
    ServiceContext,
    RecorderState,
    method,
} from '@vtex/api'

import {Clients} from './clients'
import { updateSpecification } from './middlewares/updateAdditionalServices';


const TIMEOUT_MS = 5000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 500})
metrics.trackCache('status', memoryCache);

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
    // We pass our custom implementation of the clients bag, containing the Status client.
    implementation: Clients,
    options: {
        // All IO Clients will be initialized with these options, unless otherwise specified.
        default: {
            retries: 3,
            timeout: TIMEOUT_MS,
            memoryCache
        },
        // This key will be merged with the default options and add this cache to our Status client.
        vtexAPI: {
            memoryCache,
        }
    },
};

declare global {
    type Context = ServiceContext<Clients, State>

    // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
    interface State extends RecorderState {
    }
}

// Export a service that defines route handlers and client options.
export default new Service({
    clients,
    routes: {
        updateAdditionalServices: method({
            GET: [updateSpecification],
            POST: [updateSpecification]
        })
    }
})
