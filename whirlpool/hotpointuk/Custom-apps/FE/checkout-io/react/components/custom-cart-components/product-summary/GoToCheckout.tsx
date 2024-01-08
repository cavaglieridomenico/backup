import React from "react"
import { defineMessages, useIntl } from "react-intl"
// import { Utils } from 'vtex.checkout-resources'
// import { useRuntime } from 'vtex.render-runtime'
import { useMutation } from 'react-apollo'
import cartFix from "../../../graphql/cartFix.graphql"
import style from "./product-summary.css"
import useOrder from "../../../OrderForm"

const messages = defineMessages({
	goToCheckout: {
		defaultMessage: "Go to Checkout",
		id: "checkout-io.cart.go-to-checkout",
	},
})

// const { useCheckoutURL } = Utils

const GoToCheckout = () => {
	const { orderForm } = useOrder()
	// const { navigate } = useRuntime()
	// const { major } = useCheckoutURL()
	const intl = useIntl()
  // I access the bundleItems of every item in cart to be sure that the delivery service is preselected
  const deliveryService = orderForm?.items?.map((item) => {
    // Only selecting the finished goods (products) and not Accessories or Spare Parts
    const hasDeliveryOffering = item.offerings.findIndex((offering) => offering.name === "Delivery")
    if (hasDeliveryOffering >= 0) {
      return item.bundleItems.find((item) => item.name === "Delivery")
    }
    return "hasNoDeliveryOffering"
  })
  const isDeliveryPreselected = deliveryService && deliveryService.filter((item) => item !== "hasNoDeliveryOffering").every((item) => !!item)

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
		console.log(orderForm)
		//window.location.assign("/checkout/#shipping")
		fixCart({
			variables: {
				orderFormId: orderForm.orderFormId
			}
		})
	}
	const [fixCart]: any = useMutation(cartFix, {
		onCompleted(data) {
			if(data["cartFix"]["cartItemNumber"] > 0){
				window.location.assign("/checkout/#shipping")
			} else {
				window.location.reload();
			}
		},
		onError() {

		}
	  })
	return (
		<div>
			<button
				id="proceed-to-checkout"
				onClick={handleGoToCheckout}
        disabled={!isDeliveryPreselected}
				className={`${style.GoToCheckoutButton} bg-action-primary bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary`}
			>
				{intl.formatMessage(messages.goToCheckout)}
			</button>
		</div>
	)
}

export default GoToCheckout
