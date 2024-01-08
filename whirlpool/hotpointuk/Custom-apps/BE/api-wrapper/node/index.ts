//@ts-nocheck

import { ClientsConfig, EventContext, LRUCache, RecorderState, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'
import { Clients } from './clients'
import { AddOptin } from './middlewares/AddOptin'
import { CreateUser } from './middlewares/CreateUser'
import { GetCategory } from './middlewares/GetCategory'
import { GetOrder } from './middlewares/GetOrder'
import { GetProductSpecification } from './middlewares/GetProductSpecification'
import { GetSKU } from './middlewares/GetSku'
import { HasOrders } from './middlewares/HasOrders'
import { GetUserInfo, GetUserInfoByEmail } from './middlewares/GetUserInfo'
import { ProductCategory } from './middlewares/ProductCategory'
import { ProductByRef } from './middlewares/ProductByRef'
import { GetBrands } from './middlewares/GetBrands'
import { UpdateUser } from './middlewares/UpdateUser'
import { productAvailabilityImpl } from './middlewares/DeliveryAvailability'
import { ptvPostalImpl } from './middlewares/PtvImpl'
import { GetAdditionalServicesContents } from './middlewares/GetAdditionalServicesContents'
import { GetOrderShipmentCustomData } from './middlewares/GetOrderShipmentCustomData'
import { isServedZipCode } from './middlewares/IsServedZipCode'
import { productLogos } from './resolvers/ProductLogos'
import { getAppSettings } from './middlewares/GetAppSettings'
import { updateStock } from './middlewares/UpdateStock'
import { AppSettings } from './typings/config'
import { GetPromoBySkuIdV2, getPromoInfoResover } from './middlewares/GetPromoBySkuId'
import { GetOrderHDXCustomData } from './middlewares/GetOrderHDXCustomData'
import { SignUpForCampaign } from './middlewares/signUpForCampaign'
const TIMEOUT_MS = 20000;

const memoryCache = new LRUCache<string, any>({ max: 5000, maxSize: 5000, ttl: 1000 * 60 * 8 });

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
      memoryCache
    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface NewOrder extends EventContext<Clients, State> {
    body: {
      orderId: string
    }
  }

  interface State extends RecorderState {
    appSettings: AppSettings
  }

}

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        productLogos,
        promoInfoBySkuId: getPromoInfoResover

      }
    }
  },
  events: {
    newOrder: [getAppSettings, updateStock]
  },
  routes: {
    getsku: method({
      GET: [GetSKU],
    }),
    getorder: method({
      GET: [GetOrder]
    }),
    getproductspec: method({
      GET: [GetProductSpecification]
    }),
    productbyrefid: method({
      GET: [ProductByRef]
    }),
    getcategory: method({
      GET: [GetCategory]
    }),
    newsletteroptin: method({
      PATCH: [AddOptin]
    }),
    userinfo: method({
      GET: [GetUserInfo]
    }),
    userinfobyemail: method({
      GET: [GetUserInfoByEmail]
    }),
    hasorders: method({
      GET: [HasOrders]
    }),
    productcategory: method({
      GET: [ProductCategory]
    }),
    user: method({
      POST: [CreateUser],
      PATCH: [UpdateUser]
    }),
    getbrands: method({
      GET: [GetBrands]
    }),
    tradeplace: method({
      POST: [productAvailabilityImpl]
    }),
    ptv: method({
      GET: [ptvPostalImpl]
    }),
    isServedZipCode: method({
      GET: [isServedZipCode]
    }),
    additionalServicesContents: method({
      GET: [GetAdditionalServicesContents]
    }),
    getOrderShipmentCustomData: method({
      GET: [GetOrderShipmentCustomData]
    }),
    getOrderHDXCustomData: method({
      GET: [GetOrderHDXCustomData]
    }),
    getPromoInfoBySkuId: method({
      GET: [getAppSettings, GetPromoBySkuIdV2]
    }),
    signUpForCampaign: method({
      POST: [getAppSettings, SignUpForCampaign],
      PATCH: [getAppSettings, SignUpForCampaign]
    }),
  },
})
