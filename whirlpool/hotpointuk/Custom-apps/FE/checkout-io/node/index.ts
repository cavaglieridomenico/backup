import './globals'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import {
  errorHandler,
  addItem,
  orders,
  cancelOrder,
  setOrderFormCustomData,
  updateItems,
  updateOrderFormIgnoreProfile,
  updateOrderFormPayment,
  updateOrderFormProfile,
  updateOrderFormShipping,
  getProfile,
  getAddress,
  simulation,
  updateOrderFormMarketingData,
  updateOrderFormClientPreferencesData,
  updateOrderFormCheckin,
  orderForm,
  orderFormRaw,
  newOrderForm,
  changeToAnonymousUser,
  ping,
} from './middlewares'
import { schemaDirectives } from './directives'
import { getPing } from './utils/ping'
import { checkItemStock } from './middlewares/checkItemStock'
import { retrieveCookie } from './middlewares/retrieveCookie'
import { resolvers } from './resolvers'

const THIRTY_SECONDS_MS = 30 * 1000

// Segments are small and immutable.
const MAX_SEGMENT_CACHE = 10000
const segmentCache = new LRUCache<string, any>({ max: MAX_SEGMENT_CACHE })
const catalogCache = new LRUCache<string, any>({ max: 3000 })
const messagesCache = new LRUCache<string, any>({ max: 3000 })

metrics.trackCache('segment', segmentCache)
metrics.trackCache('catalog', catalogCache)
metrics.trackCache('messages', messagesCache)

/**
 * Unhealthy Service Workaround
 * @description We want to keep the service
 * healthy/alive/awake by not letting the TTL
 * expire. So we ping our own route every
 * interval
 * */
const keepAlive = true

if (keepAlive) {
  setInterval(async () => {
    await getPing()
  }, 300000)
}

export default new Service({
  clients: {
    implementation: Clients,
    options: {
      paymentClient: {
        concurrency: 10,
        timeout: THIRTY_SECONDS_MS,
      },
      vtexAPI: {
        timeout: THIRTY_SECONDS_MS,
      }
    },
  },
  graphql: {
    resolvers: resolvers,
    schemaDirectives,
  },
  routes: {
    ping: [ping],
    addItem: method({
      POST: [errorHandler, retrieveCookie, addItem],
    }),
    cancelOrder: method({
      POST: [errorHandler, cancelOrder],
    }),
    setOrderFormCustomData: method({
      PUT: [errorHandler, retrieveCookie, setOrderFormCustomData],
    }),
    updateItems: method({
      POST: [errorHandler, retrieveCookie, updateItems],
    }),
    updateOrderFormIgnoreProfile: method({
      PATCH: [errorHandler, retrieveCookie, updateOrderFormIgnoreProfile],
    }),
    updateOrderFormPayment: method({
      POST: [errorHandler, retrieveCookie, updateOrderFormPayment],
    }),
    profile: method({
      GET: [errorHandler, retrieveCookie, getProfile],
      POST: [errorHandler, retrieveCookie, updateOrderFormProfile],
    }),
    updateOrderFormShipping: method({
      POST: [errorHandler, retrieveCookie, updateOrderFormShipping],
    }),
    orders: method({
      GET: [errorHandler, orders],
    }),
    address: method({
      GET: [errorHandler, getAddress],
    }),
    simulation: method({
      POST: [errorHandler, retrieveCookie, simulation],
    }),
    checkItemStock: method({
      POST: [errorHandler, retrieveCookie, checkItemStock],
    }),
    updateOrderFormMarketingData: method({
      POST: [errorHandler, retrieveCookie, updateOrderFormMarketingData],
    }),
    updateOrderFormClientPreferencesData: method({
      POST: [errorHandler, retrieveCookie, updateOrderFormClientPreferencesData],
    }),
    updateOrderFormCheckin: method({
      POST: [errorHandler, retrieveCookie, updateOrderFormCheckin],
    }),
    orderForm: method({
      POST: [errorHandler, retrieveCookie, orderForm],
    }),
    orderFormRaw: method({
      POST: [errorHandler, retrieveCookie, orderFormRaw],
    }),
    newOrderForm: method({
      POST: [errorHandler, retrieveCookie, newOrderForm],
    }),
    changeToAnonymousUser: method({
      POST: [errorHandler, changeToAnonymousUser],
    }),
  },
})
