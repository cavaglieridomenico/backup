import {
    ClientsConfig,
    LRUCache,
    Service,
    ServiceContext,
    RecorderState,
    EventContext, method,
} from '@vtex/api'

import {Clients} from './clients'

import {confirmationCreateOrder} from "./middlewares/confirmation.order";
import {canceledCreateOrder} from "./middlewares/cancelet.order";
import {catalogSlfcUpload} from "./middlewares/catalog.saleforce.upload";
import {someStates} from "./middlewares/order.confirmation.event";
import {refundOrder} from "./middlewares/refundOrder";
import {returnOrder} from "./middlewares/return.orders";
import {getProductRecommendations } from './middlewares/getProductRecommendations';
//add for back-in-stock
import { GetProductDetails, Init, NotifyBackInStock } from './middlewares/backInStock';
import { AppSettings, Product, BackInStockEvent, OrderStatusEvent } from './typing/types'
import { GetSfmcToken } from './middlewares/getSfmcToken'

//const TIMEOUT_MS = 5000;
const TIMEOUT_MS = 20000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
//const memoryCache = new LRUCache<string, any>({max: 5000 , maxAge: 1000 * 60 * 30, stale: true });
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
        VtexApi: {
            memoryCache,
        },
        events: {
            exponentialTimeoutCoefficient: 2,
            exponentialBackoffCoefficient: 2,
            initialBackoffDelay: 10,
            retries: 5,
            timeout: TIMEOUT_MS,
            concurrency: 50,
        }
    },
};

declare global {
    type Context = ServiceContext<Clients, State>

    interface StatusChangeContext extends EventContext<Clients> {
        body: OrderStatusEvent // {
            /*domain: string
            orderId: string
            host: string*/
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
        //}
    }

    interface BackInStockContext extends EventContext<Clients, State> {
        body: BackInStockEvent
    }

    // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
    interface State extends RecorderState {
        settings: AppSettings
        product: Product  
        sfmcToken: string  
        requestId: string    
    }
}

// Export a service that defines route handlers and client options.
export default new Service({
    clients,
    events: {
        someStates,
        backInStock: [Init, GetProductDetails, GetSfmcToken, NotifyBackInStock]
    },
    routes: {
        confirmOrder: method({
            POST: [confirmationCreateOrder]
        }),
        canceledOrder: method({
            POST: [canceledCreateOrder]
        }),
        catalogUpload: method({
            GET: [catalogSlfcUpload]
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
