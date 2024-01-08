//@ts-nocheck

import { ClientsConfig, LRUCache, Service, ServiceContext, RecorderState, EventContext, method } from '@vtex/api'
import { Clients } from './clients'
import { getProduct } from "./middlewares/getProduct";
import { getProductRecommendations } from './middlewares/getProductRecommendations';
import { checkVtexCredentials } from './middlewares/checkCredentials';
import { getAppSettings } from './middlewares/getAppSettings';
import { getOrderAdditionalData } from './middlewares/getOrderAdditionalData';
import { getOrderData } from './middlewares/getOrderData';
import { getAccessToken } from './middlewares/getAccessToken';
import { sendOrderDetails } from './middlewares/sendOrderDetails';
import { triggerConfirmationEmail } from './middlewares/triggerConfirmationEmail';
import { triggerCancellationEmail } from './middlewares/triggerCancellationEmail';
import { checkRefOrRetRequestPayload } from './middlewares/checkRefOrRetRequestPayload';
import { checkRefOrRetReqValidity } from './middlewares/checkRefOrRetReqValidity';
import { triggerRefundEmail } from './middlewares/triggerRefundEmail';
import { DGRecord, UserInfo, Product , BroadcasterNotificationEvent} from './typings/types';
import { sendWelcomeEmail } from './middlewares/sendWelcomeEmail';
import { sendInvitationEmail } from './middlewares/sendInvitationEmail';
import { triggerReturnEmail } from './middlewares/triggerReturnEmail';
import { AppSettings, SFMCSettings } from './typings/config';
import { InitDPAlert , GetProductDetailsSKU , NotifyDPAlert , UpdateSubscriptionsDPAlert } from './middlewares/sendDropPriceAlert';
import { GetProductDetailsREF , NotifyDPExpire , UpdateSubscriptionsExpireAlert } from './middlewares/sendDropPriceExpire';
import { Subscription, SubscriptionPayload } from './typings/DropPriceSubscription'
import { Authentication } from './middlewares/Authentication'

const TIMEOUT_MS = 30000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({max: 5000, maxSize: 5000, ttl: 1000*60*8});
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
      SearchGraphQL:{
        retries: 5,
        timeout: TIMEOUT_MS
      },
      // This key will be merged with the default options and add this cache to our Status client.
      status: {
          memoryCache,
      },
  },
};

declare global {
  type Context = ServiceContext<Clients, State>

  interface StatusChangeContext extends EventContext<Clients, State> {
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

  interface Invitation extends EventContext<Clients, State> {
    body: {
      invitingUser: string,
      invitedUser: string,
      expirationDate: string,
      activationDate?: string
      eventId: string
    }
  }

  interface DropPriceAlertContext extends EventContext<Clients, State> {
    body: BroadcasterNotificationEvent
  }


  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    appSettings: AppSettings,
    orderData?: Object,
    distinctSkus?: any[],
    skuContexts?: Object[],
    //sellerSkuContexts?: Object[],
    userInfo?: UserInfo,
    coupons?: string[],
    premiumProducts?: any[],
    skuImages?: Object[],
    ecofeeTotal?: number,
    accessToken?: string,
    sfmcData?: SFMCSettings,
    reqPayload?: Object,
    dngLinks?: DGRecord[],
    product: Product,
    requestId: string,
    skuID: string,
    dpEmailUser: string,
    NotificationsToSend: Subscription[]
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    newOrder: [getAppSettings, getOrderData, getOrderAdditionalData, getAccessToken, sendOrderDetails, triggerConfirmationEmail],
    newInvitation: [getAppSettings, getAccessToken, sendInvitationEmail],
    invitationAccepted: [getAppSettings, getAccessToken, sendWelcomeEmail],
    dropPriceAlert: [getAppSettings, getAccessToken, InitDPAlert, GetProductDetailsSKU , NotifyDPAlert , UpdateSubscriptionsDPAlert]
  },
  routes: {
    createOrder: method({
        POST: [getAppSettings, checkVtexCredentials, getOrderData, getOrderAdditionalData, getAccessToken, sendOrderDetails, triggerConfirmationEmail]
    }),
    cancelOrder: method({
        POST: [getAppSettings, checkVtexCredentials, getOrderData, getAccessToken, triggerCancellationEmail]
    }),
    getProduct: method({
        GET: [getAppSettings, checkVtexCredentials, getProduct]
    }),
    refundOrder: method({
        POST: [getAppSettings, checkRefOrRetRequestPayload, checkRefOrRetReqValidity, getAccessToken, triggerRefundEmail]
    }),
    returnOrder: method({
        POST: [getAppSettings, hasReturnFlow, checkRefOrRetRequestPayload, checkRefOrRetReqValidity, getAccessToken, triggerReturnEmail]
    }),
    getProductRecommendations: method({
      GET: [getAppSettings, getProductRecommendations]
    }),
    dropPriceExpire: method({
      POST: [Authentication , getAppSettings, getAccessToken, GetProductDetailsREF , NotifyDPExpire , UpdateSubscriptionsExpireAlert]
  })
  }
})

async function hasReturnFlow(ctx: Context, next: () => Promise<any>){
  if(ctx.state.appSettings.vtex.mpHasReturn){
    await next()
  }else{
    ctx.status = 404;
    ctx.body = "Resource Not Found";
  }
}
