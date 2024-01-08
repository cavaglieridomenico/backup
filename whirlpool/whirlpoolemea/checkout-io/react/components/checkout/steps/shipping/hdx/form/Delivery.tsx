import React, { FC, useEffect, useState } from "react"
import styles from "./styles/styles.css"
import {
	DeliveryProps,
	Slot,
	formatDate,
	shippingPolicies,
} from "./utils/utilsForDelivery"
import { Toggle } from "vtex.styleguide"
import { useOrder } from "../../../../../../providers/orderform"
import { FormattedMessage, useIntl, defineMessages } from "react-intl"
/* import { CSS_HANDLES } from "./utils/utilsForMessagesController" */
/* import { useCssHandles } from 'vtex.css-handles' */

/*
  In this component we should set all the necessary to show Delivery Slots (if present) or any other
  delivery type (next-day delivery for example) or user message to show in different situation like
  "Small domestic appliances ..." that change basing on product type.

*/

const Delivery: FC<DeliveryProps> = ({
	prop,
	activeSlot,
	setActiveSlot,
	shippingPrice,
	setTradePlaceCustomData,
	getSlots,
	customShippingLabel = "",
	showShipTogheter,
}) => {
	/*   const handles = useCssHandles(CSS_HANDLES) */

	const { orderForm, refreshOrder } = useOrder()
	const [tradeplaceCustomData] = useState<any>(
		orderForm?.customData?.customApps?.find(
			(customApp: any) => customApp.id === "tradeplace",
		)?.fields || null,
	)

	const [slots, setSlots] = useState<any>([])
	const [firstRender, setFirstRender] = useState<boolean>(true)
	const [shipAllProductTogether, setShipAllProductTogether] =
		useState<any>(false)

	useEffect(() => {
		setShipAllProductTogether(
			tradeplaceCustomData
				? tradeplaceCustomData.shipTogether == "true"
				: false,
		)
	}, [tradeplaceCustomData])

	const [itemsTypes, setitemsTypes] = useState({
		MDA: false,
		SDA: false,
		OOS: false,
		GAS: false,
	})

	const logisticInfos = orderForm?.shippingData?.logisticsInfo
	const intl = useIntl()

	//  set statuses in order to render correctly all messages ( ex. SDA, GAS products, ...)
	const messagesFromLogisticInfos = () => {
		logisticInfos?.forEach((li: any) => {
			if (
				!itemsTypes.MDA &&
				li.slas.filter((sla: any) => sla.id === shippingPolicies.SCHEDULED)
					.length > 0
			) {
				setitemsTypes((prevData) => ({ ...prevData, MDA: true }))
			} else if (
				!itemsTypes.SDA &&
				li.slas.filter((sla: any) => sla.id === shippingPolicies.SPECIAL)
					.length > 0
			) {
				setitemsTypes((prevData) => ({ ...prevData, SDA: true }))
			} else if (
				!itemsTypes.OOS &&
				li.slas.filter((sla: any) => sla.id === shippingPolicies.LEADTIME)
					.length > 0
			) {
				setitemsTypes((prevData) => ({ ...prevData, OOS: true }))
			}
		})
		if (prop.hasCGasAppliances)
			setitemsTypes((prevData) => ({ ...prevData, GAS: true }))
	}

	// function to set activeslot if there are already datas from orderForm
	const fetchActiveSlot = () => {
		if (logisticInfos && slots.length > 0 && firstRender) {
			let oldLogisticInfo: string = ""
			logisticInfos.forEach((data: any) => {
				data.slas.forEach((sla: any) => {
					if (typeof sla?.deliveryWindow?.startDateUtc == "string") {
						oldLogisticInfo = sla?.deliveryWindow?.startDateUtc
					}
				})
			})
			if (slots) {
				let newSlots: any = []
				slots.forEach((data: any) => {
					if (data.startDateUtc == oldLogisticInfo) {
						setActiveSlot([{ ...data, active: true }])
						newSlots.push({ ...data, active: true })
					} else {
						newSlots.push({ ...data, active: false })
					}
				})
				setFirstRender(false)
				setSlots(newSlots)
			}
		}
	}

	useEffect(() => {
		messagesFromLogisticInfos()
	}, [logisticInfos])

	// format slots according to what it will be rendered
	useEffect(() => {
		if (prop.slots && prop.slots.length > 0) {
			let data: any = []
			prop.slots.map((slot: Slot) => {
				let { weekday, month, dayNumber, startHour, endHour } = formatDate(
					slot.startDateUtc,
					slot.endDateUtc,
				)
				data.push({
					weekday,
					month,
					dayNumber,
					startDateUtc: slot.startDateUtc,
					endDateUtc: slot.endDateUtc,
					price: shippingPrice === 0 ? "FREE" : "£" + shippingPrice / 100,
					active: false,
					startHour,
					endHour,
				})
			})
			setSlots(data)
		}
	}, [])

	//  fetch from orderForm the possible active slot already selected
	useEffect(() => {
		if (slots.length > 0) fetchActiveSlot()
	}, [slots])

	// sets active slot and re-sets all the other formatted slots in order to update active field
	const setDelivery = (slot: any) => {
		let data = slots
		data.forEach((singleSlot: any) => {
			if (slot.startDateUtc === singleSlot.startDateUtc)
				singleSlot.active = true
			else singleSlot.active = false
		})
		setActiveSlot(
			data.filter((singleSlot: any) => {
				return slot.startDateUtc === singleSlot.startDateUtc
			}),
		)
		setSlots(data)
	}

	//  when the toggle ship all together is clicked set the toggle state and re-sets slots
	const handleShipAllTogether = (e: any) => {
		setShipAllProductTogether(e.target.checked)
		if (!e.target.checked) {
			fetch(
				`/api/checkout/pub/orderForm/${orderForm.orderFormId}/customData/tradeplace`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						tpError: tradeplaceCustomData?.tpError,
						connectedGas: tradeplaceCustomData?.connectedGas,
						shipTogether: "false",
					}),
					// body: tradeplaceCustomData
				},
			).then((res) => {
				console.log("TRADEPLACE custom data updated: ", res)
				refreshOrder().then(() => {
					getSlots()
				})
			})
		}
		if (prop?.slots?.length > 0) {
			if (slots?.length > 0) {
				setSlots([])
			} else {
				let data: any = []
				prop.slots.map((slot: Slot) => {
					let { weekday, month, dayNumber, startHour, endHour } = formatDate(
						slot.startDateUtc,
						slot.endDateUtc,
					)
					data.push({
						weekday,
						month,
						dayNumber,
						startDateUtc: slot.startDateUtc,
						endDateUtc: slot.endDateUtc,
						price: shippingPrice === 0 ? "FREE" : "£" + shippingPrice / 100,
						active: false,
						startHour,
						endHour,
					})
				})
				setSlots(data)
			}
			setActiveSlot([])
		}
	}

	useEffect(() => {
		let newTPCustomData = {
			tpError: tradeplaceCustomData?.tpError || "false",
			connectedGas: itemsTypes.GAS.toString(),
			shipTogether: shipAllProductTogether.toString(),
		}

		if (itemsTypes.MDA) {
			let scheduledDeliveryAvailable =
				logisticInfos?.some(
					(logInfo: any) =>
						logInfo?.slas?.some(
							(sla: any) =>
								(sla?.id == "Scheduled" &&
									sla?.availableDeliveryWindows?.length > 0) ||
								false,
						) || false,
				) || false
			if (
				!scheduledDeliveryAvailable &&
				tradeplaceCustomData &&
				tradeplaceCustomData.tpError !== "true"
			) {
				newTPCustomData.tpError = "true"
			} else if (
				scheduledDeliveryAvailable &&
				tradeplaceCustomData &&
				tradeplaceCustomData.tpError !== "false"
			) {
				newTPCustomData.tpError = "false"
			}
		}
		if (newTPCustomData !== tradeplaceCustomData) {
			setTradePlaceCustomData(newTPCustomData)
		}
	}, [itemsTypes, shipAllProductTogether])

	return (
		<>
			{itemsTypes.MDA &&
				itemsTypes.OOS &&
				!itemsTypes.GAS &&
				(showShipTogheter ? (
					<>
						<p className={styles.shipAllTogheterText}>
							<FormattedMessage id="checkout-hdx-delivery-slots-uk.toggle-ship-products-all-together" />
						</p>

						<div className={styles.shipAllTogheterToggle}>
							<Toggle
								checked={shipAllProductTogether}
								id="stairs"
								onChange={(e: any) => {
									handleShipAllTogether(e)
								}}
								label={intl.formatMessage(messages.shipAllTogether)}
							/>
						</div>
					</>
				) : (
					<></>
				))}

			{prop && prop.slots?.length > 0 && !shipAllProductTogether && (
				<div className={styles.customdate__wrapper}>
					<p className={styles.shiptext}>
						{customShippingLabel ? (
							customShippingLabel
						) : (
							<FormattedMessage id="checkout-hdx-delivery-slots-uk.preferred-delivery-date" />
						)}
					</p>
					<div className={styles.customdate__table}>
						{slots &&
							slots.length > 0 &&
							slots.slice(0, 6).map((slot: any, index: number) => {
								return (
									<div
										key={index}
										className={`${styles.customdate__table_item} ${
											slot.startDateUtc === activeSlot[0]?.startDateUtc
												? styles.customdate__table_item_active
												: ""
										}`}
										onClick={() => setDelivery(slot)}
									>
										<b>{slot.weekday}</b>
										<b>
											{" "}
											{slot.dayNumber.replace(/^0+/, "")} {slot.month}
										</b>
										<span>({slot.price && slot.price})</span>
									</div>
								)
							})}
					</div>
					<p className={styles.selectPreText}>
						<FormattedMessage id="checkout-hdx-delivery-slots-uk.more-dates" />
					</p>
					<select
						defaultValue={"DEFAULT"}
						onChange={(e: any) => setDelivery(slots[e.target.value])}
					>
						<option value="DEFAULT" disabled>
							{intl.formatMessage(messages.moreDates)}
						</option>
						{slots &&
							slots.length > 0 &&
							slots.map((slot: any, index: number) => {
								return (
									<option key={index} value={index} selected={slot.active}>
										{slot.weekday} {slot.dayNumber.replace(/^0+/, "")}{" "}
										{slot.month} ({slot.price && slot.price})
									</option>
								)
							})}
					</select>
					<p className={styles.selectPreText}>
						<FormattedMessage id="checkout-hdx-delivery-slots-uk.select-time" />
					</p>
					<select defaultValue={"DEFAULT"} onChange={() => {}}>
						<option value="DEFAULT" disabled>
							{intl.formatMessage(messages.moreTime)}
						</option>
						{activeSlot &&
							activeSlot.length > 0 &&
							activeSlot.map((slot: any, index: number) => {
								return (
									<option key={index} value={index}>
										Anytime {slot.startHour} am - {slot.endHour} pm
									</option>
								)
							})}
					</select>
				</div>
			)}
			{prop.slots?.length == 0 &&
				(itemsTypes.MDA || itemsTypes.SDA) &&
				(!itemsTypes.GAS || itemsTypes.OOS) && (
					<p className={[styles.shiptext, styles.deliveryText].join(" ")}>
						<FormattedMessage id="checkout-hdx-delivery-slots-uk.preferred-delivery-date" />
					</p>
				)}
		</>
	)
}

const messages = defineMessages({
	moreDates: {
		defaultMessage: "More delivery dates...",
		id: "checkout-hdx-delivery-slots-uk.more-dates-select",
	},
	moreTime: {
		defaultMessage: "More delivery time...",
		id: "checkout-hdx-delivery-slots-uk.more-time",
	},
	shipAllTogether: {
		defaultMessage: "More delivery time...",
		id: "checkout-hdx-delivery-slots-uk.ship-all-together",
	},
})

export default Delivery
