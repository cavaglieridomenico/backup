import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext, method
} from '@vtex/api';

import { AppSettings } from './typings/config';
import { Clients } from './clients';
import { getAppSettings } from './middlewares/getAppSettings';
import { reserveSlot } from './middlewares/reserveSlot';
import { getDeliverySlots } from './middlewares/fetchDeliverySlots';
import { OrderForm } from './typings/orderForm';
import { saveBookingInfo } from './middlewares/saveBookingInfo';
import { cancelBatchReservation } from './middlewares/batchCancellation';
import { orderCreatedUpdate, setBookingStatus, setBookingStatusOnOrderEvent } from './middlewares/bookingStatusHandler';
import { BookingInfo, SkuContext } from './typings/types';
import { Order } from './typings/order';
import { checkOrderEvent } from './middlewares/bookingStatusEventCheck';
import { getItemsInfo } from './middlewares/getProductSpecs';
import { getReservationCode } from './middlewares/getReservationCode';
import { deleteOldBooking } from './middlewares/deleteOldBooking';
import { checkSellerCredential, checkVtexCredentials } from './middlewares/checkCredentials';
import { CustomLogger } from './utils/Logger';
import { initLogger } from './middlewares/initLogger';
import { checkBookingStatus } from './middlewares/checkBookingStatus';
import { fetchGuestUserCookie } from './middlewares/fetchGuestUserCookie';
import { ping } from './middlewares/ping';
import { createCronJob } from './middlewares/createCronJob';
import { checkOrderReservation } from './middlewares/checkOrderReservation';
//import { antiThrottler } from './middlewares/antiThrottler';

const TIMEOUT_MS = 10 * 1000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000, maxSize: 5000, ttl: 1000 * 60 * 8 });
metrics.trackCache('status', memoryCache);
export var requests: any = {};

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 5,
      timeout: TIMEOUT_MS,
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
      domain: string
      orderId: string
      host: string
      currentState: string
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
  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middleware.
  interface State extends RecorderState {
    appSettings: AppSettings
    orderForm: OrderForm
    allSlots: string[]
    order: Order
    bookingInfo: BookingInfo
    logger: CustomLogger
    skus: SkuContext[]
    cookies: string[]
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    bookingStatus: [initLogger, getAppSettings, checkOrderEvent, setBookingStatusOnOrderEvent],
    updateOnOrderCreated: [initLogger, getAppSettings, orderCreatedUpdate],
    onAppInstalled: [initLogger, createCronJob]
  },
  routes: {
    // antiThrottler disabled because in case the BE api returns 504, FE is not able to call BE anymore due to not updated internal state (FE keeps on receiving 429)
    getDeliverySlots: method({
      GET: [/*antiThrottler,*/ initLogger, getAppSettings, fetchGuestUserCookie, getDeliverySlots]
    }),
    reserveDeliverySlot: method({
      POST: [/*antiThrottler,*/ initLogger, getAppSettings, fetchGuestUserCookie, deleteOldBooking, reserveSlot, saveBookingInfo]
    }),
    checkBookingStatus: method({
      GET: [/*antiThrottler,*/ initLogger, getAppSettings, fetchGuestUserCookie, checkBookingStatus]
    }),
    cancellationBatch: method({
      POST: [initLogger, getAppSettings, checkVtexCredentials, cancelBatchReservation]
    }),
    getReservation: method({
      GET: [initLogger, getAppSettings, checkVtexCredentials, getReservationCode, getItemsInfo]
    }),
    setMPBookingStatus: method({
      POST: [initLogger, getAppSettings, checkSellerCredential, setBookingStatus]
    }),
    ping: method({
      POST: [initLogger, ping]
    }),
    checkOrderReservation: method({
      GET: [initLogger, getAppSettings, checkOrderReservation]
    }),
    // backup api
    bookingStatusBackUp: method({
      POST: [initLogger, getAppSettings, checkVtexCredentials, checkOrderEvent, setBookingStatusOnOrderEvent]
    })
  }
})
