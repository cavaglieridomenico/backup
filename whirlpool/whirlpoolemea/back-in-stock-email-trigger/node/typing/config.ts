export interface TradePolicyInfo {
  hostname: string
  tradePolicyId?: string
  clusterLabel: string
}

export interface AppSettings {
  sessionCookie: string
  allowedCredentials: string
  mdEntity: string
  maxDays?: number
  crmEvent: string
  isCCProject: boolean
  hasClusterInfo: boolean
  o2pInfo?: TradePolicyInfo
  eppInfo?: TradePolicyInfo
  ffInfo?: TradePolicyInfo
  vipInfo?: TradePolicyInfo
  searchField: string
}

export enum SearchTerm {
  skuId = "skuId",
  skuRefId = "skuRefId"
}
