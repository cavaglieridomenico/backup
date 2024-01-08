export interface Pagination {
  page: number,
  pageSize: number
}

export interface DocumentResponse {
  Id: string;
  Href: string;
  DocumentId: string;
}

export interface CLRecord {
  id?: string,
  email: string,
  firstName: string,
  lastName: string,
  crmBpId?: string|null,
  isNewsletterOptIn: boolean,
  isProfilingOptIn: boolean
}

export interface StockBalance {
  warehouseId: string,
  warehouseName: string,
  totalQuantity: number,
  reservedQuantity: number,
  hasUnlimitedQuantity: boolean
}

export interface Stock {
  skuId: string,
  balance: StockBalance[]
}


export interface StockUpdate {
  unlimitedQuantity: boolean,
  quantity?: number
}

export interface ProductSpecification {
  Name: string,
  Value: string[]
}

export enum StockAvailability {
  INSTOCK = "Show In Stock Products Only",
  OUTOFSTOCK = "Out of Stock"
}
