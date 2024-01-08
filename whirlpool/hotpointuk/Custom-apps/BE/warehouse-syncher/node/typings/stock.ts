export interface StockBalance {
  warehouseId: string
  warehouseName: string
  totalQuantity: number
  reservedQuantity: number
  hasUnlimitedQuantity: boolean
}

export interface Stock {
  skuId: string
  balance: StockBalance[]
}

export interface StockWithDispatchedReservations {
  skuId: string
  warehouseId: string
  quantity: number
  isUnlimitedQuantity: boolean
  totalReservedQuantity: number
  dispatchedReservationsQuantity: number
  availableQuantity: number
}

export interface UpdateStockReq {
  unlimitedQuantity?: boolean
  quantity?: number
}

export interface StockReservation {
  LockId: string // reservation id
  ItemId: string
  Quantity: number
  SalesChannel: string
  ReservationDateUtc: string
  MaximumConfirmationDateUtc: string
  ConfirmedDateUtc: string
  Status: string
  DateUtcAcknowledgedOnBalanceSystem: string
  InternalStatus: string
}

export interface StockReservations {
  items: StockReservation[]
  paging: {
    page: number
    perPage: number
    total: number
    pages: number
  }
}

export interface StockReservationRes {
  skuId: string
  reservationList: StockReservation[]
}

export interface DeliveryItemOption {
  item: {
    id: string // sku id
    quantity: number
    dimension: {
      weight: number
      height: number
      width: number
      length: number
    }
  }
  location: {
    zipCode: string // e.g. 75010
    country: string // e.g. GBR
  }
  slaType: string // e.g. Scheduled
  slaTypeName?: string // e.g. Scheduled
}

export interface UpdateStockReservationReq {
  salesChannel: string
  autorizationExpirationTTL: string // hh:mm:ss
  deliveryItemOptions: DeliveryItemOption[]
}

export interface UpdateStockReservationRes {
  LockId: string // reservation id
  Status: number
  Errors: any[]
  IsSucess: boolean
}

export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK"
}

export interface SkuData {
  refId: string
  skuId: string
  productId: string
  physicalQuantity: number
  reservedQuantity: number
  warehouseSwitch: boolean
  inStockWarehouseUpdate: boolean
  excludeFromBackNotification?: boolean
}

export interface StockComputation {
  refId: string
  PackagedHeight: number
  PackagedLength: number
  PackagedWidth: number
  PackagedWeightKg: number
  vtex: {
    skuId: string
    productId: string
    ModalType: string | null
    physicalQuantity: number
    reservedQuantity: number
  }
  cnet: {
    physicalQuantity: number
    reservedQuantity: number
  }
  result?: {
    physicalQuantity?: number
    missingReservations?: number
    reservationsToBeCanceled?: number
    sendBackNotification?: boolean | null
  }
}
