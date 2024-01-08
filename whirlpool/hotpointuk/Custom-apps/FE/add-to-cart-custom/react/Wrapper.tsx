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
  customProduct: any,
  addToCartButtonModalTitle: string,
  addToCartButtonModalText: string,
  addToCartButtonModalEmailMeResponse201: string,
  addToCartButtonModalEmailMeResponse304: string,
  addToCartButtonModalEmailMeResponse500: string,
  addToCartButtonModalEmailMeLabelName: string,
  addToCartButtonModalEmailMeLabelEmail: string,
  addToCartButtonModalEmailMeLabelConfirmEmail: string,
  addToCartButtonModalEmailMeLabelMandatoryField: string,
  addToCartButtonModalEmailMeLabelErrorIncompleteForm: string,
  addToCartButtonModalEmailMeLabelErrorDifferentMail: string,
  addToCartButtonModalEmailMeLabelErrorInvalidMail: string,
  addToCartButtonModalEmailMeLabelPrivacyNotice: string,
  addToCartButtonModalEmailMeLabelLinkPrivacyNotice: string,
  addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice: string
  addToCartButtonModalEmailMeLabelPrivacyData: string,
  addToCartButtonModalEmailMeLabelLinkPrivacyData: string,
  addToCartButtonModalEmailMeLabelLinkUrlPrivacyData: string
  addToCartButtonModalEmailMeLabelErrorPrivacyData: string

}
interface WindowRuntime extends Window {
  __RUNTIME__: any
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
    addToCartButtonModalText = "Receive an email when the part is back in stock",
    addToCartButtonModalTitle = "Receive an email when the part is back in stock",
    addToCartButtonModalEmailMeResponse201 = "Successfully subscribed",
    addToCartButtonModalEmailMeResponse304 = "User already subscribed",
    addToCartButtonModalEmailMeResponse500 = "Subscription failed",
    addToCartButtonModalEmailMeLabelName = "Name *",
    addToCartButtonModalEmailMeLabelEmail = "Email address *",
    addToCartButtonModalEmailMeLabelConfirmEmail = "Confirm your email address *",
    addToCartButtonModalEmailMeLabelMandatoryField = "* Denotes mandatory information",
    addToCartButtonModalEmailMeLabelErrorIncompleteForm = "All the fields are mandatory",
    addToCartButtonModalEmailMeLabelErrorDifferentMail = "Email addresses must the same",
    addToCartButtonModalEmailMeLabelErrorInvalidMail = "Email addresses must be valid",
    addToCartButtonModalEmailMeLabelPrivacyNotice = "I have read and understood the content of the ",
    addToCartButtonModalEmailMeLabelLinkPrivacyNotice = "privacy notice.",
    addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice = "https://www.hotpoint.co.uk/privacy-policy",
    addToCartButtonModalEmailMeLabelPrivacyData = "I consent to the processing of my personal data in order to allow Whirlpool to inform me by email when a product that I have expressed interest in becomes available again on the Website. Please be aware that we will only hold your data for a maximum of 30 days. If the product has not become available within that time please ",
    addToCartButtonModalEmailMeLabelLinkPrivacyData = "contact us.",
    addToCartButtonModalEmailMeLabelLinkUrlPrivacyData = "https://www.hotpointservice.co.uk/contact",
    addToCartButtonModalEmailMeLabelErrorPrivacyData = "The Checkbox must be checked"
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
  const { session, error } = useRenderSession()

  useEffect(() => {
    if (session) {
      if (JSON.parse(atob(runtime.segmentToken)).channel === null) {
        setCurrentSc(session?.namespaces?.store?.channel?.value)
      } else {
        setCurrentSc(JSON.parse(atob(runtime.segmentToken)).channel)
      }
    } else {
      if (error) {
      }
    }
  }, [session]);

  useEffect(() => {
    handleShowPrice()
  }, [currentSc]);



  const getShowPriceValue = (indexString: string) => {
    //@ts-ignore
    const showPriceSpecIndex = productContext?.product?.properties.map(productSpecification => productSpecification.name).indexOf(indexString)
    const showPriceString = (showPriceSpecIndex && showPriceSpecIndex !== -1) ? productContext?.product?.properties[showPriceSpecIndex].values[0] : ""
    const showPrice = showPriceString === "true" ? true : false
    return showPrice
  }

  const handleShowPrice = () => {
    const isDiscontinued = getShowPriceValue('isDiscontinued')
    switch (currentSc) {
      case '1':
        const showPriceA1 = getShowPriceValue('showPriceA1')
        const sellableA1 = getShowPriceValue('sellableA1')
        if ((showPriceA1 && outOfStock) || isDiscontinued || (!sellableA1 || !showPriceA1)) setIsAvailable(false)
        break;
      case '2':
        const showPriceGE = getShowPriceValue('showPriceGE')
        const sellableGE = getShowPriceValue('sellableGE')
        if ((showPriceGE && outOfStock) || isDiscontinued || (!sellableGE || !showPriceGE)) setIsAvailable(false)
        break;
      case '3':
        const showPriceA2 = getShowPriceValue('showPriceA2')
        const sellableA2 = getShowPriceValue('sellableA2')
        if ((showPriceA2 && outOfStock) || isDiscontinued || (!sellableA2 || !showPriceA2)) setIsAvailable(false)
        break;
      case '4':
        const showPriceANE = getShowPriceValue('showPriceANE')
        const sellableANE = getShowPriceValue('sellableANE')
        if ((showPriceANE && outOfStock) || isDiscontinued || (!sellableANE || !showPriceANE)) setIsAvailable(false)
        break;
      default:
        return false
    }
    return true
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
      //@ts-ignore
      addToCartButtonModalTitle={addToCartButtonModalTitle}
      addToCartButtonModalText={addToCartButtonModalText}
      //@ts-ignore
      addToCartButtonModalEmailMeResponse201={addToCartButtonModalEmailMeResponse201}
      addToCartButtonModalEmailMeResponse304={addToCartButtonModalEmailMeResponse304}
      addToCartButtonModalEmailMeResponse500={addToCartButtonModalEmailMeResponse500}
      //ts-ignore
      addToCartButtonModalEmailMeLabelName={addToCartButtonModalEmailMeLabelName}
      addToCartButtonModalEmailMeLabelEmail={addToCartButtonModalEmailMeLabelEmail}
      addToCartButtonModalEmailMeLabelConfirmEmail={addToCartButtonModalEmailMeLabelConfirmEmail}
      addToCartButtonModalEmailMeLabelMandatoryField={addToCartButtonModalEmailMeLabelMandatoryField}
      addToCartButtonModalEmailMeLabelErrorIncompleteForm={addToCartButtonModalEmailMeLabelErrorIncompleteForm}
      addToCartButtonModalEmailMeLabelErrorDifferentMail={addToCartButtonModalEmailMeLabelErrorDifferentMail}
      addToCartButtonModalEmailMeLabelErrorInvalidMail={addToCartButtonModalEmailMeLabelErrorInvalidMail}
      addToCartButtonModalEmailMeLabelPrivacyNotice={addToCartButtonModalEmailMeLabelPrivacyNotice}
      addToCartButtonModalEmailMeLabelPrivacyData={addToCartButtonModalEmailMeLabelPrivacyData}
      addToCartButtonModalEmailMeLabelErrorPrivacyData={addToCartButtonModalEmailMeLabelErrorPrivacyData}
      addToCartButtonModalEmailMeLabelLinkPrivacyNotice={addToCartButtonModalEmailMeLabelLinkPrivacyNotice}
      addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice={addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice}
      addToCartButtonModalEmailMeLabelLinkPrivacyData={addToCartButtonModalEmailMeLabelLinkPrivacyData}
      addToCartButtonModalEmailMeLabelLinkUrlPrivacyData={addToCartButtonModalEmailMeLabelLinkUrlPrivacyData}
    />
  )
})

Wrapper.schema = {
  title: 'admin/editor.add-to-cart.title',
  description: "Add to card Button",
  type: "object",
  properties: {
    addToCartButtonModalTitle: {
      title: "add to cart button modal title",
      description: "add to cart button modal title",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalText: {
      title: "add to cart button modal text",
      description: "add to cart button modal text",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeResponse201: {
      title: "Add To Cart Button Modal Email Me Response 201",
      description: "Add To Cart Button Modal Email Me Response 201",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeResponse304: {
      title: "Add To Cart Button Modal Email Me Response 304",
      description: "Add To Cart Button Modal Email Me Response 304",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeResponse500: {
      title: "Add To Cart Button Modal Email Me Response 500",
      description: "Add To Cart Button Modal Email Me Response 500",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelName: {
      title: "Add To Cart Button Modal Email Me Label Name",
      description: "Add To Cart Button Modal Email Me Label Name",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelEmail: {
      title: "Add To Cart Button Modal Email Me Label Email",
      description: "Add To Cart Button Modal Email Me Label Email",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelConfirmEmail: {
      title: "Add To Cart Button Modal Email Me Label Confirm Email",
      description: "Add To Cart Button Modal Email Me Confirm Email",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelMandatoryField: {
      title: "Add To Cart Button Modal Email Me Label Mandatory Fields",
      description: "Add To Cart Button Modal Email Me Label Mandatory Fields",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorIncompleteForm: {
      title: "Add To Cart Button Modal Email Me Label Error Incomplete Form",
      description: "Add To Cart Button Modal Email Me Error Incomplete Form",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorDifferentMail: {
      title: "Add To Cart Button Modal Email Me Label Error Different Mail",
      description: "Add To Cart Button Modal Email Me Label Erro Different Mail",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorInvalidMail: {
      title: "Add To Cart Button Modal Email Me Label Error Invalid Mail",
      description: "Add To Cart Button Modal Email Me Label Error Invalid Mail",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelPrivacyNotice: {
      title: "Add To Cart Button Modal Email Me Label Privacy Notice",
      description: "Add To Cart Button Modal Email Me Label Privacy Notice",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelLinkPrivacyNotice: {
      title: "Add To Cart Button Modal Email Me Label Link Privacy Notice",
      description: "Add To Cart Button Modal Email Me Label Link Privacy Notice",
      default: undefined,
      type: "string",
    },

    addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice: {
      title: "Add To Cart Button Modal Email Me Label Link Url Privacy Notice",
      description: "Add To Cart Button Modal Email Me Label Link Url Privacy Notice",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelPrivacyData: {
      title: "Add To Cart Button Modal Email Me Label Privacy Data",
      description: "Add To Cart Button Modal Email Me Label Privacy Data",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelLinkPrivacyData: {
      title: "Add To Cart Button Modal Email Me Label Link Privacy Data",
      description: "Add To Cart Button Modal Email Me Label Link Privacy Data",
      default: undefined,
      type: "string",
    },

    addToCartButtonModalEmailMeLabelLinkUrlPrivacyData: {
      title: "Add To Cart Button Modal Email Me Label Link Url Privacy Data",
      description: "Add To Cart Button Modal Email Me Label Link Url Privacy Data",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorPrivacyData: {
      title: "Add To Cart Button Modal Email Me Label Error Privacy Data",
      description: "Add To Cart Button Modal Email Me Label Error Privacy Data",
      default: undefined,
      type: "string",
    }
  }
}

export default Wrapper
