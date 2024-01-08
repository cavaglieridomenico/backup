export interface AppSettings {
  vtex: VtexSettings
  o2p?: SFMCSettings
  epp?: SFMCSettings
  ff?: SFMCSettings
  vip?: SFMCSettings
  gcp?: GCPSettings
}

export interface AddServGeneralInfo {
  serviceIds: string
  serviceName: Translation[]
}

export interface AddServSpecificInfoPerTP {
  salesChannelId: string
  serviceIds: string
  installation?: string
  fiveYearsWarranty?: string
  legalWarranty?: string
  extendedWarranty?: string
}

export interface AdditionalServices {
  generalInfo: AddServGeneralInfo[]
  infoPerSalesChannel: AddServSpecificInfoPerTP[]
  serviceInTotals: boolean
}

export interface Specifications {
  productDataSheet: string[]
}

export interface PremiumProducts {
  specification: string
  sourceCampaign: string
  couponPrefix: string
}

export interface SellerAccount {
  name: string
  sellerIds: string
  apiKey: string
  apiToken: string
}

export interface Translation {
  key?: string
  value?: string
  alternateValue?: string
}

export interface DnGSettings {
  hasDnG: boolean
  mdName?: string
  redirectUrl?: string
}
export interface ShippingInfo {
  hdx?: boolean
  inStockSP?: string
  inStockW?: string
  outOfStockSP?: string
  outOfStockW?: string
  labelForFreeDelivery?: Translation[]
  deliveryServiceId?: string,
  noReservationDeliveryLable?: string,
  checkReservationForCustomDeliveryLable?: boolean
}

export interface DropPriceSettings {
  hasPriceDrop: boolean
  hasPriceDropUnsubscribe: boolean
  dropPriceAlertKey: string
  dropPriceExpireKey: string
}

export interface VtexSettings {
  multilanguage: boolean
  localeList?: string
  additionalServices: AdditionalServices
  specifications: Specifications
  premiumProducts?: PremiumProducts
  productInfoSheet?: string
  translations: Translation[]
  addressPattern: string
  defaultCountry?: string
  defaultLocale2C: string
  defaultLocale5C: string
  phoneMaxLength: number
  mpOrderBlackList?: string
  mpHasReturn: boolean
  mpHasRefund: boolean
  mpHasCategoryAdvice: boolean
  mpHasProdComparison: boolean
  mpHasBackInStock: boolean
  checkoutAsGuest: boolean
  checkZipCodes: boolean
  eventNewOrder: string
  paymentPerTransactionId?: string
  mpAppKey: string
  mpAppToken: string
  mpAuthCookie: string
  allowedInBoundCredentials: string
  isCCProject: boolean
  isMarketplace: boolean
  sellerAccount?: SellerAccount
  dngSettings?: DnGSettings
  shippingInfo?: ShippingInfo
}

export interface SFMCSettings {
  hostname: string
  tradePolicyId: string
  clientId: string
  clientSecret: string
  mid: string
  pathParam: string
  orderDetailsKey: Translation[]
  confirmationEmailKey: Translation[]
  cancellationEmailKey: Translation[]
  returnEmailKey: Translation[]
  refundEmailKey: Translation[]
  friendInvitationKey?: Translation[]
  friendConfirmationKey?: Translation[]
  categoryAdviceKey?: Translation[]
  productsComparisonTemplate?: ProductsComparisonTemp
  outOfStockKey?: Translation[]
  backInStockKey?: Translation[]
  dropPrice?: DropPriceSettings
}

export interface GCPSettings {
  gcpCountryParams?: string
  gcpBrandParams?: string
  gcpHost?: string
  gcpProjectId?: string
  gcpClientEmail?: string
  gcpPrivateKey?: string
  gcpTargetAudience?: string
  redirectToWS?: boolean
  wsName?: string
}


export interface ProductsComparisonTemp {
  imgSource: Translation[]
  imgLogoWidth: string
  h1: Translation[]
  langHtml: Translation[]
  currencySimbol: string
  specGroupRowColor: string
  specGroupFontColor: string
  showPricesInProductComparison: boolean
  showEnergyLogoInProductComparison: boolean
}
