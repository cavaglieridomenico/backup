interface SkuSeller {
  SellerId: string
  StockKeepingUnitId: number
  SellerStockKeepingUnitId: number
  IsActive: boolean
}

interface Image {
  ImageUrl: string
  ImageName: string
  FileId: number
}

interface Specification {
  FieldId: number
  FieldName: string
  FieldValueIds: number[]
  FieldValues: string[]
  IsFilter: boolean
  FieldGroupId: number
  FieldGroupName: string
}

interface AlternateIds {
  Ean: string
  RefId: string
}

export interface SkuContext {
  Id: number
  ProductId: number
  ProductName: string
  ProductDescription: string
  ProductRefId: string
  DetailUrl: string
  BrandName: string
  Dimension: {
    cubicweight: number
    height: number
    length: number
    weight: number
    width: number
  }
  SkuSellers: SkuSeller[]
  SalesChannels: number[]
  Images: Image[]
  Videos: string[]
  SkuSpecifications: Specification[]
  ProductSpecifications: Specification[]
  ProductCategoryIds: string
  CommercialConditionId: number
  AlternateIds: AlternateIds
  ProductIsVisible: boolean
  ShowIfNotAvailable: boolean
  IsProductActive: boolean
  ProductFinalScore: number
}
