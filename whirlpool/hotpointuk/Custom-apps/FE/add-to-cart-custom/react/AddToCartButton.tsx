import React, { useEffect, useRef, useState } from 'react';
import {
  defineMessages, FormattedMessage,
  MessageDescriptor,
  useIntl
} from 'react-intl';
import { Utils } from 'vtex.checkout-resources';
import { useCssHandles } from 'vtex.css-handles';
import { useDevice } from 'vtex.device-detector';
import { useOrderItems } from 'vtex.order-items/OrderItems';
import { usePixel } from 'vtex.pixel-manager';
import { ProductTypes, useProduct, useProductDispatch } from 'vtex.product-context';
import { useRuntime } from 'vtex.render-runtime';
import { usePWA } from 'vtex.store-resources/PWAContext';
import { Button, Tooltip } from 'vtex.styleguide';
// import addToCartIcon from './assets/add-to-cart-sticky-mob.svg'

import { Checkbox } from 'vtex.styleguide';
import useMarketingSessionParams from './hooks/useMarketingSessionParams';
import { CartItem } from './modules/catalogItemToCart';
import { runtime } from './__fixtures__/runtime';

interface ProductLink {
  linkText?: string
  productId?: string
}

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  multipleAvailableSKUs: boolean
  customToastUrl?: string
  customOneClickBuyLink?: string
  skuItems: CartItem[]
  showToast: Function
  allSkuVariationsSelected: boolean
  text?: string
  unavailableText?: string
  productLink: ProductLink
  onClickBehavior: 'add-to-cart' | 'go-to-product-page' | 'ensure-sku-selection'
  customPixelEventId?: string
  addToCartFeedback?: 'customEvent' | 'toast'
  onClickEventPropagation: 'disabled' | 'enabled',
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

// We apply a fake loading to accidental consecutive clicks on the button
const FAKE_LOADING_DURATION = 500

const CSS_HANDLES = [
  'buttonText',
  'buttonDataContainer',
  'buttonContainer',
  'buttonContainerMobile',
  'tooltipLabelText',
  'addToCartIconContainer',
  'addToCartIcon',
  'addToCartIconContainerSticky',
  'buttonDataContainerPdp',
  "availableButton",
  "obsoleteButton",
  "unavailableButton",
  "cartIcon",
  "obsoleteButtonPdp",
  "unavailableButtonPdp",
  "emailMeModal",
  "emailMeModalWrapper",
  "emailMeModalOverlay",
  "emailMeModalContainer",
  "emailMeModalCentered",
  "emailMeModalClose",
  "emailMeModalTitle",
  "emailMeModalImageDetailsRow",
  "emailMeImage",
  "emailMeModalProductDetailsColumn",
  "emailMeModalProductName",
  "emailMeModalProductReference",
  "emailMeModalSubitle",
  "emailMeModalForm",
  "emailMeModalInput",
  "emailMeModalButtonsRow",
  "emailMeModalButtonClose",
  "emailMeModalButtonSend",
  "emailMeModalFormText",
  "emailMeModalFormTextError",
  "emailMeModalOutOfStock",
  "emailMeModalOutOfStockIcon",
  "emailMeModalOutOfStockLabel",
  "unavailableButtonPdpAccessory",
  "emailMeModalFormWrapper",
  "emailMeResponseModalText",
  "outOfStockPdpAccessory",
  "emailMeCheckbox",
  "emailMeCheckboxLabel"
] as const

const messages = defineMessages({
  success: { id: 'store/add-to-cart.success' },
  duplicate: { id: 'store/add-to-cart.duplicate' },
  error: { id: 'store/add-to-cart.failure' },
  seeCart: { id: 'store/add-to-cart.see-cart' },
  skuVariations: {
    id: 'store/add-to-cart.select-sku-variations',
  },
  schemaTitle: { id: 'admin/editor.add-to-cart.title' },
  schemaTextTitle: { id: 'admin/editor.add-to-cart.text.title' },
  schemaTextDescription: { id: 'admin/editor.add-to-cart.text.description' },
  schemaUnavailableTextTitle: {
    id: 'admin/editor.add-to-cart.text-unavailable.title',
  },
  schemaUnavailableTextDescription: {
    id: 'admin/editor.add-to-cart.text-unavailable.description',
  },
})

const mapSkuItemForPixelEvent = (skuItem: CartItem) => {
  // Changes this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = skuItem.category ? skuItem.category.slice(1, -1) : ''

  return {
    skuId: skuItem.id,
    ean: skuItem.ean,
    variant: skuItem.variant,
    price: skuItem.price,
    name: skuItem.name,
    quantity: skuItem.quantity,
    productId: skuItem.productId,
    productRefId: skuItem.productRefId,
    brand: skuItem.brand,
    category,
    detailUrl: skuItem.detailUrl,
    imageUrl: skuItem.imageUrl,
    referenceId: skuItem?.referenceId?.[0]?.Value,
    seller: skuItem.seller,
    sellerName: skuItem.sellerName,
  }
}

function AddToCartButton(props: Props) {
  const {
    text,
    isOneClickBuy,
    available,
    disabled,
    skuItems,
    showToast,
    customToastUrl,
    unavailableText,
    customOneClickBuyLink,
    allSkuVariationsSelected = true,
    productLink,
    onClickBehavior,
    multipleAvailableSKUs,
    customPixelEventId,
    addToCartFeedback,
    onClickEventPropagation = 'disabled'
  } = props
  const modalTitle = props.addToCartButtonModalTitle;
  const modalText = props.addToCartButtonModalText;
  const emailMeResponse201 = props.addToCartButtonModalEmailMeResponse201;
  const emailMeResponse304 = props.addToCartButtonModalEmailMeResponse304;
  const emailMeResponse500 = props.addToCartButtonModalEmailMeResponse500;
  const addToCartButtonModalEmailMeLabelName = "Name *";
  const addToCartButtonModalEmailMeLabelEmail = "Email address *";
  const addToCartButtonModalEmailMeLabelConfirmEmail = "Confirm your email address *";
  const addToCartButtonModalEmailMeLabelMandatoryField = "* Denotes mandatory information";
  const addToCartButtonModalEmailMeLabelErrorIncompleteForm = "All the fields are mandatory";
  const addToCartButtonModalEmailMeLabelErrorDifferentMail = "Email addresses must the same";
  const addToCartButtonModalEmailMeLabelErrorInvalidMail = "Email addresses must be valid";
  const addToCartButtonModalEmailMeLabelPrivacyNotice = "I have read and understood the content of the ";
  const addToCartButtonModalEmailMeLabelLinkPrivacyNotice = "privacy notice.";
  const addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice = "https://www.hotpoint.co.uk/privacy-policy";
  const addToCartButtonModalEmailMeLabelPrivacyData = "I consent to the processing of my personal data in order to allow Whirlpool to inform me by email when a product that I have expressed interest in becomes available again on the Website. Please be aware that we will only hold your data for a maximum of 30 days. If the product has not become available within that time please ";
  const addToCartButtonModalEmailMeLabelLinkPrivacyData = "contact us.";
  const addToCartButtonModalEmailMeLabelLinkUrlPrivacyData = "https://www.hotpointservice.co.uk/contact";
  const addToCartButtonModalEmailMeLabelErrorPrivacyData = "The Checkbox must be checked";

  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { addItem } = useOrderItems()
  const productContextDispatch = useProductDispatch()
  const { rootPath = '', navigate, page } = useRuntime()
  const { url: checkoutURL, major } = Utils.useCheckoutURL()
  const { push } = usePixel();
  const { settings = {}, showInstallPrompt = undefined } = usePWA() || {}
  const { promptOnCustomEvent } = settings
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const [isFakeLoading, setFakeLoading] = useState(false)
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const [showModal, setShowModal] = useState(false)
  const productContext = useProduct();
  const seller = (productContext?.selectedItem?.sellers[0] as ProductTypes.Seller)
  const availableProductQuantity = seller?.commertialOffer?.AvailableQuantity
  const isPdp = page === 'store.product' || page === "store.custom#unsellable-products" || page === "store.custom#discontinued-products" || page === "store.account";
  const status = productContext?.product?.properties?.filter((e: any) => e.name == "status")[0]?.values[0]
  const isSpare = productContext?.product?.properties?.filter((e: any) => e.name == "isSparePart")[0]?.values[0]
  const isAccessory = productContext?.product?.properties?.filter((e: any) => e.name == "constructionType")[0]?.values[0]

  // collect toast and fake loading delay timers
  const timers = useRef<Record<string, number | undefined>>({})
  const [emailMeUserName, setEmailMeUserName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [confirmEmailAddress, setConfirmEmailAddress] = useState("")
  const [showErrorMail, setShowErrorMail] = useState(false)
  const [showIncompleteForm, setShowIncompleteForm] = useState(false)
  const [showInvalidMail, setShowInvalidMail] = useState(false)
  const [showPrivacyCheckboxError, setShowPrivacyCheckboxError] = useState(false)
  const [showEmailMeResponseModal, setShowEmailMeResponseModal] = useState(false)
  const [emailMeResponseStatus, setEmailMeResponseStatus] = useState("")
  const [emailMeCheckedPrivacy, setEmailMeCheckedPrivacy] = useState(false)
  //const [emailMeCheckedPersonalData, setEmailMeCheckedPersonalData] = useState(false)
  const emailMeFormLanguage = runtime.culture.locale;
  const outOfStockIcon = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="%23b24c24" fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1Zm3.707 8.707a1 1 0 0 0-1.414-1.414L12 10.586L9.707 8.293a1 1 0 1 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293Z" clip-rule="evenodd"%2F%3E%3C%2Fsvg%3E'
  // prevent timers from doing something if the component was unmounted
  useEffect(function onUnmount() {
    return () => {
      // We disable the eslint rule because we just want to clear the current existing timers
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    const currentTimers = timers.current

    if (isFakeLoading) {
      currentTimers.loading = window.setTimeout(
        () => setFakeLoading(false),
        FAKE_LOADING_DURATION
      )
    }
  }, [isFakeLoading])

  useEffect(() => {
    setShowErrorMail(false)
    setShowInvalidMail(false)
    setShowIncompleteForm(false)
    setShowPrivacyCheckboxError(false)
  }, [emailAddress, confirmEmailAddress, emailMeUserName])

  const handleCloseModal: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setShowModal(false)
  }

  const preventEvent: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
  }

  const resolveToastMessage = (success: boolean) => {
    if (!success) return translateMessage(messages.error)

    return translateMessage(messages.success)
  }

  const toastMessage = ({ success }: { success: boolean }) => {
    const message = resolveToastMessage(success)

    const action = success
      ? { label: translateMessage(messages.seeCart), href: customToastUrl }
      : undefined

    showToast({ message, action })
  }
  const handleEmailMe: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setShowModal(true)
  }
  function validateEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }


  const handleSendModal = () => {
    if (emailAddress && confirmEmailAddress && emailMeUserName) {
      if (emailAddress === confirmEmailAddress) {
        if (validateEmail(emailAddress)) {
          if (emailMeCheckedPrivacy) {
            sendMail();
            setShowModal(false)
          } else {
            setShowPrivacyCheckboxError(true)
          }
        } else {
          setShowInvalidMail(true)
        }
      }
      else {
        setShowErrorMail(true)
      }
    }
    else {
      setShowIncompleteForm(true)
    }
  }

  const sendMail = () => {
    fetch('/v1/backinstock/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailAddress,
        refId: productContext?.product?.productReference,
        userName: emailMeUserName || "",
        language: emailMeFormLanguage
      })
    })
      .then(res => {
        setEmailMeResponseStatus(res.status.toString())
        return res.text()
      })
      .then(() => {
        setShowEmailMeResponseModal(true)
      })
      .catch(error => { console.log(error) })
  }

  /*const emailMeHandleChangePrivacy = () => {
    return !emailMeCheckedPrivacy

  }*/

  const handleAddToCart: React.MouseEventHandler = event => {
    if (onClickEventPropagation === 'disabled') {
      event.stopPropagation()
      event.preventDefault()
    }

    setFakeLoading(true)

    const productLinkIsValid = Boolean(
      productLink.linkText && productLink.productId
    )
    const shouldNavigateToProductPage =
      onClickBehavior === 'go-to-product-page' ||
      (onClickBehavior === 'ensure-sku-selection' && multipleAvailableSKUs)

    if (productLinkIsValid && shouldNavigateToProductPage) {
      navigate({
        page: 'store.product',
        params: {
          slug: productLink.linkText,
          id: productLink.productId,
        },
      })
      return
    }

    addItem(skuItems, { ...utmParams, ...utmiParams })

    const pixelEventItems = skuItems.map(mapSkuItemForPixelEvent)
    const pixelEvent =
      customPixelEventId && addToCartFeedback === 'customEvent'
        ? {
          id: customPixelEventId,
          event: 'addToCart',
          items: pixelEventItems,
        }
        : {
          event: 'addToCart',
          items: pixelEventItems,
        }

    // @ts-expect-error the event is not typed in pixel-manager
    push(pixelEvent)

    if (isOneClickBuy) {
      if (
        major > 0 &&
        (!customOneClickBuyLink || customOneClickBuyLink === checkoutURL)
      ) {
        navigate({ to: checkoutURL })
      } else {
        window.location.assign(
          `${rootPath}${customOneClickBuyLink ?? checkoutURL}`
        )
      }
    }

    addToCartFeedback === 'toast' &&
      (timers.current.toast = window.setTimeout(() => {
        toastMessage({ success: true })
      }, FAKE_LOADING_DURATION))

    /* PWA */
    if (promptOnCustomEvent === 'addToCart' && showInstallPrompt) {
      showInstallPrompt()
    }

    if (!isPdp) {
      //@ts-ignore
      document.getElementsByClassName("vtex-minicart-2-x-minicartIconContainer")[0].click()
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (productContextDispatch) {
      productContextDispatch({
        type: 'SET_BUY_BUTTON_CLICKED',
        args: { clicked: true },
      })
    }

    if (allSkuVariationsSelected) {
      handleAddToCart(e)
    }
  }

  /*
   * If text is an empty string it should render the default message
   */
  const { isMobile } = useDevice()

  const availableButtonContent = isMobile ? (
    <div className={handles.buttonDataContainer}>
      <div className={`${handles.buttonDataContainerPdp} flex justify-center`}>
        {text ? (
          <span className={handles.buttonText}>{text}</span>
        ) : (
          <FormattedMessage id="store/add-to-cart.add-to-cart">
            {message => <span className={handles.buttonText}>{message}</span>}
          </FormattedMessage>
        )}
      </div>
      <div
        className={`${handles.addToCartIconContainerSticky} flex justify-center`}
      >
        <FormattedMessage id="store/add-to-cart.add-to-cart">
          {message => <span className={handles.buttonText}>{message}</span>}
        </FormattedMessage>

        {/*<img*/}
        {/*  src={addToCartIcon}*/}
        {/*  alt="Aggiungi al carello"*/}
        {/*  className={handles.addToCartIcon}*/}
        {/*/>*/}
      </div>
    </div>
  ) : (
    <div className={`${handles.buttonDataContainer} flex justify-center`}>
      {text ? (
        <span className={handles.buttonText}>{text}</span>
      ) : (
        <FormattedMessage id="store/add-to-cart.add-to-cart">
          {message => <span className={handles.buttonText}>{message}</span>}
        </FormattedMessage>
      )}
    </div>
  )

  const unavailableButtonContent = unavailableText ? (
    <span className={handles.buttonText}>{unavailableText}</span>
  ) : (
    <FormattedMessage id="store/add-to-cart.label-unavailable">
      {message => <span className={handles.buttonText}>{message}</span>}
    </FormattedMessage>
  )


  const tooltipLabel = (
    <span className={handles.tooltipLabelText}>
      {intl.formatMessage(messages.skuVariations)}
    </span>
  )
  let ButtonWithLabel = (
    (availableProductQuantity > 0 ? <div className={[handles.buttonContainer, !isPdp ? handles.availableButton : ""].join(" ")}>
      <Button
        block
        isLoading={isFakeLoading}
        // disabled={disabled || !available}
        onClick={handleClick}
      >
        {isPdp ? (
          <> {availableButtonContent}</>
        ) :
        <> {availableButtonContent}</>
        }

      </Button>
    </div> :

      <>{isSpare === "true" || isAccessory === "Accessory" ? (
        <>
          <button className={[handles.buttonContainer, !isPdp ? handles.unavailableButton : handles.unavailableButtonPdp].join(" ")}
                  onClick={
                    (e) => {
                      preventEvent(e);
                      handleEmailMe(e);
                      push({
                        //@ts-ignore
                        'event': 'emailMeWhenAvailableSpare',
                        'eventCategory': 'Email Me When Available',
                        'eventAction': productContext?.product?.productReference + " - " + productContext?.product?.productName
                      })
                    }
                  }>

            EMAIL ME WHEN AVAILABLE
          </button>
          <div className={handles.emailMeModalContainer}>
            {showModal && (
              <div className={handles.emailMeModalCentered} onClick={(e) => preventEvent(e)}>
                <div onClick={handleCloseModal} className={handles.emailMeModalOverlay}></div>
                <div className={handles.emailMeModalWrapper}>
                  <div className={handles.emailMeModal}
                  >
                    <div
                      className={handles.emailMeModalClose}
                      onClick={handleCloseModal}
                    >
                      &times;
                    </div>
                    <div className={handles.emailMeModalTitle}>
                      {modalTitle}
                    </div>
                    <div className={handles.emailMeModalImageDetailsRow}>
                      {/* div row per immagine e dati prodotto */}
                      <img src={productContext?.selectedItem?.images[0].imageUrl} className={handles.emailMeImage}></img>
                      <div className={handles.emailMeModalProductDetailsColumn}>
                        <div className={handles.emailMeModalProductName}>
                          {productContext?.selectedItem?.name}
                        </div>
                        <div className={handles.emailMeModalProductReference}>
                          Reference number: {productContext?.product?.productReference}
                        </div>
                        <div className={handles.emailMeModalOutOfStock}>
                          <div className={handles.emailMeModalOutOfStockIcon}>
                            <img src={outOfStockIcon} />
                          </div>
                          <div className={handles.emailMeModalOutOfStockLabel}>Out of stock</div>
                        </div>
                      </div>

                    </div>

                    <div className={handles.emailMeModalSubitle}>
                      {modalText}
                    </div>
                    <div className={handles.emailMeModalForm}>
                      <div className={handles.emailMeModalFormWrapper}>
                        <input
                          placeholder={addToCartButtonModalEmailMeLabelName}
                          className={handles.emailMeModalInput}
                          value={emailMeUserName}
                          onChange={(e) => {
                            setEmailMeUserName(e.currentTarget.value)
                          }} />
                        <label className={handles.emailMeModalFormText}>{addToCartButtonModalEmailMeLabelName}</label>
                      </div>
                      <div className={handles.emailMeModalFormWrapper}>

                        <input
                          placeholder={addToCartButtonModalEmailMeLabelEmail}
                          className={handles.emailMeModalInput}
                          value={emailAddress}
                          onChange={(e) => {
                            setEmailAddress(e.currentTarget.value)
                          }} />
                        <label className={handles.emailMeModalFormText}>{addToCartButtonModalEmailMeLabelEmail}</label>
                      </div>
                      <div className={handles.emailMeModalFormWrapper}>

                        <input
                          placeholder={addToCartButtonModalEmailMeLabelConfirmEmail}
                          className={handles.emailMeModalInput}
                          value={confirmEmailAddress}
                          onChange={(e) => {
                            setConfirmEmailAddress(e.currentTarget.value)
                          }} />
                        <label className={handles.emailMeModalFormText}>{addToCartButtonModalEmailMeLabelConfirmEmail}</label>
                      </div>
                      <p>{addToCartButtonModalEmailMeLabelMandatoryField}</p>
                      {showIncompleteForm &&
                        <div className={handles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorIncompleteForm}</div>}
                      {showErrorMail &&
                        <div className={handles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorDifferentMail}</div>}
                      {showInvalidMail &&
                        <div className={handles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorInvalidMail}</div>}
                      <p>{addToCartButtonModalEmailMeLabelPrivacyNotice}<a href={addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice} target="_blank" onClick={(e) => e.stopPropagation()}>{addToCartButtonModalEmailMeLabelLinkPrivacyNotice}</a></p>
                      <div>
                        <label
                        className={handles.emailMeCheckboxLabel}
                        onClick={() => {
                          setEmailMeCheckedPrivacy(!emailMeCheckedPrivacy)
                        }
                        }>
                          <div className={handles.emailMeCheckbox}>
                          <Checkbox
                            checked={emailMeCheckedPrivacy}
                            onChange={() => setEmailMeCheckedPrivacy(!emailMeCheckedPrivacy)}
                          />
                          </div>
                          <div>
                          {addToCartButtonModalEmailMeLabelPrivacyData}<a href={addToCartButtonModalEmailMeLabelLinkUrlPrivacyData} target="_blank"  onClick={(e) => e.stopPropagation()}>{addToCartButtonModalEmailMeLabelLinkPrivacyData}</a>
                          </div>
                          </label>
                      </div>
                      {showPrivacyCheckboxError &&
                        <div className={handles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorPrivacyData} </div>}

                    </div>
                    <div className={handles.emailMeModalButtonsRow}>
                      {/* row bottoni */}
                      <div
                        className={handles.emailMeModalButtonClose}
                        onClick={() => setShowModal(false)}>Close</div>
                      <div
                        className={handles.emailMeModalButtonSend}
                        onClick={() => { handleSendModal() }}>Send</div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {showEmailMeResponseModal && (
              <div onClick={(e) => preventEvent(e)}>
                <div onClick={handleCloseModal}
                  className={handles.emailMeModalOverlay}></div>
                <div className={handles.emailMeModalWrapper}>
                  <div className={handles.emailMeModal}
                  >
                    <div
                      className={handles.emailMeModalClose}
                      onClick={() => setShowEmailMeResponseModal(false)}
                    >
                      &times;
                    </div>
                    <div className={handles.emailMeResponseModalText}>
                      {emailMeResponseStatus === "201" ?
                        <div>{emailMeResponse201}</div> :
                        emailMeResponseStatus === "304" ?
                          <div>{emailMeResponse304}</div> :
                          emailMeResponseStatus === "500" ?
                            <div>{emailMeResponse500}</div> :
                            <div></div>
                      }
                    </div>






                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )  :

          <div style={{ display: isPdp ? 'none' : 'none' }} className={[handles.buttonContainer, !isPdp ? handles.unavailableButton : ""].join(" ")}>
            <Button
              block
              isLoading={isFakeLoading}
              disabled={disabled || !available}
              onClick={handleClick}
            >
              {unavailableButtonContent}
            </Button>
          </div>

      }</>

    )
  )

  if (status === "obsolete") {
    ButtonWithLabel = <a href={`/${productContext?.product?.properties?.filter((e: any) => e.name == "linkTextSubstitute")[0]?.values[0]}/p?jcode=${productContext?.product?.productReference}`} className={[handles.buttonContainer, !isPdp ? handles.obsoleteButton : handles.obsoleteButtonPdp].join(" ")}
      onClick={
        (e) => {
          preventEvent(e);
          let  href = e.currentTarget.href;

          push({
              //@ts-ignore
            'event': 'seeSubstituteUkSpare',
            'eventCategory': 'seeSubstituteUkSpareSee Substitute',
            'eventAction': productContext?.product?.productReference + " - " + productContext?.product?.productName
          })

          setTimeout(() => {
            window.location.href = encodeURI(href)
          }, 500);
        }}>
      VIEW SUBSTITUTES
    </a>
  }


  return allSkuVariationsSelected ? (
    ButtonWithLabel
  ) : (
    <Tooltip trigger="click" label={tooltipLabel}>
      {ButtonWithLabel}
    </Tooltip>
  )
}

export default AddToCartButton
