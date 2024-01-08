import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { defineMessages, useIntl } from "react-intl"
import { ButtonWithIcon, IconFailure, IconShoppingCart } from "vtex.styleguide"
import { useMutation } from "react-apollo"
import placeOrder from "../../../../graphql/placeOrder.graphql"
import saveWorldpayResponse from "../../../../graphql/worldpayIframeResponse.graphql"
import { useAppSettings } from "../../../../providers/appSettings"
import { useCheckout } from "../../../../providers/checkout"
import { useOrder } from "../../../../providers/orderform"
import routes from "../../../../utils/routes"
import CheckoutAlert from "../../../common/CheckoutAlert"
import { WorldpayPaymentApp } from "../../steps/payment/form/Worldpay"
import RedirectPopup from "../../steps/shipping/scheduled/RedirectPopup"
import style from "./style.css"
import { filterDeliverySlots, getDeliverySlots } from "../../../../utils/utils"
import { Slot } from "../../steps/shipping/hdx/form/utils/utilsForDelivery"
import { useRuntime } from "vtex.render-runtime"
import { usePayment } from "../../steps/payment/context/PaymentContext"


const shoppingCart = <IconShoppingCart />
const failureIcon = <IconFailure />
interface WPAppData {
	appName: string
	appPayload: string
}

interface PlaceOrderProps {
	action?: any,
	AuthApp: any,
	FarEye?: any,
	Hdx?: any
}


/**
 * @returns a button that places an order with the current orderform
 * @description this will first create the `transaction` and later
 * will fetch the `payment` API to finalize the order
 */

const PlaceOrder: React.FC<PlaceOrderProps> = ({ action, AuthApp, FarEye=false, Hdx=false }) => {
	const [canPlaceOrder, setCanPlaceOrder] = useState<boolean>(false)
	const [placingOrder, setPlacingOrder] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [wpAppData, setWPAppData] = useState<WPAppData | null>(null)
	const [authAppPayload, setAuthApp] = useState<any | null>(null)
	const [gatewayCallbackUrl, setGatewayCallbackUrl] = useState<string | null>(null)
	
	const [isPayment, setIsPayment] = useState<boolean>(false)
	const [isSlotExpired, setIsSlotExpired] = useState<boolean | undefined>(false)

	const { orderForm, orderLoading, currentStep } = useOrder()
	const orderFormId = orderForm?.orderFormId
	const paymentData = orderForm?.paymentData
	const shippingData = orderForm?.shippingData
	const deliveryMethods = shippingData?.logisticsInfo[0]?.slas
	const availableDeliveryWindows =
		deliveryMethods?.[0]?.availableDeliveryWindows

	const { appSettings } = useAppSettings()

	

	const notAdyenPaymentSystems = new Set([
			appSettings.worldpayConnectorId,
			appSettings.paypalConnectorId,
			appSettings.googlePayConnectorId,
			appSettings.applePayConnectorId
		])

	const {
		exhaustedDeliveries,
		referenceValue,
		paymentValue,
		interestValue,
	} = useCheckout()

	const { paymentMutationLoading } = usePayment()

	const intl = useIntl()
	const {
		culture: { currency },
		rootPath = "",
	} = useRuntime()

	/* Validations used to allow placing the order */
	const isAddressValid = shippingData?.selectedAddresses?.length > 0
	const isPaymentValid = paymentData?.payments?.length > 0
	const isDeliveryValid = !exhaustedDeliveries
	// I target the checkout container element to use it as the DOM Node for the popup portal rendering
	const checkoutContainer = document?.querySelector(
		".vtex-flex-layout-0-x-flexRow--checkoutContainer",
	)

	const getCardFormIframe = (() => {
		const iframe = document.getElementById("chk-card-form")! as HTMLIFrameElement

		return (): HTMLIFrameElement => {
			return iframe
		}
	})()


	const checkExpiredSlot = async (): Promise<{
		redirectToShippingSection: boolean | undefined
		reservationFound: boolean | undefined
	}> => {
		// we check if reserved slot is still available or expired and based on that we reload the page or allow proceeding to payment
		const getResponse = await fetch(
			`/app/fareye/reservation/check/${orderFormId}`,
		)
		if (getResponse.ok) {
			const data = await getResponse.json()
			return data
		}
		// If GET fails, we return undefined
		return {
			redirectToShippingSection: undefined,
			reservationFound: undefined,
		}
	}

	useEffect(() => {
		if (isAddressValid && isPaymentValid && isDeliveryValid) {
			setCanPlaceOrder(true)
		} else {
			setCanPlaceOrder(false)
		}
	}, [isAddressValid, isDeliveryValid, isPaymentValid])

	const isWPPayment =
		paymentData?.payments?.some(
			payment => payment.paymentSystem == appSettings.worldpayConnectorId,
		) || false

	/*--- MUTATIONS ---*/
    // @placeOrderMutation
    const placeOrderMutation = (transactionDatas: any) => {
        orderMutation({
            variables: {
                query: transactionDatas,
            },
        })
    }

	const [orderMutation]: any = useMutation(placeOrder, {
        onCompleted: data => {
            // window.location.replace(
            //  data.mutationCreatePaymentFromExistingCart.redirectUrl,
            // )
            if (data.mutationCreatePaymentFromExistingCart.redirectUrl) {
                window.location.replace(
                    data.mutationCreatePaymentFromExistingCart.redirectUrl,
                )
            } else if (
                paymentData?.payments[0]?.paymentSystem ==
                appSettings.worldpayConnectorId
            ) {
                const connectorData = JSON.parse(
                    data.mutationCreatePaymentFromExistingCart.error,
                )
                setWPAppData(connectorData.paymentAuthorizationAppCollection[0])
            }
            setPlacingOrder(false)
        },
        onError: error => {
            console.log(error)
            setPlacingOrder(false)
        },
    })
	//call HDX delivery/slots endpoint (POST) in order to reserve slot
	const hdx_reserve_slot = (orderFormId: any, callback: any) => {
		fetch(`/app/hdx/delivery/slots/${orderFormId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: "{}",
		})
			.then(() => {
				callback()
			})
			.catch(err => {
				console.log(err)
				// SHOW DELIVERY WARNING
				callback()
			})
	}

	const handlePlaceOrder = async () => {
		
		setPlacingOrder(true)

		// Checking if FarEye reserved slot is expired or still available
		if(FarEye){
			const {
				redirectToShippingSection: isRedirect,
				reservationFound,
			} = await checkExpiredSlot()
			setIsSlotExpired(isRedirect)
			if (isRedirect) {
				setPlacingOrder(false)
				return
			}

			if (!reservationFound) {
				try {
					const slots: { slots: Slot[] } = await getDeliverySlots(orderFormId)
					if (slots && slots.slots.length > 0) {
						const { uniqueDaySlots } = filterDeliverySlots(
							slots,
							availableDeliveryWindows,
						)
	
						if (uniqueDaySlots.length > 0) {
							setIsSlotExpired(true)
							setPlacingOrder(false)
							return
						}
					}
				} catch (err) {
					console.log(err)
					setPlacingOrder(false)
				}
			}
		}
		
		setErrorMessage(null)
		const selectedAddresses = shippingData?.selectedAddresses || []
		if (selectedAddresses?.[0]?.street == "") {
			setErrorMessage(messages.invalidShippingStreet)
			setPlacingOrder(false)
			return
		}
		if (selectedAddresses?.[0]?.postalCode == "") {
			setErrorMessage(messages.invalidShippingPostalCode)
			setPlacingOrder(false)
			return
		}
		//Adyen credit card payment check
		if(paymentData?.payments[0]?.paymentSystem == "2" || paymentData?.payments[0]?.paymentSystem == "4"){
			const postRobot = require("post-robot")
				try {
					const { data } = await postRobot.send(
						getCardFormIframe().contentWindow,
						"isCardValid"
					)
					if(!data){
						setErrorMessage(messages.insertCardMessage)
						setPlacingOrder(false)
						return
					}
				}catch (error){
					setPlacingOrder(false)
					console.log(error);
				}			
		}
		//

		const transactionData = {
			referenceId: orderFormId,
			referenceValue,
			value: paymentValue,
			interestValue,
			savePersonalData: true,
			optinNewsLetter:
				orderForm?.clientPreferencesData?.optinNewsLetter || false,
		}

		
		setErrorMessage(null)
		
		if(Hdx){
			hdx_reserve_slot(orderFormId, () => {
				if (notAdyenPaymentSystems.has(paymentData?.payments[0]?.paymentSystem)){
					placeOrderMutation(transactionData)
				}else{
					handlePlaceOrderVtex(transactionData)
				}
			});
		}else{
			
			if (notAdyenPaymentSystems.has(paymentData?.payments[0]?.paymentSystem)){
				placeOrderMutation(transactionData)
			}else{
				handlePlaceOrderVtex(transactionData)
			}	
		}

	}

	const handlePlaceOrderVtex = async(transactionData: any) => {
		
		/* Creates the transaction using the documented Checkout API */
		const startTransactionResponse = await fetch(
			`${rootPath}/api/checkout/pub/orderForm/${orderFormId}/transaction`,
			{
				method: "post",
				body: JSON.stringify(transactionData),
				headers: {
					"content-type": "application/json",
				},
			},
		)
	
		if (!startTransactionResponse.ok) {
			setPlacingOrder(false)
			return
		}
		
		//if status = 200
		const transaction = await startTransactionResponse.json();

		const {
			orderGroup: orderGroupId,
			id: transactionId,
			receiverUri,
			merchantTransactions,
			paymentData: { payments: transactionPayments },
			gatewayCallbackTemplatePath,
		} = transaction

		if (transactionId === "NO-PAYMENT") {
			window.location.replace(receiverUri)		
			return
		}

		if (merchantTransactions?.length > 0) {
			/* This calculates the payments needed per payment flag */
			const allPayments = transactionPayments.reduce(
				(_payments: any, transactionPayment: any) => {
					const merchantPayments = transactionPayment.merchantSellerPayments
						.map((merchantPayment: any) => {
							const merchantTransaction = merchantTransactions.find(
								(merchant: any) => merchant.id === merchantPayment.id,
							)

							if (!merchantTransaction) {
								return null
							}

							const { merchantSellerPayments, ...payment } = transactionPayment

							return {
								...payment,
								...merchantPayment,
								currencyCode: currency as string,
								installmentsValue: merchantPayment.installmentValue,
								installmentsInterestRate: merchantPayment.interestRate,
								transaction: {
									id: merchantTransaction.transactionId,
									merchantName: merchantTransaction.merchantName,
								},
							}
						})
						.filter((merchantPayment: any) => merchantPayment != null)

					return _payments.concat(merchantPayments)
				},
				[],
			)
			
			let redirectUrl = "";
			
			// ADYEN
			const postRobot = require("post-robot")
			try {
				
				await postRobot.send(getCardFormIframe().contentWindow, 'showCardErrors')

				const { data } = await postRobot.send(
					getCardFormIframe().contentWindow,
					"sendPayments",
					{
						payments: allPayments,
						receiverUri,
						orderId: orderGroupId,
						gatewayCallbackTemplatePath,
						transactionId,
					},
				)

				redirectUrl = data
			} catch (error) {
				console.log(JSON.stringify(error));
				setPlacingOrder(false);
				setErrorMessage(messages.transactionBadRequest)
				return 
			}
			
			const callbackResponse = await fetch(
				`${rootPath}/api/checkout/pub/gatewayCallback/${orderGroupId}`,
				{ method: "POST" },
			)

			if (callbackResponse.ok) {
				window.location.replace(redirectUrl)
			} else if (callbackResponse.status === 428) {

				//TO DO 3DS LOGIC
				
				/**
				 * @summary
				 * Status code 428 means that the payment is a redirect or a connector app
				 * that should be rendered to fulfill it
				 * @warn
				 * THIS APPROACH DOES NOT SUPPORT SPLIT-PAYMENT
				 */
				const connectorData = await callbackResponse.json()
				const redirectType = connectorData.RedirectResponseCollection
				const renderAuthType = connectorData.paymentAuthorizationAppCollection

				if (redirectType.length) {
					window.location.replace(redirectType[0].redirectUrl)
				}else if (renderAuthType.length){ // IF Card has 3ds
					setAuthApp(connectorData.paymentAuthorizationAppCollection[0].appPayload)
					document.documentElement.scrollTop = 0; //to scroll on top to see the challenge modal
					document.body.scrollTop = 0; //to scroll on top to see the challenge modal in safari
					setGatewayCallbackUrl(
						gatewayCallbackTemplatePath.replace('{messageCode}', 'Success')
					)
				}
				setPlacingOrder(false)
			}else{// status 500 internal server error
				setPlacingOrder(false);
				setErrorMessage(messages.transactionInternalServerError)
			}
		} else if (!receiverUri) {
			setErrorMessage(messages.defaultMessage)
			setPlacingOrder(false)
		} else if (transactionId === "NO-PAYMENT") {
			window.location.href = receiverUri
		}else {
			setErrorMessage(messages.defaultMessage)
			setPlacingOrder(false)
		}
	}
	
	const handleRespondTransaction = (status: boolean) => {
		if (status && gatewayCallbackUrl) {
			window.location.href = gatewayCallbackUrl
		} else {
			setAuthApp(null);
			setErrorMessage(messages.transactionInternalServerError)
			setPlacingOrder(false)
		}
		
	}

	// Function to reload the page and close the popup in case of expired slot
	const reloadPage = () => {
		window.location.reload()
	}

	useEffect(() => {
		setIsPayment(currentStep == routes.PAYMENT.route)
	}, [currentStep])

	const [saveIframeResponse] = useMutation(saveWorldpayResponse, {
		onError() {},
	})

	const saveIframeResponseCallback = (data: any) => {
		saveIframeResponse({
			variables: { ...data },
		})
	}
	

	return (
		<>
			<div className={style.placeOrderButtonContainer}>
				{isSlotExpired &&
					checkoutContainer &&
					createPortal(
						<RedirectPopup
							popupTitle={intl.formatMessage({ id: "checkout-io.popupTitle" })}
							popupText={intl.formatMessage({ id: "checkout-io.popupText" })}
							popupCtaLabel={intl.formatMessage({
								id: "checkout-io.popupCtaLabel",
							})}
							popupCtaAction={reloadPage}
						/>,
						checkoutContainer,
					)}
				{errorMessage && (
					<div className="mb6 mb7-ns mt5">
						<CheckoutAlert
							message={intl.formatMessage(errorMessage)}
							closeMessage={intl.formatMessage(messages.close)}
							handleCloseAlertError={() => setErrorMessage(null)}
						/>
					</div>
				)}
				{canPlaceOrder && isPayment && (
					<div
						className={
							!canPlaceOrder ? style.placeOrderButtonWrapper : undefined
						}
					>
						<ButtonWithIcon
							icon={canPlaceOrder ? shoppingCart : failureIcon}
							block
							variation="primary"
							isLoading={placingOrder || orderLoading || paymentMutationLoading}
							onClick={canPlaceOrder && (action ? action : handlePlaceOrder)}
						>
							{canPlaceOrder
								? intl.formatMessage(messages.placeOrder)
								: intl.formatMessage(messages.completeAllSteps)}
						</ButtonWithIcon>
					</div>
				)}

				{ authAppPayload ? <AuthApp  handleRespondTransaction={handleRespondTransaction} appPayload={authAppPayload}/> : null}
				{isWPPayment && wpAppData && (
					<div>
						<WorldpayPaymentApp
							{...{ ...wpAppData, saveResponse: saveIframeResponseCallback }}
						/>
					</div>
				)}
			</div>
			{/* )} */}
		</>
	)
}

const messages = defineMessages({
	defaultError: {
		defaultMessage: "An error has occurred",
		id: "checkout-io.default-error",
	},
	close: {
		defaultMessage: "Close",
		id: "checkout-io.close",
	},
	placeOrder: {
		defaultMessage: "Place order",
		id: "checkout-io.place-order",
	},
	completeAllSteps: {
		defaultMessage: "Complete all steps",
		id: "checkout-io.complete-all-steps",
	},
	invalidShippingStreet: {
		defaultMessage: "Please insert a valid street for the shipping.",
		id: "checkout-io.place-order.invalid-shipping-street",
	},
	invalidShippingPostalCode: {
		defaultMessage: "Please insert a internal-server-error-transaction postal code for the shipping.",
		id: "checkout-io.place-order.invalid-shipping-postal-code",
	},
	invalidDelivery: {
		defaultMessage:
			"No valid delivery options have been selected. Please check your shipping information.",
		id: "checkout-io.place-order.invalid-delivery",
	},
	transactionBadRequest: {
		defaultMessage:
			"General error when the request could not be fulfilled due to errors such as validation errors or missing required data.",
		id: "checkout-io.place-order.bad-request-transaction",
	},
	transactionInternalServerError: {
		defaultMessage:
			"Please check the data you entered, your purchase has not been completed. Your credit card information has been rejected by your bank due to an invalid address or lack of funds in your account.",
		id: "checkout-io.place-order.internal-server-error-transaction",
	},
	insertCardMessage: {
		defaultMessage:
			"Please insert credit card information",
		id: "checkout-io.place-order.insertCardMessage",
	},

})

export default PlaceOrder
