import React from 'react'
import { index as RichText } from 'vtex.rich-text'
import { useProduct } from 'vtex.product-context'
import { formatPrice, formatSkuItems } from '../utils/utils'
import { useMutation } from 'react-apollo'
import addToCartBundles from '../graphql/addToCartBundles.graphql'
import { useProductDispatch } from 'vtex.product-context'
import { usePixel } from 'vtex.pixel-manager'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { withToast } from 'vtex.styleguide'
import useMarketingSessionParams from '../hooks/useMarketingSessionParams'
import { Link } from 'vtex.render-runtime'
import style from '../style.css'
import { FormattedMessage, useIntl } from 'react-intl'
import { useBundle } from '../hooks/context'
import { BundlesContextProvider } from '../hooks/context'
interface BundlesProductInfosProps {
  subtitleText?: string
  imageLinkUrl?: string
  isImageVisible?: boolean
  // pdfLinkText?: string
  pdfLinkUrl?: string
  prePriceText?: string
  onClickEventPropagation?: string
  customPixelEventId?: string
  isSecondButtonVisible?: boolean
  secondButtonText?: string
  secondButtonLink?: string
  isPLP?: boolean
  children?: React.Component
  showToast: Function
}

const BundlesProductInfos: StorefrontFunctionComponent<BundlesProductInfosProps> = ({
  subtitleText,
  imageLinkUrl = '',
  isImageVisible = true,
  // pdfLinkText = 'Download PDF',
  prePriceText = 'Bundle price:',
  onClickEventPropagation = 'disabled',
  customPixelEventId = 'add-to-cart-custom',
  isSecondButtonVisible = true,
  secondButtonText = 'Go to store locator',
  secondButtonLink = '/service-locator',
  isPLP = false,
  children,
  showToast
}) => {
  return (
    <BundlesContextProvider>
      <BundlesProductInfosWrapped
        subtitleText={subtitleText}
        imageLinkUrl={imageLinkUrl}
        isImageVisible={isImageVisible}
        // pdfLinkText={pdfLinkText}
        prePriceText={prePriceText}
        onClickEventPropagation={onClickEventPropagation}
        customPixelEventId={customPixelEventId}
        isSecondButtonVisible={isSecondButtonVisible}
        secondButtonText={secondButtonText}
        secondButtonLink={secondButtonLink}
        isPLP={isPLP}
        children={children}
        showToast={showToast}
      />
    </BundlesContextProvider>
  )
}

const BundlesProductInfosWrapped: StorefrontFunctionComponent<BundlesProductInfosProps> = ({
  subtitleText,
  imageLinkUrl,
  isImageVisible,
  // pdfLinkText,
  prePriceText,
  onClickEventPropagation,
  customPixelEventId,
  isSecondButtonVisible,
  secondButtonText,
  secondButtonLink,
  isPLP,
  children,
  showToast
  // children,
}) => {
  const productContextDispatch = useProductDispatch()
  const { push } = usePixel()
  const {
    orderForm: { items },
  } = useOrderForm()
  const { addItem, updateQuantity } = useOrderItems()
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const { product } = useProduct()
  const {
    specifications,
    isKitAvailable,
    isKitSellable,
    kitItems,
    loading,
    // bundlePdfUrl,
  } = useBundle()
  const intl = useIntl()

  const checkArray = new Set<any>()

  const options = {
    allowedOutdatedData: ['paymentData'],
  }

  /*--- MUTATION ---*/
  // @addItemsToCart
  const addItemsToCart = (itemsForMutation: any) => {
    orderMutation({
      variables: {
        items: itemsForMutation,
        marketingData: {},
        allowedOutdatedData: ['paymentData'],
      },
    })
  }

  const [orderMutation]: any = useMutation(addToCartBundles, {
    onCompleted: data => {
      console.log(data, 'Add to cart mutation response')
      const action = {label: <FormattedMessage id="store/bundles-pdp.see-cart" /> , href: "/checkout/#/cart" }
      showToast({ message: <FormattedMessage id="store/bundles-pdp.added-to-cart" />, action })
    },
    onError: error => {
      console.log(error) // the error if that is the case
    },
  })
  /*------------------------*/

  /*--- ADD TO CART HANDLER ---*/
  const handleClick = (e: React.MouseEvent) => {
    if (productContextDispatch) {
      productContextDispatch({
        type: 'SET_BUY_BUTTON_CLICKED',
        args: { clicked: true },
      })
    }

    handleAddToCart(e)
  }

  const handleAddToCart: React.MouseEventHandler = event => {
    //Stop Propagation
    if (onClickEventPropagation === 'disabled') {
      event.stopPropagation()
      event.preventDefault()
    }

    //Mutation
    const itemsForMutation = kitItems?.map((item: any, index: number) => {
      return {
        id: +item.itemId,
        index: index,
        quantity: 1,
        seller: '1',
        options: null,
      }
    })

    addItemsToCart(itemsForMutation)

    /*--- Set the array for the update quantity check ---*/
    kitItems?.forEach((kit: any) => {
      const cartItem = items.find((item: any) => item.id == kit.itemId)
      cartItem &&
        checkArray.add({
          uniqueId: cartItem.uniqueId,
          quantity: cartItem.quantity + 1,
        })
    })

    if (checkArray.size == kitItems.length) {
      checkArray?.forEach((item: any) => updateQuantity(item, options))
    } else {
      addItem(formatSkuItems(kitItems), { ...utmParams, ...utmiParams })
    }
    /*------------------------*/

    //Pixel event
    const pixelEvent = {
      id: customPixelEventId,
      event: 'addToCart',
      items: kitItems,
    }

    push(pixelEvent)
  }
  /*-----------------------------------------*/

  const isSparePart =
    product?.properties?.filter((prop: any) => {
      return prop?.name === 'DeliveryAtCost' && prop?.values[0] == 'true'
    }).length > 0

  const freeDelivery =
    product?.properties?.some((prop: any) => {
      return prop?.name === 'DeliveryAtCost'
    })

  return (
    <div>
      <span className={style.bundleSubtitle}>
        <RichText text={subtitleText} />
      </span>
      <h2 className={style.bundleTitle}>{product?.productName}</h2>
      {!isPLP && !isSparePart ? (
        <div className={style.bundleDescriptionContainer}>
          <span className={style.bundleDescription}>
            {product?.description}
          </span>
        </div>
      ) : isImageVisible && imageLinkUrl != '' ? (
        <div className={style.bundlePLPLogoContainer}>
          <img className={style.bundlePLPLogo} src={imageLinkUrl} alt="logo" />
        </div>
      ) : null}
      <div className={style.bundleCommercialText}>
        {kitItems?.map((item: any, index: number) => (
          <>
            <Link
              className={style.bundleCommercialTextLink}
              href={`/${item?.product?.linkText}/p`}
              onClick={(e: any) => {
                e.stopPropagation()
              }}
            >
              {item?.product?.productName}
              <span> &gt;</span>
            </Link>
            {!loading ? (
              specifications?.[index]?.imageUrl &&
              specifications?.[index]?.pdfUrl ? (
                <div className={style.energyLabelContainer}>
                  <Link
                    href={specifications?.[index]?.pdfUrl}
                    target="_blank"
                    onClick={(e: any) => {
                      e.stopPropagation()
                    }}
                  >
                    <img
                      className={style.energyLabelImage}
                      src={specifications?.[index]?.imageUrl}
                      alt="Energy label image"
                    />
                  </Link>
                  <Link
                    href={specifications?.[index]?.productDataSheetUrl}
                    target="_blank"
                    className={style.energyLabelLink}
                    onClick={(e: any) => {
                      e.stopPropagation()
                    }}
                  >
                    {intl.formatMessage({
                      id: 'store/bundles-pdp.energyLabelText',
                    })}
                  </Link>
                </div>
              ) : (
                specifications?.[index]?.productDataSheetUrl && (
                  <div className={`${style.energyLabelContainer} mt2`}>
                    <Link
                      href={specifications?.[index]?.productDataSheetUrl}
                      target="_blank"
                      className={style.energyLabelLink}
                      onClick={(e: any) => {
                        e.stopPropagation()
                      }}
                    >
                      {intl.formatMessage({
                        id: 'store/bundles-pdp.energyLabelText',
                      })}
                    </Link>
                  </div>
                )
              )
            ) : (
              <></>
            )}
          </>
        ))}
        {!isKitAvailable ||
          (!isKitSellable && (
            <div className={style.notSellableContainer}>
              <div className={style.notSellableRedDot}></div>
              <span className={style.notSellableText}>
                {intl.formatMessage({
                  id: 'store/bundles-pdp.notSellableLabel',
                })}
              </span>
            </div>
          ))}
      </div>
      {/* <div className={style.bundlePdfLinkContainer}>
        <Link
          href={bundlePdfUrl}
          download
          className={style.bundlePdfLink}
          onClick={(e: any) => {
            e.stopPropagation()
          }}
        >
          <RichText text={pdfLinkText} />
        </Link>
      </div> */}
      <span className={style.bundlePrePriceText}>
        <RichText text={prePriceText} />
      </span>
      <div className={style.bundlePriceTextContainer}>
        <span className={style.bundlePriceText}>
          {formatPrice(product?.items?.[0].sellers?.[0].commertialOffer?.Price)}
        </span>
        { (freeDelivery) ? <div>{children}</div> : <div className={style.bundleAddText}>Inkl. MwSt.</div>}
        {/* <div>{children}</div> */}
      </div>
      <div>
        {isKitAvailable && isKitSellable && (
          <button
            onClick={e => {
              e.stopPropagation(), handleClick(e)
            }}
            className={`${style.bundleButtons} ${style.bundleAddToCartButton}`}
          >
            {intl.formatMessage({
              id: 'store/bundles-pdp.addToCartLabel',
            })}
          </button>
        )}
        {isSecondButtonVisible && !isSparePart && (
          <Link
            href={!isPLP ? secondButtonLink : `/${product?.linkText}/p`}
            onClick={(e: any) => {
              e.stopPropagation()
            }}
          >
            <button
              className={`${style.bundleButtons} ${style.bundleSecondButton}`}
            >
              {!isPLP
                ? secondButtonText
                : intl.formatMessage({
                    id: 'store/bundles-pdp.secondButtonLabel',
                  })}
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
const BundlesProductInfoWithToast = withToast(BundlesProductInfos)

export default BundlesProductInfoWithToast

BundlesProductInfoWithToast.schema = {
  title: '[BUNDLE] - BundlesProductInfos',
  description: 'Here you can change the labels related to the bundle',
  type: 'object',
  properties: {
    subtitleText: {
      title: 'Subtitle Text',
      description: 'Here you can change the subtitle text',
      default: '',
      type: 'string',
    },
    imageLinkUrl: {
      title: 'Image Link Url',
      description: 'Here you can change the image link url',
      default: '',
      type: 'string',
    },
    isImageVisible: {
      title: 'Image visibility',
      description:
        'Determine wheter the image should be visible (flagged) or not',
      default: true,
      type: 'boolean',
    },
    pdfLinkText: {
      title: 'PDF Link Text',
      description: 'Here you can change the pdf link text',
      default: 'Download PDF',
      type: 'string',
    },
    prePriceText: {
      title: 'Pre price Text',
      description: 'Here you can change the pre price text',
      default: 'Bundle price:',
      type: 'string',
    },
    isSecondButtonVisible: {
      title: 'Second button visibility',
      description: 'Here you hide the second button',
      default: true,
      type: 'boolean',
    },
    secondButtonText: {
      title: 'Second button text',
      description: 'Here you can change the second button text',
      default: 'Go to store locator',
      type: 'string',
    },
    secondButtonLink: {
      title: 'Second button Link',
      description: 'Here you can change the second button link',
      default: '/store-locator',
      type: 'string',
    },
  },
}
