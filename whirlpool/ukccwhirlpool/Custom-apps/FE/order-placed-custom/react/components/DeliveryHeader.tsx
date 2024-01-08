import React, { FC, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
// import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { Address } from 'vtex.order-details'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { useAdditionalOrderInfo } from './AdditionalOrderInfoContext'

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
  'packageAddressTitle',
  'packageDeliveryTitle',
] as const

const DeliveryHeader: FC<Props> = ({
  shippingData,
  index,
  numPackages,
  giftRegistry,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const multipleDeliveries = numPackages > 1

  let additionalOrderInfo = useAdditionalOrderInfo();
  const isSDA = false //TO BE REPLACED WITH THE NEW VALUE FROM GRAPHQL QUERY
  const isShipTogether = additionalOrderInfo.customData?.find((customData: CustomData) => customData.id == "tradeplace")?.fields?.find((field: CustomDataField) => field.key == "shipTogether")?.value == "true" || false;
  const isGAS = additionalOrderInfo.customData?.find((customData: CustomData) => customData.id == "tradeplace")?.fields?.find((field: CustomDataField) => field.key == "connectedGas")?.value == "true" || false;
  console.log("isGAS: ", isGAS);

  const convertDate = (startDate: string, endDate: string) => {
    let localeStartDate = new Date(startDate.split("+")[0]).toLocaleDateString('en-GB', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }).replace(",", "");
    let localeEndDate = new Date(endDate.split("+")[0]).toLocaleDateString('en-GB', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }).replace(",", "");

    let splittedStartDate = localeStartDate.split("at ");
    let splittedEndDate = localeEndDate.split("at ");

    // Expected format: weekday day month year [fromHour - toHour]
    let adaptedDate = splittedStartDate[0] + "[" + splittedStartDate[1] + " - " + splittedEndDate[1] + "]";
    return adaptedDate;
  }

  const printMessageDelivery = () => {
    // print Message Delivery for accessory
    if (shippingData.selectedSla === "Standard free" || shippingData.selectedSla === "Standard charged") {
      return (
        <>
          <small className={`${handles.packageSLA} c-muted-2 t-small`}>
            <span>
              <FormattedMessage
                id="store/delivery.standardDeliveryFree/Charged"
              />
            </span>
          </small>
        </>
      )
    } else if (shippingData.selectedSla === "Second day delivery" || shippingData.selectedSla === "Next day delivery") {
      return (
        <>
          <small className={`${handles.packageSLA} c-muted-2 t-small`}>
            <span>
              <FormattedMessage
                id="store/delivery.next/SecondDayDelivery"
              />
            </span>
          </small>
        </>
      )
    }
    // print Message Delivery for out of stock 
    else if (shippingData.selectedSla == "LeadTime") {
      if (isShipTogether) {
        return (
          <>
            <small className={`${handles.packageSLA} c-muted-2 t-small`}>
              <span>
                <FormattedMessage
                  id="store/delivery.deliveryShiptTogether"
                />
              </span>
            </small>
          </>
        )
      }
      return (
        <>
          <small className={`${handles.packageSLA} c-muted-2 t-small`}>
            <span>
              <FormattedMessage
                id="store/delivery.deliveryShipSeparately"
              />
            </span>
          </small>
        </>
      )
    }
    else {
      return (
        <>
          {isSDA ?
            <small className={`${handles.packageSLA} c-muted-2 t-small`}>
              <span>
                <FormattedMessage
                  id="store/delivery.deliveryTextSDA"
                />
              </span>
            </small>
            : isGAS ?
              <small className={`${handles.packageSLA} c-muted-2 t-small`}>
                <span>
                  <FormattedMessage
                    id="store/delivery.deliveryTextGAS"
                  />
                </span>
              </small>
              :
              // If the selected delivery is Scheduled, then check if there is a valid delivery window
              // Otherwise, show a message
              shippingData.deliveryWindow &&
                shippingData.deliveryWindow.startDateUtc &&
                shippingData.deliveryWindow.endDateUtc ?
                <>
                  <small className={`${handles.packageSLA} t-small`}>
                    <span>
                      <FormattedMessage
                        id="store/delivery.deliveryTextScheduled"
                      />
                    </span>
                  </small>
                  <small className={`${handles.packageSLA} c-muted-2 t-small`}>
                    <span>
                      {convertDate(shippingData.deliveryWindow.startDateUtc, shippingData.deliveryWindow.endDateUtc)}
                    </span>
                  </small>
                </>
                :
                <small className={`${handles.packageSLA} c-muted-2 t-small`}>
                  <span>
                    <FormattedMessage
                      id="store/delivery.scheduledDeliveryWithoutDeliveryWindow"
                    />
                  </span>
                </small>
          }
        </>
      )
    }
  }


  return (
    <Fragment>
      <div
        className={`${applyModifiers(
          handles.packageHeader,
          'delivery'
        )} t-heading-4-ns t-heading-5 mb5`}
        data-testid="shipping-header"
      >
        <span className={`${handles.packageDeliveryTitle}`}>
          <FormattedMessage id="store/shipping.header.title" />
          {multipleDeliveries && (
            <FormattedMessage
              id="store/common.header.counter"
              values={{ index: index + 1, numPackages }}
            />
          )}
        </span>
        <br />
        {printMessageDelivery()}

      </div>

      {giftRegistry &&
        giftRegistry.addressId === shippingData.address.addressId ? (
        <div className={`${handles.packageGiftDescription} c-muted-1`}>
          <span className={`${handles.packageAddressTitle} dn`}>
            <FormattedMessage id="store/shipping.header.address" />
          </span>
          <FormattedMessage
            id="store/shipping.header.wishlist.address"
            values={{ giftRegistryName: giftRegistry.description }}
          />
        </div>
      ) : (
        <div className={`${handles.packageAddressWrapper} mb5 mr10-m`}>
          <span className={`${handles.packageAddressTitle} dn`}>
            <FormattedMessage id="store/shipping.header.address" />
          </span>
          <Address address={shippingData.address} />
        </div>
      )}
    </Fragment>
  )
}

export default DeliveryHeader
