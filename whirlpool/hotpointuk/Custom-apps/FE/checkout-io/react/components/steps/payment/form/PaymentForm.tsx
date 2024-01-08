
import React, { useEffect, useState } from "react"
import { defineMessages, useIntl } from "react-intl"
import { useHistory } from "react-router"
import useFetch, { RequestInfo } from "../../../../hooks/useFetch"
import { useOrder } from "../../../../providers/orderform"
import endpoints from "../../../../utils/endpoints"
import routes from "../../../../utils/routes"
import CheckoutAlert from "../../../common/CheckoutAlert"
import { usePayment } from "../context/PaymentContext"
import { PaymentStage } from "../PaymentEnums"
import style from "../PaymentStyles.css"
import GroupOption from "./GroupOption"
import ListGroup from "./ListGroup"

import { usePixel } from "vtex.pixel-manager"

const messages = defineMessages({
	payment: {
		defaultMessage: "Payment",
		id: "checkout-io.payment",
	},
	requestError: {
		defaultMessage: "Request failed, try again",
		id: "checkout-io.request-error",
	},
	free: {
		defaultMessage: "Free",
		id: "checkout-io.payment-step/free-payment",
	},
	newCreditCardLabel: {
		defaultMessage: "New credit card",
		id: "checkout-io.payment-step/new-credit-card-label",
	},
})

const PaymentForm: React.FC = () => {
	const intl = useIntl()
	const { orderForm, refreshOrder, paymentSystems, totalizers, isSpecsInserted } =
		useOrder()

  const items = orderForm?.items // Need to pass items object to "eec.checkout" event

	const { updatePaymentMutation, setSelectedPaymentIndex } = usePayment()

	const history = useHistory()
	const [showAlertError, setShowAlertError] = useState(false)

	const referenceValue =
		totalizers?.reduce((total: number, totalizer: Totalizer) => {
			if (totalizer?.id === "Tax" || totalizer?.id === "interest") {
				return total
			}

			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			return total + (totalizer?.value ?? 0)
		}, 0) ?? 0

	const isFreePurchase = !referenceValue && orderForm?.items?.length > 0

	const [stage] = useState<PaymentStage>(
		isFreePurchase ? PaymentStage.FREE_PURCHASE : PaymentStage.PAYMENT_LIST,
	)

	const [paymentSelected /* , setPaymentSelected */] = useState<any>(null)

	const [
		updatePaymentResponse,
		isFetchingUpdatePayment
	] = useFetch({} as RequestInfo)

	const [simulationResponse, isFetchingSimulation, setRequestSimulation] =
		useFetch({} as RequestInfo)

	const { push } = usePixel()

	const runSimulation = () => {
		setRequestSimulation({
			Method: "POST",
			EndPoint: `${endpoints.SIMULATION}`,
			RequestBody: {
				orderFormId: orderForm?.orderFormId,
				countryCode: orderForm?.storePreferencesData?.countryCode,
				postalCode: orderForm?.shippingData?.selectedAddresses[0]?.postalCode,
			},
		})
	}

	useEffect(() => {
		if (!isFetchingSimulation && simulationResponse?.Data?.orderForm) {
			refreshOrder().then(() => {
				history.push(routes.INDEX.route)
			})
		} else if (!isFetchingSimulation && simulationResponse?.hasError) {
			setShowAlertError(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFetchingSimulation, simulationResponse])

	useEffect(() => {
		if (
			!isFetchingUpdatePayment &&
			updatePaymentResponse?.Data?.orderForm?.orderFormId
		) {
			runSimulation()
		} else if (!isFetchingUpdatePayment && updatePaymentResponse?.hasError) {
			setShowAlertError(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFetchingUpdatePayment, updatePaymentResponse])

	useEffect(() => {
		if(isSpecsInserted){
			push({ event: "eec.checkout", step: 3, orderForm: orderForm, items })
		}
	}, [isSpecsInserted])

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

	const handleCloseAlertError = () => {
		setShowAlertError(false)
	}

	const checkProfileData = () => {
		if (orderForm && orderForm.clientProfileData) {
			const { firstName, lastName, phone } = orderForm.clientProfileData;
			if (!firstName || !lastName || !phone) {
				history.push(routes.PROFILE.route)
			}
		} else {
			history.push(routes.PROFILE.route)
		}
	}

	checkProfileData()
	return (
		<>
			<div className={`${style.StepHeader} flex`}>
				<span
					className={`${style.StepHeaderText} t-heading-5 fw6 flex items-center`}
				>
					{intl.formatMessage(messages.payment)}
				</span>
			</div>
			{stage === PaymentStage.PAYMENT_LIST ? (
				<>
					<ListGroup>
						{paymentSystems?.map((paymentSystem: any, index: number) => (
							<GroupOption
								caretAlign="center"
								key={paymentSystem.id}
								payment={paymentSystem}
								selectedId={paymentSelected}
								index={index}
								onClick={() => {
									handlePaymentSelect(paymentSystem),
										setSelectedPaymentIndex(+paymentSystem?.id)
								}}
							>
								{/* <div
									className="flex items-center white"
									data-testid={paymentSystem.id}
								> */}

								{/* </div> */}
							</GroupOption>
						))}
					</ListGroup>
				</>
			) : (
				<div className="flex flex-column mt4">
					<span className="ttu c-on-success">
						{intl.formatMessage(messages.free)}
					</span>
				</div>
			)}
			{showAlertError && (
				<div className="mt5">
					<CheckoutAlert
						message={intl.formatMessage(messages.requestError)}
						handleCloseAlertError={handleCloseAlertError}
					/>
				</div>
			)}
		</>
	)
}

export default PaymentForm
