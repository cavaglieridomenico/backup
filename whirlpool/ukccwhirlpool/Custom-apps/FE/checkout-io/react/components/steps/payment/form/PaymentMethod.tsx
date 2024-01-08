import React, { useEffect } from "react"
import { useOrder } from "../../../../providers/orderform"
import { usePayment } from "../context/PaymentContext"
import style from "../PaymentStyles.css"
import Tick from "./paymentImagesDefaults/Tick"
import PaymentDefaultImage from "./paymentImagesDefaults/PaymentDefaultImage"

interface OptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	id: string
	paymentMethodTitle: string
	paymentMethodImage: string
	imageSrc: string
	title: string
}

const PaymentMethod: StorefrontFunctionComponent<OptionProps> = ({
	id,
	paymentMethodTitle,
	paymentMethodImage,
	imageSrc,
	title,
	children,
}) => {
	const {
		updatePaymentMutation,
		selectedPaymentIndex,
		setSelectedPaymentIndex,
	} = usePayment()
	const { orderForm, paymentSystems } = useOrder()

	const payment = paymentSystems?.find(
		(paymentSystem: any) => paymentSystem.id == id,
	)

	useEffect(() => {
		const selectedPaymentOF =
			orderForm?.paymentData?.payments?.[0]?.paymentSystem

		selectedPaymentOF && setSelectedPaymentIndex(+selectedPaymentOF)
	}, [])

	const handlePaymentSelect = async (payment: PaymentSystem) => {
		const _payments = [
			{
				group: payment.groupName,
				installments: 1,
				installmentsInterestRate: 0,
				installmentsValue: orderForm?.value,
				paymentSystem: +payment.id,
				paymentSystemName: payment.name,
				referenceValue: orderForm?.value,
				value: orderForm?.value,
			},
		]

		updatePaymentMutation(orderForm?.orderFormId, _payments)
	}

	return (
		<>
			{payment && (
				<div
					className={`${style.paymentGroupContainer} br3 mb2 ${
						selectedPaymentIndex != payment?.id
							? "b--disabled"
							: "b--action-primary"
					}`}
				>
					<button
						className={`w-100 tl pointer db lh-copy ${
							selectedPaymentIndex != payment?.id
								? "bg-checkout"
								: "bg-action-primary"
						} b--action-primary ph5 pv5 flex br3 items-center justify-between bn`}
						onClick={() => {
							handlePaymentSelect(payment),
								setSelectedPaymentIndex(+payment?.id)
						}}
						role="option"
						aria-selected={selectedPaymentIndex == payment?.id}
					>
						<div className="flex items-center">
							<div
								className={`${
									selectedPaymentIndex != payment?.id
										? style.paymentMethodCheckContainer
										: style.paymentMethodCheckContainerWhite
								} ${
									selectedPaymentIndex != payment?.id
										? "b--disabled"
										: "b--action-white"
								} flex justify-center items-center`}
							>
								<Tick />
							</div>
							<span
								className={`${style.paymentMethodName} ${
									selectedPaymentIndex != payment?.id
										? "c-action-primary"
										: "c-action-white"
								} fw6`}
							>
								{paymentMethodTitle || title || payment?.name}
							</span>
						</div>
						<div
							className={`${style.paymentMethodImageContainer} h2 mr4 flex items-center`}
						>
							{paymentMethodImage || imageSrc ? (
								<img
									src={paymentMethodImage || imageSrc}
									alt="payment-method-image"
									className={style.paymentMethodImage}
								/>
							) : (
								<PaymentDefaultImage paymentSystemGroup={payment?.id} />
							)}
						</div>
					</button>
					{selectedPaymentIndex == payment?.id && children}
				</div>
			)}
		</>
	)
}

export default PaymentMethod

PaymentMethod.schema = {
	title: "Payment Method",
	description:
		"Here you can change the label or the image of the payment method",
	type: "object",
	properties: {
		paymentMethodTitle: {
			title: "Payment method title",
			description: "This is the payment method title",
			type: "string",
		},
	},
}
