import * as React from "react"
import { useIntl, defineMessages } from "react-intl"
import style from "./PaymentStyles.css"
import routes from "../../../utils/routes"
import { useOrder } from "../../../providers/orderform"
import { useCheckout } from "../../../providers/checkout"
import PaymentFlag from "./form/PaymentFlag"
import PayPalBox from "../../custom-checkout-components/PayPalBox"
import { formatPrice } from "../../../utils/utils"
import { isFieldValid } from "../../../utils"
import StepHeader from "../../step-group/StepHeader"

const messages = defineMessages({
	payment: {
		defaultMessage: "Payment",
		id: "checkout-io.payment",
	},
	edit: {
		defaultMessage: "Edit",
		id: "checkout-io.edit",
	},
	free: {
		defaultMessage: "Free",
		id: "checkout-io.payment-step/free-payment",
	},
	total: {
		defaultMessage: "Total",
		id: "checkout-io.total",
	},
})

interface PaymentSummaryProps {
	checkOnDataSlots: boolean
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
	checkOnDataSlots = false
}) => {
	const intl = useIntl()

	const { paymentSystems, payments, orderForm } = useOrder()
	const value = orderForm?.value
	const { isFreePurchase } = useCheckout()
	const street = orderForm?.shippingData?.address?.street
	const postalCode = orderForm?.shippingData?.address?.postalCode
	const city = orderForm?.shippingData?.address?.city
	const scheduledShippings = orderForm?.shippingData?.logisticsInfo?.filter((item:any)=> item?.selectedSla == "Scheduled")
	const email = orderForm?.clientProfileData?.email;
	const phone = orderForm?.clientProfileData?.phone;
	const mapShipping = (array:any) => {
		let hasAllWindowsSelected = true
		array?.map((data:any) =>{
			if(!data?.slas[0]?.deliveryWindow?.startDateUtc)
				hasAllWindowsSelected =  false
		}
			)
			return hasAllWindowsSelected
	}

	const deliverySelected = mapShipping(scheduledShippings)
	console.log(street, postalCode, city, "___ of payment", deliverySelected)

	// const history = useHistory()
	// const handleEditPayment = () => {
	// 	history.push(routes.PAYMENT.route)
	// }

	const showEditButtonAdditionalChecks =
		!isFreePurchase &&
		isFieldValid(street) &&
		isFieldValid(postalCode) &&
		isFieldValid(city) &&
		isFieldValid(email) &&
		isFieldValid(phone) &&
		orderForm?.customData != null &&
		(checkOnDataSlots
			? scheduledShippings?.length > 0
				? deliverySelected
				: true
			: true)


	console.log(orderForm?.shippingData?.logisticsInfo, "___ check on", scheduledShippings)

	return (
		<>
			{/* <div className={`${style.StepHeader} flex`}>
				<span
					className={`${style.StepHeaderText} t-heading-5 fw6 flex items-center w-100`}
				>
					<span className={`${style.StepHeaderTitleText} ml2 w-70`}>
						{intl.formatMessage(messages.payment)}
					</span>
					{!isFreePurchase && (
						<div
							className={`dib ml4 underline-hover flex justify-end w-30 ${style.paymentEditButtonsContainer}`}
						>
							{street && postalCode && city && email && phone &&
							(checkOnDataSlots ? (scheduledShippings?.length > 0 ? deliverySelected : true) : true) &&
							<ButtonPlain
								onClick={handleEditPayment}
								disabled={!orderForm?.clientProfileData?.email}
							>
								<IconEdit solid />
								{intl.formatMessage(messages.edit)}
							</ButtonPlain>}
						</div>
					)}
				</span>
			</div> */}
			<StepHeader
				title={intl.formatMessage(messages.payment)}
				canEditData={orderForm?.canEditData}
				isSummary={true}
				step={routes.PAYMENT}
				showEditButtonAdditionalChecks={showEditButtonAdditionalChecks}
				// Add !isFreePurchase to the additionalChecks
			/>

			{payments?.length > 0 && (
				<div className="flex flex-column mt4">
					{paymentSystems
						.filter(
							(method: PaymentSystem) =>
								Number(method.id) === Number(payments[0].paymentSystem),
						)
						.map((payment: any) => (
							<div
								className={`${style.paymentSummaryContainer}  pointer mb1 flex items-center justify-between mt2 bg-base`}
							>
								<span
									key={payment?.id}
									className={`${style.summaryPaymentName}`}
								>
									{payment.name}
								</span>

								{payment?.name === "PayPal" ? (
									<div className=" lh-copy c-on-base bg-base ph5 pv5">
										{<PayPalBox />}
									</div>
								) : (
									<div className="lh-copy c-on-base bg-base ph5 pv5">
										<div className="flex">
											<div>{`${intl.formatMessage(
												messages.total,
											)}: ${formatPrice(
												value,
												orderForm?.storePreferencesData?.currencySymbol,
											)}`}</div>
										</div>
									</div>
								)}
								<div className={style.summaryPaymentImage}>
									<span className="c-muted-1">
										<PaymentFlag paymentSystemGroup={payment?.groupName} />
									</span>
								</div>
							</div>
						))}
				</div>
			)}
		</>
	)
}

export default PaymentSummary
