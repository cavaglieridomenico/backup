//@ts-nocheck

import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext, method,
} from '@vtex/api';

import { Clients } from './clients';
import { setCrmBpId } from './middlewares/setCrmBpId';
import { getUserDataFromVtex } from './middlewares/getUserDataFromVtex';
import { getUserDataFromCRM } from './middlewares/getUserDataFromCRM';
import { notificationHandler } from './middlewares/notificationHandler';
import { productRegistration3YCheckup } from './middlewares/productRegistration3YCheckup';
import { registeredUserManagerMid } from './middlewares/registeredUserManager'
import { getPing } from './utils/ping';
import { ping } from './middlewares/ping';
import { AppSettings } from './typings/config';

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
  type Context = ServiceContext<Clients, State>

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
  interface State extends RecorderState {
    appSettings: AppSettings
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    ping: [ping],
    notificationHandler: method({
      POST: [notificationHandler]
    }),
    setCrmBpId: method({
      POST: [setCrmBpId]
    }),
    getUserDataFromVtex: method({
      GET: [getUserDataFromVtex]
    }),
    getUserDataFromCRM: method({
      GET: [getUserDataFromCRM]
    }),
    productRegistration3YCheckup: method({
      POST: [productRegistration3YCheckup]
    }),
    registeredUserManagerMid: method({
      POST: [registeredUserManagerMid]
    })
    //Maps the routes to an array of middlware resolvers while also specifying which resolver to use for each method (GET, POST etc...).
  }
})

setInterval(async () => {
  await getPing()
}, 300000)

