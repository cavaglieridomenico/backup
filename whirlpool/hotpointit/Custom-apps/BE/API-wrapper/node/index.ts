//@ts-nocheck
import { ClientsConfig, LRUCache, RecorderState, ServiceContext } from '@vtex/api'
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
import { GetPromotions } from './middlewares/GetPromotions'
import { GetPromoBySkuId } from './middlewares/GetPromoBySkuId'
import { GetSpecificationValues } from './middlewares/GetSpecificationValues'
import { getInvoice } from './middlewares/getInvoice'
import { GetCouponBySkuId } from './middlewares/GetCouponBySkuId'
import { GetCateogryTree } from './middlewares/GetCategoryTree'
import { isServedZipCode } from './middlewares/IsServedZipCode'
import { GetRecipeDetails, GetRecipesList } from './middlewares/GetRecipesInfo'
import { UserOrders } from './middlewares/UserOrders'
import { GetPromoBySkuIdV2 } from './middlewares/GetPromoBySkuId_v2'
import { getHotnCold } from './middlewares/Hot&Cold'
import { GaOrderIsAlreadyPushed, PushOrderId } from './middlewares/GoogleAnalyticsOrders'
import { AppSettings } from './typings/configs'
import { GetAdditionalServicesResolver, GetAdditionalServicesMiddleware } from './middlewares/getProductServices'
import { GetAppSettings } from './middlewares/getAppSettings'
import { getPromoInfoResover } from "./middlewares/GetPromoBySkuId_v2"
import { createMasterChefData } from './middlewares/CreateMasterChefData'
import { MasterChefForm } from './typings/types'
import { SignUpForCampaign } from './middlewares/signUpForCampaign'
const TIMEOUT_MS = 2000

const memoryCache = new LRUCache<string, any>({ max: 500, maxAge: 1000 * 60 * 60, stale: false })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
      memoryCache: memoryCache
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    appSettings: AppSettings,
    masterchefData: MasterChefForm
  }

}

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        additionalServices: GetAdditionalServicesResolver,
        promoInfoBySkuId: getPromoInfoResover
      }
    }
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
    userorders: method({
      GET: [UserOrders]
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
    getpromotions: method({
      GET: [GetPromotions]
    }),
    GetPromoBySkuId: method({
      GET: [GetAppSettings, GetPromoBySkuId]
    }),
    GetPromoBySkuIdV2: method({
      GET: [GetAppSettings, GetPromoBySkuIdV2]
    }),
    getspecvalues: method({
      GET: [GetSpecificationValues]
    }),
    getInvoice: method({
      GET: [getInvoice]
    }),
    GetCouponBySkuId: method({
      GET: [GetAppSettings, GetCouponBySkuId]
    }),
    GetCategoryTree: method({
      GET: [GetCateogryTree]
    }),
    isServedZipCode: method({
      GET: [isServedZipCode]
    }),
    recipesList: method({
      GET: [GetRecipesList]
    }),
    recipeDetail: method({
      GET: [GetRecipeDetails]
    }),
    getHotnCold: method({
      GET: [getHotnCold]
    }),
    gaOrder: method({
      GET: [GaOrderIsAlreadyPushed],
      POST: [PushOrderId]
    }),
    createMasterChefData: method({
      POST: [createMasterChefData]
    }),
    additionalServices: method({
      GET: [GetAdditionalServicesMiddleware]
    }),
    signUpForCampaign: method({
      POST: [GetAppSettings, SignUpForCampaign],
      PATCH: [GetAppSettings, SignUpForCampaign]
    }),
  },
})
