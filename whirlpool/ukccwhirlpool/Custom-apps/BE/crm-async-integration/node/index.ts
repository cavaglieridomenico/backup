//@ts-nocheck

import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext, method,
} from '@vtex/api';

import {Clients} from './clients';
import { setCrmBpId } from './middlewares/setCrmBpId';
import { getUserDataFromVtex } from './middlewares/getUserDataFromVtex';
import { getUserDataFromCRM } from './middlewares/getUserDataFromCRM';
import { notificationHandler } from './middlewares/notificationHandler';
import { checkVtexCredentials, checkMDCredentials} from './middlewares/checkCredentials';
import { eppExportHandler } from './middlewares/eppExportHandler';
import { getAppSettings } from './middlewares/getAppSettings';
import { recoverPlan } from './middlewares/recoverPlan';
import { AppSettings, NewsletterSubscriptionData } from './typings/types';
import { ping } from './middlewares/ping';
import { env } from 'process';
import { subscribeNewsletter } from './middlewares/subscribeNewsletter';
import { sendGuestUserData } from './middlewares/sendGuestUserData';
const fetch = require('node-fetch');


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
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    fetchDataFromCRM: [getAppSettings, getUserDataFromCRM],
    recoverPlan: [getAppSettings, recoverPlan],
    newsletterSubscription: [getAppSettings, subscribeNewsletter],
    newOrder: [getAppSettings, sendGuestUserData]
  },
  routes:{
    ping: method({
      POST: [ping]
    }),
    notificationHandler: method({
      POST: [getAppSettings, checkMDCredentials, notificationHandler]
    }),
    setCrmBpId: method({
      POST: [getAppSettings, checkVtexCredentials, setCrmBpId]
    }),
    getUserDataFromVtex: method({
      GET: [getAppSettings, checkVtexCredentials, getUserDataFromVtex]
    }),
    getUserDataFromCRM: method({
      GET: [getAppSettings, getUserDataFromCRM]
    }),
    eppExportHandler: method({
      POST: [getAppSettings, checkVtexCredentials, eppExportHandler]
    }),
    // backup API
    guestUserRegistration: method({
      POST: [getAppSettings, checkVtexCredentials, sendGuestUserData]
    })
    //Maps the routes to an array of middlware resolvers while also specifying which resolver to use for each method (GET, POST etc...).
  }
})

setInterval(() => {
  fetch("http://"+env.VTEX_ACCOUNT+".myvtex.com/app/crm-async-integration/ping", {method: "POST", body: JSON.stringify({})})
}, 300000)
