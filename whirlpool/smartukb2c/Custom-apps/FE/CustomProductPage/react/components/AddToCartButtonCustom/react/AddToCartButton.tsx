// @ts-nocheck

import React, { useState, useEffect, useRef, useContext } from 'react'
import { isEmpty, path } from 'ramda'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'
import { Button, Tooltip } from 'vtex.styleguide'
import { Utils } from 'vtex.checkout-resources'
import { useRuntime } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import { useProductDispatch } from 'vtex.product-context'
import { usePWA } from 'vtex.store-resources/PWAContext'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { ProductContext } from 'vtex.product-context'
import { CartItem } from './modules/catalogItemToCart'
import useMarketingSessionParams from './hooks/useMarketingSessionParams'
import ShoppingCart from './Icons/ShoppingCart'
import SyncIcon from './Icons/SyncIcon'
import { Modal } from 'vtex.styleguide'
import IconMail from './Icons/IconMail'
import styles from './styles.css';
import UnavailableIcon from './Icons/UnavailableIcon'
import products from './graphql/products.graphql'
import { useQuery } from 'react-apollo'
interface ProductLink {
  linkText?: string
  productId?: string
}


interface Props {
  isOneClickBuy: boolean
  available: string | undefined
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
  onClickEventPropagation: 'disabled' | 'enabled'
  productName?: string
  productReference?: string
  productImage?: any
  product?: any
}

// We apply a fake loading to accidental consecutive clicks on the button
const FAKE_LOADING_DURATION = 500


const messages = defineMessages({
  success: { id: 'store/add-to-cart.successCustom' },
  duplicate: { id: 'store/add-to-cart.duplicateCustom' },
  email: { id: "store/add-to-cart.email-meCustom" },
  modalHeader: { id: "store/add-to-cart.modal-headerCustom" },
  confirmEmail: { id: "store/add-to-cart.confirm-email-addressCustom" },
  emailAddres: { id: "store/add-to-cart.email-addressCustom" },
  nameAddres: { id: "store/add-to-cart.name-addressCustom" },
  iHaveRead: { id: "store/add-to-cart.i-read-understoodCustom" },
  terms: { id: "store/add-to-cart.termsCustom" },
  validEmail: { id: "store/add-to-cart.enter-valid-emailCustom" },
  send: { id: "store/add-to-cart.send" },
  required: {id: "store/add-to-cart.required"},
  close: { id: "store/add-to-cart.close" },
  emailMatch: { id: "store/add-to-cart.email-should-matchCustom" },
  weWillContact: { id: "store/add-to-cart.we-will-contactCustom" },
  currentLanguage: { id: "store/add-to-cart.checkLanguage" },
  error: { id: 'store/add-to-cart.failureCustom' },
  seeCart: { id: 'store/add-to-cart.see-cartCustom' },
  skuVariations: {
    id: 'store/add-to-cart.select-sku-variationsCustom',
  },
  schemaTitle: { id: 'admin/editor.add-to-cart.titleCustom' },
  schemaTextTitle: { id: 'admin/editor.add-to-cart.text.titleCustom' },
  schemaTextDescription: { id: 'admin/editor.add-to-cart.text.descriptionCustom' },
  schemaUnavailableTextTitle: {
    id: 'admin/editor.add-to-cart.text-unavailable.titleCustom',
  },
  schemaUnavailableTextDescription: {
    id: 'admin/editor.add-to-cart.text-unavailable.descriptionCustom',
  },
})

const mapSkuItemForPixelEvent = (skuItem: CartItem) => {
  // Changes this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = skuItem.category ? skuItem?.category?.slice(1, -1) : ''

  return {
    skuId: skuItem?.id,
    ean: skuItem?.ean,
    variant: skuItem?.variant,
    price: skuItem?.price,
    name: skuItem?.name,
    quantity: skuItem?.quantity,
    productId: skuItem?.productId,
    productRefId: skuItem?.productRefId,
    brand: skuItem?.brand,
    category,
    detailUrl: skuItem?.detailUrl,
    imageUrl: skuItem?.imageUrl,
    referenceId: skuItem?.referenceId?.[0]?.Value,
    seller: skuItem?.seller,
    sellerName: skuItem?.sellerName,
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
    onClickEventPropagation = 'disabled',
    productName,
    productReference,
    productImage,
    product
  } = props

  const valuesFromContext = useContext(ProductContext)
  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }
  const availabilityObject: any = path(['properties'], product)

  const intl = useIntl()
  const { addItem } = useOrderItems()
  const productContextDispatch = product
  const { rootPath = '', navigate } = useRuntime()
  const { url: checkoutURL, major } = Utils.useCheckoutURL()
  const { push } = usePixel()
  const { settings = {}, showInstallPrompt = undefined } = usePWA() || {}
  const { promptOnCustomEvent } = settings
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const [isFakeLoading, setFakeLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [inputValue2, setInputValue2] = useState("")
  const [inputValue3, setInputValue3] = useState("");
  const [match, setMatch] = useState(true)
  const [requestSend, setRequestSend] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [invalidName, setInvalidName] = useState(false)

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  // collect toast and fake loading delay timers
  const timers = useRef<Record<string, number | undefined>>({})

  //Obsolete product

  const obsolete = product.substitute;
  const jCode = product.jCode;
  const hazardous = product.hazardous

  const { loading, error, data } = useQuery(products, {
    variables: {
      "field": "reference",
      "values": [obsolete]
    }
  });
  // prevent timers from doing something if the component was unmounted
  useEffect(function onUnmount() {
    return () => {
      // We disable the eslint rule because we just want to clear the current existing timers
      // eslint-disable-next-line react-hooks/exhaustive-deps
      //Object.values(timers.current).forEach(clearTimeout)
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

  const testFunction: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setModalOpen(true);
  }

  const obsoloteFunction: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    window.location.href = window.location.href.includes("vtex") ? encodeURI(`${window.location.origin}/${data.productsByIdentifier[0].linkText}/p${window.location.search}&jcode=${jCode}&qty=${quantity}`) : encodeURI(`${window.location.origin}/${translateMessage(messages.currentLanguage)}/${data.productsByIdentifier[0].linkText}/p?jcode=${jCode}&qty=${quantity}`)
  }

  const closeModal: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setModalOpen(false)
    setInputValue("")
    setInputValue2("")
    setMatch(true)
    setRequestSend(false)
    setInvalidEmail(false)
  }


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
    document.getElementsByClassName("vtex-minicart-2-x-cartIcon")[0].parentElement.click()
  }

  const handleClick = (e: React.MouseEvent) => {


    if (allSkuVariationsSelected) {
      handleAddToCart(e)
    }
  }

  const onInputChange = (e: any) => {
    setInvalidEmail(false)
    setInputValue(e.target.value)
  }

  const onInputChange2 = (e: any) => {
    setInvalidEmail(false)
    setInputValue2(e.target.value)
  }
  const onInputChange3 = (e: any) => {
    setInputValue3(e.target.value)
    setInvalidName(e.target.value.length === 0)
  }
  const checkboxChange = () => {
    setCheckboxValue(!checkboxValue)
  }

  const sendButton = () => {
    const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (inputValue == inputValue2) {
      if (!inputValue.match(regex) || !inputValue2.match(regex)) {
        setMatch(false)
      }
      else {

        if (!invalidName) {
          var brand = document.location.href.includes("indesit") ? "indesit" : "hotpoint";

          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "email": inputValue,
              "name": inputValue3,
              "skuId": skuItems[0].id,
              "skuRefId": skuItems[0].referenceId[0].Value,
              "brand": brand,
              "notificationSend": false
            }),
          };
          const fetchUrlPatch = "/v1/document/AS";
          fetch(fetchUrlPatch, options).then(() => setRequestSend(true));


        }
      }
    }

    else {
      if (!inputValue.match(regex) || !inputValue2.match(regex)) {
        setInvalidEmail(true)
      }
      else {
        setMatch(false)
      }

    }
    setInvalidName(inputValue3.length === 0);



  }

  /*
   * If text is an empty string it should render the default message
   */
  const availableButtonContent = (
    <div className={`${styles.buttonDataContainer} flex justify-center`}>
      {text ? (
        <span className={styles.buttonText}>{text}</span>
      ) : (
        <FormattedMessage id="store/add-to-cart.add-to-cart-pdpCustom">
          {message => <span className={styles.buttonText}>add to basket<ShoppingCart className={styles.shoppingIcon} /></span>}
        </FormattedMessage>
      )}
    </div>
  )

  const unavailableButtonContent = unavailableText ? (
    <div className={`${styles.buttonDataContainer} flex justify-center`}>
      <span className={styles.buttonText}>{unavailableText} </span>
    </div>
  ) : (
    <div className={`${styles.buttonDataContainer} flex justify-center`}>
      <FormattedMessage id="store/add-to-cart.label-unavailable-plpCustom">
        {message => <span className={styles.buttonText}>{message}<SyncIcon className={styles.syncIcon} /></span>}
      </FormattedMessage>
    </div>
  )

  const tooltipLabel = (
    <span className={styles.tooltipLabelText}>
      {intl.formatMessage(messages.skuVariations)}
    </span>
  )


  const ButtonWithLabel = (
    ((available == "out of stock" || available == "ausverkauft" || available == "Esaurito" || available == "En rupture de stock" || hazardous == "vero" || hazardous == "true" || hazardous == "vrai") ?
      <div onClick={testFunction} className={`${styles.buttonDataContainerMail} flex justify-center`}>
        <IconMail className={styles.mailIcon} />
        <a style={{ width: "100%", color: "black", fontWeight: "bold", textDecoration: "underline" }}>
          <FormattedMessage id="store/add-to-cart.email-meCustom">
            {message => <span className={[styles.buttonText, styles.buttonTextEmail].join(" ")}>Email me when available</span>}
          </FormattedMessage>
          <Modal
            centered
            isOpen={isModalOpen}
            onClose={closeModal}
            bottomBar={
              <div className="nowrap">
                <span className={styles.closeButton}>
                  <Button variation="tertiary" onClick={closeModal}>
                  <span className={styles.buttonText}>Close</span>
                  </Button>
                </span>
                <span className={styles.sendButton}>
                  {!requestSend && <Button onClick={sendButton} style={{ background: "black !important" }}>
                  <span className={styles.buttonText}>Send</span>
                  </Button>}
                </span>
              </div>
            }
          >

            <div className={styles.modal}>
              <FormattedMessage id="store/add-to-cart.modal-headerCustom">
                {message => <p className={styles.subHeader}>{message}</p>}
              </FormattedMessage>
              <div className={styles.productDetailsModal}>
                <img className={styles.modalImage} src={productImage} />
                <div>
                  <h2>{productName}</h2>
                  <p>Reference number: {productReference}</p>
                  <div className={styles.modalAvailabilityDiv}>
                    <UnavailableIcon className={styles.unavailableIcon} />
                    <p>{available}</p>
                  </div>
                </div>
              </div>
              <FormattedMessage id="store/add-to-cart.modal-headerCustom">
                {message => <p>{message}</p>}
              </FormattedMessage>
              {!requestSend &&
                <>
                  <div>
                    <FormattedMessage id="store/add-to-cart.name-addressCustom">
                      {message => <p>{message}</p>}
                    </FormattedMessage>
                    <input value={inputValue3} onChange={onInputChange3} className={[styles.inputEmail, invalidName ? styles.errorBorder : ""].join(" ")} required={"required"} />
                    {invalidName && (
                      <FormattedMessage id="store/add-to-cart.required">
                      {message => <p className={styles.emailMatch}>{message}</p>}
                    </FormattedMessage>
                    )}
                  </div>
                  <div>
                    <FormattedMessage id="store/add-to-cart.email-addressCustom">
                      {message => <p>{message}</p>}
                    </FormattedMessage>
                    <input value={inputValue} onChange={onInputChange} className={` ${(match && !invalidEmail) ? styles.inputEmail : styles.errorBorder} `} />
                  </div>
                  {invalidEmail &&
                    <FormattedMessage id="store/add-to-cart.enter-valid-emailCustom">
                      {message => <p className={styles.validEmail}>{message}</p>}
                    </FormattedMessage>
                  }

                  <div>
                    <FormattedMessage id="store/add-to-cart.confirm-email-addressCustom">
                      {message => <p>{message}</p>}
                    </FormattedMessage>
                    <input value={inputValue2} onChange={onInputChange2} className={` ${(match && !invalidEmail) ? styles.inputEmail : styles.errorBorder} `} />
                  </div>
                  {invalidEmail &&
                    <FormattedMessage id="store/add-to-cart.enter-valid-emailCustom">
                      {message => <p className={styles.validEmail}>{message}</p>}
                    </FormattedMessage>}

                  {!match &&
                    <FormattedMessage id="store/add-to-cart.email-should-matchCustom">
                      {message => <p className={styles.emailMatch}>{message}</p>}
                    </FormattedMessage>
                  }

                  {/* <div className={styles.checkboxDiv}>
                    <div onClick={checkboxChange} className={styles.checkwrap}>
                      <div
                        className={[styles.check, checkboxValue ? styles.checked : ""].join(" ")}

                      >

                      </div>
                      <FormattedMessage id="store/add-to-cart.i-read-understoodCustom">
                        {message => <p>{message}</p>}
                      </FormattedMessage>


                    </div>
                    <a onClick={() => window.open('https://www.whirlpool.be/nl_BE', '_blank')} className={styles.checkboxHref} target="_blank" >
                      <FormattedMessage id="store/add-to-cart.termsCustom">
                        {message => <p>{message}</p>}
                      </FormattedMessage>
                    </a>
                </div>*/}


                </>}
              {requestSend &&
                <FormattedMessage id="store/add-to-cart.we-will-contactCustom">
                  {message => <h3>{message}</h3>}
                </FormattedMessage>
              }
            </div>
          </Modal>
        </a>
      </div>
      :
      ((available == null || available == "not sellable" ||
        available == "nicht verkaufbar" ||
        available == "non vendibile" || available == "non vendable") ? <></> : ((available == "in stock" ||
          available == "auf Lager" ||
          available == "disponibile" ||
          available == "en stock" ||
          available == "limited availability" ||
          available == "Begrenzte Verfügbarkeit" ||
          available == "disponibilità limitata" ||
          available == "disponibilité limitée")) ? (<Button
            block
            isLoading={isFakeLoading}
            disabled={disabled || !available}
            onClick={handleClick}
          > {availableButtonContent}
          </Button>) : ((available == "xXxXxXxXx") ?
            //This part will be changed when business requests to activate email button
            <div onClick={testFunction} className={`${styles.buttonDataContainerMail} flex justify-center`}>
              <IconMail className={styles.mailIcon} />
              <a style={{ width: "100%", color: "black", fontWeight: "bold", textDecoration: "underline" }}>
                <FormattedMessage id="store/add-to-cart.email-meCustom">
                  {message => <span className={styles.buttonText}>{message}</span>}
                </FormattedMessage>
                <Modal
                  centered
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  bottomBar={
                    <div className="nowrap">
                      <span className={styles.closeButton}>
                        <Button variation="tertiary" onClick={closeModal}>
                          Close
                        </Button>
                      </span>
                      <span className={styles.sendButton}>
                        {!requestSend && <Button onClick={sendButton} style={{ background: "black !important" }}>
                          Send
                        </Button>}
                      </span>
                    </div>
                  }
                >

                  <div className={styles.modal}>
                    <FormattedMessage id="store/add-to-cart.modal-headerCustom">
                      {message => <p className={styles.subHeader}>{message}</p>}
                    </FormattedMessage>
                    <div className={styles.productDetailsModal}>
                      <img className={styles.modalImage} src={productImage} />
                      <div>
                        <h2>{productName}</h2>
                        <p>Reference number: {productReference}</p>
                        <div className={styles.modalAvailabilityDiv}>
                          <UnavailableIcon className={styles.unavailableIcon} />
                          <p>{available}</p>
                        </div>
                      </div>
                    </div>
                    <FormattedMessage id="store/add-to-cart.modal-headerCustom">
                      {message => <p>{message}</p>}
                    </FormattedMessage>
                    {!requestSend &&
                      <>
                        <div>
                          <FormattedMessage id="store/add-to-cart.email-addressCustom">
                            {message => <p>{message}</p>}
                          </FormattedMessage>
                          <input value={inputValue} onChange={onInputChange} className={` ${(match && !invalidEmail) ? styles.inputEmail : styles.errorBorder} `} />
                        </div>
                        {invalidEmail &&
                          <FormattedMessage id="store/add-to-cart.enter-valid-emailCustom">
                            {message => <p className={styles.validEmail}>{message}</p>}
                          </FormattedMessage>
                        }

                        <div>
                          <FormattedMessage id="store/add-to-cart.confirm-email-addressCustom">
                            {message => <p>{message}</p>}
                          </FormattedMessage>
                          <input value={inputValue2} onChange={onInputChange2} className={` ${(match && !invalidEmail) ? styles.inputEmail : styles.errorBorder} `} />
                        </div>
                        {invalidEmail &&
                          <FormattedMessage id="store/add-to-cart.enter-valid-emailCustom">
                            {message => <p className={styles.validEmail}>{message}</p>}
                          </FormattedMessage>}

                        {!match &&
                          <FormattedMessage id="store/add-to-cart.email-should-matchCustom">
                            {message => <p className={styles.emailMatch}>{message}</p>}
                          </FormattedMessage>
                        }

                        <div className={styles.checkboxDiv}>
                          <input type="checkbox" className={styles.checkboxInput} checked={checkboxValue} onChange={checkboxChange} />
                          <FormattedMessage id="store/add-to-cart.i-read-understoodCustom">
                            {message => <p>{message}</p>}
                          </FormattedMessage>

                          <a onClick={() => window.open('https://www.whirlpool.be/nl_BE', '_blank')} className={styles.checkboxHref} target="_blank" >
                            <FormattedMessage id="store/add-to-cart.termsCustom">
                              {message => <p>{message}</p>}
                            </FormattedMessage>
                          </a>
                        </div></>}
                    {requestSend &&
                      <FormattedMessage id="store/add-to-cart.we-will-contactCustom">
                        {message => <h3>{message}</h3>}
                      </FormattedMessage>
                    }
                  </div>
                </Modal>
              </a>
            </div> : obsolete ? <Button onClick={obsoloteFunction}>{unavailableButtonContent}</Button> : <></>)))
  )

  return allSkuVariationsSelected ? (
    ButtonWithLabel
  ) : (
    <Tooltip trigger="click" label={tooltipLabel}>
      {ButtonWithLabel}
    </Tooltip>
  )
}

export default AddToCartButton