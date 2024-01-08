import {
    ClientsConfig,
    LRUCache,
    Service,
    ServiceContext,
    RecorderState,
    EventContext, method,
} from '@vtex/api'

import { Clients } from './clients'
import { cancellationOrder } from './middlewares/cancellationOrder';
import { confirmationOrder } from './middlewares/confirmationOrder';
import { orderConfirmationEvent, orderCancellationEvent, backInStockEvent } from './middlewares/events';
import {backInStock} from "./middlewares/backInStock";


const TIMEOUT_MS = 10000;

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
            domain: string
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
        orderConfirmationEvent,
        orderCancellationEvent,
        backInStockEvent
    },
    routes: {
        confirmOrder: method({
            POST: [confirmationOrder]
        }),
        cancelOrder: method({
            POST: [cancellationOrder]
        }),
        backInStock: method({
            POST: [backInStock]
        })
    }
})