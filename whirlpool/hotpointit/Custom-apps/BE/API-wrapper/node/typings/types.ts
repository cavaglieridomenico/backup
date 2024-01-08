export interface Stock {
  data: any
  skuId: string,
  balance: StockBalance[]
}

export interface StockBalance {
  warehouseId: string,
  warehouseName: string,
  totalQuantity: number,
  reservedQuantity: number,
  hasUnlimitedQuantity: boolean
}


// MASTERCHEF INTERFACE

export interface MasterChefForm {
  name: string,
  surname: string,
  email: string,
  image: any
  optIn: boolean,
}
