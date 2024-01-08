import { PayPalScriptProvider, PayPalMessages } from "@paypal/react-paypal-js"
import React from "react"
import { useAppSettings } from "../../../../../providers/appSettings"
import { useOrder } from "../../../../../providers/orderform"
import { formatPriceWithoutCurrency } from "../../../../../utils/utils"

import style from "../../PaymentStyles.css"

export default function PayPalContent() {
	type Style = {
		layout: "text"
		align: "center"
	}

	const style1: Style = {
		layout: "text",
		align: "center",
	}
	const { appSettings } = useAppSettings()
	const { orderForm } = useOrder()
	const value = orderForm?.value

	return (
		<div className="p3 w-100 br3 lh-copy c-on-base bg-base ph5 pv5">
			<div className={`${style.containerPayPal}`}>
				<PayPalScriptProvider
					options={{
						"client-id":
							// "ASYx6kQqKVXUIDgg2Q-iN8722Ycn4IGdY7xAngJ1U8j_LY9924rdfq80LOt_CVrRrqrp86vJZSE2D1ur",
							appSettings.paypalClientId,
						components: "messages",
						// locale: "en_GB",
						locale: appSettings.defaultLocale.replace("-", "_"),
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
		</div>
	)
}
