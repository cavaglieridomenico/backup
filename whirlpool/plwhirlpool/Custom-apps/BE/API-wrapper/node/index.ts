import { ClientsConfig, LRUCache, ServiceContext } from '@vtex/api'
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
import { getInvoices } from './middlewares/getInvoices'
import { GetCouponBySkuId } from './middlewares/GetCouponBySkuId'
import { GetCateogryTree } from './middlewares/GetCategoryTree'
import { isServedZipCode } from './middlewares/IsServedZipCode'
import { signUpForBlackFriday } from './middlewares/signUpForBlackFriday'
import { GetAdditionServiceByCategoryId } from './middlewares/GetAdditionalServiceInfo'
import { orderHasFgas } from './middlewares/orderHasFgas'
import { GetRecipeDetails, GetRecipesList } from './middlewares/GetRecipesInfo'
import { UserOrders } from './middlewares/UserOrders'
import { getHotnCold } from './middlewares/HotandCold'
//import { SFMCRecommend } from './middlewares/SFMCRecommendations'

const TIMEOUT_MS = 2000

const memoryCache = new LRUCache<string, any>({ max: 500, maxAge: 1000 * 60 * 15, stale: false })

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
  type Context = ServiceContext<Clients>

}

export default new Service({
  clients,
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
    /*sfmcrecommend: method({
      GET: [SFMCRecommend]
    })*/
    getbrands: method({
      GET: [GetBrands]
    }),
    getpromotions: method({
      GET: [GetPromotions]
    }),
    GetPromoBySkuId: method({
      GET: [GetPromoBySkuId]
    }),
    getspecvalues: method({
      GET: [GetSpecificationValues]
    }),
    getInvoice: method({
      GET: [getInvoice]
    }),
    getInvoices: method({
      GET: [getInvoices]
    }),
    GetCouponBySkuId: method({
      GET: [GetCouponBySkuId]
    }),
    GetCategoryTree: method({
      GET: [GetCateogryTree]
    }),
    isServedZipCode: method({
      GET: [isServedZipCode]
    }),
    signUpForBlackFriday: method({
      POST: [signUpForBlackFriday]
    }),
    additionalServicesInfo: method({
      GET: [GetAdditionServiceByCategoryId]
    }),
    orderHasFgas: method({
      GET: [orderHasFgas]
    }),
    recipesList: method({
      GET: [GetRecipesList]
    }),
    recipeDetail: method({
      GET: [GetRecipeDetails]
    }),
    getHotnCold: method({
      GET: [getHotnCold]
    })
  },
})
