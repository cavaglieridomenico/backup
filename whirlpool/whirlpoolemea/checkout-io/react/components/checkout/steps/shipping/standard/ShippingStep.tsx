import React from "react"
import { Switch, Route } from "react-router"
import routes from "../../../../../utils/routes"
import Step from "../../../../checkout/step-group/Step"
import { useOrder } from "../../../../../providers/orderform"

interface ShippingStepProps {
	children: any[]
}

const ShippingStep: React.FC<ShippingStepProps> = ({ children }) => {
	const { orderLoading } = useOrder()

	const ShippingForm = children?.find(
		(child: any) => child.props.id == "shipping-form",
	)
	const ShippingSummary = children?.find(
		(child: any) => child.props.id == "shipping-summary",
	)

	return (
		<>
			{!orderLoading && (
				<Step>
					<Switch>
						<Route path={routes.SHIPPING.route}>{ShippingForm}</Route>
						<Route path="*">{ShippingSummary}</Route>
					</Switch>
				</Step>
			)}
		</>
	)
}

export default ShippingStep
