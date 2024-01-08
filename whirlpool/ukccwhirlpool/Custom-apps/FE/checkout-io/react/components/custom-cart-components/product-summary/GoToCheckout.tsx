import React from "react"
import { useIntl, defineMessages } from "react-intl"
// import { Utils } from 'vtex.checkout-resources'
// import { useRuntime } from 'vtex.render-runtime'
import style from "./product-summary.css"
// import { useCartOrder } from '../../../providers/cartOrderform'

const messages = defineMessages({
	goToCheckout: {
		defaultMessage: "Go to Checkout",
		id: "checkout-io.cart.go-to-checkout",
	},
})

// const { useCheckoutURL } = Utils

const GoToCheckout = () => {
	// const { cartOrderForm } = useCartOrder()
	// const { navigate } = useRuntime()
	// const { major } = useCheckoutURL()
	const intl = useIntl()

	// const hasEmail = cartOrderForm?.clientProfileData?.email

	/* const handleGoToCheckout = () => {
    if (major >= 2) {
      navigate(
        hasEmail
          ? { page: 'store.checkout.order-form' }
          : {
              page: 'store.checkout.identification',
              query: `returnUrl=/checkout`,
            }
      )
    } else {
      window.location.assign('/checkout/#payment')
    }
  } */
	const handleGoToCheckout = () => {
		window.location.assign("/checkout/#payment")
	}

	return (
		<div>
			<button
				id="proceed-to-checkout"
				onClick={handleGoToCheckout}
				className={`${style.GoToCheckoutButton} bg-action-primary bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary`}
			>
				{intl.formatMessage(messages.goToCheckout)}
			</button>
		</div>
	)
}

export default GoToCheckout
