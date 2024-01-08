export enum TranslationsKeys {
  products = "products",
  accessories = "accessories"
}

export interface GetProductTranslationReq {
  identifier: {
    field: string  // constant value "id"
    value: string | number  // e.g. 25
  },
  srcLocale: string // e.g. it-IT
  dstLocale: string // e.g. en-US
}

export interface GetProductTranslationRes {
  data: {
    product: {
      id: string
      name: string
      title: string
      description: string
      linkId: string
    }
  }
}
