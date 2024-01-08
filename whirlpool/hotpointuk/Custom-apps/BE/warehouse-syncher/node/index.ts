import {
  ClientsConfig,
  LRUCache,
  Service,
  ServiceContext,
  RecorderState,
  EventContext,
  method,
} from '@vtex/api';

import { AppSettings } from './typings/config';
import { Clients } from './clients';
import { getAppSettings } from './middlewares/getAppSettings';
import { authenticate } from './middlewares/authenticate';
import { StockInfo } from './typings/sap-po';
import { Order } from './typings/order';
import { switchWarehouse } from './middlewares/switchWarehouse';
import { sendNotificationtoMP } from './middlewares/sendNotificationToMP';
import { sendNotificationToCNET } from './middlewares/sendNotificationToCNET';
import { checkCNETPayload } from './middlewares/checkCNETPayload';
import { retrieveStockInfoByOrderId } from './middlewares/retrieveStockInfoByOrderId';
import { updateStockSpecByRefIds } from './middlewares/updateStockSpecByRefIds';
import { syncStockAndReservations } from './middlewares/syncStockAndReservations';
import { SkuData } from './typings/stock';
import { checkOrderEvent } from './middlewares/checkOrderEvent';
import { isMP, isNotMP } from './middlewares/checkAccountType';

const TIMEOUT_MS = 20 * 1000;
const memoryCache = new LRUCache<string, any>({ max: 5000, maxSize: 5000, ttl: 1000 * 60 * 8 });
metrics.trackCache('status', memoryCache);

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 5,
      timeout: TIMEOUT_MS,
      memoryCache
    },
    status: {
      memoryCache
    },
  },
};

declare global {
  type Context = ServiceContext<Clients, State>

  interface OrderEvent extends EventContext<Clients, State> {
    body: {
      orderId: string,
      currentState: string
    }
  }

  interface State extends RecorderState {
    appSettings: AppSettings,
    reqPayload: StockInfo[],
    order: Order,
    skus: SkuData[]
  }
}

export default new Service({
  clients,
  events: {
    newOrder: [getAppSettings, isNotMP, checkOrderEvent, retrieveStockInfoByOrderId, sendNotificationToCNET, switchWarehouse, sendNotificationtoMP]
  },
  routes: {
    sync: method({
      POST: [getAppSettings, authenticate, isNotMP, checkCNETPayload, syncStockAndReservations, sendNotificationToCNET, switchWarehouse, sendNotificationtoMP],
    }),
    notify: method({
      POST: [getAppSettings, authenticate, isMP, updateStockSpecByRefIds],
    }),
    //backup API for tests on orders
    manualSync: method({
      POST: [getAppSettings, authenticate, isNotMP, retrieveStockInfoByOrderId, sendNotificationToCNET, switchWarehouse, sendNotificationtoMP],
    }),
  }
})

