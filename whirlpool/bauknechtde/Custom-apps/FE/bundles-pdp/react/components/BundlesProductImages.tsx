import React from 'react'
import style from '../style.css'
import { formatPrice } from '../utils/utils'
import { useBundle } from '../hooks/context'
import { useProduct } from "vtex.product-context"
import { BundlesContextProvider } from '../hooks/context'
import { Link } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'

interface BundlesProductImagesProps {}

const BundlesProductImages: React.FC<BundlesProductImagesProps> = () => {
  return (
    <BundlesContextProvider>
      <BundlesProductImagesWrapped />
    </BundlesContextProvider>
  )
}

const BundlesProductImagesWrapped: React.FC<BundlesProductImagesProps> = () => {
  const { kitItems } = useBundle()
  const { product } = useProduct();
  const { push } = usePixel()
  const handleImageClick = (product: any, e: any, link: string) => {
    e.stopPropagation(), e.preventDefault()
    push({
      event: 'productClick',
      product,
      type: 'product',
      products: [
        {
          list: product.product.categoryId,
          price: product?.sku?.sellers[0]?.commercialOffer?.Price,
        },
      ],
    })
    window.location.href = link
  }
  const hasSpareParts = kitItems?.some((item: any) => {
    return item.product.categoryId === "55";
  })
  if (hasSpareParts) {
    return (
      <div className={style.bundleImagesWrapper}>
        <div className={style.bundleImagesContainer}>
          <img
            className={style.bundleImage}
            src={product.items[0]?.images[0]?.imageUrl}
            alt="ProductImage"
            />
        </div>
      </div>
    )
  } else {
    return (
      <div className={style.bundleImagesWrapper}>
        {kitItems?.map((item: any) => (
          <div className={style.bundleImagesContainer}>
            <Link
              href={`/${item?.product?.linkText}/p`}
              onClick={(e: any) => {
                handleImageClick(item, e, `/${item?.product?.linkText}/p`)
              }}
            >
              <img
                className={style.bundleImage}
                src={item.sku?.images?.[0].imageUrl}
                alt="ProductImage"
              />
            </Link>
            <span className={style.bundleItemPrice}>
              {formatPrice(item.sku?.sellers?.[0].commertialOffer?.Price)}
            </span>
          </div>
        ))}
      </div>
    )
  }
}

export default BundlesProductImages
