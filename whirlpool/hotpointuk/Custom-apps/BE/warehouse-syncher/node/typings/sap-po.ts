export interface SAPPOEnvDetails {
  host: string
  cert: string
  envPath: string
}

export interface SAPPO {
  quality: SAPPOEnvDetails
  production: SAPPOEnvDetails
}

export interface StockInfo {
  productCode: string // 12nc
  stock: number // physical stock
  reserved: number
}

export interface POStockNotification {
  sid?: string
  stock: StockInfo[]
}
