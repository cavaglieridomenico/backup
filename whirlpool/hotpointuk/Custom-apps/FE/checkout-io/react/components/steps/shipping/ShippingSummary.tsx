import React from "react"
// import { useShipping } from './context/ShippingContext'
import { useIntl, defineMessages } from "react-intl"
import StepHeader from "../../step-group/StepHeader"
import { useOrder } from "../../../providers/orderform"
import style from "./shipping.css"
import routes from "../../../utils/routes"
import { isFieldValid } from "../../../utils/validateFields"


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

	const street = shippingData ? shippingData?.address?.street : null
	const postalCode = shippingData ? shippingData?.address?.postalCode : null
	const city = shippingData ? shippingData?.address?.city : null
	const delivery = shippingData
		? shippingData?.logisticsInfo[0]?.selectedSla
		: null

	// const AddressSummary = children?.find(
	//   (child: any) =>
	//     child.props.id == 'shipping-summary.address-summary'
	// )
	console.log(canEditData)

	const showEditButtonAdditionalChecks =
		isFieldValid(orderForm?.clientProfileData?.email) &&
		isFieldValid(orderForm?.clientProfileData?.firstName) &&
		isFieldValid(orderForm?.clientProfileData?.lastName) &&
		isFieldValid(orderForm?.clientProfileData?.phone) &&
		orderForm?.customData != null


	return (
		<>
			<div className={style.StepHeader}>
				<StepHeader
					title={intl.formatMessage(messages.shipping)}
					canEditData={canEditData}
					isSummary={true}
					// step={"shipping"}
					step={routes.SHIPPING}
					showEditButtonAdditionalChecks={showEditButtonAdditionalChecks}
				/>
			</div>
			{street && postalCode && city && delivery && (
				/* AddressSummary and DeliverySummary*/
				<div className={`${style.shippingSummaryContainer} bg-checkout`}>
					<div className={style.shippingSummaryAddress}>
						<span className={style.shippingSummaryLabel}>{street}</span>
						<span
							className={style.shippingSummaryLabel}
						>{`${postalCode} ${city}`}</span>
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
