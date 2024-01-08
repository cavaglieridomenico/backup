/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { useProduct } from "vtex.product-context";
import { Helmet, useRuntime, canUseDOM } from 'vtex.render-runtime'
import discontinedProducts from './graphql/discontinued-products.graphql'
import { useQuery } from 'react-apollo'

const ProductMetaHandler = () => {
  const { getSettings } = useRuntime();
  const settings = getSettings("vtex.store");
  const { route } = useRuntime()
  const { slug } = route.queryString
  const prodValue = useProduct()
  const { data , loading } = useQuery(discontinedProducts, {
    variables: {
      slug: slug,
    },
  })
  const sellableTitle = prodValue?.product?.titleTag
  const sellableDesc = prodValue?.product?.metaTagDescription ? prodValue.product.metaTagDescription : undefined
  const discTitle = data?.product?.titleTag || data?.product?.productName
  const discDesc = data?.product?.metaTagDescription || data?.product?.description
  const finalTitle = discTitle || sellableTitle
  const finalDesc = discDesc || sellableDesc
  
  // setTimeout(() => {
  //   document.title = finalTitle
  // }, 2000)
  console.log("🚀 ~ file: ProductMetaHandler.jsx ~ line 8 ~ ProductMetaHandler ~ prodValue", finalTitle , finalDesc , data , loading)

  if(finalTitle && finalDesc && canUseDOM ){
    return  <Helmet><title data-react-helmet="true">{`${finalTitle} - ${settings.storeName.split(' ')[0]}`}</title> <meta name="description" content={finalDesc} /></Helmet>
    
} else return null

}

export default ProductMetaHandler
