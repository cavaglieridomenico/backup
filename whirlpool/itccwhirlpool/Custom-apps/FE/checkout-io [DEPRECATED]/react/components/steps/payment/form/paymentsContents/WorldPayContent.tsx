import React from "react"
import { useIntl, defineMessages } from "react-intl"
import { formatPrice } from "../../../../../utils/utils"
import { useOrder } from "../../../../../providers/orderform"

interface WorldPayContentProps {}

const WorldPayContent: React.FC<WorldPayContentProps> = ({}) => {
	const intl = useIntl()
	const { orderForm } = useOrder()

	const value = orderForm?.value
	const currency = orderForm?.storePreferencesData?.currencySymbol

	return (
		<div className="p3 w-100  br3 lh-copy c-on-base bg-base ph5 pv5">
			<div className="flex">
				<div>{`${intl.formatMessage(messages.total)}: ${formatPrice(
					value,
					currency,
				)}`}</div>
			</div>
		</div>
	)
}

const messages = defineMessages({
	total: {
		defaultMessage: "Total",
		id: "checkout-io.total",
	},
})

export default WorldPayContent
