import useOrder from "hotpointuk.checkout-container-custom/OrderForm"
import React, { FC, useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { usePixel } from "vtex.pixel-manager"
import { IconCaret } from 'vtex.store-icons'
import { IconClose } from 'vtex.store-icons'
import { Button, Input, Toggle } from 'vtex.styleguide'
import Delivery from './Delivery'
import updateSelectedAddress from "./graphql/updateSelectedAddress.gql"
import isServedPC from "./graphql/isServedPC.graphql"
import MessagesController from './MessagesController'
import StandardDelivery from "./StandardDelivery"
import styles from "./styles/styles.css"
import { shippingPolicies } from "./utils/utilsForDelivery"
import { config, filterPostalCodeUK, getTitleCase, isValidPostcode, options, state } from "./utils/utilsForShippingForm"

type ShippingFormProps = {}

/*
  In this component we should set all the necessary to show the shipping form: here you'll find the logic to show correctly the list of streets, the autocomplete of fields when clicked on the street from the street list, the postalcode and error. When submitted it sends the data to the orderform

*/

const ShippingForm: FC<ShippingFormProps> = ({ }) => {
  const intl = useIntl()
  const { push } = usePixel();
  const [formData, setFormData] = useState({
    postCode: "",
    street: "",
    houseNumber: "",
    town: "",
    county: "",
    stairs: false
  })
  const [addresses, setAddresses] = useState([] as any)
  const [streetOptions, setStreetOptions] = useState([] as any)
  const [isPostCodeValid, setIsPostCodeValid] = useState(false)
  const [isAddressesListOpen, setIsAddressesListOpen] = useState(false)
  const [slotData, setSlotData] = useState<any>("")
  const [activeSlot, setActiveSlot] = useState<any>([])
  const [tradePlaceCustomData, setTradePlaceCustomData] = useState({} as any)
  const [showRemoveInstallationModal, setShowRemoveInstallationModal] = useState(false)
  const [submitError, setSubmitError] = useState({
    postCode: false,
    street: false,
    town: false,
    county: false,
  })

  const hash = window?.location?.hash
  const { orderForm, refreshOrder, isSpecsInserted } = useOrder()
  const orderFormId = orderForm?.orderFormId
  const shippingPrice = orderForm?.shippingData?.logisticsInfo[0]?.slas[0]?.price
  const selectedAddress = orderForm?.shippingData?.selectedAddresses[0]

  const items = orderForm?.items // Need to pass items object to "eec.checkout" event

  const [dataLoading, setDataLoading] = useState(false);
  const [slotDataLoading, setSlotDataLoading] = useState(false);

  const [standardDeliverySlot, setStandardDeliverySlot] = useState<any>(null);

  const logisticInfos = orderForm?.shippingData?.logisticsInfo;

  let itemsTypes = {
    MDA: false,
    SDA: false,
    OOS: false,
    GAS: false
  }

  logisticInfos?.forEach((li: any) => {
    if (!itemsTypes.MDA && li.slas.filter((sla: any) => sla.id === shippingPolicies.SCHEDULED).length > 0) {
      itemsTypes = { ...itemsTypes, MDA: true }
    } else if (!itemsTypes.SDA
      && li.slas.filter((sla: any) => sla.id === shippingPolicies.SPECIAL).length > 0) {
      itemsTypes = { ...itemsTypes, SDA: true }


    } else if (!itemsTypes.OOS
      && li.slas.filter((sla: any) => sla.id === shippingPolicies.LEADTIME).length > 0) {
      itemsTypes = { ...itemsTypes, OOS: true }

    }
  });
  if (orderForm?.customData?.customApps?.filter((app: any) => app.id == "tradeplace")[0]?.fields.connectedGas == "true")
    itemsTypes = { ...itemsTypes, GAS: true }


  // format street data in order to corretly show them on the street list
  const formatAddresses = (addresses: any) => {
    setStreetOptions([] as any)
    let streetOptions: any = []
    addresses.map((address: any) => {
      let streetOptionLabel: string = (address.number ? address.number + ", " : "") + (address.street ? address.street + ", " : "") + (address.neighborhood ? address.neighborhood + ", " : "") + (address.city ? address.city : "")
      let streetOptionValue: string = address.addressId
      const streetOption = {
        value: streetOptionValue,
        label: streetOptionLabel
      }
      streetOptions = [...streetOptions, streetOption]
    })

    return streetOptions
  }

  const handleStreetOptions = (addresses: any) => {
    setStreetOptions(formatAddresses(addresses))
  }

  const handleChangeInput = (e: any) => {
    e.persist()
    if (e.target.id !== "stairs")
      setFormData((prevstate) => ({ ...prevstate, [e.target.id]: e.target.value }))
    else
      setFormData((prevstate) => ({ ...prevstate, [e.target.id]: e.target.checked }))
  }

  //  handles street field and also filters the results from the streetlist according with what the user digits
  const handleChangeInputAddresses = (e: any) => {
    e.persist()
    setFormData((prevstate) => ({ ...prevstate, [e.target.id]: e.target.value }))
    if (e.target.value !== "") {
      let tempStreetOptions = formatAddresses(addresses)
      setStreetOptions(tempStreetOptions.filter((address: any) => address.label.toLowerCase().includes(e.target.value.toLowerCase())))
    }
    else {
      setStreetOptions(formatAddresses(addresses))
    }
  }

  useEffect(() => {
    if (isPostCodeValid) {
      loadAddressPTV(formData.postCode, hash)
      // push({
      //   event: "eec.checkout",
      //   step: 2,
      //   orderForm: orderForm,
      //   items
      // })
    } else {
      setIsPostCodeValid(false)
      setFormData(prevData => ({
        ...prevData,
        street: "",
        houseNumber: "",
        town: "",
        county: "",
        stairs: false
      }))
    }
  }, [isPostCodeValid])

  useEffect(() => {
    if (selectedAddress) {
      setFormData({
        postCode: selectedAddress.postalCode ? selectedAddress.postalCode : "",
        street: selectedAddress.street ? selectedAddress.street : "",
        houseNumber: selectedAddress.complement ? selectedAddress.complement : "",
        town: selectedAddress.city ? selectedAddress.city : "",
        county: selectedAddress.state ? selectedAddress.state : "",
        stairs: selectedAddress.reference ? Boolean(selectedAddress.reference) : false,
      })
    }
    if (selectedAddress?.postalCode && isValidPostcode(selectedAddress.postalCode)) {
      setIsPostCodeValid(true)
      // push({
      //   event: "eec.checkout",
      //   step: 2,
      //   orderForm: orderForm,
      //   items
      // })
    }
  }, [])

  // handles postalCode and also calls loadAddressPTV if it's valid
  const handleChangePostalCode = (e: any) => {
    if (!dataLoading && !slotDataLoading) {
      e.persist()
      setFormData((prevstate) => ({ ...prevstate, postCode: e.target.value }))
      if (isValidPostcode(e.target.value)) {
        setIsPostCodeValid(true);

        loadAddressPTV(e.target.value, hash);
      } else {
        setIsPostCodeValid(false)
        setFormData(prevData => ({
          ...prevData,
          street: "",
          houseNumber: "",
          town: "",
          county: "",
          stairs: false
        }))
      }
    }
  }

  // get all datetime slots (if present)
  const loadDeliverySlots = async (newOrderForm: any) => {

    //let hasScheduled = newOrderForm ? newOrderForm?.shippingData?.logisticsInfo?.filter((info: any) => info.selectedSla == "Scheduled").length > 0 :  orderForm?.shippingData?.logisticsInfo?.filter((info: any) => info.selectedSla == "Scheduled").length > 0;

    if (isPostCodeValid) {

      setSlotData("")
      setSlotDataLoading(true)
      await fetch(`/app/hdx/delivery/slots/${orderFormId}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          let tradeplaceData = newOrderForm ? newOrderForm?.customData?.customApps?.filter((app: any) => app.id == "tradeplace")[0]?.fields : orderForm?.customData?.customApps?.filter((app: any) => app.id == "tradeplace")[0]?.fields
          fetch(`/api/checkout/pub/orderForm/${orderForm?.orderFormId}/customData/tradeplace`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              ...tradeplaceData,
              connectedGas: data?.hasCGasAppliances.toString(),
              shipTogether: !(itemsTypes.MDA && itemsTypes.OOS && !itemsTypes.GAS) ? "false" : tradeplaceData.shipTogether
            })
            // body: tradeplaceCustomData
          }).then((/*res*/) => {
            setSlotDataLoading(false)
            refreshOrder()
            setSlotData(data)
          });

        })
        .catch((err) => {
          setSlotDataLoading(false)
          console.error(err, "SLOT DATA TTT")
        })
    } else {
      setSlotDataLoading(false)
    }
  }

  // mutation for initialize logistic Infos
  const updateAddressInfoMutation = (postalCode: any) => {

    updateAddressData({
      variables: {
        orderFormId: orderFormId,
        address: {
          postalCode: postalCode ? filterPostalCodeUK(postalCode) : filterPostalCodeUK(formData.postCode),
          country: "GBR",
          receiverName: orderForm.clientProfileData.firstName + " " + orderForm.clientProfileData.lastName,
          street: formData?.street ? formData?.street : "",
          complement: formData?.houseNumber ? formData?.houseNumber : "",
          city: formData?.town ? formData?.town : "",
          reference: formData?.stairs ? "With stairs" : "",
          state: formData?.county,
        }
      },
    })
  }

  const [safeToLoadStandard, setSafeToLoadStandard] = useState(false)
  const [updateAddressData]: any = useMutation(updateSelectedAddress, {
    onCompleted() {
      refreshOrder().then((data: any) => {
        loadDeliverySlots(data?.data?.checkoutOrder)
        setSafeToLoadStandard(true);
        setDataLoading(false);
        postalCodeServed({
          variables: {
            orderFormId: orderForm?.orderFormId
          }
        })
      })

    },
    onError() {
      setDataLoading(false);
    }
  })

  const [postalCodeServed]: any = useMutation(isServedPC, {
    onCompleted(data) {
      if (data && data["isServedPC"]) {
        if (!data["isServedPC"]["isServed"] && data["isServedPC"]["removedItems"] > 0) {
          setShowRemoveInstallationModal(true);
        }
      }
    },
    onError() {
      setDataLoading(false);
    }
  })
  // GET all data nedeed for streets, number and so on
  const loadAddressPTV = async (postalCode: string, hash: string) => {

    if ((hash === '#/shipping' && postalCode && postalCode !== state.hotpointPTV.lastPostalCode && !state.hotpointPTV.inProgress) || streetOptions.length === 0) {
      setDataLoading(true);
      state.hotpointPTV.addresses = [];
      state.hotpointPTV.inProgress = true;
      state.hotpointPTV.addresses = await fetch(
        config.URLhotpointPTV + postalCode,
        options
      )
        .then((response) => (response.json()))
        .then((addresses) => {

          if (orderFormId) {

            updateAddressInfoMutation(postalCode)
            // initLogisticInfos()
          }
          state.hotpointPTV.lastPostalCode = postalCode;
          state.hotpointPTV.inProgress = false;
          if (addresses?.length > 0) {
            setAddresses(addresses)
            handleStreetOptions(addresses)
            for (let i = 0; i < addresses.length; i++) {
              if (addresses[i]?.city) {
                addresses[i].city = getTitleCase(addresses[i].city);
              }
            }
            return addresses;
          }
          return [];
        })
        .catch((error) => {
          setDataLoading(false);
          updateAddressInfoMutation(postalCode);
          state.hotpointPTV.inProgress = false;
          console.error('error: loadAddressPTV', error);
          return error;
        });
    }
  }

  // re-sets data when user clicks on a single street from street list
  const handleSingleAddress = (address: any) => {
    setIsAddressesListOpen(false)
    let streetid = address.value
    let street = addresses.find((p: any) => p.addressId == streetid)
    setFormData((prevState) => ({
      ...prevState,
      street: street?.street,
      houseNumber: street?.number,
      town: street?.city,
      county: street?.state,
      stairs: false
    }))
  }

  const convertPriceToNumber = (stringPrice: string) => {
    let price: number = 9999.0;
    if (Number.isNaN(+stringPrice)) {
      if (stringPrice.toUpperCase() === "FREE") {
        price = 0.0;
      }
    } else {
      price = parseFloat(stringPrice)
    }
    return price;
  }

  useEffect(() => {
    (Object.values(submitError) as boolean[]).forEach((error: boolean) =>
    error && push({
      event: "ga4-custom_error",
      type: "error message",
      description: intl.formatMessage(messages.inputError),
    }),
    )
  }, [submitError])


  //  function to post shipping data inside orderForm
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // if (selectedAddress?.postalCode && isValidPostcode(selectedAddress.postalCode)) {
    //   push({
    //     event: "eec.checkout",
    //     step: 2,
    //     orderForm: orderForm,
    //     items
    //   })
    // }

    if (formData.postCode == ""  || formData.street == "" || formData.town == "" || formData.town.includes("\x01") || formData.town.includes("\x02") || formData.town.includes("\x03") || formData.town.includes("\x04") || formData.town.includes("\x05") || formData.town.includes("\x06") || formData.town.includes("\x07") || formData.town.includes("\x08") || formData.town.includes("\x09") || formData.town.includes("\x0A") || formData.town.includes("\x0B") || formData.town.includes("\x0C") || formData.town.includes("\x0D") || formData.town.includes("\x0E") || formData.town.includes("\x0F") || formData.houseNumber.includes("\x01") || formData.houseNumber.includes("\x02") || formData.houseNumber.includes("\x03") || formData.houseNumber.includes("\x04") || formData.houseNumber.includes("\x05") || formData.houseNumber.includes("\x06") || formData.houseNumber.includes("\x07") || formData.houseNumber.includes("\x08") || formData.houseNumber.includes("\x09") || formData.houseNumber.includes("\x0A") || formData.houseNumber.includes("\x0B") || formData.houseNumber.includes("\x0C") || formData.houseNumber.includes("\x0D") || formData.houseNumber.includes("\x0E") || formData.houseNumber.includes("\x0F") || (slotData.length > 0 ? activeSlot.length <= 0 : false)) {
      setSubmitError({
        postCode: formData.postCode == "",
        street: formData.street == "",
        town: formData.town == "",
        county: formData.county == "",
      })
      return
    } else {
      let selectedAddresses = [...orderForm?.shippingData?.selectedAddresses]
      let logisticsInfo = [...orderForm?.shippingData?.logisticsInfo]
      if (selectedAddresses && logisticsInfo) {
        if (selectedAddresses.length === 0) {
          selectedAddresses = [{
            city: "",
            complement: "",
            reference: "",
            postalCode: "",
            recieverName: "",
            state: "",
            street: ""
          }];
        }
        selectedAddresses[0].city = formData.town
        selectedAddresses[0].complement = formData.houseNumber
        selectedAddresses[0].reference = formData.stairs ? "With stairs" : ""
        selectedAddresses[0].postalCode = filterPostalCodeUK(orderForm?.shippingData?.address?.postalCode || formData.postCode)
        selectedAddresses[0].receiverName = orderForm?.clientProfileData?.firstName + " " + orderForm?.clientProfileData?.lastName
        selectedAddresses[0].state = formData.county
        selectedAddresses[0].street = formData.street



        const updatedLogisticsInfo = logisticsInfo.map(logInfo => {
          let deliveryWindow: any = {
            startDateUtc: null,
            endDateUtc: null,
            price: null,
            lisPrice: null,
            tax: null
          }

          if (logInfo.selectedSla === "Standard free" || logInfo.selectedSla === "Standard charged" || logInfo.selectedSla === "Second day delivery" || logInfo.selectedSla === "Next day delivery") {

            return {
              itemIndex: logInfo.itemIndex,
              selectedSla: standardDeliverySlot.id,
              selectedDeliveryInfo: standardDeliverySlot.deliveryChannel,
              addressId: selectedAddresses[0].addressId
            }
          } else {
            if (activeSlot[0]) {
              deliveryWindow.startDateUtc = activeSlot[0].startDateUtc,
                deliveryWindow.endDateUtc = activeSlot[0].endDateUtc,
                deliveryWindow.price = typeof activeSlot[0].price == "string" ? convertPriceToNumber(activeSlot[0].price) : activeSlot[0].price,
                deliveryWindow.lisPrice = typeof activeSlot[0].price == "string" ? convertPriceToNumber(activeSlot[0].price) : activeSlot[0].price,
                deliveryWindow.tax = 0.0;
            } else {
              if (slotData && slotData.slots.length > 0) {
                deliveryWindow.startDateUtc = slotData.slots[0]?.startDateUtc
                deliveryWindow.endDateUtc = slotData.slots[0]?.endDateUtc
                deliveryWindow.price = 0,
                  deliveryWindow.lisPrice = 0,
                  deliveryWindow.tax = 0.0;
              } else {
                deliveryWindow.startDateUtc = logInfo?.slas[0]?.availableDeliveryWindows?.filter((del: any) => del.price == "0")[0]?.startDateUtc,
                  deliveryWindow.endDateUtc = logInfo?.slas[0]?.availableDeliveryWindows?.filter((del: any) => del.price == "0")[0]?.endDateUtc
                deliveryWindow.price = 0,
                  deliveryWindow.lisPrice = 0,
                  deliveryWindow.tax = 0.0;
              }

            }
            return {
              itemIndex: logInfo.itemIndex,
              selectedSla: logInfo.selectedSla,
              selectedDeliveryInfo: logInfo.slas?.find((sla: { id: any }) => sla.id == logInfo.selectedSla)?.deliveryChannel,
              deliveryWindow: deliveryWindow?.startDateUtc ? deliveryWindow : null
            }
          }


        })
        let body = { "orderFormId": orderFormId, "shipping": { "selectedAddresses": selectedAddresses, "logisticsInfo": updatedLogisticsInfo } }
        await fetch(`/checkout-io/update-shipping`, {
          method: 'POST',
          body: JSON.stringify(body)
        })
          .then((updateShippingResponse) => {
            if (updateShippingResponse.ok) {
              refreshOrder();
              window.location.hash = '#/payment';
              //HDX POST removed, added in checkout.io -> PlaceOrder.tsx
            }
          })

          .catch((err) => console.error(err, "SLOT DATA TTT"))
        await fetch(`/api/checkout/pub/orderForm/${orderFormId}/customData/tradeplace`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(tradePlaceCustomData)
          // body: tradeplaceCustomData
        }).then(() => {
          refreshOrder();
        });
      }
    }
  }

  useEffect(() => {
    if (standardDeliverySlot) {
      setDataLoading(true)

      let selectedAddresses = [...orderForm?.shippingData?.selectedAddresses]
      let logisticsInfo = [...orderForm?.shippingData?.logisticsInfo]
      let body = { "orderFormId": orderFormId, "shipping": { "selectedAddresses": selectedAddresses, "logisticsInfo": logisticsInfo } }

      logisticsInfo = logisticsInfo.map((info) => {
        if (info.selectedSla === "Standard free" || info.selectedSla === "Standard charged" || info.selectedSla === "Second day delivery" || info.selectedSla === "Next day delivery") {
          info.selectedSla = standardDeliverySlot.id
        }

      })

      fetch(`/checkout-io/update-shipping`, {
        method: 'POST',
        body: JSON.stringify(body)
      }).then(() => {
        refreshOrder()
        setDataLoading(false)

      }).catch(() => {
        setDataLoading(false)

      })

    }
  }, [standardDeliverySlot])


  useEffect(() => {
    let customData = orderForm?.customData;
    if (!customData && orderFormId) {
      fetch(`/api/checkout/pub/orderForm/${orderForm?.orderFormId}/customData/tradeplace`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          connectedGas: "false",
          shipTogether: "false"
        })
        // body: tradeplaceCustomData
      }).then((/*res*/) => {
      });
    }
  }, [])

  useEffect(() => {
    if(isSpecsInserted){
      push({
        event: "eec.checkout",
        step: 2,
        orderForm: orderForm,
        items
      })
    }
  }, [isSpecsInserted])

  return <div className={styles.formWrapper}>
    {(dataLoading || slotDataLoading) && (
      <div className={styles.loadingWrapper}>
        <svg className={styles.loadingImage} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          viewBox="0 0 26.3 26.4">
          <g>
            <g>
              <circle cx="13.8" cy="3.1" r="3.1" />
              <circle cx="13.8" cy="24.5" r="1.8" />
              <circle cx="6.2" cy="6.2" r="2.8" />
              <circle cx="21.4" cy="21.4" r="1.5" />
              <circle cx="3.1" cy="13.8" r="2.5" />
              <circle cx="24.5" cy="13.8" r="1.2" />
              <path d="M4.7,19.8c-0.8,0.8-0.8,2.2,0,3c0.8,0.8,2.2,0.8,3,0c0.8-0.8,0.8-2.2,0-3C6.9,19,5.5,19,4.7,19.8z" />
              <circle cx="21.4" cy="6.2" r="0.9" />
            </g>
          </g>
        </svg>

      </div>
    )}
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="mb5">
        <Input
          value={formData.postCode}
          size="small"
          label={`${intl.formatMessage(messages.postCode)}`}
          onChange={(e: any) => { handleChangePostalCode(e) }}
          errorMessage={(submitError.postCode && !formData.postCode) ? intl.formatMessage(messages.inputError) : ""}
        />
      </div>
      {isPostCodeValid && <div className="mb5">
        <div className="mb5"
          onBlur={() => setIsAddressesListOpen(false)}
          onFocus={() => setIsAddressesListOpen(true)}
        >
          <div className="mb5">
            <div className={styles.formInputWrapper}>
              <Input
                value={formData.street}

                size="small"
                id="street"
                label={`${intl.formatMessage(messages.street)}`}
                onChange={(e: any) => { handleChangeInputAddresses(e) }}
                placeholder={`${intl.formatMessage(messages.streetPlaceholder)}`}
                errorMessage={(submitError.street && !formData.street) ? intl.formatMessage(messages.inputError) : ""}
              />
              <IconCaret orientation="down" size={13} />
            </div>
          </div>
          <div className={styles.streetListWrapper} style={isAddressesListOpen ? { display: "block" } : { display: "none" }}>
            {streetOptions && streetOptions.map((address: any, index: number) => {
              return <div key={index} className={styles.singleStreet} onMouseDown={() => handleSingleAddress(address)}>{address.label}</div>
            })}
          </div>
        </div>
        <div className="mb5">
          <Input
            value={formData.houseNumber}
            size="small"
            id="houseNumber"
            label={`${intl.formatMessage(messages.houseNumber)}`}
            onChange={(e: any) => { handleChangeInput(e) }}
            placeholder={`${intl.formatMessage(messages.houseNumberPlaceholder)}`}
            errorMessage={(formData.houseNumber.includes("\x01") || formData.houseNumber.includes("\x02") || formData.houseNumber.includes("\x03") || formData.houseNumber.includes("\x04") || formData.houseNumber.includes("\x05") || formData.houseNumber.includes("\x06") || formData.houseNumber.includes("\x07") || formData.houseNumber.includes("\x08") || formData.houseNumber.includes("\x09") || formData.houseNumber.includes("\x0A") || formData.houseNumber.includes("\x0B") || formData.houseNumber.includes("\x0C") || formData.houseNumber.includes("\x0D") || formData.houseNumber.includes("\x0E") || formData.houseNumber.includes("\x0F") ? intl.formatMessage(messages.inputFormatError) : "")}
          />
        </div>
        <div className="mb5">
          <Input
            value={formData.town}
            size="small"
            label={`${intl.formatMessage(messages.town)}`}
            id="town"
            onChange={(e: any) => { handleChangeInput(e) }}
            errorMessage={(submitError.town && !formData.town) ? intl.formatMessage(messages.inputError) : (formData.town.includes("\x01") || formData.town.includes("\x02") || formData.town.includes("\x03") || formData.town.includes("\x04") || formData.town.includes("\x05") || formData.town.includes("\x06") || formData.town.includes("\x07") || formData.town.includes("\x08") || formData.town.includes("\x09") || formData.town.includes("\x0A") || formData.town.includes("\x0B") || formData.town.includes("\x0C") || formData.town.includes("\x0D") || formData.town.includes("\x0E") || formData.town.includes("\x0F") ? intl.formatMessage(messages.inputFormatError) : "")}
          />
        </div>
        <div className="mb5">
          <Input
            value={formData.county}
            size="small"
            label={`${intl.formatMessage(messages.county)}`}
            id="county"
            onChange={(e: any) => { handleChangeInput(e) }}
            errorMessage={(submitError.county && !formData.county) ? intl.formatMessage(messages.inputError) : (formData.county.includes("\x01") || formData.county.includes("\x02") || formData.county.includes("\x03") || formData.county.includes("\x04") || formData.county.includes("\x05") || formData.county.includes("\x06") || formData.county.includes("\x07") || formData.county.includes("\x08") || formData.county.includes("\x09") || formData.county.includes("\x010") || formData.county.includes("\x011") || formData.county.includes("\x012") || formData.county.includes("\x013") || formData.county.includes("\x014") || formData.county.includes("\x015") ? intl.formatMessage(messages.inputFormatError) : "")}
          />
        </div>
        <div className="mb5">
          <p className={styles.stairsPreText}>{intl.formatMessage(messages.stairsPreText)}</p>
          <div className={styles.stairsInputWrapper}>
            <Toggle
              checked={formData.stairs}
              id="stairs"
              onChange={(e: any) => { handleChangeInput(e) }}
              label={<FormattedMessage id="checkout-hdx-delivery-slots-uk.stair-text" />}
            />
          </div>
        </div>
        {slotData && (
          <Delivery prop={slotData} getSlots={loadDeliverySlots} activeSlot={activeSlot} setActiveSlot={setActiveSlot} shippingPrice={shippingPrice} setTradePlaceCustomData={setTradePlaceCustomData} />
        )}
        <MessagesController itemsTypes={itemsTypes} hasSlots={slotData && slotData.slots.length > 0} />

        {safeToLoadStandard && (
          <StandardDelivery orderForm={orderForm} onStandardDeliveryChanged={setStandardDeliverySlot} />

        )}
        <div className={styles.goToPaymentWrap}>
          <Button type="submit"><FormattedMessage id="checkout-hdx-delivery-slots-uk.go-to-payment" /></Button>

        </div>
      </div>}
      {!isPostCodeValid && formData.postCode.length > 0 && (
        <div className={styles.invalidPostalCode}>Please insert a valid postal code.</div>
      )}
    </form>
    {showRemoveInstallationModal && (
        <div className={styles.installationRemovedModalWrapper} onClick={() => { setShowRemoveInstallationModal(false); window.location.reload()}}>
          <div className={styles.installationRemovedModalContent}>
            <div className={styles.iconCloseInstallation} onClick={() => { setShowRemoveInstallationModal(false); window.location.reload()}}>
              <IconClose orientation="down" size={15} />
            </div>
            <p>{intl.formatMessage(messages.installationRemove1)}<strong className="c-action-primary">{formData?.postCode}</strong>{intl.formatMessage(messages.installationRemove2)}</p>
          </div>
        </div>
      )}
  </div>
}

const messages = defineMessages({
  state: {
    defaultMessage: 'State*',
    id: 'checkout-hdx-delivery-slots-uk.state',
  },
  street: {
    defaultMessage: 'Street*',
    id: 'checkout-hdx-delivery-slots-uk.street',
  },
  postCode: {
    defaultMessage: 'Postcode*',
    id: 'checkout-hdx-delivery-slots-uk.postal-code',
  },
  houseNumberPlaceholder: {
    defaultMessage: "Apartment, suite, building, floor, etc (optional)",
    id: 'checkout-hdx-delivery-slots-uk.house-number-placeholder',
  },
  streetPlaceholder: {
    defaultMessage: "Street address*",
    id: 'checkout-hdx-delivery-slots-uk.street-placeholder',
  },
  houseNumber: {
    default: "House Number or name*",
    id: 'checkout-hdx-delivery-slots-uk.house-number',
  },
  stairsPreText: {
    default: "Are there any stairs to access this property?",
    id: 'checkout-hdx-delivery-slots-uk.stair-pretext',
  },
  stairsText: {
    default: "Stairs",
    id: 'checkout-hdx-delivery-slots-uk.stair-text',
  },
  inputError: {
    default: "This field is required.",
    id: 'checkout-hdx-delivery-slots-uk.input-error',
  },
  inputFormatError: {
    default: "The inserted field is not a valid field",
    id: 'checkout-hdx-delivery-slots-uk.input-format-error',
  },
  town: {
    default: "Town",
    id: 'checkout-hdx-delivery-slots-uk.town',
  },
  county: {
    default: "County*",
    id: 'checkout-hdx-delivery-slots-uk.county',
  },
  installationRemove1: {
    default: "The postal code ",
    id: 'checkout-hdx-delivery-slots-uk.installation-remove-1',
  },
  installationRemove2: {
    default: " is not covered by our Installation service. The installation fee will be removed.",
    id: 'checkout-hdx-delivery-slots-uk.installation-remove-2',
  },
})

export default ShippingForm;
