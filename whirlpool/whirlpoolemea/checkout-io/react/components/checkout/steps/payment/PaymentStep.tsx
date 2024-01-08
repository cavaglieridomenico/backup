import React, { useEffect } from "react"
import { Switch, Route } from "react-router"

import routes from "../../../../utils/routes"
import Step from "../../../checkout/step-group/Step"

interface PaymentStepProps {
	children: any[]
}

const PaymentStep: React.FC<PaymentStepProps> = ({ children }) => {
	const PaymentForm = children?.find(
		(child: any) => child.props.id == "payment-form",
	)
	const PaymentSummary = children?.find(
		(child: any) => child.props.id == "payment-summary",
	)

	useEffect(() => {
		// if (document.getElementById(id)) {
		//   return
		// }
		const head = document.getElementsByTagName("head")[0]

		const js1 = document.createElement("script")
		js1.id = "id-js1"
		js1.crossOrigin = "anonymous"
		js1.src =
			"https://master--hotpointuk.myvtex.com/_v/public/assets/v1/published/hotpointuk.worldpay-payment-app@0.0.5/public/react/runtime.min.js"
		head.appendChild(js1)

		const js2 = document.createElement("script")
		js2.id = "id-js2"
		js2.crossOrigin = "anonymous"
		js2.src =
			"https://master--hotpointuk.myvtex.com/_v/public/assets/v1/published/hotpointuk.worldpay-payment-app@0.0.5/public/react/index.min.js"
		head.appendChild(js2)

		const css = document.createElement("link")
		css.rel = "stylesheet"
		css.type = "text/css"
		css.href =
			"https://master--hotpointuk.myvtex.com/_v/public/assets/v1/published/hotpointuk.worldpay-payment-app@0.0.5/public/react/index.min.css"
		head.appendChild(css)
	}, [])

	return (
		<Step>
			<Switch>
				<Route path={routes.PAYMENT.route}>{PaymentForm}</Route>
				<Route path="*">{PaymentSummary}</Route>
			</Switch>
		</Step>
	)
}

export default PaymentStep
