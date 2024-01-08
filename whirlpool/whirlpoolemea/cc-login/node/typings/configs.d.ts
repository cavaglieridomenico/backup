export interface AppSettings {
  authCookie?: string
  inboundCredentials?: string
  O2P?: SiteInfo
  isCCProject: boolean
  EPP?: SiteInfo
  FF?: SiteInfo
  VIP?: SiteInfo
  llLoggerConstants?: LLLoggerConstants
}

interface LLLoggerConstants {
  signupEvent: string
  loginEvent: string
  resetPasswordEvent: string
  setPasswordEvent: string
  increaseOrderNumberEvent: string
  autologinEvent: string
  patternsToExcludeExport?: string
  vipUserUpdate?: string
}

interface SiteInfo {
  hostname: string
  tradePolicyId: string
  ordersLimitNumber?: number
  ordersLimitDays?: number
  recordsMDName?: string
  invitationToken?: string
  cluster?: string
  checkoutRegistrationEnabled?: boolean
}
