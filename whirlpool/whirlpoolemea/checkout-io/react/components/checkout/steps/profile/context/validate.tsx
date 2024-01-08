import { ErrorsObject } from "../../../../../typings/errors"
import { Values } from "../form/CustomDatas"
import { Validate } from "../../../../../typings/validation"
import { InvoiceValidate } from "../../../../../typings/invoiceValidation"
// import {
// 	useCodiceFiscaleAzienda,
// 	useInvoiceFiscalCode,
// } from "../config/checkInvoiceCustomField"
import { AppSettings } from "../../../../../typings/configs"
import { EMAIL_REGEX } from "../../../../../utils"
import { FIELD_REGEX } from "../../../../../utils"

export default function validate(
	values: any,
	validation: Validate,
	messages: any,
	customDataValues: any,
	shouldValidateInvoice: boolean,
	invoiceValidation: InvoiceValidate,
	selected: string | undefined,
	invoicesValues: any,
	isInvoiceSectionOpen: boolean,
	invoiceRequiredFields: any,
	realEmail: any,
	isCC: boolean,
	loggedIn: boolean,
	appSettings: AppSettings,
	customInvoiceField: string,
) {
	let errors: ErrorsObject = {}

	/*--- INFO DATA VALIDATION ---*/
	//Email validation
	if (isCC && !loggedIn) {
		if (validation.isEmailRequired && !realEmail.email.trim()) {
			errors.email = messages["checkout-io.profile.errors.empty"]
		} else if (!EMAIL_REGEX.test(realEmail.email)) {
			errors.email = messages["checkout-io.profile.errors.email"]
		}
	} else {
		if (validation.isEmailRequired && !values.email.trim()) {
			errors.email = messages["checkout-io.profile.errors.empty"]
		} else if (!EMAIL_REGEX.test(values.email)) {
			errors.email = messages["checkout-io.profile.errors.email"]
		}
	}
	//Firstname validation
	if (validation.isFirstNameRequired && !values.firstName.trim()) {
		errors.firstName = messages["checkout-io.profile.errors.empty"]
	} else if (!FIELD_REGEX.test(values.firstName)) {
		errors.firstName = messages["checkout-io.profile.errors.firstName"]
	}
	//Lastname validation
	if (validation.isLastNameRequired && !values.lastName.trim()) {
		errors.lastName = messages["checkout-io.profile.errors.empty"]
	} else if (!FIELD_REGEX.test(values.lastName)) {
		errors.lastName = messages["checkout-io.profile.errors.lastName"]
	}
	//Document validation
	if (validation.isDocumentRequired && !values.document.trim()) {
		errors.document = messages["checkout-io.profile.errors.empty"]
	}
	//DocumentType validation
	if (validation.isDocumentTypeRequired && !values.documentType.trim()) {
		errors.documentType = messages["checkout-io.profile.errors.empty"]
	}
	//Phone validation
	// New checks for itcc
	if (appSettings.country == "IT") {
		if (validation.isPhoneRequired && !values.phone.trim()) {
			errors.phone = messages["checkout-io.profile.errors.empty"]
		} else {
			let phoneWithoutPrefix
			if (values.phone.trim().startsWith("+39")) {
				phoneWithoutPrefix = values.phone.trim().substring(3)
			} else if (values.phone.trim().startsWith("39")) {
				phoneWithoutPrefix = values.phone.trim().substring(2)
			} else {
				phoneWithoutPrefix = values.phone
			}
			phoneWithoutPrefix = phoneWithoutPrefix.trim()
			if (
				phoneWithoutPrefix.length > 11 ||
				phoneWithoutPrefix.length < 9 ||
				!/^\d+$/.test(phoneWithoutPrefix) ||
				!phoneWithoutPrefix.startsWith("3")
			) {
				// phone without 39 or +39 is: between 9 and 11, digits only and starts with 3
				errors.phone = messages["checkout-io.profile.errors.phone"]
			}
		}
	} else {
		if (validation.isPhoneRequired && !values.phone.trim()) {
			errors.phone = messages["checkout-io.profile.errors.empty"]
		} else if (values.phone.trim().length < 9) {
			errors.phone = messages["checkout-io.profile.errors.phone"]
		} else {
			let phoneNumber = values.phone.trim()
			if (phoneNumber.startsWith("+")) {
				phoneNumber = phoneNumber.substring(3).trim() // Remove the + and the 2 number related to the prefix
			}
			if (phoneNumber.length < 9 || !/^\d+$/.test(phoneNumber)) {
				// The regex checks if the "cleaned" phoneNumber only contains digits
				errors.phone = messages["checkout-io.profile.errors.phone"]
			}
		}
	}

	/*--- INVOICE SECTION VALIDATION ---*/
	//PRIVATE VALIDATION
	const isFiscalcodeValid = (input: any) => {
		let cf = input
		const regex = /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
		const setdisp = [
			1,
			0,
			5,
			7,
			9,
			13,
			15,
			17,
			19,
			21,
			2,
			4,
			18,
			20,
			11,
			3,
			6,
			8,
			12,
			14,
			16,
			10,
			22,
			25,
			24,
			23,
		]
		cf = cf.toUpperCase()
		let checkValue = 0
		for (let i = 0; i < cf.length - 1; i++) {
			let c = cf.charCodeAt(i)
			if (i % 2 == 0) {
				if (c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0))
					c = c - "0".charCodeAt(0) + "A".charCodeAt(0)
				checkValue += setdisp[c - "A".charCodeAt(0)]
			} else {
				if (c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0))
					checkValue += c - "0".charCodeAt(0)
				else checkValue += c - "A".charCodeAt(0)
			}
		}
		return (
			regex.test(cf) &&
			(checkValue % 26) + "A".charCodeAt(0) == cf.charCodeAt(cf.length - 1)
		)
	}
	if (shouldValidateInvoice) {
		if (selected == Values.private) {
			//Invoice name and surname validation
			if (
				invoiceValidation?.isInvoiceNameRequired &&
				!customDataValues.sendInvoiceTo.trim()
			) {
				errors.sendInvoiceTo = messages["checkout-io.profile.errors.empty"]
			}
			// if (invoiceValidation.isInvoiceFiscalCodeRequired) {
			// 	if (
			// 		(useInvoiceFiscalCode(appSettings) &&
			// 			!isFiscalcodeValid.test(customDataValues.invoiceFiscalCode)) ||
			// 		(useCodiceFiscaleAzienda(appSettings) &&
			// 			!isFiscalcodeValid.test(customDataValues.codiceFiscaleAzienda))
			// 	) {
			// 		errors.invoiceFiscalCode =
			// 			messages["checkout-io.profile.errors.fiscalcode"]
			// 	}
			// }
			if (
				invoiceValidation?.isInvoiceFiscalCodeRequired &&
				!isFiscalcodeValid(customDataValues[customInvoiceField])
			) {
				errors.invoiceFiscalCode =
					messages["checkout-io.profile.errors.fiscalcode"]
			}
			//Invoice PEC validation
			if (
				invoiceValidation?.isSDIPECRequired &&
				!customDataValues.SDIPEC.trim()
			) {
				errors.SDIPEC = messages["checkout-io.profile.errors.empty"]
			}
		} else if (selected == Values.company) {
			//COMPANY VALIDATION
			//Invoice Socal Reason validation
			if (
				invoiceValidation?.isInvoiceSocialReasonRequired &&
				!customDataValues.invoiceSocialReason.trim()
			) {
				errors.invoiceSocialReason =
					messages["checkout-io.profile.errors.empty"]
			}
			//Invoice VAT validation
			if (
				invoiceValidation?.isInvoiceVatRequired &&
				!customDataValues.invoiceVat.trim()
			) {
				errors.invoiceVat = messages["checkout-io.profile.errors.empty"]
			}
		}
	}

	if (isInvoiceSectionOpen) {
		if (
			invoiceRequiredFields?.isStreetRequired &&
			!invoicesValues.street.trim()
		) {
			errors.invoiceStreet = messages["checkout-io.profile.errors.empty"]
		}
		if (
			invoiceRequiredFields?.isAdditionalInfosRequired &&
			!invoicesValues.complement.trim()
		) {
			errors.invoiceAdditionalInfos =
				messages["checkout-io.profile.errors.empty"]
		}
		if (
			invoiceRequiredFields?.isInvoiceZipCodeRequired &&
			!invoicesValues.postalCode.trim()
		) {
			errors.invoiceZipCode = messages["checkout-io.profile.errors.empty"]
		}
		if (
			invoiceRequiredFields?.isInvoiceCityRequired &&
			!invoicesValues.city.trim()
		) {
			errors.invoiceCity = messages["checkout-io.profile.errors.empty"]
		}
	}
	return errors
}
