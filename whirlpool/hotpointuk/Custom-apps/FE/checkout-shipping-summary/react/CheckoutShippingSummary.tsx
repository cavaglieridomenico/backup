//@ts-nocheck
import useOrder from "hotpointuk.checkout-container-custom/OrderForm"
import React, { FC, useEffect, useState } from "react"
import { useMutation } from 'react-apollo'
import { defineMessages, useIntl } from "react-intl"
import { IconClose } from 'vtex.store-icons'
import isServedPC from "./graphql/isServedPC.graphql"

import style from "./styles/styles.css"
interface CheckoutShippingSummaryProps {
  children: any,
  deliveriesOverrides: any
}

const CheckoutShippingSummary: FC<CheckoutShippingSummaryProps> = (
  {
    deliveriesOverrides = []
  },
) => {
  const { orderForm, refreshOrder } = useOrder()
  const [shippingData, setShippingData] = useState(orderForm?.shippingData)
  const intl = useIntl()
  const deliveries = shippingData?.logisticsInfo || []
  const [selectedDeliveryName, setSelectedDeliveryName] = useState("");
  const shipTogether = orderForm?.customData?.customApps?.filter(app => app.id == "tradeplace")[0]?.fields.shipTogether == "true"
  const connectedGas = orderForm?.customData?.customApps?.filter(app => app.id == "tradeplace")[0]?.fields.connectedGas == "true"
  const [slots, setSlots] = useState([])
  const logisticInfos = shippingData?.logisticsInfo
  const [dataLoading, setDataLoading] = useState(true);
  const [showRemoveInstallationModal, setShowRemoveInstallationModal] = useState(false)
  const hasItemsWithInstallation = orderForm?.items?.filter((item: any) => item.bundleItems.length > 0).length > 0

  const shippingPolicies = {
    SCHEDULED: 'Scheduled',
    STANDARD: 'Next day (Orders placed before 2pm)',
    SPECIAL: 'Special',
    LEADTIME: 'LeadTime',
    BUNDLE: 'Bundle'
  }


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
  if (connectedGas)
    itemsTypes = { ...itemsTypes, GAS: true }

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
  useEffect(() => {
    postalCodeServed({
      variables: {
        orderFormId: orderForm?.orderFormId
      }
    })
    fetch(`/app/hdx/delivery/slots/${orderForm?.orderFormId}`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setSlots(data?.slots);

        refreshOrder().then((newOrder) => {
          setShippingData(newOrder?.data?.checkoutOrder?.shippingData)
          let refreshedOrderForm = newOrder?.data?.checkoutOrder;
          let tradeplaceData = refreshedOrderForm?.customData?.customApps?.filter(app => app.id == "tradeplace")[0]?.fields
          fetch(`/api/checkout/pub/orderForm/${orderForm.orderFormId}/customData/tradeplace`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              ...tradeplaceData,
              connectedGas: data?.hasCGasAppliances.toString()
            })
            // body: tradeplaceCustomData
          }).then(res => refreshOrder() )

          let scheduledSla = deliveries.filter(logInfo => logInfo.selectedSla === "Scheduled")[0]

          if ((scheduledSla && !scheduledSla.slas[0].deliveryWindow)) {

            let deliveryWindow = {
              startDateUtc: null,
              endDateUtc: null,
              price: null,
              lisPrice: null,
              tax: null
            }

            if (data?.slots && data.slots.length > 0) {
              deliveryWindow.startDateUtc = data?.slots[0]?.startDateUtc
              deliveryWindow.endDateUtc = data?.slots[0]?.endDateUtc
              deliveryWindow.price = 0,
                deliveryWindow.lisPrice = 0,
                deliveryWindow.tax = 0.0;

            } else {
              deliveryWindow.startDateUtc = scheduledSla.slas[0].availableDeliveryWindows?.filter((del: any) => del.price == "0")[0]?.startDateUtc,
                deliveryWindow.endDateUtc = scheduledSla.slas[0].availableDeliveryWindows?.filter((del: any) => del.price == "0")[0]?.endDateUtc
              deliveryWindow.price = 0,
                deliveryWindow.lisPrice = 0,
                deliveryWindow.tax = 0.0;

            }


            let newScheduled = {
              itemIndex: scheduledSla.itemIndex,
              selectedSla: scheduledSla.selectedSla,
              selectedDeliveryInfo: scheduledSla.slas[0].availableDeliveryWindows?.filter((del: any) => del.price == "0")[0]?.deliveryChannel,
              deliveryWindow
            }

            const updatedLogistics = deliveries.map(logInfo => {
              if (logInfo.selectedSla === "Scheduled") {
                return { ...newScheduled, itemIndex: logInfo.itemIndex };
              } else {
                return {
                  ...logInfo
                }
              }
            })
            let body = { "orderFormId": orderForm.orderFormId, "shipping": { "selectedAddresses": [...orderForm.shippingData.selectedAddresses], "logisticsInfo": updatedLogistics } }
            fetch(`/checkout-io/update-shipping`, {
              method: 'POST',
              body: JSON.stringify(body)
            })
              .then((updateShippingResponse) => {
                return updateShippingResponse.json()
              }).then((newOrderForm) => {
                setShippingData(newOrderForm.orderForm.shippingData)
                refreshOrder().then(() => {
                  setDataLoading(false)
                })

              })

              .catch((err) => {
                console.error(err, "SLOT DATA TTT")
                setDataLoading(false)
              })
          } else {
            setDataLoading(false);
          }

        })

        let standardFreeSla = deliveries.filter(logInfo => logInfo.selectedSla === "Standard free")[0]

        if (!(itemsTypes.SDA || itemsTypes.OOS || itemsTypes.GAS || itemsTypes.MDA) && standardFreeSla) {

          const updatedLogisticsInfo = deliveries.map(logInfo => {


            let isNextDay = logInfo.slas.filter(sla => sla.id === "Next day delivery").length > 0;
            let isSecondDay = logInfo.slas.filter(sla => sla.id === "Second day delivery")


            if (logInfo.selectedSla === "Standard free" || logInfo.selectedSla === "Standard charged" || logInfo.selectedSla === "Second day delivery" || logInfo.selectedSla === "Next day delivery") {

              return {
                ...logInfo,
                selectedSla: isNextDay ? "Next day delivery" : isSecondDay ? "Second day delivery" : itemsTypes.MDA || itemsTypes.SDA || itemsTypes.OOS || itemsTypes.GAS ? "Standard free" : "Standard charged"
              }
            } else {
              return { ...logInfo }
            }


          })
          let body = { "orderFormId": orderForm.orderFormId, "shipping": { "selectedAddresses": [...orderForm.shippingData.selectedAddresses], "logisticsInfo": updatedLogisticsInfo } }
          fetch(`/checkout-io/update-shipping`, {
            method: 'POST',
            body: JSON.stringify(body)
          })
            .then((updateShippingResponse) => {
              return updateShippingResponse.json()
            }).then((updatedForm) => {
              setShippingData(updatedForm.orderForm.shippingData)
              refreshOrder()
              setDataLoading(false)
            })
            .catch((err) => {
              console.error(err, "SLOT DATA TTT")
              setDataLoading(false)
            })
        } else {
          setDataLoading(false)
        }


      })
      .catch((err) => {
        console.error(err, "SLOT DATA TTT")
        setDataLoading(false)
      })



  }, [])

  // const AddressSummary = children?.find(
  //   (child: any) =>
  //     child.props.id == 'shipping-summary.address-summary'
  // )
  const daysAbb = {
    "1st": [
      "01",
      "21",
      "31"
    ],
    "2nd": [
      "22",
      "02"
    ]
  }
  const convertEstimate = (estimate: string) => {
    let days = estimate.charAt(0);
    try {
      if (parseInt(days) == 1) {
        return `${days} business day`
      } else {
        return `${days} business days`
      }
    } catch (error) {
      return ""
    }
  }

  const calculatePrice = (name: any) => {
    if (name === "Next day delivery" || name === "Standard free" || name === "Second day delivery") {
      let price = 0;
      orderForm?.shippingData?.logisticsInfo?.map((info: any) => {
        info?.slas?.map((sla: any) => {
          if (sla.name == name) {
            price += sla.price
          }
        })
      })
      return price
    } else {
      const productsWithSamePolicy = deliveries?.filter((item) => item.selectedSla === name)
      const onlyProducts = orderForm?.items?.filter((item) => productsWithSamePolicy.findIndex((product) => product.itemId === item.id) >= 0)
      const productsDelivery = onlyProducts.map((item) => item.bundleItems.find((item) => item.name === "Delivery")?.price)
      const productsDeliveryPurified = productsDelivery.map((item) => {
        if (!item) return 0
        return item
      })
      const deliveryPrice = productsDeliveryPurified.reduce((acc, curr) => curr + acc, 0);
      return deliveryPrice
    }
  }

  const convertDate = (date: string) => {
    let dateSplitted = new Date(date).toUTCString(__RUNTIME__.culture.locale).toString().split(" ");

    let day = daysAbb["1st"].includes(dateSplitted[1]) ? dateSplitted[1] + "st" : daysAbb["2nd"].includes(dateSplitted[1]) ? dateSplitted[1] + "nd" : dateSplitted[1] + "th"
    if (day.charAt(0) === "0") {
      day = day.substring(1, 4)
    }
    return dateSplitted[0] + " " + dateSplitted[2] + " " + day
  }

  let itemsGroupedByDelivery = null;

  if (deliveries && orderForm) {
    let grouped = {} as any;
    if (shipTogether || (connectedGas && slots.length == 0)) {
      grouped["shipTogether"] = {
        name: "shipTogether",
        price: 0,
        products: [],
        position: 100
      }
    }
    deliveries.map((delivery) => {
      let currentDeliveryOverride = deliveriesOverrides.filter(item => item.deliveryId == delivery.selectedSla)[0];
      if (!grouped[delivery.selectedSla]) {
        grouped[delivery.selectedSla] = {
          name: delivery.selectedSla === "Scheduled" && slots.length == 0 ? "We will contact you for Delivery and/or Installation" : (connectedGas && delivery.selectedSla === "LeadTime") ? "We will contact you for Delivery and/or Installation" : currentDeliveryOverride?.deliveryName ? currentDeliveryOverride.deliveryName : delivery.selectedSla,
          position: currentDeliveryOverride?.position ? currentDeliveryOverride.position : 100,

          products: [{
            name: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].name,
            leadtime: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].leadtime,
            hideLeadTime: currentDeliveryOverride?.hideLeadTime
          }],
          deliveryWindow: delivery.selectedSla === "Scheduled" && slots.length == 0 ? "" : delivery?.slas?.filter(sla => sla.id === delivery?.selectedSla)[0]?.deliveryWindow,
          shippingEstimate: delivery.selectedSla === "Scheduled" && slots.length == 0 ? "" : !currentDeliveryOverride?.hideBussinessDays ? delivery.slas.filter(sla => sla.id === delivery.selectedSla)[0].shippingEstimate : "",
          price: calculatePrice(delivery.selectedSla)
        }

      } else {
        grouped[delivery.selectedSla].products.push({
          name: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].name,
          leadtime: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].leadtime,
          position: currentDeliveryOverride?.position ? currentDeliveryOverride.position : 100,
          hideLeadTime: currentDeliveryOverride?.hideLeadTime
        })
      }
    })

    if (shipTogether || (connectedGas && slots.length == 0)) {
      Object.keys(grouped).map((key) => {
        if (key !== "shipTogether" && deliveriesOverrides.filter(item => item.deliveryId == key) && deliveriesOverrides.filter(item => item.deliveryId == key)[0]?.groupOnShipTogheter) {
          grouped["shipTogether"].products = grouped["shipTogether"].products.concat([...grouped[key].products])
          delete grouped[key];
        }
      })
      grouped["shipTogether"].name = shipTogether || (connectedGas && slots.length == 0) ? deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0] ? deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0].deliveryName : "We will contact you for Delivery and/or Installation" : deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0] ? deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0].deliveryName : "Products that will be shipped togheter";
    }

    itemsGroupedByDelivery = grouped
  }


  return (
    <div className={style.shippingSummaryDelivery}>
      {dataLoading && (
        <div className={style.loadingWrapper}>
          <svg className={style.loadingImage} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
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
      {!dataLoading && (
        <div className={style.selectedDeliveries}>
          {Object.keys(itemsGroupedByDelivery).map((key, index) => {

            return <div className={style.selectedDeliveryWrapper} style={{ order: itemsGroupedByDelivery[key]?.position }}>
              <span
                className={[style.selectedDeliveryTitle, selectedDeliveryName === itemsGroupedByDelivery[key].name ? style.selectedDeliveryTitleClicked : ""].join(" ")}
                onClick={() => { setSelectedDeliveryName(itemsGroupedByDelivery[key].name === selectedDeliveryName ? "" : itemsGroupedByDelivery[key].name) }}>
                {itemsGroupedByDelivery[key].name}
                {itemsGroupedByDelivery[key].shippingEstimate && (
                  <span> {convertEstimate(itemsGroupedByDelivery[key].shippingEstimate)}</span>
                )}
                {itemsGroupedByDelivery[key].deliveryWindow && (
                  <span> {convertDate(itemsGroupedByDelivery[key].deliveryWindow.endDateUtc)}</span>
                )}
              </span>
              {
                selectedDeliveryName === itemsGroupedByDelivery[key].name && (
                  <div className={style.selectedDeliveryItems}>

                    <div className={style.selectedDeliveryItemsWrapper}>

                      <div>
                        {itemsGroupedByDelivery[key].products.map((product) => {
                          return <div className={style.selectedDeliveryProduct}>{product.name} {product.leadtime && !product.hideLeadTime && (<span className={[style.selectedDeliveryProductLeadTime, "c-link"].join(" ")}>({product.leadtime})</span>)}</div>
                        })}
                      </div>
                    </div>
                    <div className={style.selectedDeliveryItemsWrapper}>
                      <span className={style.selectedDeliveryItemsTitle}>{`${intl.formatMessage(
                        messages.shippingPrice,
                      )}:`}</span>
                      <div className={style.selectedDeliveryItemPrice}>
                        {`${__RUNTIME__.culture.customCurrencySymbol} ${(itemsGroupedByDelivery[key].price / 100).toFixed(2)}`}
                      </div>
                    </div>
                  </div>

                )
              }
            </div>
          })}
        </div>
      )}
      {showRemoveInstallationModal && (
        <div className={style.installationRemovedModalWrapper} onClick={() => {setShowRemoveInstallationModal(false); window.location.reload()}}>
          <div className={style.installationRemovedModalContent}>
            <div className={style.iconCloseInstallation} onClick={() => { setShowRemoveInstallationModal(false); window.location.reload()}}>
              <IconClose orientation="down" size={15} />
            </div>
            <p>{intl.formatMessage(messages.installationRemove1)}<strong className="c-action-primary">{shippingData?.address?.postalCode}</strong>{intl.formatMessage(messages.installationRemove2)}</p>
          </div>
        </div>
      )}
    </div>
  )
}


const messages = defineMessages({
  shipping: {
    defaultMessage: "Shipping",
    id: "checkout-io.shipping",
  },
  delivery: {
    defaultMessage: "Selected delivery:",
    id: "checkout-io.shipping.selected-delivery",
  },
  deliveries: {
    defaultMessage: "Selected deliveries:",
    id: "checkout-io.shipping.selected-deliveries",
  },
  estimate: {
    defaultMessage: "Estimate date",
    id: "checkout-io.shipping.estimate"
  },
  products: {
    defaultMessage: "Products",
    id: "checkout-io.shipping.products"
  },
  shippingPrice: {
    defaultMessage: "Shipping cost",
    id: "checkout-io.shipping.delivery-price"
  },
  installationRemove1: {
    default: "The postal code ",
    id: 'checkout-shipping-summary.installation-remove-1',
  },
  installationRemove2: {
    default: " is not covered by our Installation service. The installation fee will be removed.",
    id: 'checkout-shipping-summary.installation-remove-2',
  },
})

export default CheckoutShippingSummary
