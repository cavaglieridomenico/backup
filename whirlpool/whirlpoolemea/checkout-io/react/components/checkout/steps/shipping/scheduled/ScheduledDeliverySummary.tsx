import React from 'react';
import { useRuntime } from "vtex.render-runtime";
import { formatTheDate } from '../hdx/form/utils/utilsForDelivery';
import type { DeliveryWindow } from '../standard/form/DeliveryEditableForm';

interface SummaryProps {
  scheduledDeliveryWindow: DeliveryWindow;
}

const ScheduledDeliverySummary: StorefrontFunctionComponent<SummaryProps> = ({scheduledDeliveryWindow}) => {
  const { culture: { locale } } = useRuntime();
  // I take the day from the delivery window and format it with util function
  const deliveryDate = scheduledDeliveryWindow?.startDateUtc?.split("T")[0];
  const formattedDate = deliveryDate && formatTheDate(deliveryDate, locale);
  // I create a new util function to format the time of the delivery window, for it to match the required string
  const formatTime = (deliveryWindow: DeliveryWindow) => {
    // Regex to format the time removing the first 0 of the time string (e.g. "08.00" --> becomes "8.00")
    const regex = /0{1}(?=[1-9])/
    const startTime = deliveryWindow?.startDateUtc?.split("T")[1].slice(0, 2).replace(regex, "");
    const endTime = deliveryWindow?.endDateUtc?.split("T")[1].slice(0, 2);
    const timeSlots = ["Mattina 8:00 - 12:00", "Pomeriggio 13:00 - 18:00", "Giornata intera 8:00 - 20:00"];
    let selectedTime;
    if (startTime && endTime) {
      selectedTime = timeSlots.find((timeSlot) => timeSlot.includes(startTime) && timeSlot.includes(endTime));
    }
    return selectedTime;
  }

  return (
    formattedDate ? (
      <span>{formattedDate.dayInLetters}, {formattedDate.dayInNumbers} {formattedDate.formattedMonth}, {formatTime(scheduledDeliveryWindow)}</span>
    ) :
    null
  )
}

export default ScheduledDeliverySummary
