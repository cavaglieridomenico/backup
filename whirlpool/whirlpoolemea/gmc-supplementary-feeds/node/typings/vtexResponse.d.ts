export interface getSkuIdsByCategoryId {
  data: Data
  range: Range
}

export interface Data {
  [productId: string]: number[]
}

export interface Range {
  from: number
  to: number
  total: number
}