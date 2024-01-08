export interface SAPPOSettings {
  environment: string
  password: string
}

export interface HDXSettings {
  userId: string
  password: string
  systemID: string
  clientNum: string
  isoLanguageCode: string
  isoCountryCode: string
  isoCurrencyCode: string
  visitNumDays: string
  visitTimeSlotGroupNum: string
  visitTimeSlotNum: string
  visitReleasedInd: string
}

export interface DeliveryEntity {
  mdName: string
  mainRecordId?: string
  defaultEOD?: string
}

export interface CategoryMap {
  ids: string
  keyword: string
}

export interface AdditionalServiceData {
  tradePolicyId: string
  installationId: string
  collectScrapId: string
}

export interface VtexSettings {
  enabledAPICredentials: string
  deliveryMatrix: DeliveryEntity
  deliveryTimeCalc: DeliveryEntity
  depotConfiguration: DeliveryEntity
  reservationTable: DeliveryEntity
  offsetTable: DeliveryEntity
  holidayTable: DeliveryEntity
  inStockShippingPolicy: string
  additionalServicesData: AdditionalServiceData[]
  categoriesMap: CategoryMap[]
  productsWithoutSlots: string
}

export interface AppSettings {
  sappo: SAPPOSettings
  hdx: HDXSettings
  vtex: VtexSettings
}
