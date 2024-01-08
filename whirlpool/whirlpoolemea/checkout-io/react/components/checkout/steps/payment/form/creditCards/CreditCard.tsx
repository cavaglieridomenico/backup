import React, {
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
	forwardRef,
	useImperativeHandle,
} from "react"
import { /*Button*/ Spinner } from "vtex.styleguide"
import { useIntl, defineMessages } from "react-intl"
import CardSummary from "./CardSummary"
import styles from "../../PaymentStyles.css"
import { useOrder } from "../../../../../../providers/orderform"
import useFetch, { RequestInfo } from "../../../../../../hooks/useFetch"
import { useRuntime } from "vtex.render-runtime"
import { useSSR } from "vtex.render-runtime/react/components/NoSSR"
//import endpoints from "../../../../../../utils/endpoints"

const messages = defineMessages({
	selectedPaymentLabel: {
		defaultMessage: "You selected",
		id: "checkout-io.credit-card/selected-payment-label",
	},
	reviewPurchaseLabel: {
		defaultMessage: "Review purchase",
		id: "checkout-io.credit-card/review-purchase-label",
	},
	cardFormTitle: {
		defaultMessage: "Container for credit card form",
		id: "checkout-io.credit-card/card-form-title",
	},
	save: {
		defaultMessage: "Save",
		id: "checkout-io.save",
	},
})

let postRobot: typeof import("post-robot") | null = null
let iFrameResize: typeof import("iframe-resizer") | null = null

if (window?.document) {
	postRobot = require("post-robot")
	iFrameResize = require("iframe-resizer").iframeResize
}

const IFRAME_APP_VERSION = "0.9.2"
const PORT = 3000

const iframeURLProd = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`
const iframeURLDev = `https://checkoutio.vtexlocal.com.br:${PORT}/`

// DOn't allow the user to copy and paste the credit card
//let cardInput = document.getElementsByName("cardNumber")
// console.log("CARD INPUT ------------->",cardInput);
//cardInput[0].onpaste = (e) => e.preventDefault()

const { production, query } = __RUNTIME__
const LOCAL_IFRAME_DEVELOPMENT =
	!production && query?.__localCardUi !== undefined
const iframeURL = LOCAL_IFRAME_DEVELOPMENT ? iframeURLDev : iframeURLProd
//console.log("iframeURL: ", iframeURL)

interface Props {
	onCardFormCompleted: () => void
	onChangePaymentMethod: () => void
	onSetCardType: (value: any) => void
	cardType: CardType
}

export interface CreditCardRef {
	resetCardFormData: () => void
	updateAddress: (address: string | Address) => void
	updateDocument: (document: string) => void
}

const CreditCard = forwardRef<CreditCardRef, Props>(function CreditCard(
	{
		// onCardFormCompleted,
		onChangePaymentMethod,
		onSetCardType,
		cardType = "new",
	},
	ref,
) {
	const [iframeLoading, setIframeLoading] = useState(true)

	// console.log("ref: ", ref)
	// console.log("onSetCardType: ", onSetCardType)
	console.log("onChangePaymentMethod: ", onChangePaymentMethod)
	// console.log("cardType: ", cardType)

	const {
		orderForm: {
			// totalizers,
			paymentData: { paymentSystems, payments },
		},
	} = useOrder()

	const { orderForm, refreshOrder } = useOrder()

	const [
		updatePaymentResponse,
		isFetchingUpdatePayment,
		//setRequestUpdatePayment,
	] = useFetch({} as RequestInfo)

	useEffect(() => {
		if (
			!isFetchingUpdatePayment &&
			updatePaymentResponse?.Data?.orderForm?.orderFormId
		) {
			refreshOrder().then(() => {
				
				console.log("## orderForm actualizado", orderForm)
				onSetCardType("saved")
			})
		} else if (!isFetchingUpdatePayment && updatePaymentResponse?.hasError) {
			// setShowAlertError(true)
			console.log("## error - updatePaymentResponse", updatePaymentResponse)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFetchingUpdatePayment, updatePaymentResponse])

	const payment = payments?.[0] ?? {}

	// const setOrderPayment = useCallback(async (paymentData: PaymentDataInput) => {
	// 	console.log("-- setOrderPayment --")
	// 	console.log("paymentData: ", paymentData)
	// 	setRequestUpdatePayment({
	// 		Method: "POST",
	// 		EndPoint: `${endpoints.PAYMENT}`,
	// 		RequestBody: {
	// 			orderFormId: orderForm?.orderFormId,
	// 			payments: paymentData.payments,
	// 		},
	// 	})
	// }, [])

	// const setPaymentField = useCallback(
	// 	(paymentField: Partial<PaymentInput>) => {
	// 		console.log("-- setPaymentField --")
	// 		console.log("paymentField: ", paymentField)
	// 		console.log("payment: ", payment)
	// 		const newPayment = {
	// 			...payment,
	// 			...paymentField,
	// 		}
	// 		return setOrderPayment({
	// 			payments: [newPayment],
	// 		})
	// 	},
	// 	[payment, setOrderPayment],
	// )

	// const referenceValue =
	// 	totalizers?.reduce((total: number, totalizer: Totalizer) => {
	// 		if (totalizer?.id === "Tax" || totalizer?.id === "interest") {
	// 			return total
	// 		}
	// 		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
	// 		return total + (totalizer?.value ?? 0)
	// 	}, 0) ?? 0

	// const [cardLastDigits, /*setCardLastDigits*/] = useState("")
	// const [
	// 	//selectedPaymentSystem,
	// 	//setSelectedPaymentSystem,
	// ] = useState<PaymentSystem | null>(
	// 	orderForm?.paymentData?.paymentSystems?.find(ps => ps.id == "202") || null,
	// )

	const iframeRef = useRef<HTMLIFrameElement>(null)
	const {
		culture: { locale },
	} = useRuntime()
	const isSSR = useSSR()
	const intl = useIntl()
	const creditCardPaymentSystems = useMemo(
		() =>
			paymentSystems.filter(
				(paymentSystem: PaymentSystem) =>
					paymentSystem.groupName === "creditCardPaymentGroup",
			),
		[paymentSystems],
	)

	const setupIframe = useCallback(async () => {
		iFrameResize?.(
			{
				heightCalculationMethod: "documentElementOffset",
				checkOrigin: false,
				resizeFrom: "parent",
				autoResize: true,
			},
			iframeRef.current!,
		)

		const stylesheetsUrls = Array.from(
			document.head.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]"),
		).map(link => link.href)

		await postRobot.send(iframeRef.current!.contentWindow, "setup", {
			stylesheetsUrls,
			paymentSystems: creditCardPaymentSystems,
		})
		setIframeLoading(false)
	}, [creditCardPaymentSystems])

	// const showCardErrors = useCallback(async () => {
	// 	await postRobot.send(iframeRef.current!.contentWindow, "showCardErrors")
	// }, [])

	const resetCardFormData = useCallback(async () => {
		if (iframeRef.current) {
			await postRobot.send(iframeRef.current.contentWindow, "resetCardFormData")
		}
	}, [])

	const updateAddress = (address: string | Address) => {
		if (!iframeRef.current) {
			return
		}

		postRobot.send(iframeRef.current.contentWindow, "updateAddress", {
			address,
		})
	}

	const updateDocument = (doc: string) => {
		if (!iframeRef.current) {
			return
		}

		postRobot.send(iframeRef.current.contentWindow, "updateDocument", {
			document: doc,
		})
	}

	useImperativeHandle(ref, () => ({
		resetCardFormData,
		updateAddress,
		updateDocument,
	}))

	useEffect(function createPaymentSystemListener() {
		// console.log("postRobot - bbbbb: ", postRobot)
		const listener = postRobot.on(
			"paymentSystem",
			({ data }: { data: PaymentSystem }) => {
				console.log("Setting paymentSystem - data: ", data)
				//setSelectedPaymentSystem(data)
			},
			// { timeout: 20000 },
		)
		return () => listener.cancel()
	}, [])

	//const [submitLoading, setSubmitLoading] = useState(false)

	// const handleSubmit = async () => {
	// 	setSubmitLoading(true)

	// 	try {
	// 		// const { data: cardIsValid } = await postRobot.send(
	// 		// 	iframeRef.current!.contentWindow,
	// 		// 	"isCardValid",
	// 		// )

	// 		console.log("selectedPaymentSystem: ", selectedPaymentSystem)
	// 		// console.log("cardIsValid: ", cardIsValid)
	// 		console.log("cardType: ", cardType)

	// 		// setSelectedPaymentSystem(
	// 		// 	orderForm?.paymentData?.paymentSystems?.find(ps => ps.id == "2") ||
	// 		// 		null,
	// 		// )

	// 		console.log(
	// 			"selectedPaymentSystem after setting value: ",
	// 			selectedPaymentSystem,
	// 		)

	// 		if (!selectedPaymentSystem /*|| !cardIsValid*/) {
	// 			showCardErrors()
	// 			return
	// 		}

	// 		console.log()

	// 		if (cardType === "new") {
	// 			const { data: lastDigits } = await postRobot.send(
	// 				iframeRef.current!.contentWindow,
	// 				"getCardLastDigits",
	// 			)
	// 			console.log("lastDigits: ", lastDigits)

	// 			setCardLastDigits(lastDigits)

	// 			console.log("## selectedPaymentSystem", selectedPaymentSystem)

	// 			await setPaymentField({
	// 				paymentSystem: selectedPaymentSystem.id,
	// 				paymentSystemName: selectedPaymentSystem.name,
	// 				group: selectedPaymentSystem.groupName,
	// 				installments: 1,
	// 				installmentsInterestRate: 0,
	// 				referenceValue,
	// 			})

	// 			console.log("updatePaymentResponse: ", updatePaymentResponse)
	// 		}

	// 		onCardFormCompleted()
	// 	} finally {
	// 		setSubmitLoading(false)
	// 	}
	// }

	const handleCardSummaryClick = async () => {
		resetCardFormData()
		// onChangePaymentMethod()
	}

	if (isSSR) {
		return null
	}

	return (
		<div className="relative w-100">
			{/* <span className="dib t-heading-6 mb5">
				{intl.formatMessage(messages.selectedPaymentLabel)}
			</span> */}
			{iframeLoading && (
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-white-70 z-1 flex items-center justify-center">
					<Spinner />
				</div>
			)}
			<div className={cardType === "saved" ? "mb5" : "mb3"}>
				<CardSummary
					paymentSystem={
						cardType === "saved" ? payment.paymentSystem! : undefined
					}
					//lastDigits={cardType === "saved" ? cardLastDigits : undefined}
					onEdit={handleCardSummaryClick}
				/>
			</div>

			<iframe
				id="chk-card-form"
				/* className={classNames(styles.iframe, 'vw-100 w-auto-ns nl5 nh0-ns', {
					[styles.newCard]: cardType === 'new',
        			[styles.savedCard]: cardType === 'saved',
        		})} */
				className={`${styles.creditCardIframe} vw-100 w-auto-ns nl5 nh0-ns`}
				title={intl.formatMessage(messages.cardFormTitle)}
				// The scrolling attribute is set to 'no' in the iframe tag, as older versions of IE don't allow
				// this to be turned off in code and can just slightly add a bit of extra space to the bottom
				// of the content that it doesn't report when it returns the height.
				scrolling="no"
				frameBorder="0"
				src={`${iframeURL}?locale=${locale}&cardType=${cardType}`}
				// src={
				// 	"https://io.vtexpayments.com.br/card-ui/1.21.2/index.html?paymentGroup=creditCardPaymentGroup&fallbackLocale=it-IT&accountName=itccwhirlpoolqa&css=%2Ffiles%2Fcheckout6-custom.css%3Fv%3D3edec7c6&origin=https%3A%2F%2Fitccwhirlpoolqa.vtexcommercestable.com.br&id=-16813831927300c9m99r3jkt"
				// }
				onLoad={() => setupIframe()}
				ref={iframeRef}
			/>

			{/* <div className="flex mt5">
				<Button
					size="large"
					block
					onClick={handleSubmit}
					isLoading={submitLoading}
				>
					<span className="f5">
						{intl.formatMessage(
							cardType === "saved"
								? messages.reviewPurchaseLabel
								: messages.save,
						)}
					</span>
				</Button>
			</div> */}
		</div>
	)
})

export default CreditCard
