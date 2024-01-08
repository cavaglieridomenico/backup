export const EXTENDED_WARRANTY = "Бесплатно: 2 года сервиса"

export const deafultLocale = "ru-RU"
export const productDetailsQuery = "ProductDetailsQuery.graphql"
export const filteredSearch = "ProductsByCollection.graphql"
export const productCommercialOfferQuery = "query($identifier: ProductUniqueIdentifier, $salesChannel: Int){product(identifier:$identifier, salesChannel: $salesChannel){productClusters{id, name},items{sellers{commertialOffer{Price,ListPrice,spotPrice,PriceWithoutDiscount,RewardValue,PriceValidUntil,AvailableQuantity,Tax,taxPercentage,discountHighlights{name}}}}}}"

export const VbaseConfig = {
  catalogBucket: "catalog",
  productsFile: "products"
}

export const CachePeriod = 1000 * 60 * 60 //1 hour
