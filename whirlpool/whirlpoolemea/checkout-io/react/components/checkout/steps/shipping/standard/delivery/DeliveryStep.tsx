import React from "react"
import { Switch, Route } from "react-router"

import DeliveryForm from "./form/DeliveryForm"
import DeliverySummary from "./DeliverySummary"
import routes from "../../../../../../utils/routes"
import Step from "../../../../step-group/Step"

const DeliveryStep: React.FC = () => {
	return (
		<Step>
			<Switch>
				<Route path={routes.SHIPPING.route}>
					<DeliveryForm />
				</Route>
				<Route path="*">
					<DeliverySummary />
				</Route>
			</Switch>
		</Step>
	)
}

export default DeliveryStep
