import * as React from "react"
import { defineMessages, useIntl } from "react-intl"
import { useCheckout } from "../../../../providers/checkout"
import { useOrder } from "../../../../providers/orderform"
import { isFieldValid } from "../../../../utils"
import routes from "../../../../utils/routes"
import { formatPrice } from "../../../../utils/utils"
import StepHeader from "../../step-group/StepHeader"
import PayPalContent from "../../steps/payment/form/paymentsContents/PayPalContent"
import style from "./PaymentStyles.css"
import PaymentFlag from "./form/PaymentFlag"

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
	creditCard: {
		defaultMessage: "Credit Card",
		id: "checkout-io.credit-card-summary/credit-card-label",
	}
})

interface PaymentSummaryProps {
	checkOnDataSlots: boolean
	worldPayImage: string
	payPalImage: string
	genericCardImage: string
}

const PaymentSummary: StorefrontFunctionComponent<PaymentSummaryProps> = ({
	checkOnDataSlots = false,
	
	
	
}) => {
	const intl = useIntl()
	const { paymentSystems, payments, orderForm } = useOrder()
	const value = orderForm?.value
	const { isFreePurchase } = useCheckout()
	const street = orderForm?.shippingData?.address?.street
	const postalCode = orderForm?.shippingData?.address?.postalCode
	const city = orderForm?.shippingData?.address?.city
	const scheduledShippings = orderForm?.shippingData?.logisticsInfo?.filter(
		(item: any) => item?.selectedSla == "Scheduled",
	)
	const email = orderForm?.clientProfileData?.email
	const phone = orderForm?.clientProfileData?.phone
	const mapShipping = (array: any) => {
		let hasAllWindowsSelected = true
		array?.map((data: any) => {
			if (!data?.slas[0]?.deliveryWindow?.startDateUtc)
				hasAllWindowsSelected = false
		})
		return hasAllWindowsSelected
	}

	const deliverySelected = mapShipping(scheduledShippings)

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

	return (
		<>
			<StepHeader
				title={intl.formatMessage(messages.payment)}
				canEditData={orderForm.canEditData}
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
									{payment.name === "Visa" ? intl.formatMessage(messages.creditCard) : payment.name}
								</span>

								{payment?.name === "PayPal" ? (
									<div className=" lh-copy c-on-base bg-base ph5 pv5">
										{<PayPalContent />}
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
								<div className={`${style.summaryPaymentImage} flex items-center`}>
									<span className="c-muted-1">
										<PaymentFlag paymentName={payment?.name} />
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

PaymentSummary.schema = {
	title: "Payment Method",
	description:
		"Here you can change the label or the image of the payment method",
	type: "object",
	properties: {},
}
