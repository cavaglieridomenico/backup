import React, { useEffect, useState } from "react"
import { ButtonWithIcon, IconShoppingCart, IconFailure } from "vtex.styleguide"
import { useIntl, defineMessages } from "react-intl"
// import { useRuntime } from 'vtex.render-runtime'
import style from "./style.css"
import { useOrder } from "../../providers/orderform"
import { useCheckout } from "../../providers/checkout"
import CheckoutAlert from "../common/CheckoutAlert"
import { useMutation } from "react-apollo"
import placeOrder from "../../graphql/placeOrder.graphql"
import saveWorldpayResponse from "../../graphql/worldpayIframeResponse.graphql"
import { WorldpayPaymentApp } from "../steps/payment/form/Worldpay"
import { usePayment } from "../steps/payment/context/PaymentContext"
import routes from "../../utils/routes"

const shoppingCart = <IconShoppingCart />
const failureIcon = <IconFailure />

interface WPAppData {
  appName: string
  appPayload: string
}

/**
 * @returns a button that places an order with the current orderform
 * @description this will first create the `transaction` and later
 * will fetch the `payment` API to finalize the order
 */

const PlaceOrder: React.FC = () => {
  const [canPlaceOrder, setCanPlaceOrder] = useState<boolean | null>(null)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [wpAppData, setWPAppData] = useState<WPAppData | null>(null)

	const [isPayment, setIsPayment] = useState<boolean>(false)

  const { orderForm, orderLoading, currentStep } = useOrder()
  const orderFormId = orderForm?.orderFormId
  const paymentData = orderForm?.paymentData
  const shippingData = orderForm?.shippingData

  // const { orderFormId, paymentData, shippingData } = orderForm as OrderForm

  const { exhaustedDeliveries, referenceValue, paymentValue, interestValue } =
    useCheckout()

  const { paymentMutationLoading } = usePayment()

  console.log(
    paymentMutationLoading,
    "paymentMutationLoading----------------------------------",
  )

  const intl = useIntl()
  // const {
  //   culture: { currency },
  //   rootPath = '',
  // } = useRuntime()

  /* Validations used to allow placing the order */
  const isAddressValid = shippingData?.selectedAddresses.length > 0
  const isPaymentValid = paymentData?.payments?.length > 0
  const isDeliveryValid = !exhaustedDeliveries

  useEffect(() => {
    if (isAddressValid && isPaymentValid && isDeliveryValid) {
      setCanPlaceOrder(true)
    } else {
      setCanPlaceOrder(false)
    }
  }, [isAddressValid, isDeliveryValid, isPaymentValid])

  const isWPPayment =
    paymentData?.payments?.some((payment) => payment.paymentSystem == "202") ||
    false

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
    onCompleted: (data) => {
      // window.location.replace(
      // 	data.mutationCreatePaymentFromExistingCart.redirectUrl,
      // )
      if (data.mutationCreatePaymentFromExistingCart.redirectUrl) {
        window.location.replace(
          data.mutationCreatePaymentFromExistingCart.redirectUrl,
        )
      } else if (paymentData?.payments[0]?.paymentSystem == "202") {
        const connectorData = JSON.parse(
          data.mutationCreatePaymentFromExistingCart.error,
        )
        console.log("RESPONSE for WORLDPAY - data: ", connectorData)
        // <WorldpayPaymentApp {...connectorData.paymentAuthorizationAppCollection[0]} />
        setWPAppData(connectorData.paymentAuthorizationAppCollection[0])
      }
      setPlacingOrder(false)
    },
    onError: (error) => {
      console.log(error) // the error if that is the case
    },
  })

  const handlePlaceOrder = async () => {
    const transactionData = {
      referenceId: orderFormId,
      referenceValue,
      value: paymentValue,
      interestValue,
      savePersonalData: true,
      optinNewsLetter:
        orderForm?.clientPreferencesData?.optinNewsLetter || false,
    }

    setPlacingOrder(true)
    setErrorMessage(null)

    // const selectedPaymentSystems = paymentData?.payments?.map(
    // 	(payment) => payment.paymentSystem,
    // )
    hdx_reserve_slot(orderFormId, () => {
      placeOrderMutation(transactionData)
    });

    
  }

  //call HDX delivery/slots endpoint (POST) in order to reserve slot
  const hdx_reserve_slot = (orderFormId: any, callback:any) => {

    fetch(`/app/hdx/delivery/slots/${orderFormId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: "{}"
    }).then(() => {
      callback();
    }).catch((err) => {
      // SHOW DELIVERY WARNING
      callback();
      console.log("Error in hdx_reserve_slot -> ", err)
    });
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
      {canPlaceOrder && isPayment && (
        <div className={style.placeOrderButtonContainer}>
          {errorMessage && (
            <div className="mb6 mb7-ns mt5">
              <CheckoutAlert
                message={errorMessage}
                closeMessage={intl.formatMessage(messages.close)}
                handleCloseAlertError={() => setErrorMessage(null)}
              />
            </div>
          )}
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
              onClick={canPlaceOrder && handlePlaceOrder}
            >
              {canPlaceOrder
                ? intl.formatMessage(messages.placeOrder)
                : intl.formatMessage(messages.completeAllSteps)}
            </ButtonWithIcon>
          </div>
          {isWPPayment && wpAppData && (
            <div>
              <WorldpayPaymentApp {...{ ...wpAppData, saveResponse: saveIframeResponseCallback }} />
            </div>
          )}
        </div>
      )}
    </>
  )
}

const messages = defineMessages({
  defaultError: {
    defaultMessage: "An error has ocurred",
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
})

export default PlaceOrder
