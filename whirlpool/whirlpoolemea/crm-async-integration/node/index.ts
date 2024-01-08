import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext, method
} from '@vtex/api';

import { Clients } from './clients';
import { checkVtexCredentials, checkMDCredentials } from './middlewares/checkCredentials';
import { eppExportHandler } from './middlewares/eppExportHandler';
import { getAppSettings } from './middlewares/getAppSettings';
import { recoverPlan } from './middlewares/recoverPlan';
import { ping } from './middlewares/ping';
import { NewsletterSubscriptionData } from './typings/NL';
import { AppSettings } from './typings/config';
import { notificationHandler } from './middlewares/notificationHandler';
import { readOrderData, sendOrderDataToCRM, sendOrderDataToGCP } from './middlewares/sendGuestUserData';
import { getUserDataFromCRM } from './middlewares/getUserDataFromCRM';
import { getUserDataFromVtex } from './middlewares/getUserDataFromVtex';
import { setCrmBpId } from './middlewares/setCrmBpId';
import { initNLSubscription, subscribeNewsletterThroughCRM, subscribeNewsletterThroughGCP } from './middlewares/subscribeNewsletter';
import { Order } from './typings/Order';
import { RegistrationForm } from './typings/md';
import { registerUser, registerUserOnCL, sendNLSubscriptionEvent } from './middlewares/registrationForm';
import { crmBackflowStatus } from './middlewares/crmBackflowStatus';
import { profilingOptinManagement } from './middlewares/ProfilingOptinManagement';
import { CustomLogger } from './utils/Logger';
import { initLogger } from './middlewares/initLogger';
import { createCronJob } from './middlewares/createCronJob';
import { registerProduct } from './middlewares/registerproduct';
import { deleteUserDataFromVtex } from './middlewares/deleteUserDataFromVtex';


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

  interface LoggedUser extends EventContext<Clients, State> {
    body: {
      email: string,
      eventId: string
    }
  }

  interface NewsletterSubscription extends EventContext<Clients, State> {
    body: NewsletterSubscriptionData
  }

  interface OrderEvent extends EventContext<Clients, State> {
    body: {
      orderId: string
    }
  }

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    appSettings: AppSettings
    orderId: string
    order: Order
    tradePolicy: string | undefined
    reqRF: RegistrationForm
    userId: string
    logger: CustomLogger
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    fetchDataFromCRM: [initLogger, getAppSettings, getUserDataFromCRM],
    recoverPlan: [initLogger, getAppSettings, recoverPlan],
    newsletterSubscription: [initLogger, getAppSettings, initNLSubscription, subscribeNewsletterThroughGCP, subscribeNewsletterThroughCRM],
    newOrder: [initLogger, getAppSettings, profilingOptinManagement, readOrderData, sendOrderDataToGCP, sendOrderDataToCRM],
    onAppInstalled: [initLogger, createCronJob]
  },
  routes: {
    ping: method({
      POST: [initLogger, ping]
    }),
    notificationHandler: method({
      POST: [initLogger, getAppSettings, checkMDCredentials, notificationHandler]
    }),
    setCrmBpId: method({
      POST: [initLogger, getAppSettings, checkVtexCredentials, setCrmBpId]
    }),
    getUserDataFromVtex: method({
      GET: [initLogger, getAppSettings, checkVtexCredentials, getUserDataFromVtex]
    }),
    deleteUserDataFromVtex: method({
      DELETE: [initLogger, getAppSettings, checkVtexCredentials, deleteUserDataFromVtex]
    }),
    getUserDataFromCRM: method({
      GET: [initLogger, getAppSettings, getUserDataFromCRM]
    }),
    eppExportHandler: method({
      POST: [initLogger, getAppSettings, checkVtexCredentials, eppExportHandler]
    }),
    // backup API
    guestUserRegistration: method({
      POST: [initLogger, getAppSettings, checkVtexCredentials, profilingOptinManagement, readOrderData, sendOrderDataToGCP, sendOrderDataToCRM]
    }),
    registrationForm: method({
      POST: [initLogger, getAppSettings, checkMDCredentials, registerUser, registerUserOnCL, sendNLSubscriptionEvent]
    }),
    crmBackflowStatus: method({
      GET: [initLogger, getAppSettings, crmBackflowStatus]
    }),
    productRegistration: method({
      POST: [initLogger, getAppSettings, registerProduct]
    }),
    //Maps the routes to an array of middlware resolvers while also specifying which resolver to use for each method (GET, POST etc...).
  }
})
