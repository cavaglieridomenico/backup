/* eslint-disable */
/* eslint-disable prettier/prettier */
//@ts-ignore
import React, { useEffect } from 'react'
import { canUseDOM } from 'vtex.render-runtime'
//@ts-ignore
import { useProduct } from 'vtex.product-context'
import { useRuntime } from 'vtex.render-runtime'
//@ts-ignore
const AggregateStructuredData = ({
  //@ts-ignore
  total,
  //@ts-ignore
  average,
}) => {
  if (canUseDOM && total && average) {
    const productScript = document.querySelectorAll(
      'script[type="application/ld+json"]'
    )
    for (let i = 0; i < productScript.length; i++) {
      if (productScript[i] !== null && productScript[i] !== undefined) {
        if (
          productScript[i].innerHTML !== null &&
          productScript[i].innerHTML !== undefined
        ) {
          if (
            JSON.parse(productScript[i].innerHTML).sku !== null &&
            JSON.parse(productScript[i].innerHTML).sku !== undefined &&
            productScript[i].id !== 'product-script'
          ) {
            productScript[i].remove()
          }
        }
      }
    }
  }
  const baseUrl = 'https://www.indesit.it/'
  const productInfo = useProduct()
  const getCategory = () => {
    if (productInfo) {
      let categoryTree = productInfo.product.categoryTree
      let i = categoryTree?.lenght
      if (i && i > 1) {
        for (let x = 0; x < i; x++) {
          if (categoryTree[x].id === productInfo.product.categoryId) {
            return categoryTree[x].name
          }
        }
      }
    } else getCategory()
  }

  const {
    //@ts-ignore
    culture: { currency },
  } = useRuntime()
  /* const IN_STOCK = 'http://schema.org/InStock'
  const OUT_OF_STOCK = 'http://schema.org/OutOfStock'
  let priceValidUntil =
    productInfo.selectedItem.sellers[0].commertialOffer.PriceValidUntil */
  const productCategory = getCategory()
  const fetchData = async () => {
    let bvScript = await productInfo
    console.log('bvscript', bvScript)
  }
  useEffect(() => {
    if (!productInfo || !average || !total) {
      fetchData()
    }
  }, [])
  if (productInfo && total && average) {
    const fullScript = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      '@id': baseUrl + productInfo.product.linkText + '/p',
      name: productInfo.product.productName,
      brand: {
        '@type': 'Brand',
        name: productInfo.product.brand,
      },
      image: productInfo.selectedItem.images[0].imageUrl,
      description: productInfo.product.description,
      mpn: productInfo.product.productId,
      sku: productInfo.selectedItem.itemId,
      category: productCategory,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: typeof average === 'number' ? average.toFixed(2) : average,
        reviewCount: total,
      },
    }
    let onlyOneScript = document.getElementById('product-script')
    if (!onlyOneScript) {
      let script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'product-script'
      script.innerHTML = JSON.stringify(fullScript)
        .replace(/\\{1,}/g, '')
        .replace(/\"{"{1,}/gm, '{"')
        .replace(/\"}"{1,}/gm, '"}')
      document.head.appendChild(script)
    }
    return <React.Fragment></React.Fragment>
  }
}
export default AggregateStructuredData
