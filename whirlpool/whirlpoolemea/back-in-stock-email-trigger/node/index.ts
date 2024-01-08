
import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  method,
} from '@vtex/api';

import { Clients } from './clients';
import { backInStock } from './middlewares/backInStock';
import { checkVtexCredentials } from './middlewares/checkCredentials';
import { deleteSubscription } from './middlewares/deleteExpiredSubscription';
import { getAppSettings } from './middlewares/getAppSettings';
import { saveBISForm } from './resolvers/saveBISForm';
import { AppSettings } from './typing/config';

const TIMEOUT_MS = 20 * 1000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 });
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
  interface State extends RecorderState {
    appSettings?: AppSettings
  }

}

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Mutation: {
        saveBISForm: saveBISForm
      }
    }
  },
  routes: {
    backInStock: method({
      POST: [getAppSettings, checkVtexCredentials, backInStock],
      DELETE: [getAppSettings, checkVtexCredentials, deleteSubscription]
    })
  }
})
