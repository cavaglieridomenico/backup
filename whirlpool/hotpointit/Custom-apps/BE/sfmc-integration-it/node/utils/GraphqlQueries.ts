export const ProductInfo = `query ($identifier: ProductUniqueIdentifier, $salesChannel: Int) {
    product(identifier: $identifier, salesChannel: $salesChannel) {
      linkText
      productName
      properties {
        originalName
        name
        values
      }
      productReference
      items {
        images(quantity: 1) {
          imageId
          imageLabel
          imageUrl
          imageText
        }
        sellers {
          sellerId          
          commertialOffer {
            Price
            ListPrice
            AvailableQuantity
          }
        }
      }
    }
  }
  `
  