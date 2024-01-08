export interface FillInStandardParamsRes {
  payload: string
  referenceCode: string
}

export interface FillInVisitParamsRes {
  payload: string
  vehicleType: string
}

export enum CustomApp {
  Tradeplace = "tradeplace",
  HDX = "hdx"
}

export interface TradeplaceFields {
  shipTogether?: string // boolean
  tpError?: string // boolean
  connectedGas?: string // boolean
}

export interface HDXFields {
  reservationCode?: string // HDX reservation code
}

export interface RequestPaylod {
  file: string // DM or DT
  data: any[]
}

export enum FileType {
  DM = "DM",
  DT = "DT"
}

export interface DeliverySlot {
  startDateUtc: string
  endDateUtc: string
  lisPrice?: number
  price?: number
  tax?: number
}

export enum ModalType {
  WHITE_GOODS = "WHITE_GOODS",
  FURNITURE = "FURNITURE"
}

export enum HDXFieldsEnum {
  ReservationCode = "reservationCode",
  VehicleType = "vehicleType"
}

export enum TPFieldsEnum {
  ShipTogether = "shipTogether"
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
  ProductSpecifications: SKUProdSPec[]
  ModalType: string
}

export enum ConstructionType {
  BUILTIN = "Built In",
  FREESTANDING = "Free Standing"
}

export enum OrderPlaced {
  TRUE = 1,
  FALSE = 0
}
