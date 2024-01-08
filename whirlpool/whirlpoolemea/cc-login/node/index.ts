import { ClientsConfig, EventContext, Logger, LRUCache, ServiceContext } from '@vtex/api'
import { method, Service, RecorderState } from '@vtex/api'
import { Clients } from './clients'
import { LoginChecker } from './middlewares/LoginChecker'
import { InitLogin } from './middlewares/InitLogin'
import { ValidateAccountCredentials } from './middlewares/ValidateAccountCredentials'
import { SignupChecker } from './middlewares/SignupChecker'
import { SendAccessCodeByEmail } from './middlewares/SendAccessCodeByEmail'
import { SetAccountPassword } from './middlewares/SetAccountPassword'
import { AdditionalSignUpOperations } from './middlewares/AdditionalSignUpOperations'
import { GetAppSettings } from './middlewares/getAppSettings'
import { UserAuthentication } from './typings/UserAuthentication'
import { CheckHostAndTradePolicy } from './middlewares/CheckHostAndTradePolicy'
import { ReturnCookiesAndUserInfo } from './middlewares/ReturnCookiesAndUserInfo'
import { ResetPswChecker } from './middlewares/ResetPswChecker'
import { SetPasswordChecker } from './middlewares/SetPasswordChecker'
import { TradePolicyInfo } from './typings/TradePolicy'
import { HandleFFActivation } from './middlewares/HandleFFActivation'
import { AppSettings } from './typings/configs'
import { CLRecord, EMRecord, FFRecord, PARecord } from './typings/MasterData'
import { CallCRM } from './middlewares/CallCRM'
import { CRMRecoverPlan } from './middlewares/CRMRecoverPlan'
import { VIPAuthorizationChecker } from './middlewares/VIPAuthorizationChecker'
import { InitVIPAuthorization } from './middlewares/InitVIPAuthorization'
import { IsVIPAuthorizedChecker } from './middlewares/IsVIPAuthorizedChecker'
import { InitVIPSession } from './middlewares/InitVIPSession'
import { LLCustomLog } from './typings/LLCustomLog'
import { InitLoginCustomLogger, InitSignUpCustomLogger, InitResetPasswordCustomLogger, InitSetPasswordCustomLogger, InitAutologinCustomLogger, InitOrderCustomLogger } from './middlewares/InitLLCustomLoggers'
import { IncreaseLoginCounter } from './middlewares/IncreaseLoginCounter'
import { IncreaseUserNumberOfOrders } from './middlewares/IncreaseTotalNumberOfOrders'
import { Order } from './typings/order'
import { CollectOrderPartitions } from './middlewares/CollectOrderPartitions'
import { checkCredentials } from './middlewares/checkCredentials'
import { ExtractFailedRegistrations } from './middlewares/ExtractFailedRegistrations'
import { ExtractCorrectRegistrations } from './middlewares/ExtractCorrectRegistrations'
import { UpdateVipCustomer } from './middlewares/UpdateVipCustomer'

const TIMEOUT_MS = 20 * 1000;

export const memoryCache = new LRUCache<string, any>({ max: 500, maxAge: 1000 * 60 * 10, stale: false })

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

  interface NewOrder extends EventContext<Clients, State> {
    body: {
      orderId: string
    }
  }

  interface State extends RecorderState {
    appSettings: AppSettings
    req?: UserAuthentication
    tradePolicyInfo?: TradePolicyInfo
    employee?: EMRecord // EPP record (used in SignUp only)
    invitation?: FFRecord // FF record
    partner?: PARecord // VIP info,
    vipInvitation?: FFRecord // VIP invitation
    authFlow?: string // sign up or reset password
    cookie?: string[] | string
    userData?: CLRecord
    userId?: string
    userActivationDate?: string
    accountWithoutPassword: boolean
    llLogger: Logger
    llCustomLog?: LLCustomLog
    trustVIP: boolean
    order: Order
  }

}

export default new Service({
  clients,
  events: {
    newOrder: [GetAppSettings, InitOrderCustomLogger, CollectOrderPartitions, IncreaseUserNumberOfOrders, UpdateVipCustomer]
  },
  routes: {
    login: method({
      POST: [GetAppSettings, CheckHostAndTradePolicy, InitLoginCustomLogger, LoginChecker, InitVIPSession, InitLogin, ValidateAccountCredentials, CallCRM, CRMRecoverPlan, HandleFFActivation, IncreaseLoginCounter, ReturnCookiesAndUserInfo]
    }),
    initSignUp: method({
      POST: [GetAppSettings, CheckHostAndTradePolicy, InitSignUpCustomLogger, SignupChecker, InitLogin, SendAccessCodeByEmail]
    }),
    initResetPassword: method({
      POST: [GetAppSettings, CheckHostAndTradePolicy, InitResetPasswordCustomLogger, ResetPswChecker, InitLogin, SendAccessCodeByEmail]
    }),
    setAccountPassword: method({
      POST: [GetAppSettings, CheckHostAndTradePolicy, InitSetPasswordCustomLogger, SetPasswordChecker, InitVIPSession, SetAccountPassword, AdditionalSignUpOperations, CallCRM, CRMRecoverPlan, HandleFFActivation, IncreaseLoginCounter, ReturnCookiesAndUserInfo]
    }),
    authorizeVIP: method({
      POST: [GetAppSettings, CheckHostAndTradePolicy, InitAutologinCustomLogger, VIPAuthorizationChecker, InitVIPAuthorization]
    }),
    isVIPAuthorized: method({
      GET: [GetAppSettings, CheckHostAndTradePolicy, InitAutologinCustomLogger, IsVIPAuthorizedChecker]
    }),
    //backup API
    statistics: method({
      POST: [GetAppSettings, checkCredentials, InitOrderCustomLogger, CollectOrderPartitions, IncreaseUserNumberOfOrders]
    }),
    extractFailedRegistrations: method({
      GET: [GetAppSettings, checkCredentials, ExtractFailedRegistrations]
    }),
    extractCorrectRegistrations: method({
      GET: [GetAppSettings, checkCredentials, ExtractCorrectRegistrations]
    })
  }
})
