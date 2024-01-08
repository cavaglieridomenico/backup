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
import { checkVtexCredentials, checkMDCredentials } from './middlewares/checkCredentials';
import { wakeUpServices } from './middlewares/wakeUpServices';
import { CustomLogger } from './utils/Logger';
import { deleteEntryFromVbase } from './middlewares/DeleteUserFromVbase';


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
  interface State extends RecorderState { }
}
// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    wakeUpServices
  },
  routes: {
    notificationHandler: method({
      POST: [runJob, checkMDCredentials, notificationHandler]
    }),
    setCrmBpId: method({
      POST: [runJob, checkVtexCredentials, setCrmBpId]
    }),
    getUserDataFromVtex: method({
      GET: [runJob, checkVtexCredentials, getUserDataFromVtex]
    }),
    getUserDataFromCRM: method({
      GET: [runJob, getUserDataFromCRM]
    }),
    deleteEntryFromVbase: method({
      GET: [deleteEntryFromVbase]
    })
    //Maps the routes to an array of middlware resolvers while also specifying which resolver to use for each method (GET, POST etc...).
  }
})

async function runJob(ctx: Context, next: () => Promise<any>) {
  if (process.env.JOB == undefined) {
    process.env.JOB = "RUNNING";
    ctx.vtex.logger = new CustomLogger(ctx);
    ctx.vtex.logger.info("variable JOB correctly set up");
    setInterval(() => {
      ctx.clients.events.sendEvent(ctx.vtex.account + ".crm-async-integration", 'crm-wake-up-services');
    }, 480000)
  }
  await next();
}
