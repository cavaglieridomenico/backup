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
  