import React, { useEffect } from "react"
// import { useShipping } from '../context/ShippingContext'
import { useOrder } from "../../../../providers/orderform"
import { useCheckout } from "../../../../providers/checkout"
// import { useShipping } from '../context/ShippingContext'
import StepHeader from "../../../step-group/StepHeader"
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
	const { push } = useCheckout()
	const { orderForm } = useOrder()
	const { canEditData } = orderForm

	useEffect(() => {
		//push checkoutStep analytics step 2
		push({ event: "eec.checkout", step: "step 2" })
	}, [])

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
