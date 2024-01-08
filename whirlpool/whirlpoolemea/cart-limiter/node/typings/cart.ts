interface Item {
  seller: string
  quantity: number
  id: string
  index: number
  hasBundleItems: boolean
}

export interface UpdateCartItemsReq {
  orderItems: Item[]
  expectedOrderFormSections: string []
  noSplitItem: boolean
}
