import React, { useMemo, useState } from 'react'
import { ProductTypes, useProduct } from 'vtex.product-context'
import { withToast } from 'vtex.styleguide'
import AddToCartButton from './AddToCartButton'
import { AssemblyOptions } from './modules/assemblyOptions'
import { CartItem, mapCatalogItemToCart } from './modules/catalogItemToCart'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl?: string
  customOneClickBuyLink?: string
  showToast: Function
  selectedSeller?: ProductTypes.Seller
  text?: string
  unavailableTextProps?: string
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
    // available,
    customToastUrl,
    showToast,
    customOneClickBuyLink,
    selectedSeller,
    text,
    customPixelEventId,
    addToCartFeedback = 'toast',
    onClickBehavior = 'add-to-cart',
    onClickEventPropagation = 'disabled',
  } = props
  const { disabled, unavailableTextProps } = props
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
  
  const [isDisabled, setisDisabled] = useState(
    checkDisabled(isEmptyContext, assemblyOptions, disabled)
  )

  const unavailableText = unavailableTextProps || "Unvailable"

  const areAllSkuVariationsSelected = Boolean(
    !isEmptyContext && productContext?.skuSelector?.areAllVariationsSelected
  )

  const productLink = {
    linkText: product?.linkText,
    productId: product?.productId,
  }

  function disableProduct() {
    setisDisabled(true)
  }

  if ((selectedItem as any)?.images.length < 1) {
        disableProduct()
        return
      }

  const isAvailable = productContext?.product?.properties?.find((prop: any) => prop.name == "sellable")?.values?.[0] == "true"

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
    />
  )
  })

Wrapper.schema = {
  title: 'admin/editor.add-to-cart.title',
}

export default Wrapper
