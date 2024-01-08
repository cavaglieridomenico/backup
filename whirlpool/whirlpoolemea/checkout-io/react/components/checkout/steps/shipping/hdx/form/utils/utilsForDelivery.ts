export type DeliveryProps = {
	prop: SlotObject
	activeSlot: any
	setActiveSlot: any
	shippingPrice: any
	customShippingLabel?: string
	setTradePlaceCustomData: any
	getSlots: any
	showShipTogheter: boolean
}

export type SlotObject = {
	slots: Slot[]
	hasCGasAppliances: boolean
}

export type Slot = {
	startDateUtc: string
	endDateUtc: string
}

const daysAbb = {
	"1st": ["01", "21", "31"],
	"2nd": ["22", "02"],
}

export const formatDate = (sDate: string, eDate: string) => {
	let startDate = new Date(sDate)
		.toUTCString()
		.toString()
		.split(" ")
	let endDate = new Date(eDate)
		.toUTCString()
		.toString()
		.split(" ")
	let weekday = startDate[0].replace(",", "")
	let month = startDate[2]
	let startHour = startDate[4].substring(0, 5)
	let endHour = endDate[4].substring(0, 5)
	let dayNumber = daysAbb["1st"].includes(startDate[1])
		? startDate[1] + "st"
		: daysAbb["2nd"].includes(startDate[1])
		? startDate[1] + "nd"
		: startDate[1] + "th"
	return { weekday, month, startHour, dayNumber, endHour }
}
export const shippingPolicies = {
	SCHEDULED: "Scheduled",
	STANDARD: "Next day (Orders placed before 2pm)",
	SPECIAL: "Special",
	LEADTIME: "LeadTime",
	BUNDLE: "Bundle",
}

export const formatTheDate = (dateString: string, locale: string) => {
    const date = new Date(dateString)
    const options: any = {
      weekday: "long",
      month: "long",
      day: "numeric"
    }
    const convertedDate = date.toLocaleDateString(locale, options).split(" ");
    const dayInLetters = convertedDate[0].slice(0, 1).toUpperCase() + convertedDate[0].slice(1)
    const dayInNumbers = convertedDate[1]
    const month = convertedDate[2].slice(0, 3)
    const formattedMonth = month.slice(0, 1).toUpperCase() + month.slice(1, 3)
    return {
      dayInLetters,
      dayInNumbers,
      formattedMonth
    }
  }

export async function wait(time: number = 500): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
}
