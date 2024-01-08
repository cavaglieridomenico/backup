import React from "react"
import { defineMessages, useIntl } from "react-intl"
import { useCart } from "../../../providers/cart"
import { useOrder } from "../../../providers/orderform"
import style from "./product-summary.css"

const messages = defineMessages({
	installationLabel: {
		defaultMessage: 'Installation',
		id: 'checkout-io.cart.installation-label',
	}
})

const InstallationPrice: React.FC = () => {
	const { INSTALLATION_PRICE } = useCart()
  const currency = useOrder().orderForm?.storePreferencesData?.currencySymbol
  const intl = useIntl()
  if (INSTALLATION_PRICE !== "0.00") {
    return (
      <>
        <div className={style.installationContainer}>
          <span className={style.installationLabel}>{intl.formatMessage(messages.installationLabel)}</span>
          <span className={style.installationPrice}>{currency} {INSTALLATION_PRICE}</span>
        </div>
      </>
    )
  } else {
    return <></>
  }
}

export default InstallationPrice
