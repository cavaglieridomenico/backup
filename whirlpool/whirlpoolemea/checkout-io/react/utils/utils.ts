import { Slot } from "../components/checkout/steps/shipping/hdx/form/utils/utilsForDelivery"

// Format the price in the format X,XXX.XX
export const formatPrice = (price: number, currency: string) => {
	return `${currency}${(price / 100)
		?.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}
export const formatPriceWithoutCurrency = (price: number) => {
	return (price / 100)?.toFixed(2)
}

export const getAddressBasicFields = (address: any) => ({
	postalCode: address.postalCode,
	geoCoordinates: address.geoCoordinates,
	street: address.street,
	number: address.number,
	complement: address.complement,
	city: address.city,
	state: address.state,
	country: address.country,
})

export const getDeliverySlots = (orderFormId: string, storeErrorResponseFunction?: any) => {
	return new Promise<any>((resolve, reject) => {
		fetch(`/app/fareye/slots/retrieve/${orderFormId}`)
			.then(res => {
				if (!res.ok) {
					if (storeErrorResponseFunction) storeErrorResponseFunction({ variables: { message: `Retrieve delivery slots (orderFormId: ${orderFormId}) - status : ${res.status}` } })
					resolve({ slots: [] })
				} else {
					res.json().then(resolve)
				}
			})
			.catch(reject)
	})
}

// This is the regex to fix the endDate of the slots, in order to be sure that it's compliant with VTEX's ones
export const regex = /[0-9]{2}(?=[+])/gm;

export const filterDeliverySlots = (slots: { slots: Slot[] }, availableDeliveryWindows: globalThis.DeliveryWindow[]) => {
	const filteredSlots = slots.slots.filter((slot) => availableDeliveryWindows.findIndex((item) => item.startDateUtc === slot.startDateUtc && item.endDateUtc === slot.endDateUtc.replace(regex, "59")) >= 0);
	// I also store slots with day informations only, make them unique and remove the ones which go ahead of two weeks from now
	const daySlots = filteredSlots.map((slot: Slot) => slot.startDateUtc.split("T")[0]);
	const thirtyDaysFromNow = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
	const uniqueDaySlots = [...new Set(daySlots)].filter((slot: string) => new Date(slot).getTime() < thirtyDaysFromNow);

	return { filteredSlots, uniqueDaySlots }
}

export const getCircularReplacer = () => {
	const seen = new WeakSet();
	return ({ }, value: object | null) => {
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) {
				return;
			}
			seen.add(value);
		}
		return value;
	};
}

export function stringify(data: any): string {
	return typeof data == 'object' ? JSON.stringify(data, getCircularReplacer()) : (data + "");
}