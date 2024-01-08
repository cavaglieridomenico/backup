import React from "react"
// import { useShipping } from './context/ShippingContext'
import { useIntl, defineMessages } from "react-intl"
import StepHeader from "../../step-group/StepHeader"
import { useOrder } from "../../../providers/orderform"
import style from "./shipping.css"

interface ShippingSummaryProps {
	children: any
}

const ShippingSummary: React.FC<ShippingSummaryProps> = (
	{
		children
	},
) => {
	const intl = useIntl()
	const { orderForm } = useOrder()
	const { canEditData, shippingData } = orderForm

	const delivery = shippingData
		? shippingData?.logisticsInfo[0]?.selectedSla
		: null

	const street = shippingData ? shippingData?.address?.street : null
	const postalCode = shippingData ? shippingData?.address?.postalCode : null
	const city = shippingData ? shippingData?.address?.city : null
	const number = shippingData ? shippingData?.address?.number : null
	const state = shippingData ? shippingData?.address?.state : null

	// const AddressSummary = children?.find(
	//   (child: any) =>
	//     child.props.id == 'shipping-summary.address-summary'
	// )

	return (
		<>
			<div className={style.StepHeader}>
				<StepHeader
					title={intl.formatMessage(messages.shipping)}
					canEditData={canEditData}
					isSummary={true}
					step={"shipping"}
				/>
			</div>
			{street && postalCode && city && delivery && (
				/* AddressSummary and DeliverySummary*/
				<div className={`${style.shippingSummaryContainer} bg-checkout`}>
					<div className={style.shippingSummaryAddress}>
						<span className={style.shippingSummaryLabel}>{street}{number ? `, ${number}` : ""}</span>
						<span
							className={style.shippingSummaryLabel}
						>{`${postalCode} ${city} ${state ? ("- "+state) : ""}`}</span>
					</div>
					<>{children}</>
				</div>
			)}
		</>
	)
}

const messages = defineMessages({
	shipping: {
		defaultMessage: "Shipping",
		id: "checkout-io.shipping",
	},
	delivery: {
		defaultMessage: "Selected delivery:",
		id: "checkout-io.shipping.selected-delivery",
	},
})

export default ShippingSummary