export type DeliveryProps = {
    prop: SlotObject,
    activeSlot: any,
    setActiveSlot: any,
    shippingPrice: any,
    setTradePlaceCustomData: any,
    getSlots: any
  }

export type SlotObject = {
    slots: Slot[],
    hasCGasAppliances: boolean
}

export type Slot = {
    startDateUtc: string,
    endDateUtc: string,
  }

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

export const formatDate = (sDate: string, eDate: string) => {
    let startDate = new Date(sDate).toUTCString().toString().split(" ")
    let endDate = new Date(eDate).toUTCString().toString().split(" ");
    let weekday = startDate[0].replace(",", "")
    let month = startDate[2]
    let startHour = startDate[4].substring(0,5)
    let endHour = endDate[4].substring(0,5)
    let dayNumber = daysAbb["1st"].includes(startDate[1]) ? startDate[1] + "st" : daysAbb["2nd"].includes(startDate[1]) ? startDate[1] + "nd" : startDate[1] + "th"
    return {weekday, month, startHour, dayNumber, endHour}
  }
export const shippingPolicies = {
    SCHEDULED: 'Scheduled',
    STANDARD: 'Next day (Orders placed before 2pm)',
    SPECIAL: 'Special',
    LEADTIME: 'LeadTime',
    BUNDLE: 'Bundle'
  }
