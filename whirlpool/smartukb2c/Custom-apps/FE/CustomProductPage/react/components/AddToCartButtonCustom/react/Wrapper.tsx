// @ts-nocheck
import React, { useMemo, useContext } from 'react'
import { useProduct } from 'vtex.product-context'
import type { ProductTypes } from 'vtex.product-context'
import { withToast } from 'vtex.styleguide'

import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart, CartItem } from './modules/catalogItemToCart'
import { AssemblyOptions } from './modules/assemblyOptions'

import { getDefaultSeller } from './modules/seller'

interface Props {
  isOneClickBuy: boolean
  available: string | undefined
  disabled: boolean
  customToastUrl?: string
  customOneClickBuyLink?: string
  showToast: Function
  selectedSeller?: ProductTypes.Seller
  text?: string
  unavailableText?: string
  onClickBehavior?:
    | 'add-to-cart'
    | 'go-to-product-page'
    | 'ensure-sku-selection'
  onClickEventPropagation?: 'disabled' | 'enabled'
  skuItems?: CartItem[]
  customPixelEventId?: string
  addToCartFeedback?: 'toast' | 'customEvent',
  product?: any,
  selectedQuantity?: any
}
 

function checkDisabled(
  isEmptyContext: boolean,
  assemblyOptions: AssemblyOptions | undefined,
  disabledProp: Props['disabled']
) {
  if (isEmptyContext) {
    return true
  }
  if (disabledProp != null) {
    return disabledProp
  }

  const groupsValidArray =
    (assemblyOptions?.areGroupsValid &&
      Object.values(assemblyOptions.areGroupsValid)) ||
    []
  const areAssemblyGroupsValid = groupsValidArray.every(Boolean)

  return !areAssemblyGroupsValid
}

const Wrapper = withToast(function Wrapper(props: Props) {
  const {
    isOneClickBuy,
    disabled,
    customToastUrl,
    showToast,
    customOneClickBuyLink,
    selectedSeller,
    unavailableText,
    text,
    customPixelEventId,
    addToCartFeedback = 'toast',
    onClickBehavior = 'add-to-cart',
    onClickEventPropagation = 'disabled',
    product,
    selectedQuantity
  } = props
  const isEmptyContext = false

  const itemsLength = product?.items?.length ?? 0
  const multipleAvailableSKUs = itemsLength > 1
  const selectedItem = product.items[0]
  const assemblyOptions = {
    areGroupsValid: {},
    inputValues: {},
    items: {}
  }
  const seller = getDefaultSeller(product.items[0].sellers)
  const skuItems = useMemo(
    () =>
      props.skuItems ??
      mapCatalogItemToCart({
        product,
        selectedItem,
        selectedQuantity,
        selectedSeller: seller,
        assemblyOptions,
      }),
    [
      assemblyOptions,
      product,
      props.skuItems,
      selectedItem,
      selectedQuantity,
      seller,
    ]
  )
  const isAvailable = product.status ? product.status[0] : product.properties ? product.properties.filter((prop) => prop.originalName = "status")[0]?.values[0] : "out of stock";

  const productName = product.productName
  const productReference = product.productReference
  const productImage = product.items && product.items[0] && product.items[0].images && product.items[0].images[0]?.imageUrl


  const isDisabled = checkDisabled(isEmptyContext, assemblyOptions, disabled)

  const areAllSkuVariationsSelected = true

  const productLink = {
    linkText: product?.linkText,
    productId: product?.productId,
  }

  return (
    <AddToCartButton
      text={text}
      skuItems={skuItems}
      disabled={isDisabled}
      showToast={showToast}
      available={isAvailable}
      isOneClickBuy={isOneClickBuy}
      customToastUrl={customToastUrl}
      unavailableText={unavailableText}
      customOneClickBuyLink={customOneClickBuyLink}
      allSkuVariationsSelected={areAllSkuVariationsSelected}
      productLink={productLink}
      onClickBehavior={onClickBehavior}
      onClickEventPropagation={onClickEventPropagation}
      multipleAvailableSKUs={multipleAvailableSKUs}
      customPixelEventId={customPixelEventId}
      addToCartFeedback={addToCartFeedback}
      productName={productName}
      productReference={productReference}
      productImage={productImage}
      product={product}
    />
  )
})

Wrapper.schema = {
  title: 'admin/editor.add-to-cart.title',
}

export default Wrapper
