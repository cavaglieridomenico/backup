import React, { FC, useEffect, useState } from 'react'
import { useOrder } from './components/OrderContext'
import { singleTypeOrder, singleTypeOrder2, checkShipTogether, checkShipping } from './utils/shippingTypes.js'
import { map } from 'lodash'
import style from './styles.css'

const DeliveryDate: FC = () => {
    const { deliveryParcels, creationDate, clientProfileData, orderId } = useOrder()
    const [product, setProduct] = useState([])
    const [shipTogheterCheckDone, setShipTogheterCheckDone] = useState(null);
    const [nextSecondDayDelivery, setNextSecondDayDelivery] = useState(false);
    const [standardDelivery, setStandardDelivery] = useState(false);
    const [noReseravtion, setNoReservation] = useState(false)
    async function useProduct(productId) {
        let baseUrl = window.location.origin
        let urlComplete = baseUrl + "/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/"+productId
        await fetch(urlComplete).then(response => response.json()).then(res => setProduct(res))
    }

    useEffect(()=>{
        map(deliveryParcels, item => {
            if(item.selectedSla === "Bundle") {
                useProduct(item.items[0].id)
            }
        })
        fetch(`/_v/wrapper/api/orders/${orderId}/customData?email=${clientProfileData.email}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setShipTogheterCheckDone(data);
        });
        deliveryParcels.map((deliveryParcel)=> {
            if(deliveryParcel.selectedSla === "Next day delivery" || deliveryParcel.selectedSla === "Second day delivery") {
                setNextSecondDayDelivery(true)
            }
            if(deliveryParcel.selectedSla === "Standard delivery" || deliveryParcel.selectedSla === "Standard free" || deliveryParcel.selectedSla === "Standard charged") {
                setStandardDelivery(true)
            }
        })

        fetch(`/_v/wrapper/api/orders/${orderId}/hdxCustomData?email=${clientProfileData.email}`)
        .then(response => response.json())
        .then(data => {
            setNoReservation(data && !data.reservationCode)
        });
    }, [])


    return (
        <div style={{display: 'flex',flexDirection:'column'}}>
            <div className={style.deliveryDate}>
                {shipTogheterCheckDone && deliveryParcels.length === 1 && product["ModalType"] !== "FURNITURE" && (
                    deliveryParcels[0].shippingEstimateDate === null ?
                    singleTypeOrder2(deliveryParcels[0],creationDate, shipTogheterCheckDone,noReseravtion)
                    :
                    singleTypeOrder(deliveryParcels[0], shipTogheterCheckDone, noReseravtion)
                )}
                {deliveryParcels.length === 1 && product["ModalType"] === "FURNITURE" && (
                    "Our customer support team will contact you to arrange a convenient date for delivery and installation, which will be completed by one of our gas safe registered engineers."
                )}
                {deliveryParcels.length !== 1 && checkShipTogether(product) && (
                    "Your orders will be shipped together. We will contact you by phone to arrange delivery."
                )}
                {shipTogheterCheckDone && !checkShipTogether(product) && deliveryParcels.length !== 1 &&(
                    checkShipping(deliveryParcels,creationDate,product, shipTogheterCheckDone, useOrder(), noReseravtion)
                )}
                {deliveryParcels.length > 0 && nextSecondDayDelivery && (
                    <div>Delivery of your spare parts order will take place the next working day if ordered before 4pm Monday - Friday or 2 business days if ordered after 4pm Monday - Friday.</div>
                )}
                {deliveryParcels.length > 0 && standardDelivery && (
                    <div>Delivery for your spare parts order will take place in the next 3-5 working days.</div>
                )}
            </div>
        </div>

    )
}

export default DeliveryDate
