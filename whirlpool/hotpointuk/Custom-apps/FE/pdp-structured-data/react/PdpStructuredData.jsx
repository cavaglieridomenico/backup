/* eslint-disable */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { canUseDOM } from "vtex.render-runtime";
import { path } from 'ramda'
import axios from 'axios';
import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import discontinedProductsSd from '../graphql/discontinued-products-sd.graphql'
import { useRuntime } from 'vtex.render-runtime'

const PdpAggregateData = () => {

  const { route } = useRuntime()
  const { slug } = route?.queryString
  const prodValue = useProduct()
  const { data, loading, error } = useQuery(discontinedProductsSd, {
    variables: {
      slug: slug,
    },
  })

  const productInfo = data ? data : (prodValue ? prodValue : null)
  const baseUrl = "https://www.hotpoint.co.uk/"
  const [aggregate, setAggregate] = useState()
  if (canUseDOM) {
    const productScript = document.querySelectorAll('script[type="application/ld+json"]')
    for (let i = 0; i < productScript?.length; i++) {
      if (productScript[i] !== null && productScript[i] !== undefined) {
        if (productScript[i]?.innerHTML !== null && productScript[i]?.innerHTML !== undefined) {
          if (productScript[i].innerHTML && JSON.parse(productScript[i].innerHTML).sku !== null && JSON.parse(productScript[i].innerHTML).sku !== undefined && productScript[i].id !== "product-script") {
            productScript[i].remove()
          }
        }
      }
    }

  }


  const isSellable = productInfo?.product?.properties?.find(
    (e) => e.name == 'sellable'
  )?.values.map((e) => e)[0]

  const getCategory = () => {
    if (productInfo) {
      let categoryTree = productInfo?.product?.categoryTree
      let i = categoryTree?.lenght
      if (i && i > 1) {
        for (let x = 0; x < i; x++) {
          if (categoryTree[x]?.id === productInfo?.product?.categoryId) {
            return categoryTree[x]?.name
          }
        }
      }
    } else getCategory()

  }

  const availability = productInfo?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity ? productInfo?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity : productInfo?.product?.items[0].sellers[0]?.commertialOffer?.AvailableQuantity
  const isAvailable = () => {
    if (availability > 0) return IN_STOCK
    else return OUT_OF_STOCK
  }

  const {
    culture: { currency },
  } = useRuntime()

  const IN_STOCK = 'http://schema.org/InStock'
  const OUT_OF_STOCK = 'http://schema.org/OutOfStock'
  let priceValidUntil = path(['commertialOffer', 'PriceValidUntil'], productInfo?.selectedItem?.sellers[0]) ? path(['commertialOffer', 'PriceValidUntil'], productInfo?.selectedItem?.sellers[0]) : productInfo?.product?.items[0].sellers[0].commertialOffer.PriceValidUntil
  let commercialOfferPrice = path(['commertialOffer', 'Price'], productInfo?.selectedItem?.sellers[0]) ? path(['commertialOffer', 'Price'], productInfo?.selectedItem?.sellers[0]) : productInfo?.product?.items[0].sellers[0].commertialOffer.Price
  let lowPrice = path(['commertialOffer', 'PriceWithoutDiscount'], productInfo?.selectedItem?.sellers[0]) ? path(['commertialOffer', 'PriceWithoutDiscount'], productInfo?.selectedItem?.sellers[0]) : productInfo?.product?.items[0].sellers[0].commertialOffer.PriceWithoutDiscount
  let highPrice = path(['commertialOffer', 'ListPrice'], productInfo?.selectedItem?.sellers[0]) ? path(['commertialOffer', 'ListPrice'], productInfo?.selectedItem?.sellers[0]) : productInfo?.product?.items[0].sellers[0].commertialOffer.listPrice
  const productCategory = getCategory()
  const fetchData = async () => {
    let name = productInfo?.selectedItem?.name ? productInfo?.selectedItem?.name : productInfo?.product.items[0].name
    let reevooScript = await axios.get("https://widgets.reevoo.com/loader/product_reviews_rich_snippets.js?trkref=HTT&sku=" + name)
    let scriptToString = reevooScript?.data?.toString()
    if (scriptToString?.includes("AggregateRating")) {
      setAggregate(scriptToString)
    } else setAggregate("nodata")

  }

  useEffect(() => {
    if (!aggregate) {
      fetchData();
    }
  }, []);

  const aggregateDataSplit = (prop) => {
    if (prop && typeof prop === "string") {
      let propsplit = prop.split("{")
      if (propsplit[3]) {
        let propsplit2 = propsplit[3].split("}")
        if (propsplit2[0]) {
          return propsplit2[0]
        }
      }

    }

  }
  const checkforQuotes = (prop) => {
    let quotesFreeDescription = null
    if (prop?.includes('"')) {
      quotesFreeDescription = prop.replace(/['"]+/g, '')
    }
    return quotesFreeDescription ? quotesFreeDescription : prop
  }
  const description = checkforQuotes(productInfo?.product?.description)


  if ((aggregate !== null && aggregate !== undefined && aggregate !== "nodata" && isSellable == "false")) {
    let aggregateDataAfterSplit = aggregateDataSplit(aggregate)
    const fullScript = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": baseUrl + productInfo?.product?.linkText + "/p",
      name: productInfo?.product?.productName,
      brand: {
        "@type": "Brand",
        name: productInfo?.product?.brand
      },
      image: productInfo?.selectedItem?.images?.[0]?.imageUrl ? productInfo?.selectedItem?.images?.[0]?.imageUrl : productInfo?.product?.items[0]?.itemId, //
      description: description,
      mpn: productInfo?.product?.productId,
      sku: productInfo?.selectedItem?.itemId ? productInfo?.selectedItem?.itemId : productInfo?.product?.items[0].itemId, //
      category: productCategory,
      offers: {
        "@type": "AggregateOffer",
        lowPrice: lowPrice,
        highPrice: highPrice,
        priceCurrency: currency,
        offers: [
          {
            "@type": "Offer",
            price: commercialOfferPrice,
            priceCurrency: currency,
            availability: isAvailable(),
            sku: productInfo?.selectedItem?.itemId ? productInfo?.selectedItem?.itemId : productInfo?.product?.items[0]?.itemId, //
            itemCondition: "http://schema.org/NewCondition",
            priceValidUntil: priceValidUntil,
            seller: {
              "@type": "Organization",
              name: productInfo?.selectedItem?.sellers?.sellerName ? productInfo?.selectedItem?.sellers?.sellerName : productInfo?.product?.items[0]?.sellers[0]?.sellerName
            }
          }
        ],
        offerCount: productInfo?.product?.items?.length
      },
      ...(aggregate && aggregate !== "nodata") && { aggregateRating: "{" + aggregateDataAfterSplit + "}" }
    }
    let onlyOneScript = document.getElementById("product-script")
    if (!onlyOneScript) {
      let script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'product-script'
      script.innerHTML = JSON.stringify(fullScript).replace(/\\{1,}/g, '').replace(/\"{"{1,}/gm, '{"').replace(/\"}"{1,}/gm, '"}')
      document.head.appendChild(script)
    }

  } else if ((aggregate !== null && aggregate !== undefined && aggregate !== "nodata" && isSellable == "true") || (commercialOfferPrice && aggregate === "nodata" && isSellable == "true")) {
    let aggregateDataAfterSplit = aggregateDataSplit(aggregate)
    const fullScript = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": baseUrl + productInfo?.product?.linkText + "/p",
      name: productInfo?.product?.productName,
      brand: {
        "@type": "Brand",
        name: productInfo?.product?.brand
      },
      image: productInfo?.selectedItem?.images?.[0]?.imageUrl ? productInfo?.selectedItem?.images?.[0]?.imageUrl : productInfo?.product?.items[0]?.itemId, //
      description: description,
      mpn: productInfo?.product?.productId,
      sku: productInfo?.selectedItem?.itemId ? productInfo?.selectedItem?.itemId : productInfo?.product?.items[0].itemId, //
      category: productCategory,
      offers: {
        "@type": "AggregateOffer",
        lowPrice: lowPrice,
        highPrice: highPrice,
        priceCurrency: currency,
        offers: [
          {
            "@type": "Offer",
            price: commercialOfferPrice,
            priceCurrency: currency,
            availability: isAvailable(),
            sku: productInfo?.selectedItem?.itemId ? productInfo?.selectedItem?.itemId : productInfo?.product?.items[0]?.itemId, //
            itemCondition: "http://schema.org/NewCondition",
            priceValidUntil: priceValidUntil,
            seller: {
              "@type": "Organization",
              name: productInfo?.selectedItem?.sellers?.sellerName ? productInfo?.selectedItem?.sellers?.sellerName : productInfo?.product?.items[0]?.sellers[0]?.sellerName
            }
          }
        ],
        offerCount: productInfo?.product?.items?.length
      },
      ...(aggregate && aggregate !== "nodata") && { aggregateRating: "{" + aggregateDataAfterSplit + "}" }
    }
    let onlyOneScript = document.getElementById("product-script")
    if (!onlyOneScript) {
      let script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'product-script'
      script.innerHTML = JSON.stringify(fullScript).replace(/\\{1,}/g, '').replace(/\"{"{1,}/gm, '{"').replace(/\"}"{1,}/gm, '"}')
      document.head.appendChild(script)
    }

  }
  return null
}

export default PdpAggregateData;



