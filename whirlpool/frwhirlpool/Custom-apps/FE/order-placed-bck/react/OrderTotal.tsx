import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import TranslateTotalizer from 'vtex.totalizer-translator/TranslateTotalizer'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'

import FormattedPrice from './components/FormattedPrice'
import { useOrder } from './components/OrderContext'
import { getTotals } from './utils'
import TaxInfo from './TaxInfo'
const CSS_HANDLES = [
  'totalListWrapper',
  'totalList',
  'totalListItem',
  'totalListItemLabel',
  'totalListItemValue',
] as const

const OrderTotal: FC = () => {
  const { items, totals, value: totalValue } = useOrder()
  const handles = useCssHandles(CSS_HANDLES)
  const numItems = items.reduce((acc, item) => {
    if (item.parentItemIndex === null) {
      return acc + item.quantity
    }
    return acc
  }, 0)
  const [newTotals, taxes] = getTotals(totals)
  return (
    <div className={`${handles.totalListWrapper} flex-l justify-end w-100`}>
      <ul
        className={`${handles.totalList} list pa0 mt8 w-100 w-60-l c-muted-1`}
      >
        {newTotals.map((total, i) => {
          if (total.value === 0) {
            return null
          }
          // if (total.name === "Total d'articles") {
          //   console.log("Printing total")
          // }
          return (
            <>
            <li
              className={`${applyModifiers(
                handles.totalListItem,
                total.id
              )} pv3 flex justify-between items-center`}
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
                <FormattedPrice value={total.value} />
              </span>
            </li>
            {(i === 0) &&
              <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "1rem", marginLeft: "auto", textAlign: "right", flexDirection: "column"}}>
                <span><FormattedMessage id="store/order.totals.ttc1" /></span>
                <span><FormattedMessage id="store/order.totals.ttc2" /></span>
              </div>}
            </>
          )
        })}
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
        <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "1rem", marginLeft: "auto", textAlign: "right", flexDirection: "column"}}>
        <span><FormattedMessage id="store/order.totals.tva1" /></span>
        <span><FormattedMessage id="store/order.totals.tva2" /></span>
        </div>
      </ul>
    </div>
  )
}

export default OrderTotal
