import React from "react"
import { useIntl, defineMessages } from "react-intl"
// import { Utils } from 'vtex.checkout-resources'
// import { useRuntime } from 'vtex.render-runtime'
import { useMutation } from "react-apollo"
import cartFix from "../../../graphql/cartFix.graphql"

import style from "./product-summary.css"
import { useOrder } from "../../../providers/orderform"
import { useRuntime } from "vtex.render-runtime"

const messages = defineMessages({
	goToCheckout: {
		defaultMessage: "Go to Checkout",
		id: "checkout-io.cart.go-to-checkout",
	},
})

interface GoToCheckoutProps {
	action?: any
}

// const { useCheckoutURL } = Utils

const GoToCheckout: React.FC<GoToCheckoutProps> = ({ action }) => {
	const { orderForm } = useOrder()
	// const { navigate } = useRuntime()
	// const { major } = useCheckoutURL()
	const intl = useIntl()
	const { navigate, binding } = useRuntime()

	// const hasEmail = orderForm?.clientProfileData?.email

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
		//window.location.assign("/checkout/#shipping")
		fixCart({
			variables: {
				orderFormId: orderForm.orderFormId,
			},
		})
	}
	const [fixCart]: any = useMutation(cartFix, {
		onCompleted(data: any) {
			if (data["cartFix"]["cartItemNumber"] > 0) {
				const hasBinding = window?.location?.href?.includes("myvtex")
				navigate({
					to: `/checkout/${
						hasBinding
							? "?__bindingAddress=" + binding?.canonicalBaseAddress
							: ""
					}#/profile`,
				})
			} else {
				window.location.reload()
			}
		},
		onError() {},
	})
	return (
		<div>
			<button
				id="proceed-to-checkout"
				onClick={action ? action : handleGoToCheckout}
				className={`${style.GoToCheckoutButton} bg-action-primary bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary`}
			>
				{intl.formatMessage(messages.goToCheckout)}
			</button>
		</div>
	)
}

export default GoToCheckout
