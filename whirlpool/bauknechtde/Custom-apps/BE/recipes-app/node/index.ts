//@ts-nocheck
import { ClientsConfig, LRUCache, ServiceContext } from '@vtex/api'
import { method, Service, RecorderState } from '@vtex/api'
import { GetRecipeDetails, GetRecipesList } from './middlewares/GetRecipesInfo'
import { Clients } from './clients'

const TIMEOUT_MS = 5000

const memoryCache = new LRUCache<string, any>({ max: 500, maxAge: 1000 * 60 * 10, stale: false })

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
    req?: UserAuthentication,
    tradePolicyInfo?: TradePolicyInfo,
    isTestEnv?: boolean,
    invitation?: FFRecord, // FF record
    partner?: PARecord, // VIP info,
    authFlow?: string, // sign up or reset password
    cookie?: string[] | string,
    userData?: CLRecord,
    userId?: string,
    accountWithoutPassword: boolean
  }

}

export default new Service({
  clients,
  routes: {
    recipesList: method({
      GET: [GetRecipesList]
    }),
    recipeDetail: method({
      GET: [GetRecipeDetails]
    })
  },
})
