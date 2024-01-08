export interface AppSettings {
  vtex: VtexSettings,
  o2p?: SFMCSettings
  epp?: SFMCSettings,
  ff?: SFMCSettings,
  vip?: SFMCSettings

}

export interface AddServGeneralInfo {
  serviceIds: string,
  serviceName: string
}

export interface AddServSpecificInfoPerTP {
  salesChannelId: string,
  serviceIds: string,
  installation?: string,
  fiveYearsWarranty?: string,
  legalWarranty?: string,
  extendedWarranty?: string
}

export interface AdditionalServices {
  generalInfo: AddServGeneralInfo [],
  infoPerSalesChannel: AddServSpecificInfoPerTP[]
}
export interface PremiumProducts {
  specification: string,
  sourceCampaign: string,
  couponPrefix: string
}

export interface SellerAccount {
  name: string,
  apiKey: string,
  apiToken: string
}

export interface Translation {
  key: string,
  value: string
}

export interface DnGSettings {
  hasDnG: boolean,
  mdName?: string,
  redirectUrl?: string
}

export interface VtexSettings {
  additionalServices?: AdditionalServices,
  premiumProducts?: PremiumProducts,
  translations?: Translation[],
  defaultCountry?: string,
  defaultLocale2C: string,
  defaultLocale5C: string,
  phoneMaxLength: number,
  mpOrderBlackList?: string,
  mpHasReturn: boolean,
  retRefIntegrityCheck: boolean, // retRefIntegrityCheck <=> !checkoutAsGuest
  checkoutAsGuest: boolean, // checkoutAsGuest <=> !retRefIntegrityCheck && !isCCProject
  checkZipCodes: boolean,
  paymentPerTransactionId: string,
  mpAppKey: string,
  mpAppToken: string,
  mpAuthCookie: string,
  allowedInBoundCredentials: string,
  isCCProject: boolean, // isCCProject <=> retRefIntegrityCheck && !checkoutAsGuest
  sellerAccount?: SellerAccount,
  dngSettings?: DnGSettings
}

export interface SFMCSettings {
  hostname: string,
  tradePolicyId: string,
  clientId: string,
  clientSecret: string,
  mid: string,
  pathParam: string,
  orderDetailsKey: string,
  confirmationEmailKey: string,
  cancellationEmailKey: string,
  returnEmailKey: string,
  refundEmailKey: string,
  friendInvitationKey?: string,
  friendConfirmationKey?: string,  
  dropPriceAlertKey: string,
  dropPriceExpireKey: string,
  appkey: string,
  apptoken: string
}

