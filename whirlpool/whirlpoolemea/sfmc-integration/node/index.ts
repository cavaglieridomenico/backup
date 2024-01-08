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
import { triggerRefundEmail } from './middlewares/triggerRefundEmail';
import { BroadcasterNotificationEvent, DGRecord, DropPriceReq, SpAccDetails, UserInfo, ProductSearchGQL } from './typings/types';
import { sendWelcomeEmail } from './middlewares/sendWelcomeEmail';
import { sendInvitationEmail } from './middlewares/sendInvitationEmail';
import { triggerReturnEmail } from './middlewares/triggerReturnEmail';
import { AppSettings, SFMCSettings } from './typings/config';
import { checkNewOrderEvent } from './middlewares/checkNewOrderEvent';
import { GetProductTranslationRes } from './typings/translations';
import { sendCategoryAdviceEmail } from './middlewares/sendCategoryAdviceEmail';
import { productsComparisonEmail } from './middlewares/productsComparisonEmail';
import { GetProductDetails, Init, NotifyBackInStock } from './middlewares/backInStock';
import { checkBlackList } from './middlewares/checkBlackList';
import { Order } from './typings/order';
import { collectOrderPartitions } from './middlewares/collectOrderPartitions';
import { GetProductDetailsREF, NotifyDPExpire, UpdateSubscriptionsExpireAlert } from './middlewares/sendDropPriceExpire';
import { GetProductDetailsSKU, InitDPAlert, NotifyDPAlert, UpdateSubscriptionsDPAlert } from './middlewares/sendDropPriceAlert';
import { hasDropPrice_Service, hasRefundFlow, hasReturnFlow, hasCategoryAdvise, hasProdComparison, hasBackInStock, hasDropPriceUnsubscribe_Service } from './middlewares/countryServiceSelection';
import { redirectProductComparisonRequest } from './middlewares/redirectProductComparisonReq';
import { CustomLogger } from './utils/Logger';
import { initLogger } from './middlewares/initLogger';
import { unsubscriptionDPA } from './middlewares/priceDropAlertUnsubscription';

const TIMEOUT_MS = 30 * 1000;

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

  interface StatusChangeContext extends EventContext<Clients, State> {
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

  interface Invitation extends EventContext<Clients, State> {
    body: {
      invitingUser: string
      invitedUser: string
      expirationDate: string
      activationDate?: string
      cluster?: string
      accessCode?: string
      locale?: string
      eventId: string
    }
  }

  interface BackInStockContext extends EventContext<Clients, State> {
    body: {
      refId: string
      isOutOfStock: boolean
      emails: string[]
      eventId: string
      cluster: string
    }
  }

  interface DropPriceAlertContext extends EventContext<Clients, State> {
    body: BroadcasterNotificationEvent
  }


  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    spare_accDetails: SpAccDetails
    dropPriceRequirements?: DropPriceReq
    orderId: string
    appSettings: AppSettings
    orderData: Order
    distinctSkus?: any[]
    skuContexts?: any[]
    userInfo?: UserInfo
    coupons?: string[]
    premiumProducts?: any[]
    skuImages?: any[]
    ecofeeTotal?: number
    accessToken?: string
    sfmcData?: SFMCSettings
    reqPayload?: any
    dngLinks?: DGRecord[]
    locale?: string
    productSearchGQL: ProductSearchGQL
    requestId?: string
    product?: {
      tradePolicy?: string
      skuContext?: any
      price?: any
      marketPrice?: any
      stock?: any
      sellable?: any
      hasPrice?: boolean
      hasImages?: boolean
      imageUrl?: any
      productInfoSheet?: any
      energyLogo?: any
      constructionType?: any
      accessoryType?: any
      commCode?: any
      IFU?: any
      discount?: number | string
      xsellAss?: any[]
      upsellAss?: any[]
      accessoryAss?: any[]
      productInfo?: any
      category?: any,
      translations?: { locale: string, response: GetProductTranslationRes }[],
    },
    productComparisonReq: any
    logger: CustomLogger

  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  events: {
    newOrder: [initLogger, getAppSettings, checkNewOrderEvent, checkBlackList, collectOrderPartitions, getOrderData, getOrderAdditionalData, getAccessToken, sendOrderDetails, triggerConfirmationEmail, hasDropPriceUnsubscribe_Service, unsubscriptionDPA],
    newInvitation: [initLogger, getAppSettings, getAccessToken, sendInvitationEmail],
    invitationAccepted: [initLogger, getAppSettings, getAccessToken, sendWelcomeEmail],
    backInStock: [initLogger, getAppSettings, hasBackInStock, getAccessToken, Init, GetProductDetails, NotifyBackInStock],
    dropPriceAlert: [initLogger, getAppSettings, hasDropPrice_Service, getAccessToken, InitDPAlert, GetProductDetailsSKU, NotifyDPAlert, UpdateSubscriptionsDPAlert]
  },
  routes: {
    //backup API
    createOrder: method({
      POST: [initLogger, getAppSettings, checkVtexCredentials, checkBlackList, collectOrderPartitions, getOrderData, getOrderAdditionalData, getAccessToken, sendOrderDetails, triggerConfirmationEmail, hasDropPriceUnsubscribe_Service, unsubscriptionDPA]
    }),
    cancelOrder: method({
      POST: [initLogger, getAppSettings, checkVtexCredentials, checkBlackList, collectOrderPartitions, getOrderData, getAccessToken, triggerCancellationEmail]
    }),
    getProduct: method({
      GET: [initLogger, getAppSettings, checkVtexCredentials, getProduct]
    }),
    refundOrder: method({
      POST: [initLogger, getAppSettings, hasRefundFlow, checkRefOrRetRequestPayload, getAccessToken, triggerRefundEmail]
    }),
    returnOrder: method({
      POST: [initLogger, getAppSettings, hasReturnFlow, checkRefOrRetRequestPayload, getAccessToken, triggerReturnEmail]
    }),
    getProductRecommendations: method({
      GET: [initLogger, getAppSettings, getProductRecommendations]
    }),
    categoryAdvice: method({
      POST: [initLogger, getAppSettings, hasCategoryAdvise, getAccessToken, sendCategoryAdviceEmail]
    }),
    productsComparisonEmail: method({
      POST: [initLogger, getAppSettings, hasProdComparison, redirectProductComparisonRequest, productsComparisonEmail],
    }),
    dropPriceExpire: method({
      POST: [initLogger, getAppSettings, hasDropPrice_Service, checkVtexCredentials, getAccessToken, GetProductDetailsREF, NotifyDPExpire, UpdateSubscriptionsExpireAlert]
    })
  }
})



