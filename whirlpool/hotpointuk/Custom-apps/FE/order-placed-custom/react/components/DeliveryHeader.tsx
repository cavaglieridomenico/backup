import React, { FC, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
// import { Address } from 'vtex.order-details'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

interface Props {
  shippingData: Parcel
  index: number
  numPackages: number
  giftRegistry?: GiftRegistry | null
}

const CSS_HANDLES = [
  'packageHeader',
  'packageShippingEstimate',
  'packageSLA',
  'packageGiftDescription',
  'packageAddressWrapper',
]

const DeliveryHeader: FC<Props> = ({
  shippingData,
  index,
  numPackages,
  giftRegistry,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const multipleDeliveries = numPackages > 1
  
  return (
    <Fragment>
      <div
        className={`${applyModifiers(
          handles.packageHeader,
          'delivery'
        )} t-heading-4-ns t-heading-5 mb5`}
        data-testid="shipping-header"
      >
        <FormattedMessage id="store/shipping.header.title" />
        {multipleDeliveries && (
          <FormattedMessage
            id="store/common.header.counter"
            values={{ index: index + 1, numPackages }}
          />
        )}
        <br />
        <small
          className={`${handles.packageShippingEstimate} c-muted-2 t-small`}
        >
          <TranslateEstimate
            shippingEstimate={shippingData.shippingEstimate}
            scheduled={shippingData.deliveryWindow}
          />
        </small>
        <br />
        <small className={`${handles.packageSLA} c-muted-2 t-small`}>
          {shippingData.selectedSla}
        </small>
      </div>

      {giftRegistry &&
      giftRegistry.addressId === shippingData.address.addressId ? (
        <div className={`${handles.packageGiftDescription} c-muted-1`}>
          <FormattedMessage
            id="store/shipping.header.wishlist.address"
            values={{ giftRegistryName: giftRegistry.description }}
          />
        </div>
      ) : (
        <div className={`${handles.packageAddressWrapper} mb5 mr10-m`}>
          {/* <Address address={shippingData.address} /> */}
          <div>{shippingData.address.street}</div>
          {
            shippingData.address.complement !== null &&
            <div>{shippingData.address.complement}</div>
          }
          <div>{shippingData.address.city}</div>  
          <div>{shippingData.address.state}</div>
          <div>{shippingData.address.postalCode}</div>
        </div>
      )}
    </Fragment>
  )
}

export default DeliveryHeader
