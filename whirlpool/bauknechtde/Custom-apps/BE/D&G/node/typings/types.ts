export interface Pagination {
  page: number,
  pageSize: number
}

export interface DGRecord {
  orderId?: string,
  itemId?: string,
  itemToken: string,
  typeOfWarranty?: string
}

export interface DocumentResponse {
  Id: string;
  Href: string;
  DocumentId: string;
}

export interface ProductSpecification {
  Value: string[],
  Id: string,
  Name: string
}

export interface ProductSpecificationResponse {
  id: string,
  data: ProductSpecification[]
}

export enum CustomApps {
  PROFILE = "profile"
}

export enum ProfileCustomFields {
  email = "email"
}
