export interface ASRecord {
  id?: string
  email?: string
  name?: string | null
  surname?: string | null
  skuId?: string | null
  skuRefId?: string
  commercialCode?: string | null
  productUrl?: string | null
  productImageUrl?: string | null
  optin?: boolean | null
  campaign?: string | null
  tradePolicy?: string | null
  locale?: string | null
  createdAt?: string | null
  notificationSend?: string | null
  sendAt?: string | null
  host?: string | null // field used for tests in Vtex domain, so not stored on MD
}

export interface CLRecord {
  id?: string
  email: string
  userType: string | null
  isNewsletterOptIn: boolean | null
}

export enum UserType {
  O2P = "O2P",
  EPP = "EPP",
  FF = "FF",
  VIP = "VIP"
}
