import React, { FC, useEffect, useState } from 'react'
import { NextDayDeliveryProps, cartProductsStatus, getStandardDeliverySlas } from "./utils/utilsForStandardDelivery"
import styles from "./styles/styles.css";
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from "react-intl";

const StandardDelivery: FC<NextDayDeliveryProps> = ({
    orderForm,
    onStandardDeliveryChanged,

}) => {
    const runtime = useRuntime();
    const cartStatus = cartProductsStatus(orderForm?.items);
    const StandardDeliverySlas = getStandardDeliverySlas(orderForm.shippingData.logisticsInfo);
    const [selectedDelivery, setSelectedDelivery] = useState("");
    const onDeliveryChange = ((e: any) => {
        setSelectedDelivery(e.currentTarget.value)
    })
    const convertEstimate = (estimate: string) => {
        let days = estimate.charAt(0);
        try {
            if (parseInt(days) == 2) {
                return `In ${days} business days`
            } else if (parseInt(days) == 1) {
                return `In ${days} business day`
            } else {
                return `Up to ${days} business days`
            }
        } catch (error) {
            return ""
        }
    }
    const convertMoney = (value: any) => {
        return runtime.culture.customCurrencySymbol + " " + value / 100
    }

    useEffect(() => {
        let isNextDay = StandardDeliverySlas?.slas.filter((sla: any) => sla?.id === "Next day delivery").length > 0;
        let isSecondDay = StandardDeliverySlas?.slas.filter((sla: any) => sla?.id === "Second day delivery").length > 0

        if (isNextDay) {
            setSelectedDelivery("Next day delivery")
        } else if (isSecondDay) {
            setSelectedDelivery("Second day delivery")
        }
        else if (StandardDeliverySlas.selected === "Standard free" && !cartStatus.hasFg) {
            setSelectedDelivery("Standard charged")
        } else if (StandardDeliverySlas.selected === "Standard charged" && cartStatus.hasFg) {
            setSelectedDelivery("Standard free")
        } else {
            setSelectedDelivery(StandardDeliverySlas.selected)
        }

    }, [])
    useEffect(() => {
        if (selectedDelivery) {
            onStandardDeliveryChanged(
                StandardDeliverySlas.slas.filter((sla: any) => { return sla.id === selectedDelivery })[0]
            )
        }
    }, [selectedDelivery])
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
    return (
        <>
            {StandardDeliverySlas && StandardDeliverySlas.slas.length > 0 && (
                <>
                    <p className={[styles.shiptext, styles.deliveryText].join(" ")}><FormattedMessage id="checkout-hdx-delivery-slots-uk.standard-delivery-date" /></p>
                    <div className={styles.deliveryRadioGroup}>

                        {StandardDeliverySlas.slas?.map((sla: any) => {

                            if ((sla.id === "Standard free" && !cartStatus.hasFg) || (sla.id === "Standard charged" && cartStatus.hasFg)) {
                                return ""
                            } else {
                                return <div className={styles.deliveryRadio}>
                                    <label className={styles.deliveryRadioWrapper}>
                                        <input
                                            type="radio"
                                            value={sla.id}
                                            onChange={onDeliveryChange}
                                            checked={selectedDelivery === sla.id} />
                                        <div className={styles.deliveryRadioInfo}>
                                            <b>{sla.name === "Second day delivery" ? "Next day delivery" : sla.name}</b>
                                            <span className={styles.deliveryRadioInfoEstimate}>{convertEstimate(sla.shippingEstimate)}</span>
                                        </div>
                                        <span className={styles.deliveryRadioInfoPrice}>
                                            {convertMoney(calculatePrice(sla.name))}
                                        </span>
                                    </label>
                                </div>
                            }


                        })}
                    </div>
                </>
            )}

        </>

    )
}

<div></div>
export default StandardDelivery;
