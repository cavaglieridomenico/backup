import { GSP_ItemSkuSpecs, GSP_ItemSpecs } from "./fareye"

export enum CustomApp {
  Tradeplace = "tradeplace",
  FAREYE = "fareye"
}

export enum OrderStatus {
  orderCreated = "order-created",
  paymentApproved = "payment-approved",
  handling = "handling",
  readyForHandling = "ready-for-handling",
  invoiced = "invoiced",
  cancelled = "canceled"
}
export interface DeliverySlot {
  startDateUtc: string
  endDateUtc: string
  lisPrice?: number
  price?: number
  tax?: number
}
export interface SkuDimensions {
  height: number
  length: number
  width: number
  weight: number
}

export interface SKUProdSPec {
  FieldName: string
  FieldValues: string[]
}

export interface SkuContext {
  Id: number
  ProductId: number
  Dimension: SkuDimensions
  ProductCategoryIds: string
  ProductName: string
  ProductSpecifications: SKUProdSPec[]
  ModalType: string
  ProductRefId: string
  ProductDescription: string
  ReleaseDate: Date
  CategoriesFullPath: string[]
}



export interface TotSkuInfo {
  TotHeight: number
  TotLength: number
  TotWeight: number
  TotWidth: number
  TotQuantity: number
  TotItemValue: number
}

export interface ItemsInfo {
  itemProductInfo: GSP_ItemSpecs[]
  itemSkuInfo: GSP_ItemSkuSpecs[]
}

export interface TimeSlot_ToBeReturned {
  startDateUtc: string
  endDateUtc: string
}


export interface GDS_AvailableSlots {
  date: string
  start: string
  end: string
}
interface GDS_CarrierInfo {
  code: string
  available_slots: GDS_AvailableSlots[]
}
export interface GetDeliverySlots_Response {
  carriers?: GDS_CarrierInfo[]
  available_slots?: any[]
}


export interface ReserveSlot_Response {
  reference_number: string
  slot_token: string
  errors: any[]
}

export interface BookingInfo {
  referenceNumber?: string
  reservationCode: string | null
  carrierCode?: string
  selectedSlot?: string
  firstAvailableSlot?: string
}

export enum ConstructionType {
  BUILTIN = "Built In",
  FREESTANDING = "Free Standing"
}

export interface GPS_Item {
  index: number
  productId: string
  skuId: string
  ean: string
  refId: string
  categoryName: string
  vtexCategoryId: string
  mepCategoryId: string
  constructionType: string
  isGas: boolean
  isSideBySide: boolean
}
export interface GetProductSpec_Response {
  reservationCode: string | null
  items?: GPS_Item[]
}


export interface CheckOrderReservationRes {
  hasReservation: boolean,
  status: string
}
