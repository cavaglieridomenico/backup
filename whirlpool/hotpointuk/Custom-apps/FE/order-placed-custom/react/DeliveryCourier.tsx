import React, { FC, useState, useEffect } from 'react'
import { useOrder } from './components/OrderContext';
import { map } from 'lodash'
import style from './styles.css'

const DeliverCourier: FC = () => {

    const { deliveryParcels } = useOrder()
    const [SDA, setSDA] = useState(false)
    const [notSDA, setNOTSDA] = useState(false)
    const [isSpareAccessory, setIsSpareAccessory] = useState(false)



    async function useProduct(productId) {
        let baseUrl = window.location.origin
        let urlComplete = baseUrl + "/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/"+productId
        await fetch(urlComplete).then(response => response.json()).then((res) => {
            if(res["ModalType"] === "WHITE_GOODS"){
                setSDA(true)
            } else {
                setNOTSDA(true)
            }
        })
    }
    useEffect(()=>{
        //@ts-ignore
        deliveryParcels.map((parcel) => {
            if(parcel.selectedSla === "Next day delivery" || parcel.selectedSla === "Second day delivery" || parcel.selectedSla === "Standard delivery" || parcel.selectedSla === "Standard free" || parcel.selectedSla === "Standard charged") {
                setIsSpareAccessory(true)
            }
            parcel.items.map((item) => {
                useProduct(item.id)
            })
        })
    }, [])
    const deliveryCourier = () => {
        let specialSla = 0;
        let scheduledSla = 0;
        map(deliveryParcels, item => {
            if(item.selectedSla === "Special") {
                specialSla++
            }
            if(item.selectedSla === "Scheduled") {
                scheduledSla++
            }
        })
        if(SDA && !notSDA ){
            return "Hotpoint Home Solutions"
        } else if(SDA && notSDA){
            return "Your order will be delivered by Hotpoint Home Solutions"
        } else if(SDA && scheduledSla != 0){
            return "Your order will be delivered by Hotpoint Home Solutions"
        } else {
            switch(specialSla) {
                case 0: return "Hotpoint Home Solutions";
                case deliveryParcels.length: return "DPD"
                default: return "Your order will be delivered by Hotpoint Home Solutions"
            }
        }


    }

    return(
        <div className={style.deliveryCourier}>
            { deliveryCourier() }
            {isSpareAccessory && (
                <div>You will receive your tracking number via text/email from our courier provider once your parts order has been dispatched.</div>
            )}
        </div>
    );
}

export default DeliverCourier
