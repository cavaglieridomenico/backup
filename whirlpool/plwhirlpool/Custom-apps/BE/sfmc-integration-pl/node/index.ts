import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  EventContext, method,
} from '@vtex/api'

import { Clients } from './clients'

import { createOrder } from './middlewares/createOrder';
import { createOrderOnEvent } from './middlewares/createOrderOnEvent';
import { cancelOrder } from './middlewares/cancelOrder';
import { getProduct } from "./middlewares/getProduct";
import { refundOrder } from "./middlewares/refundOrder";
import { returnOrder } from "./middlewares/returnOrder";
import { getProductRecommendations } from './middlewares/getProductRecommendations';
import { cancelOrderEvent } from './middlewares/orderCancellationEvent';


const TIMEOUT_MS = 20000;

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
  type Context = ServiceContext<Clients>

  interface StatusChangeContext extends EventContext<Clients> {
    body: {
      domain: string
      orderId: string
      host: string
      // currentState: string
      // lastState: string
      // currentChangeDate: string
      // lastChangeDate: string
      // receiverName: string
      // street: string
      // postalCode: string
      // city: string
      // country: string
      // creationDate: string
      // paymentSystemName: string
      // cardNumber: string
    }
  }

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  //interface State extends RecorderState { }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    createOrderOnEvent,
    cancelOrderEvent
  },
  routes: {
    createOrder: method({
      POST: [createOrder]
    }),
    cancelOrder: method({
      POST: [cancelOrder]
    }),
    getProduct: method({
      GET: [getProduct]
    }),
    refundOrder: method({
      POST: [refundOrder]
    }),
    returnOrder: method({
      POST: [returnOrder]
    }),
    getProductRecommendations: method({
      GET: [getProductRecommendations]
    })
  }
})
