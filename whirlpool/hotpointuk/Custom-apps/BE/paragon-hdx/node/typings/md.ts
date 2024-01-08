export interface Pagination {
  page: number
  pageSize: number
}

export interface DMRecord {
  id?: string
  majorPostCode: string
  deliverySunday?: boolean | null
  deliveryMonday?: boolean | null
  deliveryTuesday?: boolean | null
  deliveryWednesday?: boolean | null
  deliveryThursday?: boolean | null
  deliveryFriday?: boolean | null
  deliverySaturday?: boolean | null
  satellite: string
  alternativePostCode?: string | null
  isDepot?: boolean | null
  deliveryZone: string
  deliveryService: string
}

export interface DTRecord {
  id?: string
  timeCalCode: string
  timeCalFixed?: number | null
  timeCalUnitVar?: number | null
  timeCalVolVar?: number | null
  timeCalWeightVar?: number | null
  timeCalRemoveVar?: number | null
  timeCalElecConnVar?: number | null
  timeCalWetConnVar?: number | null
  timeCalOtherConnVar?: number | null
  timeCalOther1?: number | null
  timeCalOther2?: number | null
  timeCalOther3?: number | null
  timeCalType?: string | null
  timeCalZone?: string | null
  timeCalPlant?: string | null
  timeCalShipTo?: string | null
  timeCalDesc?: string | null
}

export interface DCRecord {
  id?: string
  depotName: string
  EOD24h?: string | null
  sameDayEOD?: string | null
  saturdayEOD?: string | null
  sundayEOD?: string | null
  allow24hDelivery?: boolean | null
  allowSameDay?: boolean | null
  allowSaturdayDelivery?: boolean | null
  allowSundayDelivery?: boolean | null
  allowNextDaySaturdayDelivery?: boolean | null
  allowNextDaySundayDelivery?: boolean | null
  workingDayList?: string | null
  hdsForceInSaturdayTrade?: boolean | null
  hdsForceInSundayTrade?: boolean | null
  hdsForceInSaturdayHD?: boolean | null
  hdsForceInSundayHD?: boolean | null
}

export enum DeliveryZone {
  XDEL = "XDEL"
}

export enum DeliveryService {
  CARRIER = "CARRIER"
}

export interface VCRecord {
  orderId: string
  reservationCode: string
}

export interface OTRecord {
  area: string
  stdOffset: number
  adOffset: number
  carrierPCode?: boolean | null
  carrierText?: string | null
}

export interface HTRecord {
  date: string
}
