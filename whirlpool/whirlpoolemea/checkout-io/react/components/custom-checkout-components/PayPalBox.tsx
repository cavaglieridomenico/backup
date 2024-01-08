import { PayPalScriptProvider, PayPalMessages } from "@paypal/react-paypal-js"
import React from "react"
import { useAppSettings } from "../../providers/appSettings"
import { useOrder } from "../../providers/orderform"
import { formatPriceWithoutCurrency } from "../../utils/utils"
import style from "../checkout/steps/payment/PaymentStyles.css"

export default function PayPalBox() {
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
	// da configurare

	return (
		<div className={`${style.containerPayPal}`}>
			<PayPalScriptProvider
				options={{
					"client-id": appSettings?.paypalClientId,
					components: "messages",
					locale: appSettings?.defaultLocale?.replace("-", "_"),
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
