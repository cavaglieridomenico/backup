// @ts-nocheck
import React, { FC, useEffect, useState } from "react"
import { useIntl, defineMessages } from "react-intl"
import { Spinner } from 'vtex.styleguide'
import useOrder from "ukccwhirlpool.checkout-container-custom/OrderForm"
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
  // const logisticInfos = shippingData?.logisticsInfo
  const [dataLoading, setDataLoading] = useState(true);
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

  deliveries?.forEach((li: any) => {
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


  useEffect(() => {

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
          }).then(res => {
            console.log("TRADEPLACE custom data updated: ", res);
            refreshOrder()
          });



          let scheduledSla = deliveries.filter(logInfo => logInfo.selectedSla === "Scheduled")[0]
          let hdxApp = refreshedOrderForm.customData.customApps.filter(app => app.id == "hdx")[0]

          if ((scheduledSla && !scheduledSla.slas[0].deliveryWindow) || (scheduledSla && scheduledSla?.slas[0].deliveryWindow && data?.slots && data.slots.length > 0 && hdxApp && hdxApp.fields && !hdxApp.fields.reservationCode)) {

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
                return {...newScheduled, itemIndex: logInfo.itemIndex};
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
                  fetch(`/app/hdx/delivery/slots/${orderForm.orderFormId}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                    },
                    body: "{}"
                  }).then(() => {
                    // TO BE CHECKED: if the response is not successful, what shall be done?
                    setDataLoading(false)
                  }).catch(() => {
                    setDataLoading(false)
                    // SHOW DELIVERY WARNING
                  });
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
            .catch((err) =>{ console.error(err, "SLOT DATA TTT")
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

      return ()=>{selectedDeliveryName('')}
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

    let price = 0;
    orderForm?.shippingData?.logisticsInfo?.map((info: any) => {
      info?.slas?.map((sla: any) => {
        if (sla.name == name) {
          price += sla.price
        }
      })
    })
    return price
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
    if (shipTogether ||  (connectedGas && slots.length == 0)) {
      grouped["shipTogether"] = {
        name: "shipTogether",
        price: 0,
        products: [],
        position: 100
      }
    }
    deliveries.map((delivery) => {
      let currentDeliveryOverride = deliveriesOverrides.filter(item => item.deliveryId == delivery.selectedSla)[0];
      console.log("step1")
      if (!grouped[delivery.selectedSla]) {
        grouped[delivery.selectedSla] = {
          name: connectedGas && delivery.selectedSla === "LeadTime" ? "We will contact you for Delivery and/or Installation" : currentDeliveryOverride?.deliveryName ? currentDeliveryOverride.deliveryName : delivery.selectedSla,
          position: currentDeliveryOverride?.position ? currentDeliveryOverride.position : 100,

          products: [{
            name: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].name,
            leadtime: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].leadtime,
            hideLeadTime: currentDeliveryOverride?.hideLeadTime
          }],
          deliveryWindow: delivery?.slas?.filter(sla => sla.id === delivery?.selectedSla)[0]?.deliveryWindow,
          shippingEstimate: !currentDeliveryOverride?.hideBussinessDays ? delivery.slas.filter(sla => sla.id === delivery.selectedSla)[0].shippingEstimate : "",
          price: calculatePrice(delivery.selectedSla)
        }

      } else {
        console.log("entro quod")
        grouped[delivery.selectedSla]?.products.push({
          name: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].name,
          leadtime: orderForm.items.filter(pr => pr.id == delivery.itemId)[0].leadtime,
          position: currentDeliveryOverride?.position ? currentDeliveryOverride.position : 100,
          hideLeadTime: currentDeliveryOverride?.hideLeadTime
        })
      }
    })
    console.log(connectedGas, "connectedGas")

    if (shipTogether ||  (connectedGas && slots.length == 0)) {
      Object.keys(grouped).map((key) => {
        if (key !== "shipTogether" && deliveriesOverrides.filter(item => item.deliveryId == key) && deliveriesOverrides.filter(item => item.deliveryId == key)[0]?.groupOnShipTogheter) {
          grouped["shipTogether"]?.products = grouped["shipTogether"].products.concat([...grouped[key].products])
          delete grouped[key];
        }
      })
      grouped["shipTogether"].name = shipTogether ||  (connectedGas && slots.length == 0) ? 
      (deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0] ?  deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0].deliveryName : "We will contact you for Delivery and/or Installation") 
      :(deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0] ? deliveriesOverrides.filter(item => item.deliveryId == "shipTogether")[0].deliveryName : "Products that will be shipped togheter");
    }
    console.log(grouped, "grouped")
    itemsGroupedByDelivery = grouped
    console.log(itemsGroupedByDelivery, "itemsGroupedByDelivery")
  }


  return (
    <div className={style.shippingSummaryDelivery}>
      {dataLoading && (
        <span className="c-action-primary absolute">
          <Spinner color="currentColor" />
        </span>
      )}
      {!dataLoading && (
           <div className={style.selectedDeliveries}>
           {Object.keys(itemsGroupedByDelivery).map((key, index) => {

             return <div className={style.selectedDeliveryWrapper} style={{ order: itemsGroupedByDelivery[key].position }}>
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
                         {`${__RUNTIME__.culture.customCurrencySymbol} ${itemsGroupedByDelivery[key].price / 100}`}
                       </div>
                     </div>
                   </div>

                 )
               }
             </div>
           })}
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
  }
})

export default CheckoutShippingSummary
