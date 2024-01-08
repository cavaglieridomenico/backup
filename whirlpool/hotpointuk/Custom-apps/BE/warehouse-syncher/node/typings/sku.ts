export interface Sku {
  Id: string
  ProductId: string
  RefId: string
  ModalType: string | null
  PackagedHeight: number
  PackagedLength: number
  PackagedWidth: number
  PackagedWeightKg: number
  NotFound?: boolean
}

export interface SkuNotFound {
  RefId: string
  NotFound: boolean
}
