//@ts-nocheck

import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext,
  method,
} from '@vtex/api';

import {Clients} from './clients';
import { backInStock } from './middlewares/backInStock';

const TIMEOUT_MS = 20000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({max: 5000});
metrics.trackCache('status', memoryCache);

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
      // All IO Clients will be initialized with these options, unless otherwise specified.
      default: {
          retries: 5,
          timeout: TIMEOUT_MS,
          memoryCache
      },
      // This key will be merged with the default options and add this cache to our Status client.
      status: {
          memoryCache,
      },
  },
};

declare global {
  type Context = ServiceContext<Clients, State>
}

export default new Service({
  clients,
  routes:{
    backInStock: method({
      POST: [backInStock]
    })
  }
})
