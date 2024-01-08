import React, {
  useEffect,
  useState
} from "react"
import { defineMessages, useIntl } from "react-intl"
import { usePixel } from "vtex.pixel-manager"
import { Button, Input, RadioGroup } from "vtex.styleguide"
import { useCheckout } from "../../../../../../providers/checkout"
import { useOrder } from "../../../../../../providers/orderform"
import type { Slot } from "../../hdx/form/utils/utilsForDelivery"
import DeliverySlots from "../../scheduled/DeliverySlots"
import ErrorMessage from "../../scheduled/ErrorMessage"
import { useShipping } from "../context/ShippingContext"
import style from "../delivery.css"
// import endpoints from "../../../../../../utils/endpoints"
// import useFetch, { RequestInfo } from "../../../../../../hooks/useFetch"
import DeliveryTypeLabel from "./DeliveryTypeLabel"
import { useMutation } from "react-apollo"
import { filterDeliverySlots, getDeliverySlots, regex, stringify } from "../../../../../../utils/utils"
import storeFareyeErrorResponse from "../../../../../../graphql/storeFareyeErrorResponse.graphql"

interface DeliveryEditableFormProps {
  // children: any
  isSlotsFromThirdPartyAPI: boolean
}

export type DeliveryWindow = {
  startDateUtc: string,
  endDateUtc: string,
  price: number,
  lisPrice: number,
  tax: number
}

const DeliveryEditableForm: React.FC<DeliveryEditableFormProps> = ({ isSlotsFromThirdPartyAPI = false }) => {
  // I create states for handling the slots fetch and selection from the user
  const [daySlots, setDaySlots] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<{ name: string, values: string }[]>([])
  const [selectedDaySlot, setSelectedDaySlot] = useState<string>("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [showNameErrorMessage, setNameErrorMessage] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isReservingSlot, setIsReservingSlot] = useState<boolean>(false)
  // I call custom hooks for orderForm, checkout and shipping details
  const { orderForm, refreshOrder } = useOrder()
  const { shippingData } = orderForm
  const {
    deliveryValues,
    setDeliveryValues,
    handleChangeDeliveryInput,
    isAddressSetted,
    updateDeliveryMutation,
    handleDeliverySubmit
    // isFetching
  } = useShipping()
  const { isScheduledDeliveryError, setIsScheduledDeliveryError, authCookie } = useCheckout()
  // I call other VTEX hooks for utilities
  const intl = useIntl()
  const { push } = usePixel()
  // I create consts from orderForm
  const items = orderForm?.items // Need to pass items object to "eec.checkout" event
  const deliveryMethods = shippingData?.logisticsInfo[0]?.slas
  const selectedDelivery = shippingData?.logisticsInfo[0]?.selectedSla
  const availableDeliveryWindows = deliveryMethods[0]?.availableDeliveryWindows
  const orderFormId = orderForm?.orderFormId

	const [saveFareyeErrorResponse]: any = useMutation(storeFareyeErrorResponse, {
    onError() {},
	})

  // I create two timeslots array, and then I will assign one of them based on the user's address
  const normalTimeSlots = [
    {
      name: "Mattina 8:00 - 12:00",
      values: "T08:00:00+00:00,T12:00:00+00:00"
    },
    {
      name: "Pomeriggio 13:00 - 18:00",
      values: "T13:00:00+00:00,T18:00:00+00:00"
    }
  ]
  const remoteTimeSlots = [
    {
      name: "Giornata intera 8:00 - 20:00",
      values: "T08:00:00+00:00,T20:00:00+00:00"
    }
  ]

  const fetchSlots = async (orderFormId: string) => {
    setIsReservingSlot(false);
    setIsScheduledDeliveryError(false);
    setIsLoading(true);
    try {
      const slots: { slots: Slot[] } = await getDeliverySlots(orderFormId, saveFareyeErrorResponse)
      if (slots && slots.slots.length > 0) {
        setIsLoading(false);
        // I filter the slots received by FarEye API to only include the ones passed by VTEX
        const {filteredSlots, uniqueDaySlots} = filterDeliverySlots(slots, availableDeliveryWindows)
        // if all the slots are during the weekends or are after two weeks from now than shows no slot available alert
        if(uniqueDaySlots.length == 0){
          setIsScheduledDeliveryError(true);
        }else {
          // I check if we receive only daily slots or otherwise only evenings slots
          const isOnlyMorning = filteredSlots.every((slot) => slot.endDateUtc.split("T")[1].includes("12"));
          const isOnlyEvening = filteredSlots.every((slot) => slot.startDateUtc.split("T")[1].includes("13"));
          // I check if I only received slots "giornata intera" if the CAP inserted is "zona remota"
          const isNotRemote = filteredSlots.some((slot) => slot.startDateUtc.split("T")[1].includes("13") || slot.endDateUtc.split("T")[1].includes("12"));
          setDaySlots(uniqueDaySlots);
          setTimeSlots(isNotRemote ? isOnlyMorning ? (normalTimeSlots.filter((slot) => slot.name.includes("Mattina"))) : isOnlyEvening ? (normalTimeSlots.filter((slot) => slot.name.includes("Pomeriggio"))) : normalTimeSlots : remoteTimeSlots);
        }
      } else {
        setIsLoading(false);
        setIsScheduledDeliveryError(true);
      }
    } catch (err) {
      setIsLoading(false);
      setIsScheduledDeliveryError(true);
      saveFareyeErrorResponse({variables: {message: `Retrieve delivery slots (orderFormId: ${orderFormId}) - error: ${stringify(err)}`}})
      console.log(err);
    }
  }

  const updateLogisticsInfo = async () => {
    let startDate: string;
    let endDate: string;
    // I initialize a default delivery window in case we receive empty slot from FarEye
    const defaultSlot: DeliveryWindow = availableDeliveryWindows[0]
    // I compose the start and end dates starting from day slots
    if (isScheduledDeliveryError) {
      startDate = defaultSlot.startDateUtc
      endDate = defaultSlot.endDateUtc
    } else {
      // If the user does not select a day or a time, we select the first ones available
      if (!selectedDaySlot) {
        if (!selectedTimeSlot) {
          startDate = daySlots[0] + timeSlots[0].values.split(",")[0]
          endDate = daySlots[0] + timeSlots[0].values.split(",")[1]
        } else {
          startDate = daySlots[0] + selectedTimeSlot.split(",")[0]
          endDate = daySlots[0] + selectedTimeSlot.split(",")[1]
        }
      } else if (!selectedTimeSlot) {
        startDate = selectedDaySlot + timeSlots[0].values.split(",")[0]
        endDate = selectedDaySlot + timeSlots[0].values.split(",")[1]
      } else {
        startDate = selectedDaySlot + selectedTimeSlot.split(",")[0]
        endDate = selectedDaySlot + selectedTimeSlot.split(",")[1]
      }
    }
    // I update the ORDERFORM with the selected deliveryWindow
    const updatedLogisticsInfo = shippingData.logisticsInfo.map((logInfo) => {
      let deliveryWindow: DeliveryWindow = {
        startDateUtc: startDate,
        endDateUtc: endDate.replace(regex, "59"),
        price: 0,
        lisPrice: 0,
        tax: 0,
      }
      return {
        itemIndex: logInfo.itemIndex,
        selectedSla: logInfo.selectedSla,
        selectedDeliveryInfo: "delivery",
        deliveryWindow
      }
    })
    const body = {
      userCookie: authCookie,
      orderFormId: orderFormId,
      shipping: {
        selectedAddresses: [{ ...shippingData.selectedAddresses[0], receiverName: deliveryValues?.receiver || shippingData.selectedAddresses[0].receiverName }],
        logisticsInfo: updatedLogisticsInfo,
      }
    };
    const postFetch = await fetch(`/checkout-io/update-shipping`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const isPosted = await postFetch.json();
    if (isPosted) return refreshOrder()
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (deliveryValues.receiver.length > 50) {
      setNameErrorMessage(true)
      return;
    } else {
      setNameErrorMessage(false)
    }
    // If the zone is not served, we skip all the HTTP requests
    if (deliveryMethods.length <= 0) handleDeliverySubmit(".whirlpoolemea-checkout-container-custom-2-x-receiverInput")
    // When the form is submitted we update the logisticInfos of the orderForm and do the POST request to reserve the selected slot
    setIsReservingSlot(true);
    updateLogisticsInfo().then((newOrderForm) => {
      // When the ORDERFORM is updated with the deliveryWindow, I send it to FarEye API to reserve the selected slot
      fetch(`/app/fareye/slots/reserve/${newOrderForm.data.checkoutOrder.orderFormId}`, {
        method: "POST",
        body: JSON.stringify({})
      })
        .then((response) => {
          if (!response.ok) {
            setIsScheduledDeliveryError(true)
            response.text().then(res => saveFareyeErrorResponse({variables: {
              message: `Reserve delivery slots (orderFormId: ${newOrderForm.data.checkoutOrder.orderFormId}) - error: ${res}`
            }}))
          }
          setIsReservingSlot(false)
          handleDeliverySubmit()
        })

      .catch(err => saveFareyeErrorResponse({variables: {
        message: `Reserve delivery slots (orderFormId: ${newOrderForm.data.checkoutOrder.orderFormId}) - error: ${stringify(err)}`
      }}))
    })
  }

  const getDeliveryOptions = () => {
    let delOptions: any = []
    deliveryMethods.map((item: any) => {
      delOptions.push({
        value: item.name,
        label: <DeliveryTypeLabel type={item.name} price={item.price} />,
      })
    })
    // delOptions.push({
    //   value: "Delivery",
    //   label: <DeliveryTypeLabel type={"Delivery"} price={"5,00 €"}/>
    // })
    return delOptions
  }

  //Get delivery options to put in the RadioGroup
  const deliveryOptions = getDeliveryOptions()

  useEffect(() => {

    push({
      event: "eec.checkout",
      step: 2,
      orderForm: orderForm,
      items,
    });

    if (selectedDelivery) {
      setDeliveryValues({
        ...deliveryValues,
        id: selectedDelivery,
      })
      //updateDeliveryMutation(defaultDeliveryMethod) NOT NECESSARY AS FROM DEFAULT WE HAVE A SELECTED_SLA
    }
  }, [])

  useEffect(() => {
    // This useEffect is necessary to ensure that the GET fetch for the slots is executed also when the user changes his address
    isSlotsFromThirdPartyAPI && isAddressSetted && deliveryMethods.length > 0 && fetchSlots(orderFormId);
  }, [isSlotsFromThirdPartyAPI, isAddressSetted, deliveryMethods.length])

  return (
    <>
      {isAddressSetted && (
        <form className={`mt6 relative ${isReservingSlot ? style.disabledForm : ""}`} onSubmit={(e) => isSlotsFromThirdPartyAPI ? handleSubmit(e) : handleDeliverySubmit()}>
          <div className={style.receiverInput} data-testid="delivery-receiver">
            <Input
              label={`${intl.formatMessage(messages.receiver)}`}
              name="receiver"
              type="text"
              value={deliveryValues?.receiver || ""}
              error={showNameErrorMessage}
              onChange={(e: any) => {
                setNameErrorMessage(false);
                handleChangeDeliveryInput(e)
              }}
              errorMessage={showNameErrorMessage ? intl.formatMessage(messages.receiverTooLong) : (deliveryValues.receiver.includes("\x01") || deliveryValues.receiver.includes("\x02") || deliveryValues.receiver.includes("\x03") || deliveryValues.receiver.includes("\x04") || deliveryValues.receiver.includes("\x05") || deliveryValues.receiver.includes("\x06") || deliveryValues.receiver.includes("\x07") || deliveryValues.receiver.includes("\x08") || deliveryValues.receiver.includes("\x09") || deliveryValues.receiver.includes("\x0A") || deliveryValues.receiver.includes("\x0B") || deliveryValues.receiver.includes("\x0C") || deliveryValues.receiver.includes("\x0D") || deliveryValues.receiver.includes("\x0E") || deliveryValues.receiver.includes("\x0F") ? intl.formatMessage(messages.inputFormatError) : "")}
            />
          </div>
          <div className={style.deliverygroupContainer}>
            {!isSlotsFromThirdPartyAPI ? (
              <RadioGroup
                name="delivery-types"
                options={deliveryOptions || []}
                value={selectedDelivery}
                label={`${intl.formatMessage(messages.shippingType)}`}
                onChange={(e: any) =>
                  updateDeliveryMutation(e.currentTarget.value)
                }
              />
            ) : isScheduledDeliveryError && deliveryMethods.length > 0 ? (
              <ErrorMessage>{intl.formatMessage(messages.fetchErrorMessage)}</ErrorMessage>
            ) : (
              deliveryMethods.length > 0 &&
              <DeliverySlots
                isLoading={isLoading}
                daySlots={daySlots}
                selectedDaySlot={selectedDaySlot}
                setSelectedDaySlot={setSelectedDaySlot}
                timeSlots={timeSlots}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
              />
            )}
          </div>
          <div className={style.deliveryButton}>
            <Button size="large" type="submit" block variation="primary" isLoading={isReservingSlot}>
              <span className="f5">
                {intl.formatMessage(messages.goToPayment)}
              </span>
            </Button>
          </div>
        </form>
      )}
    </>
  )
}

const messages = defineMessages({
  receiver: {
    defaultMessage: "Receiver",
    id: "checkout-io.receiver",
  },
  receiverTooLong: {
    defaultMessage: "Hai superato il limite di 50 caratteri",
    id: "checkout-io.receiverTooLong"
  },
  inputFormatError: {
		default: "Il campo inserito non è valido",
		id: 'checkout-hdx-delivery-slots-uk.input-format-error',
	},
  shippingType: {
    defaultMessage: "Shipping type",
    id: "checkout-io.shipping-type",
  },
  goToPayment: {
    defaultMessage: "Go to payment",
    id: "checkout-io.goToPayment",
  },
  fetchErrorMessage: {
    defaultMessage: "Something went wrong, please try again",
    id: "checkout-io.fetchErrorMessage",
  }
})

export default DeliveryEditableForm
