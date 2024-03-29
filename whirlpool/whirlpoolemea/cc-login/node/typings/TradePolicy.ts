export enum CCTradePolicy {
  EPP = "EPP",
  FF = "FF",
  VIP = "VIP"
}
export enum TradePolicy {
  EPP = "EPP",
  FF = "FF",
  VIP = "VIP",
  O2P = "O2P"
}

export interface TradePolicyInfo {
  id?: string
  name?: string
  ordersLimitNumber?: number
  ordersLimitDays?: number
}
