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
import {productBack} from "./middlewares/product.back";
import {productTerminate} from "./middlewares/product.terminate";
import {catalogSlfcUpload} from "./middlewares/catalog.saleforce.upload";
import {allStates, someStates} from "./middlewares/order.confirmation.event";


const TIMEOUT_MS = 800;

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
            retries: 3,
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

    interface StatusChangeContext extends EventContext<Clients> {
        body: {
            // domain: string
            orderId: string
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
    }
}

// Export a service that defines route handlers and client options.
export default new Service({
    clients,
    events: {
        allStates,
        someStates,
    },
    routes: {
        confirmOrder: method({
            POST: [confirmationCreateOrder]
        }),
        canceledOrder: method({
            POST: [canceledCreateOrder]
        }),
        productBack: method({
            POST: [productBack]
        }),
        productTerminate: method({
            POST: [productTerminate]
        }),
        catalogUpload: method({
            POST: [catalogSlfcUpload]
        }),
    }
})
