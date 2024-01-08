import React from "react"
import { defineMessages, useIntl } from "react-intl"
import { useCart } from "../../../providers/cart"
import { useOrder } from "../../../providers/orderform"
import style from "./product-summary.css"

const messages = defineMessages({
	removalLabel: {
		defaultMessage: 'Removal',
		id: 'checkout-io.cart.removal-label',
	}
})

const RemovalPrice: React.FC = () => {
	const { REMOVAL_PRICE } = useCart()
  const currency = useOrder().orderForm?.storePreferencesData?.currencySymbol
  const intl = useIntl()
  if (REMOVAL_PRICE !== "0.00") {
    return (
      <>
        <div className={style.removalContainer}>
          <span className={style.removalLabel}>{intl.formatMessage(messages.removalLabel)}</span>
          <span className={style.removalPrice}>{currency} {REMOVAL_PRICE}</span>
        </div>
      </>
	  )
  } else {
    return <></>
  }
}

export default RemovalPrice
