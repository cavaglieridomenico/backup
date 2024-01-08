import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import styles from "./style.css";
const DateTimeCustom = (props) => {

    const { selectedDeliveryWindow, selectDeliveryWindow, sla } = props
    const [availabelDates, setAvailableDates] = useState(null);
    const [activeTimeSlots, setActiveTimeSlots] = useState(null);
    const [isNextDay, setIsNextDay] = useState(false);

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
    useEffect(() => {

        let dates = {};
        if (sla && sla.availableDeliveryWindows) {

            sla.availableDeliveryWindows.filter((date, index) => {

                let startDateSplitted = new Date(date.startDateUtc).toUTCString().toString().split(" ");
                let endDateSplitted = new Date(date.endDateUtc).toUTCString().toString().split(" ");
                let id = startDateSplitted[0].replace(",", "") + startDateSplitted[2] + startDateSplitted[1];
                if (!dates[id]) {
                    dates[id] = [];
                }
                dates[id].push(
                    {
                        id: startDateSplitted[0].replace(",", "") + startDateSplitted[2] + startDateSplitted[1],
                        utcStart: date.startDateUtc,
                        utcEnd: date.endDateUtc,
                        startFormatted: new Date(date.startDateUtc),
                        endFormatted: new Date(date.endDateUtc),
                        price: date.price === 0 ? "FREE" : "£" + date.price /100,
                        startDateText: {
                            weekDay: startDateSplitted[0].replace(",", ""),
                            dayNumber: daysAbb["1st"].includes(startDateSplitted[1]) ? startDateSplitted[1] + "st" : daysAbb["2nd"].includes(startDateSplitted[1]) ? startDateSplitted[1] + "nd" : startDateSplitted[1] + "th",
                            month: startDateSplitted[2],
                            hour: startDateSplitted[4].substr(0, 5)
                        },
                        endDayText: {
                            weekDay: endDateSplitted[0].replace(",", ""),
                            dayNumber: daysAbb["1st"].includes(endDateSplitted[1]) ? endDateSplitted[1] + "st" : daysAbb["2nd"].includes(endDateSplitted[1]) ? endDateSplitted[1] + "nd" : startDateSplitted[1] + "th",
                            month: endDateSplitted[2],
                            hour: endDateSplitted[4].substr(0, 5)
                        },
                        sla: date,
                        active: selectedDeliveryWindow && selectedDeliveryWindow.startDateUtc === date.startDateUtc ? true : false,
                        slotActive: false
                    }
                )
                //check if next day available
                if(index === 0){
                    let currentDateSplitted = new Date().toUTCString().toString().split(" ");
                    if((parseInt(currentDateSplitted[1]) +1 === parseInt(startDateSplitted[1]))){
                        dates[id].isNextDay = true;
                        setIsNextDay(id);
                    }
                }
            })
            if (selectedDeliveryWindow && selectedDeliveryWindow.startDateUtc) {
                Object.keys(dates).map((keyName, i) => {

                    dates[keyName].map((date) => {
                        if (date.utcStart === selectedDeliveryWindow.startDateUtc) {
                            date.slotActive = true;
                            setActiveTimeSlots(dates[keyName])
                        }
                    })
                })
                setAvailableDates(dates)

            }
            setAvailableDates(dates);
        }

    }, []);

    useEffect(() => {
        let select = document.getElementById("time-slots");
        if (select) {
            onTimeSlotChange(null, select)
        }
    }, [activeTimeSlots])

    const onDayChange = (e) => {
        let id = e.currentTarget.dataset.id || e.currentTarget.value;
        let newDates = { ...availabelDates };
        Object.keys(availabelDates).map((keyName, i) => {
            if (keyName === id) {
                availabelDates[keyName][0].active = true;
            } else {
                availabelDates[keyName][0].active = false;
            }
        })
        setAvailableDates(newDates);
        setActiveTimeSlots(newDates[id]);
    }

    const onTimeSlotChange = ((e, select) => {
        let id = e ? e.currentTarget.value.split("-")[0] : select.value.split("-")[0];
        let position = parseInt(e ? e.currentTarget.value.split("-")[1] : select.value.split("-")[1]);
        try {
            if (!selectedDeliveryWindow || availabelDates[id][position].utcStart !== selectedDeliveryWindow.startDateUtc) {

                selectDeliveryWindow(sla && sla.id, availabelDates[id][position].sla)
            }
        } catch (error) {
            console.log(error);
        }


    });
 
    return (
        <div className={styles.customdate}>
            {isNextDay && (
                <div data-id={isNextDay} onClick={(e) => {onDayChange(e)}}className={[styles.customdate__nextday, availabelDates[isNextDay].filter(date => date.active).length > 0 ? styles.customdate__nextday_active: ""].join(" ")}>
                    <b>Next day</b>
                    <span>
                        ( Orders placed before 2pm ) In 1 business day
                    </span>
                    <span>
                        {availabelDates[isNextDay][0].price}
                    </span>
                </div>
            )}

            {availabelDates && (
                <div className={styles.customdate__wrapper}>
                    <div className={styles.customdate__table}>
                        {
                            Object.keys(availabelDates).map((keyName, i) => (
                                <div onClick={(e) => { onDayChange(e) }} data-id={keyName} className={[styles.customdate__table_item, i > 6 || (i===0 && isNextDay) || (i===6 && !isNextDay)? styles.customdate__table_item_hidden : availabelDates[keyName][0].active ? styles.customdate__table_item_active : ""].join(" ")}>
                                    <b>
                                        {availabelDates[keyName][0].startDateText.weekDay}
                                    </b>
                                    <b> {availabelDates[keyName][0].startDateText.dayNumber.replace(/^0+/, '')} {availabelDates[keyName][0].startDateText.month}</b>
                                    <span>
                                        ({availabelDates[keyName][0].price})
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.customdate__select_field_label}>More delivery dates</div>
                    <select onChange={(e) => { onDayChange(e) }}>
                        <option selected disabled>More delivery dates...</option>
                        {
                            Object.keys(availabelDates).map((keyName, i) => {
                                if (availabelDates[keyName][0].active) {
                                    return <option value={keyName} selected>
                                        {availabelDates[keyName][0].startDateText.weekDay} {availabelDates[keyName][0].startDateText.dayNumber.replace(/^0+/, '')} {availabelDates[keyName][0].startDateText.month} ({availabelDates[keyName][0].price})
                                    </option>
                                } else {
                                    return <option value={keyName}>
                                        {availabelDates[keyName][0].startDateText.weekDay} {availabelDates[keyName][0].startDateText.dayNumber.replace(/^0+/, '')} {availabelDates[keyName][0].startDateText.month} ({availabelDates[keyName][0].price})
                                    </option>
                                }
                            })
                        }
                    </select>

                    <div className={styles.customdate__select_field_label}>Select a delivery time</div>
                    <select id="time-slots" onChange={(e) => onTimeSlotChange(e)} className={styles.customdate__timeslot_select}>
                        <option selected disabled>Select a delivery time...</option>
                        {activeTimeSlots && activeTimeSlots.map((slot, index) => {
                            if (slot.slotActive) {
                                return <option value={`${slot.id}-${index}`} selected>Anytime {slot.startDateText.hour} am - {slot.endDayText.hour} pm</option>
                            } else {
                                return <option value={`${slot.id}-${index}`}>Anytime {slot.startDateText.hour} am - {slot.endDayText.hour} pm</option>

                            }
                        })}
                    </select>

                </div>
            )}
        </div>
    )

}

DateTimeCustom.propTypes = {
    intl: PropTypes.object,
    previousHasSelectedWindow: PropTypes.bool,
    selectDeliveryWindow: PropTypes.func.isRequired,
    selectedDeliveryWindow: PropTypes.object,
    sla: PropTypes.object,
    storePreferencesData: PropTypes.object,
    triedCompleteOmnishipping: PropTypes.bool,
}

export default DateTimeCustom