import React, { useEffect, useMemo, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import type { ProductTypes } from 'vtex.product-context'
import { withToast } from 'vtex.styleguide'
import { useRenderSession } from 'vtex.session-client'
import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart, CartItem } from './modules/catalogItemToCart'
import { AssemblyOptions } from './modules/assemblyOptions'

interface Props {
  isOneClickBuy: boolean
  available: boolean
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
  isSticky?: boolean
}
interface WindowRuntime extends Window  {
  __RUNTIME__:any
}

// async function getUserSession(): Promise<any> {
//   return fetch(`/api/sessions?items=*`, {
//     method: "GET",
//     credentials: "same-origin",
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }


// function checkAvailability(
//   isEmptyContext: boolean,
//   seller: ProductTypes.Seller | undefined,
//   availableProp: Props['available']
// ) {
//   if (isEmptyContext) {
//     return false
//   }
//   if (availableProp != null) {
//     return availableProp
//   }

//   const availableProductQuantity = seller?.commertialOffer?.AvailableQuantity

//   return Boolean(availableProductQuantity)
// }

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

function getDefaultSeller(sellers?: ProductTypes.Seller[]) {
  if (!sellers) {
    return undefined
  }

  const defaultSeller = sellers.find(seller => seller.sellerDefault)

  if (defaultSeller) {
    return defaultSeller
  }

  return sellers[0]
}

const Wrapper = withToast(function Wrapper(props: Props) {
  
  let runtime = (window as unknown as WindowRuntime).__RUNTIME__
  const {
    isOneClickBuy,
    // available,
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
    isSticky,
  } = props

  const productContext = useProduct()
  const isEmptyContext = Object.keys(productContext ?? {}).length === 0

  const product = productContext?.product
  const itemsLength = product?.items?.length ?? 0
  const multipleAvailableSKUs = itemsLength > 1
  const selectedItem = productContext?.selectedItem
  const assemblyOptions = productContext?.assemblyOptions
  const seller =
    selectedSeller ?? getDefaultSeller(productContext?.selectedItem?.sellers)
  const commercialOffer = seller?.commertialOffer

  const outOfStock = !commercialOffer || commercialOffer?.AvailableQuantity <= 0
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

  // const isAvailable = checkAvailability(isEmptyContext, seller, available)

  const isDisabled = checkDisabled(isEmptyContext, assemblyOptions, disabled)

  const areAllSkuVariationsSelected = Boolean(
    !isEmptyContext && productContext?.skuSelector?.areAllVariationsSelected
  )

  const productLink = {
    linkText: product?.linkText,
    productId: product?.productId,
  }

  const [currentSc, setCurrentSc] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(true)
  const {  session, error } = useRenderSession()
  
  useEffect(() => {
    if(session){


      if(JSON.parse(atob(runtime.segmentToken)).channel === null) {
        setCurrentSc(session?.namespaces?.store?.channel?.value)
      } else {
        setCurrentSc(JSON.parse(atob(runtime.segmentToken)).channel)
      }
    } else {
      if(error){
        console.log(error.message);
      }
    }
  }, [session]);
  
  useEffect(() => {
    handleShowPrice()
  }, [currentSc]);

  

  const getSpecificationValue = (specName: string) => {
    const showPriceSpecIndex = productContext?.product?.properties.map(productSpecification => productSpecification.name).indexOf(specName)
    const showPriceString = (showPriceSpecIndex && showPriceSpecIndex !== -1) && productContext?.product?.properties[showPriceSpecIndex].values[0]
    const showPrice = showPriceString === "true" ? true : false    
    return showPrice
  }

  const handleShowPrice = () => {

    console.log("HANDLE SHOW PRICE!!!  --- " + currentSc );

    const isDiscontinued = getSpecificationValue('isDiscontinued')
    
    const community = getCommunityFromSalesChannel(currentSc);

    if (community !== "") {
      let showPrice = getSpecificationValue(`showPrice${community}`);
      let sellable = getSpecificationValue(`sellable${community}`);
      if((showPrice && outOfStock) || isDiscontinued || (!sellable || !showPrice)) 
        setIsAvailable(false)
      else 
        setIsAvailable(true);
      return true
    } else  {
      setIsAvailable(false);
      return false
    }
  }

  const getCommunityFromSalesChannel = (channel : String ):String => {
    switch (channel) {
      case '1': return "EPP";
      case "2" : return "FF";
      case "3" : return "VIP";
      default:  return "";
    }
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
      isSticky={isSticky}
    />
  )
})

Wrapper.schema = {
  title: 'admin/editor.add-to-cart.title',
}

export default Wrapper
