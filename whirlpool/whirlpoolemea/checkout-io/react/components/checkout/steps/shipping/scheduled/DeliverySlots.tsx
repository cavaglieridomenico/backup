import React from 'react'
import { defineMessages, useIntl } from "react-intl"
import { useRuntime } from "vtex.render-runtime"
import { formatTheDate } from "../hdx/form/utils/utilsForDelivery"
import style from "../standard/delivery.css"

interface DeliverySlotsProps {
  isLoading: boolean,
  daySlots: string[],
  selectedDaySlot: string,
  setSelectedDaySlot: React.Dispatch<React.SetStateAction<string>>,
  timeSlots: {name: string, values: string}[],
  selectedTimeSlot: string,
  setSelectedTimeSlot: React.Dispatch<React.SetStateAction<string>>
}

const DeliverySlots: StorefrontFunctionComponent<DeliverySlotsProps> = (props) => {
  const {isLoading, daySlots, selectedDaySlot, setSelectedDaySlot, timeSlots, selectedTimeSlot, setSelectedTimeSlot} = props
	const intl = useIntl()
  const { culture: { locale } } = useRuntime();
  return (
    <>
      <span className={`${style.deliveryMethodLabel} db mb3 c-on-base`}>
        {intl.formatMessage(messages.shippingType)}
      </span>
        {isLoading ? (
          <div className={style.skeletonLoader}></div>
        ) : (
          <div className={style.deliverySlotsContainer}>
            {daySlots?.slice(0, 6).map((slot: string, index: number) => (
              <div key={index} className={`${style.deliverySlot} ${selectedDaySlot === daySlots[index] ? style.selectedDeliverySlot : ""}`} onClick={() => setSelectedDaySlot(slot)}>
                <span className={style.slotDate}>{formatTheDate(slot, locale).dayInLetters}</span>
                <span className={style.slotDate}>{formatTheDate(slot, locale).dayInNumbers} {formatTheDate(slot, locale).formattedMonth}</span>
                <span className={style.slotPrice}>({intl.formatMessage({id: "checkout-io.shipping.delivery-price.free"})})</span>
              </div>
            ))}
            <p className={`${style.deliverySelectLabel}`}>{intl.formatMessage(messages.otherDates)}</p>
            <select value={selectedDaySlot} onChange={(e) => setSelectedDaySlot(e.target.value)} className={style.select}>
              <option value="" disabled>{intl.formatMessage(messages.otherDates)}</option>
              {daySlots?.map((slot: string, index: number) => (
                <option value={slot} key={index}>{formatTheDate(slot, locale).dayInLetters} {formatTheDate(slot, locale).dayInNumbers} {formatTheDate(slot, locale).formattedMonth} ({intl.formatMessage({id: "checkout-io.shipping.delivery-price.free"})})</option>
              ))}
            </select>
            <p className={`${style.deliverySelectLabel}`}>{intl.formatMessage(messages.selectTime)}</p>
            <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} className={style.select}>
                <option value="" disabled>{intl.formatMessage(messages.otherTimes)}</option>
                {timeSlots?.map((timeSlot, index: number) => (
                  <option key={index} value={timeSlot.values}>{timeSlot.name}</option>
                ))}
            </select>
          </div>
        )}
    </>
  )
}

const messages = defineMessages({
  shippingType: {
		defaultMessage: "Shipping type",
		id: "checkout-io.shipping-type",
	},
  otherDates: {
    defaultMessage: "More delivery dates...",
    id: "checkout-io.otherDates",
  },
  selectTime: {
    defaultMessage: "Select a delivery time",
    id: "checkout-io.selectTime",
  },
  otherTimes: {
    defaultMessage: "Other delivery times",
    id: "checkout-io.otherTimes",
  }
})

export default DeliverySlots
