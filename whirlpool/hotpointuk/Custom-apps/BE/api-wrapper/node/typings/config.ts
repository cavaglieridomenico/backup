export interface AppSettings {
  stockUpdate: boolean,
  inStockWarId?: string,
  outOfStockWarId?: string,
  retrievePromoParam: {
    UTC: string
  }
}
