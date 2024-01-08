import { CLRecord, EMRecord, FFRecord, PARecord } from "./MasterData";
import { TradePolicyInfo } from "./TradePolicy";

export interface UserAuthentication {
  email?: string
  password?: string
  id?: string // clock number or HR number
  name?: string
  surname?: string
  optin?: boolean
  tradePolicy: string
  accessCode?: string // partner access code
  locale?: string
  accessKey?: string  // key received by email in the authentication flow
  companyPassword?: string
}

export enum AuthHash {
  SIGNUP = "05c2d7b8821fb061c3a6030db05cd530a6606aa55dd203d81d2e60c9ef6274a0",
  RESETPSW = "fa91ad6ceb772c35200b21c7f884480d3aabd1bed848afb70fbba5ad9b6a5323"
}

export interface AucsmCookie {
  req: UserAuthentication
  hostname: string
  tradePolicyInfo: TradePolicyInfo
  employee?: EMRecord
  partner?: PARecord // partner access code
  vipInvitation?: FFRecord // VIP invitation info
  invitation?: FFRecord
  authFlow: string // signup or reset password
  userData?: CLRecord
  accountWithoutPassword: boolean
  vss: string // _vss value
}

export interface CookieObj {
  name?: string
  value?: string
  expiration?: Date
  domain?: string
  path?: string
  secure?: boolean
  samesite?: string | boolean
  httponly?: boolean
}
