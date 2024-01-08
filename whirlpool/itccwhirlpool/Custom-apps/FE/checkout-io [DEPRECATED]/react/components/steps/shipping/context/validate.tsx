import { ValidateAddress } from "../../../../typings/validation"
import { ErrorsObject } from "../../../../typings/errors"

export default function validateAddress(
	formattedAddress: string,
	addressValues: any,
	validation: ValidateAddress,
	messages: any,
) {
	let errors: ErrorsObject = {}

	/*--- ADDRESS INFO VALIDATION ---*/
	//Address validation
	if (validation.isAddressRequired && !formattedAddress.trim()) {
		errors.address = messages["checkout-io.address.errors.empty"]
	}
	//Complement validation
	if (validation.isComplementRequired && !addressValues.complement.trim()) {
		errors.complement = messages["checkout-io.address.errors.empty"]
	}
	//City validation
	if (validation.isCityRequired && !addressValues.city.trim()) {
		errors.city = messages["checkout-io.address.errors.empty"]
	}
	//State validation
	if (validation.isStateRequired && !addressValues.state.trim()) {
		errors.state = messages["checkout-io.address.errors.empty"]
	}
	//PostalCode validation
	if (validation.isPostalCodeRequired && !addressValues.postalCode.trim()) {
		errors.postalCode = messages["checkout-io.address.errors.empty"]
	} else if (!/(?:^|\D)(\d{5})(?!\d)/g.test(addressValues.postalCode)) {
		errors.postalCode = messages["checkout-io.address.errors.postal-code"]
	}
	// The English postal-code can contain letters as well
	// } else if (addressValues.postalCode.trim().length < 6 || addressValues.postalCode.trim().length > 8) {
	//   errors.postalCode = "The postal code must contain 6 to 8 characters"
	// }
	// streetNumber validation
	if (validation.isNumberRequired && !addressValues.number.trim()) {
		errors.number = messages["checkout-io.address.errors.empty"]
	}
	// Country validation
	if (validation.isCountryRequired && !addressValues.country.trim()) {
		errors.number = messages["checkout-io.address.errors.empty"]
	}
	return errors
}
