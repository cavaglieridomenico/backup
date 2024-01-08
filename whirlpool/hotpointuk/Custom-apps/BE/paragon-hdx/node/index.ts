import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext, method, WORKSPACE, ACCOUNT,
} from '@vtex/api';

import { ping } from './middlewares/ping';
import { AppSettings } from './typings/config';
import { Clients } from './clients';
import { getAppSettings } from './middlewares/getAppSettings';
import { retrieveDeliverySlots } from './middlewares/retrieveDeliverySlots';
import { getServerStatus } from './middlewares/getServerStatus';
import { checkVtexCredentials } from './middlewares/checkCredentials';
import { uploadDeliveryData } from './middlewares/uploadDeliveryData';
import { reserveSlot } from './middlewares/reserveSlot';
import { DMRecord, DTRecord, OTRecord } from './typings/md';
import { SkuContext } from './typings/types';
import { reserveSlotOnOrderPlaced } from './middlewares/reserveSlotOnOrderPlaced';
import { getReservationCode } from './middlewares/getReservationCode';
import { retrieveCookie } from './middlewares/retrieveCookie';
const fetch = require('node-fetch');


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
    }
  }

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    appSettings: AppSettings,
    dmRecord?: DMRecord,
    skuContext?: SkuContext[],
    delTimeCalc?: DTRecord,
    offset?: OTRecord,
    isHoliday?: boolean
    CheckoutOrderFormOwnershipCookie?: string
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    newOrder: [getAppSettings, reserveSlotOnOrderPlaced]
  },
  routes: {
    ping: method({
      POST: [ping]
    }),
    deliverySlots: method({
      GET: [getAppSettings, retrieveCookie, retrieveDeliverySlots],
      POST: [getAppSettings, retrieveCookie, reserveSlot],
    }),
    getServerStatus: method({
      GET: [getAppSettings, checkVtexCredentials, getServerStatus]
    }),
    uploadDeliveryData: method({
      POST: [getAppSettings, checkVtexCredentials, uploadDeliveryData]
    }),
    slotReservation: method({
      GET: [getAppSettings, checkVtexCredentials, getReservationCode],
      // backup API
      POST: [getAppSettings, checkVtexCredentials, reserveSlotOnOrderPlaced]
    })
  }
})


setInterval(() => {
  fetch(`http://${WORKSPACE}--${ACCOUNT}.myvtex.com/app/hdx/ping`, { method: "POST", body: JSON.stringify({}) })
}, 300000)
