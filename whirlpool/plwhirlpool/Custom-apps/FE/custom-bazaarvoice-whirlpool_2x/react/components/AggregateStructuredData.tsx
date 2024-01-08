/* eslint-disable */
/* eslint-disable prettier/prettier */
//@ts-ignore
import React , { useEffect , useState } from 'react'
//import { canUseDOM } from "vtex.render-runtime";
//@ts-ignore
import { useProduct } from 'vtex.product-context'
import { useRuntime , canUseDOM } from 'vtex.render-runtime'
import { useQuery } from "react-apollo";
import queryRatingSummary from "..//graphql/queries/queryRatingSummary.gql";
//@ts-ignore

//@ts-ignore
const AggregateStructuredData = () => {

  const baseUrl = "https://www.whirlpool.pl/"
  const productInfo = useProduct()
  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !productInfo,
    variables: {
      sort: "SubmissionTime:desc",
      offset: 0,
      filter: 0,
      pageId: JSON.stringify({
        linkText: productInfo?.product?.linkText,
        productId: productInfo?.product?.productId,
        productReference: productInfo?.product?.productReference,
      }),
    },
  });
  
    if(error){
      console.log("BAZAARVOICE ERROR :" , error)
    }

    const average =
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? data.productReviews.Includes.Products[0].ReviewStatistics
          .AverageOverallRating
      : null;

  const totalReviews =
    !loading && !error && data && data.productReviews
      ? data.productReviews.TotalResults
      : null;


  const [wasScriptRemoved , setWasScriptRemoved] = useState(false)
  const productScript = document?.querySelectorAll('script[type="application/ld+json"]')
  if(canUseDOM && !wasScriptRemoved){
    for (let i = 0; i < productScript?.length; i++) {
    if (productScript[i] && productScript[i]?.id !== "product-script") {
      if (productScript[i]?.innerHTML) {
        if (JSON.parse(productScript[i].innerHTML)?.sku) {
          productScript[i].remove()
          setWasScriptRemoved(true)
        }
      }
    }
  }}



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
    } else return null

  }


  //@ts-ignore
  const { culture: { currency } } = useRuntime()
  
  const currentRuntime = useRuntime() //@ts-ignore
  //@ts-ignore
  const isUnsellable = currentRuntime?.route?.path?.includes("/unsellable") //@ts-ignore
  const isMobile = currentRuntime?.hints?.mobile

  const IN_STOCK = 'http://schema.org/InStock'
  const OUT_OF_STOCK = 'http://schema.org/OutOfStock'
  const priceValidUntil = productInfo?.selectedItem?.sellers[0]?.commertialOffer?.PriceValidUntil
  const price = productInfo?.selectedItem?.sellers[0]?.commertialOffer?.Price
  const productCategory = getCategory()

  //@ts-ignore
  const getPrice = (propPrice) => {
    if (propPrice > 0) {
      return {
        "@type": "AggregateOffer",
        lowPrice: price,
        highPrice: price,
        priceCurrency: currency,
        offers: [
          {
            "@type": "Offer",
            price: price,
            priceCurrency: currency,
            availability: productInfo?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity > 0 ? IN_STOCK : OUT_OF_STOCK,
            sku: productInfo?.selectedItem?.itemId,
            itemCondition: "http://schema.org/NewCondition",
            priceValidUntil: priceValidUntil,
            seller: {
              "@type": "Organization",
              name: productInfo?.selectedItem?.sellers[0]?.sellerName
            }
          }
        ],
        offerCount: productInfo?.product?.items?.length
      }
    } else return null
  }

  //@ts-ignore
  const getAggregateRating = () => {
    if (average && totalReviews) {
      return {
        '@type': 'AggregateRating',
        ratingValue: average?.toFixed(1),
        reviewCount: totalReviews?.toFixed(0)
      }
    } else return null
  }

  const getBrand = () => {
    if (productInfo?.product?.brand) {
      return {
        "@type": "Brand",
        name: productInfo.product.brand
      }
    } else return null

  }

  //@ts-ignore
  const appendScriptInHead = (fullScript) => {
    let onlyOneScript = document.getElementById("product-script");
    if (!onlyOneScript && ((totalReviews && average) || price > 0) && fullScript) {
      let script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'product-script';
      script.innerHTML = JSON.stringify(fullScript)
      document.head.appendChild(script);
    } else if (onlyOneScript){
      onlyOneScript.innerHTML = JSON.stringify(fullScript)
    }
    return null
  }


  useEffect(() => {
    console.time("🚀 ~ file: AggregateStructuredData.tsx ~ line 149 ~ loading")
    console.log("🚀 ~ file: AggregateStructuredData.tsx ~ line 149 ~ loading", loading)
    if (isUnsellable && isMobile){
      let hideOnMobile= document?.getElementById("reviews");
      if(hideOnMobile) hideOnMobile.style.display = "none"
    }
    if (productInfo && ((totalReviews) || price ) && !isUnsellable && !loading) {
      const fullScript = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": baseUrl + productInfo?.product?.linkText + "/p",
        name: productInfo?.product?.productName,
        brand: getBrand(),
        image: productInfo?.selectedItem?.images[0]?.imageUrl,
        description: productInfo?.product?.metaTagDescription,
        mpn: productInfo?.product?.productId,
        sku: productInfo?.selectedItem?.itemId,
        category: productCategory,
        ...(price > 0) && { offers: getPrice(price) },
        aggregateRating: getAggregateRating()
      }
      console.timeEnd("🚀 ~ file: AggregateStructuredData.tsx ~ line 149 ~ loading")
     appendScriptInHead(fullScript);
  
      //@ts-ignore
    } else if (isUnsellable && productInfo && (totalReviews) && !loading){
      const fullScript = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": baseUrl + productInfo?.product?.linkText + "/p",
        name: productInfo?.product?.productName,
        brand: getBrand(),
        image: productInfo?.selectedItem?.images[0]?.imageUrl,
        description: productInfo?.product?.metaTagDescription,
        mpn: productInfo?.product?.productId,
        sku: productInfo?.selectedItem?.itemId,
        category: productCategory,
        aggregateRating: getAggregateRating()
      }
      console.timeEnd("🚀 ~ file: AggregateStructuredData.tsx ~ line 149 ~ loading")
     appendScriptInHead(fullScript);
    }
  }, [data,loading,error])
  

  return <React.Fragment></React.Fragment>

}


export default AggregateStructuredData
