export interface GetSkuByRefIdRes {
  Id: number
  ProductId: number
}

export interface SkuImage {
  ImageUrl: string
  ImageName: string
  FileId: number
}

export interface SkuProductSpecification {
  FieldId: number
  FieldName: string
  FieldValues: string[]
  FieldGroupName: string
}

export interface GetSkuContextRes {
  Id: number
  ProductId: number
  ProductName: string
  ImageUrl: string
  DetailUrl: string
  Images: SkuImage[]
  ProductSpecifications: SkuProductSpecification[]
}

export interface SkuFile {
  Id: number
  ArchiveId: number
  SkuId: number
  Name: string
  IsMain: boolean
  Label: string
}
