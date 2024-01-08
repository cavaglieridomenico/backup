//@ts-nocheck
import React, { useEffect, useState } from "react"
import { Input, Dropdown } from "vtex.styleguide"
import { useIntl, defineMessages } from "react-intl"
import style from "../address.css"
import { useShipping } from "../context/ShippingContext"
import { useOrder } from "../../../../providers/orderform"
import states from "../../../../utils/addressStates"
import {
	// loadMapAPI,
	loadGMapsScript,
	getPlaceInfo,
	countryMapping,
} from "../../../../utils/googleMapUtils"

interface AddressInfoProps {}

const AddressInfo: React.FC<AddressInfoProps> = ({}: // children,
any) => {
	const intl = useIntl()
	const {
		formattedAddress,
		setFormattedAddress,
		addressValues,
		setAddressValues,
		handleChangeAddressInput,
		errors,
		resetInput,
	} = useShipping()

	const { orderForm } = useOrder()
	const { loggedIn, clientProfileData } = orderForm
	console.log(orderForm, "orderForm?")
	let firstName = clientProfileData?.firstName || ""
	let lastName = clientProfileData?.lastName || ""

	let autocomplete: google.maps.places.Autocomplete

	const initAutocomplete = () => {
		const input = document.getElementById(
			"autocomplete",
		) as window.HTMLInputElement

		const options = {
			// componentRestrictions: { country: ["FR"] },
			componentRestrictions: { country: ["GB"] },
			fields: [
				"address_components",
				"geometry",
				"place_id",
				"name",
				"formatted_address",
			],
			strictBounds: false,
			types: ["address"],
		}
		// Create the autocomplete object
		autocomplete = new window.google.maps.places.Autocomplete(input, options)
		// Handle when the user selects an address from the drop-down
		autocomplete.addListener("place_changed", onPlaceChanged)
	}

	//Callback function on google autocomplete input selected
	const onPlaceChanged = () => {
		console.log("AUTOCOMPLETE changed:-----> ", autocomplete)
		const place = autocomplete?.getPlace()
		console.log("PLACE: ", place)
		if (!place.geometry) {
			//User didn't select a prediction
			setAddressValues({
				...addressValues,
				number: "",
				street: "",
				country: countryMapping["GB"],
				geoCoordinates: [],
			})
		} else {
			console.log("PLACE: ", place)
			let addressInfo = place.address_components
			let coordinates = [
				place.geometry?.location?.lng(),
				place.geometry?.location?.lat(),
			]
			let placeInfo = getPlaceInfo(addressInfo)
			console.log("PLACE INFO:", getPlaceInfo(addressInfo))
			setFormattedAddress(place?.formatted_address)
			setAddressValues({
				...addressValues,
				receiverName: firstName + " " + lastName,
				number: placeInfo.number,
				street: placeInfo.street,
				city: placeInfo.city,
				postalCode: placeInfo.postalCode,
				state: placeInfo.state,
				country: countryMapping[placeInfo.country], //country mapping used to change FR to FRA (GMaps country to VTEX country)
				geoCoordinates: coordinates,
			})
		}
	}

	// const [formattedAddress,setFormattedAddress] = useState<string>('')

	useEffect(() => {
		//Load GMaps API script for Autocomplete input
		loadGMapsScript()
		window.initAutocomplete = initAutocomplete
		if (
			!autocomplete?.getPlace() &&
			addressValues.street &&
			addressValues.city
		) {
			setFormattedAddress(`${addressValues.street}, ${addressValues?.city}`)
		}
	}, [])

	return (
		<>
			<div
				className={style.addressInput}
				data-testid="address-google-autocomplete-wrapper"
			>
				<Input
					label={`${intl.formatMessage(messages.address)}`}
					id="autocomplete"
					name="address"
					type="text"
					placeholder={`${intl.formatMessage(messages.addressPlaceholder)}`}
					value={formattedAddress || ""}
					error={errors?.address}
					errorMessage={errors?.address}
					onChange={(e: any) => {
						setFormattedAddress(e.target.value), resetInput("address")
					}}
					disabled={loggedIn}
				/>
			</div>
			<div
				className={style.addressInput}
				data-testid="address-additional-info-wrapper"
			>
				<Input
					label={`${intl.formatMessage(messages.complement)}`}
					name="additionalInfoAddress"
					type="text"
					value={addressValues?.additionalInfoAddress}
					error={errors?.additionalInfoAddress}
					errorMessage={errors?.additionalInfoAddress}
					onChange={(e: any) => {
						handleChangeAddressInput(e), resetInput("additionalInfoAddress")
					}}
					disabled={loggedIn}
				/>
			</div>
			<div className={`${style.tripleInputsContainer} flex justify-between`}>
				<div className={style.addressInput} data-testid="address-city-wrapper">
					<Input
						label={`${intl.formatMessage(messages.city)}`}
						name="city"
						type="text"
						value={addressValues?.city}
						error={errors?.city}
						errorMessage={errors?.city}
						onChange={(e: any) => {
							handleChangeAddressInput(e), resetInput("city")
						}}
						disabled={loggedIn}
					/>
				</div>
				<div className={style.addressInput} data-testid="address-state-wrapper">
					<Dropdown
						label={`${intl.formatMessage(messages.state)}`}
						options={states}
						value={addressValues?.state}
						name="state"
						onChange={(e: any) => {
							handleChangeAddressInput(e)
							// resetInput('state')
						}}
						error={errors?.state}
						errorMessage={errors?.state}
						disabled={loggedIn}
					/>
				</div>
				<div
					className={`${style.addressInput}  w100 relative`}
					data-testid="address-postal-code-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.postalCode)}`}
						name="postalCode"
						type="text"
						value={addressValues?.postalCode}
						error={errors?.postalCode}
						errorMessage={errors?.postalCode}
						onChange={(e: any) => {
							handleChangeAddressInput(e)
							// resetInput('postalCode')
						}}
						maxLength="8"
						disabled={loggedIn}
					/>
				</div>
			</div>
		</>
	)
}

const messages = defineMessages({
	address: {
		defaultMessage: "Street number and name",
		id: "checkout-io.address",
	},
	addressPlaceholder: {
		defaultMessage: "Ex: 7 Rue Hautefeille, Paris",
		id: "checkout-io.address-placeholder",
	},
	complement: {
		defaultMessage: "Additional info",
		id: "checkout-io.complement",
	},
	city: {
		defaultMessage: "City",
		id: "checkout-io.city",
	},
	state: {
		defaultMessage: "State",
		id: "checkout-io.state",
	},
	postalCode: {
		defaultMessage: "Postal Code",
		id: "checkout-io.postal-code",
	},
})

export default AddressInfo
