import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import TranslateTotalizer from 'vtex.totalizer-translator/TranslateTotalizer'
import { useCssHandles } from 'vtex.css-handles'

import FormattedPrice from './components/FormattedPrice'
import { useOrder } from './components/OrderContext'
import { getTotals } from './utils'
import TaxInfo from './TaxInfo'
import {map}from 'lodash'

const CSS_HANDLES = [
  'totalListWrapper',
  'totalList',
  'totalListItem',
  'totalListItemLabel',
  'totalListItemValue',
]

const OrderTotal: FC = () => {
  const { items, totals, value: totalValue, deliveryParcels } = useOrder()
  const handles = useCssHandles(CSS_HANDLES)
  const numItems = items.reduce((acc, item) => {
    if (item.parentItemIndex === null) {
      return acc + item.quantity
    }
    return acc
  }, 0)
  const [newTotals, taxes] = getTotals(totals)
  const shippingType = (item) => {
    switch(item.selectedSla) {
      case "Next day": return " - Next day Delivery"
      case "Scheduled": return " - Delivery time slot"
      case "Special" : return " - Special Delivery"
      default : return ""
    }
  }

  const shippingValue = (items?.reduce((sum, item) => {
    const deliveryOffering = item.bundleItems?.find(offering => offering.name === "Delivery");
    const deliveryPrice = deliveryOffering ? deliveryOffering.price : 0;
    return sum + deliveryPrice;
  }, 0));
  const installationValue = (items?.reduce((sum, item) => {
    const installationOffering = item.bundleItems?.find(offering => offering.name === "Installation");
    const installationPrice = installationOffering ? installationOffering.price : 0;
    return sum + installationPrice;
  }, 0));
  const removalValue = (items?.reduce((sum, item) => {
    const removalOffering = item.bundleItems?.find(offering => offering.name === "Removal");
    const removalPrice = removalOffering ? removalOffering.price : 0;
    return sum + removalPrice;
  }, 0));
  return (
    <div className={`${handles.totalListWrapper} flex-l justify-end w-100`}>
      <ul
        className={`${handles.totalList} list pa0 mt8 w-100 w-60-l c-muted-1`}
      >
        {newTotals.map((total, i) => {
          if (total.value === 0) {
            return null
          }
          if(total.id === "Shipping") {
            return(
              map(deliveryParcels,(item,index) => {
                if(item.price === 0) {
                  return null
                }
                return(
                  <li
                    className={`${handles.totalListItem} pv3 flex justify-between items-center`}
                    key={`${total.id}_${i}`}
                  >
                    <span className={`${handles.totalListItemLabel} flex`} key={index}>
                      <TranslateTotalizer totalizer={total} />
                      {shippingType(item)}
                    </span>
                    <span className={`${handles.totalListItemValue} c-on-base`} key={index}>
                      <FormattedPrice value={item.price} />
                    </span>
                  </li>
                )
              })
            );
          }
          return(
            <li
              className={`${handles.totalListItem} pv3 flex justify-between items-center`}
              key={`${total.id}_${i}`}
            >
              <span className={`${handles.totalListItemLabel} flex`}>
                <TranslateTotalizer totalizer={total} />
                {total.id === 'Items' && ` (${numItems})`}
                {total.id === 'Tax' && taxes.length > 0 && (
                  <div className="ml2 mt1">
                    <TaxInfo taxesTotals={taxes} />
                  </div>
                )}
              </span>
              <span className={`${handles.totalListItemValue} c-on-base`}>
                <FormattedPrice value={
                  total.id === "Discounts" ? total.value : total.value - shippingValue - installationValue - removalValue
                  } />
              </span>
            </li>
          )
        })}
        {shippingValue !== 0 && (
          <li className={`${handles.totalListItem} pv3 flex justify-between items-center`}>
            <span className={`${handles.totalListItemLabel} flex`}>
              <div className="mt1"><FormattedMessage id="store/order.shipping-label"/></div>
            </span>
            <span className={`${handles.totalListItemValue} c-on-base`}>
              <FormattedPrice value={shippingValue} />
            </span>
          </li>
        )}
        {installationValue !== 0 && (
          <li className={`${handles.totalListItem} pv3 flex justify-between items-center`}>
            <span className={`${handles.totalListItemLabel} flex`}>
              <div className="mt1"><FormattedMessage id="store/order.installation-label" /></div>
            </span>
            <span className={`${handles.totalListItemValue} c-on-base`}>
              <FormattedPrice value={installationValue} />
            </span>
          </li>
        )}
        {removalValue !== 0 && (
          <li className={`${handles.totalListItem} pv3 flex justify-between items-center`}>
            <span className={`${handles.totalListItemLabel} flex`}>
              <div className="mt1"><FormattedMessage id="store/order.removal-label" /></div>
            </span>
            <span className={`${handles.totalListItemValue} c-on-base`}>
              <FormattedPrice value={removalValue} />
            </span>
          </li>
        )}
        <li
          className={`${handles.totalListItem} pv3 flex justify-between items-center c-on-base t-heading-2-ns t-heading-3`}
        >
          <strong className={`${handles.totalListItemLabel}`}>
            <FormattedMessage id="store/order.totals.total" />
          </strong>
          <strong className={`${handles.totalListItemValue}`}>
            <FormattedPrice value={totalValue} />
          </strong>
        </li>
      </ul>
    </div>
  )
}

export default OrderTotal
