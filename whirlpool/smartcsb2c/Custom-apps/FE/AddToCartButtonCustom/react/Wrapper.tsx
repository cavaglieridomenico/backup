import React, { useMemo, useContext } from 'react'
import { useProduct } from 'vtex.product-context'
import type { ProductTypes } from 'vtex.product-context'
import { withToast } from 'vtex.styleguide'
import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart, CartItem } from './modules/catalogItemToCart'
import { AssemblyOptions } from './modules/assemblyOptions'
import { ProductContext } from 'vtex.product-context'

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
  addToCartFeedback?: 'toast' | 'customEvent'
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
  } = props
  const productContext = useProduct()
  const isEmptyContext = Object.keys(productContext ?? {}).length === 0

  const product = productContext?.product
  const itemsLength = product?.items?.length ?? 0
  const multipleAvailableSKUs = itemsLength > 1
  const selectedItem = productContext?.selectedItem
  const assemblyOptions = productContext?.assemblyOptions
  const seller =
    selectedSeller ??
    (productContext?.selectedItem?.sellers[0] as ProductTypes.Seller)
  const selectedQuantity =
    productContext?.selectedQuantity != null
      ? productContext.selectedQuantity
      : 1

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
  const valuesFromContext = useContext(ProductContext)

  const isAvailable = valuesFromContext?.product?.properties?.filter( x => { return x.name=="Status" || x.name=="Stato" || x.name=="Statut" || x.name=="status" || x.name=="stato" || x.name=="statut" })[0]?.values[0]
  const productName = valuesFromContext?.product?.productName
  const productReference = valuesFromContext?.product?.productReference
  const productImage = valuesFromContext?.selectedItem?.images[0]?.imageUrl


  const isDisabled = checkDisabled(isEmptyContext, assemblyOptions, disabled)

  const areAllSkuVariationsSelected = Boolean(
    !isEmptyContext && productContext?.skuSelector?.areAllVariationsSelected
  )

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
    />
  )
})

Wrapper.schema = {
  title: 'admin/editor.add-to-cart.title',
}

export default Wrapper
