export const productbyIdentifier = `query ($identifiers: [ID!], $salesChannel: String) {
  productsByIdentifier(field: sku, values: $identifiers, salesChannel: $salesChannel) {
    brand
    brandId
    cacheId
    categoryId
    categoryTree {
      cacheId
      href
      slug
      id
      name
      titleTag
      hasChildren
      metaTagDescription
      cacheId
      href
      slug
      id
      name
      titleTag
      hasChildren
      metaTagDescription
      children {
        cacheId
        href
        slug
        id
        name
        titleTag
        hasChildren
        metaTagDescription
        children {
          cacheId
          href
          slug
          id
          name
          titleTag
          hasChildren
          metaTagDescription
        }
      }
    }
    clusterHighlights {
      id
      name
    }
    productClusters {
      id
      name
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
      measurementUnit
      unitMultiplier
      images {
        cacheId
        imageId
        imageLabel
        imageTag
        imageUrl
        imageText
      }
      sellers {
        sellerId
        sellerName
        addToCartLink
        commertialOffer {
          Installments {
            Value
            InterestRate
            TotalValuePlusInterestRate
            NumberOfInstallments
            PaymentSystemName
            PaymentSystemGroupName
            Name
          }
          AvailableQuantity
          Price
          spotPrice
          ListPrice
          PriceWithoutDiscount
          PriceValidUntil
          discountHighlights {
            name
          }
          teasers {
            name
            conditions {
              minimumQuantity
              parameters {
                name
                value
              }
            }
            effects {
              parameters {
                name
                value
              }
            }
          }
        }
      }
      variations {
        originalName
        name
        values
      }
      estimatedDateArrival
    }
    skuSpecifications {
      field {
        originalName
        name
      }
      values {
        originalName
        name
      }
    }
    link
    linkText
    productId
		productName
    properties {
      originalName
      name
      values
    }
    propertyGroups {
      name
      properties
    }
    productReference
    titleTag
    metaTagDescription
    benefits {
      featured
      id
      name
      items {
        benefitProduct {
          productId
        }
        benefitSKUIds
        discount
        minQuantity
      }
      teaserType
    }
    itemMetadata {
      items {
        id
        name
        skuName
        productId
        refId
        ean
        imageUrl
        detailUrl
        seller
      }
      priceTable {
        type
        values {
          id
          assemblyId
          price
        }
      }
    }
    specificationGroups{
      originalName
      name
      specifications{
        originalName
        name
        values
      }
    }
    releaseDate
    priceRange{
      sellingPrice{
        lowPrice
        highPrice
      }
      listPrice{
        lowPrice
        highPrice
      }
    }
  }
}
`
