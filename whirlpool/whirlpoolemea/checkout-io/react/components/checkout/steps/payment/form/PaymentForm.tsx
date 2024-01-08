import React, { useState, useEffect /* , useRef */ } from "react"
import { useHistory } from "react-router"
import { useIntl, defineMessages } from "react-intl"

import routes from "../../../../../utils/routes"
import { useOrder } from "../../../../../providers/orderform"
import useFetch, { RequestInfo } from "../../../../../hooks/useFetch"
import endpoints from "../../../../../utils/endpoints"
import CheckoutAlert from "../../../../common/CheckoutAlert"
import style from "../PaymentStyles.css"
import { usePixel } from "vtex.pixel-manager"
// import { usePayment } from "../context/PaymentContext"
// import CreditCard, { CreditCardRef } from "./creditCards/CreditCard"

interface WindowGTM extends Window {
	dataLayer: any[]
}

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

const PaymentForm: React.FC = ({ children }) => {
	const intl = useIntl()
	const { orderForm, refreshOrder } = useOrder()
	const dataLayer = ((window as unknown) as WindowGTM).dataLayer || []

	const history = useHistory()
	const [showAlertError, setShowAlertError] = useState(false)

	// const {
	// 	selectedPaymentIndex,
	// 	cardType,
	// 	setCardType,
	// 	updatePaymentMutation,
	// } = usePayment()
	// const creditCardRef = useRef<CreditCardRef>(null)

	const [updatePaymentResponse, isFetchingUpdatePayment] = useFetch(
		{} as RequestInfo,
	)

	const [
		simulationResponse,
		isFetchingSimulation,
		setRequestSimulation,
	] = useFetch({} as RequestInfo)

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
	}, [isFetchingUpdatePayment, updatePaymentResponse])

	useEffect(() => {
		//push checkoutStep analytics step 3
		const prevDataLayer = dataLayer.filter(
			(event: any) => event.event == "eec.checkout",
		)
		prevDataLayer.length > 0 &&
			push({ event: "eec.checkout", step: 3, orderForm: orderForm })
	}, [])

	const handleCloseAlertError = () => {
		setShowAlertError(false)
	}

	const checkProfileData = () => {
		if (orderForm && orderForm.clientProfileData) {
			const { firstName, lastName, phone } = orderForm.clientProfileData
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
			<>{children}</>
			{/* <div className={`${selectedPaymentIndex == 202 ? "" : "dn"}`}>
				<CreditCard
					ref={creditCardRef}
					onCardFormCompleted={() => {
						console.log("cardFormCompleted!!!")
					}}
					onChangePaymentMethod={updatePaymentMutation}
					onSetCardType={setCardType}
					cardType={cardType}
					key={cardType}
				/>
			</div> */}
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
