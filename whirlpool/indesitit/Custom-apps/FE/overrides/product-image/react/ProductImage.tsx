import React , {Suspense} from 'react'
import {useProduct} from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

interface ProductImageProps {}

const CSS_HANDLES = ['container', 'image'] as const

const ProductImage: StorefrontFunctionComponent<ProductImageProps> = () => {
  const productContext = useProduct()
  const { handles } = useCssHandles(CSS_HANDLES)
  
  const url = productContext?.product?.items[0]?.images[0]?.imageUrl
  const altText = productContext?.product?.metaTagDescription
  
  return (//@ts-ignore
    <Suspense fallback={<div style={{height: "200px" , width: "200px"}}></div>}><img className={handles.image} src={url} alt={altText}/></Suspense>
  )
}

ProductImage.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
  },
}

export default ProductImage
