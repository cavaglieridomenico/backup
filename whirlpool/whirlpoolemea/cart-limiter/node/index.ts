import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext, method,
} from '@vtex/api';
import { Clients } from './clients';
import { checkCart } from './middlewares/checkCart';
import { checkOrderEvent } from './middlewares/checkOrderEvent';
import { countOrder } from './middlewares/countOrder';
import { fetchRequest } from './middlewares/fetchRequest';
import { getAppSettings } from './middlewares/getAppSettings';
import { returnCart } from './middlewares/returnCart';
import { updateCartItems } from './middlewares/updateCartItems';
import { checkCartGQL } from './resolvers/checkCartGQL';
import { updateCartItemsQL } from './resolvers/updateCartItemsGQL';
import { UpdateCartItemsReq } from './typings/cart';
import { AppSettings } from './typings/config';
import { OrderForm } from './typings/orderForm';


const TIMEOUT_MS = 20000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000, maxSize: 5000, ttl: 1000 * 60 * 8 });
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

  interface OrderEvent extends EventContext<Clients, State> {
    body: {
      orderId: string
      currentState: string
    }
  }

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    appSettings: AppSettings
    orderFormId: string
    req: UpdateCartItemsReq
    cart: OrderForm
    originalItems: { index: number, id: string, quantity: number }[]
    largeComparisonFG: boolean
    underMDAQtyThreshold: boolean
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    newOrder: [getAppSettings, checkOrderEvent, countOrder]
  },
  graphql: {
    resolvers:{
      Query: {
        checkCart: checkCartGQL
      },
      Mutation: {
        updateCartItems: updateCartItemsQL
      }
    }
  },
  routes: {
    cartChecker: method({
      GET: [getAppSettings, checkCart, returnCart],
    }),
    updateCartItems: method({
      POST: [getAppSettings, fetchRequest, checkCart, updateCartItems, returnCart]
    }),
    // backup API for tests on orders
    countOrder: method({
      POST: [getAppSettings, countOrder]
    })
  }
})
