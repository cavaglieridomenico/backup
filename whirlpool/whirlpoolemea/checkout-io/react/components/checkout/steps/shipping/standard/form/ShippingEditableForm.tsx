import React from "react"
// import { useShipping } from '../context/ShippingContext'
import { useOrder } from "../../../../../../providers/orderform"
// import { useShipping } from '../context/ShippingContext'
import StepHeader from "../../../../step-group/StepHeader"
// import { Button } from 'vtex.styleguide'
import { useIntl, defineMessages } from "react-intl"
import style from "../shipping.css"

interface ShippingEditableFormProps {
	children: any
}

const ShippingEditableForm: React.FC<ShippingEditableFormProps> = ({
	children,
}: // isFetching,
any) => {
	const intl = useIntl()
	const { orderForm } = useOrder()
	const { canEditData } = orderForm

	return (
		<>
			<div className={style.StepHeader}>
				<StepHeader
					title={intl.formatMessage(messages.shipping)}
					canEditData={canEditData}
				/>
			</div>
			<div className="mt6">
				{/*  AddressEditableForm.tsx, AddressSummary.tsx and DeliveryEditableForm.tsx */}
				{children}
			</div>
		</>
	)
}

const messages = defineMessages({
	shipping: {
		defaultMessage: "Shipping",
		id: "checkout-io.shipping",
	},
})

export default ShippingEditableForm
