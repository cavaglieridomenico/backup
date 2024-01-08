interface Limit {
  status: boolean
  threshold?: number
  salesChannels?: string
}

interface FGLimit extends Limit {
  excludedCategories?: string
}

interface OrderLimit extends Limit {
  counter: boolean
  orderEvent?: string
  fieldNameCounter?: string
  fieldNameDate?: string
}

export interface AppSettings {
  authCookie: string
  limitMDAs: FGLimit
  limitMDAQuantity: FGLimit
  limitOrders: OrderLimit

}
