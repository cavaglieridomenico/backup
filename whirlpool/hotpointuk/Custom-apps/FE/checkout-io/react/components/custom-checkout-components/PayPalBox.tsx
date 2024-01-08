import { PayPalScriptProvider, PayPalMessages } from "@paypal/react-paypal-js"
import React from "react"
import { useOrder } from "../../providers/orderform"
import { formatPriceWithoutCurrency } from "../../utils/utils"

import style from "../steps/payment/PaymentStyles.css"

export default function PayPalBox() {
	type Style = {
		layout: "text"
		align: "center"
	}

	const style1: Style = {
		layout: "text",
		align: "center",
	}
	const { orderForm } = useOrder()
	const value = orderForm?.value
	// da configurare

	return (
		<div className={`${style.containerPayPal}`}>
			<PayPalScriptProvider
				options={{
					"client-id":
						"ASYx6kQqKVXUIDgg2Q-iN8722Ycn4IGdY7xAngJ1U8j_LY9924rdfq80LOt_CVrRrqrp86vJZSE2D1ur",
					components: "messages",
					locale: "en_GB",
					"enable-funding": "paylater",
				}}
			>
				<PayPalMessages
					style={style1}
					forceReRender={[]}
					amount={formatPriceWithoutCurrency(value)}
				/>
			</PayPalScriptProvider>
		</div>
	)
}
