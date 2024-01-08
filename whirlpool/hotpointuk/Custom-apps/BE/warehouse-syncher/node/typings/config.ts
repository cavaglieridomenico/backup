export interface SAPPOSettings {
  environment: string
  password: string
  sid: string
  notificationThreshold: number
  enableNotification: boolean
}

export interface Categories {
  keyword: string
  id: string
}

export interface StockAvailability {
  salesChannel: string
  specificationName: string
  specificationValue: string
}

export interface MPSettings {
  accountName: string
  username: string
  psw: string
  realm: string
  hashAlgorithm: string
  enableNotification: boolean
}

export interface VtexSettings {
  isMP: boolean
  switchWarehouse: boolean
  allowedCredentials: string
  categories: Categories[]
  inStockWarehouse: string
  outOfStockWarehouse: string
  shippingPolicyInStockMDA: string
  resDefaultZipCode: string
  resDefaultCountry: string
  resExpiration: string
  stockAvailability: StockAvailability[]
  mp: MPSettings
}

export interface AppSettings {
  sappo: SAPPOSettings
  vtex: VtexSettings
}
