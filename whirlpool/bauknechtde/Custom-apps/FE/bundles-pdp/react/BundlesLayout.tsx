import React from 'react'
import { useProduct } from 'vtex.product-context'

const BundlesLayout: StorefrontFunctionComponent = ({ children }) => {
  const { product } = useProduct()
  const isKit = product?.items?.[0].kitItems?.length > 0

  const bundlesRow = (children as any)?.filter(
    (child: any) => child.props?.id == 'flex-layout.row#bundle-layout' || child.props?.id == 'flex-layout.row#bundle-additional-infos'
  )
  const responsiveLayouts = (children as any)?.filter(
    (child: any) => child.props?.id != 'flex-layout.row#bundle-layout' && child.props?.id != 'flex-layout.row#bundle-additional-infos'
  )

  return <div>{isKit ? bundlesRow : responsiveLayouts}</div>
}

BundlesLayout.schema = {
  title: 'BundlesLayout',
  description: 'editor.basicblock.description',
  type: 'object',
}

export default BundlesLayout
