export interface RequestRedirect {
  bomId: string,
  categoryId: number,
  categoryName: string,
  familyGroup: string,
  fCode: string,
  industrialCode: string,
  modelNumber: string,
  originalModelNumber: string,
  referenceNumber: string,
  sparePartId: string,
  spareSkuId: number,
  twelveNc: string
}

export interface FinishedGood{
  modelNumber: string
  industrialCode: string
}

export interface CheckRequest{
  isExistent: boolean
  from: string
}

export interface ListInternalRequest{
  next: string
}

export interface DeleteRequest{
  from: string
}
