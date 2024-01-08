export const VBaseBucket = 'cache'

export const PRODUCT_QUERY = `query($identifier: ProductUniqueIdentifier, $salesChannel: Int) {
  product(identifier: $identifier, salesChannel: $salesChannel) {
    brand
    brandId
    categoryId
    categoryTree {
      href
      slug
      id
      name
      titleTag
      hasChildren
      metaTagDescription
    }
    description
    items {
      itemId
      name
      nameComplete
      complementName
      ean
      referenceId {
        Key
        Value
      }
      images(quantity: 10) {
        imageId
        imageLabel
        imageUrl
        imageText
      }
      videos {
        videoUrl
      }
      sellers {
        sellerId
        sellerName
        addToCartLink
        commertialOffer {
          Price
          ListPrice
          spotPrice
          PriceWithoutDiscount
          RewardValue
          PriceValidUntil
          AvailableQuantity
          Tax
          taxPercentage
        }
      }
    }
    skuSpecifications {
      field {
        name
        originalName
      }
      values {
        name
        originalName
      }
    }
    linkText
    productId
    productName
    properties {
      originalName
      name
      values
    }
    specificationGroups {
      name
      originalName
      specifications {
        name
        originalName
        values
      }
    }
    productReference
    titleTag
    metaTagDescription
  }
}
`
export const REVIEW_FIELDS = [
  "totalReviews",
  "averageOverallRating",
  "secondaryRatingsAverages"
]
