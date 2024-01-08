import { Validate } from "../../../../typings/validation"
import { InvoiceValidate } from "../../../../typings/invoiceValidation"
import { ErrorsObject } from "../../../../typings/errors"
import { Values } from "../form/CustomDatas"

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
	account: string,
	loggedIn: boolean,
) {
	let errors: ErrorsObject = {}

	/*--- INFO DATA VALIDATION ---*/
	//Email validation
	if (isCC && !loggedIn) {
		if (validation.isEmailRequired && !realEmail.email.trim()) {
			errors.email = messages["checkout-io.profile.errors.empty"]
		} else if (!/\S+@\S+\.\S+/.test(realEmail.email)) {
			errors.email = messages["checkout-io.profile.errors.email"]
		}
	} else {
		if (validation.isEmailRequired && !values.email.trim()) {
			errors.email = messages["checkout-io.profile.errors.empty"]
		} else if (!/\S+@\S+\.\S+/.test(values.email)) {
			errors.email = messages["checkout-io.profile.errors.email"]
		}
	}
	//Firstname validation
	if (validation.isFirstNameRequired && !values.firstName.trim()) {
		errors.firstName = messages["checkout-io.profile.errors.empty"]
	}
	//Lastname validation
	if (validation.isLastNameRequired && !values.lastName.trim()) {
		errors.lastName = messages["checkout-io.profile.errors.empty"]
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
	if (account.includes("itcc")) {
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
	const isFiscalcodeValid =
		/^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$/
	if (shouldValidateInvoice) {
		if (selected == Values.private) {
			//Invoice name and surname validation
			if (
				invoiceValidation.isInvoiceNameRequired &&
				!customDataValues.sendInvoiceTo.trim()
			) {
				errors.sendInvoiceTo = messages["checkout-io.profile.errors.empty"]
			}
			//Invoice fiscal code validation
			if (invoiceValidation.isInvoiceFiscalCodeRequired){
				if(!isFiscalcodeValid.test(customDataValues.invoiceFiscalCode)){
					errors.invoiceFiscalCode = messages["checkout-io.profile.errors.fiscalcode"]
				}
			}
			//Invoice PEC validation
			if (
				invoiceValidation.isSDIPECRequired &&
				!customDataValues.SDIPEC.trim()
			) {
				errors.SDIPEC = messages["checkout-io.profile.errors.empty"]
			}
		} else if (selected == Values.company) {
			//COMPANY VALIDATION
			//Invoice Socal Reason validation
			if (
				invoiceValidation.isInvoiceSocialReasonRequired &&
				!customDataValues.invoiceSocialReason.trim()
			) {
				errors.invoiceSocialReason =
					messages["checkout-io.profile.errors.empty"]
			}
			//Invoice VAT validation
			if (invoiceRequiredFields.is && !customDataValues.invoiceVat.trim()) {
				errors.invoiceVat = messages["checkout-io.profile.errors.empty"]
			}
		}
	}

	if (isInvoiceSectionOpen) {
		if (
			invoiceRequiredFields.isStreetRequired &&
			!invoicesValues.street.trim()
		) {
			errors.invoiceStreet = messages["checkout-io.profile.errors.empty"]
		}
		if (
			invoiceRequiredFields.isAdditionalInfosRequired &&
			!invoicesValues.complement.trim()
		) {
			errors.invoiceAdditionalInfos =
				messages["checkout-io.profile.errors.empty"]
		}
		if (
			invoiceRequiredFields.isInvoiceZipCodeRequired &&
			!invoicesValues.postalCode.trim()
		) {
			errors.invoiceZipCode = messages["checkout-io.profile.errors.empty"]
		}
		if (
			invoiceRequiredFields.isInvoiceCityRequired &&
			!invoicesValues.city.trim()
		) {
			errors.invoiceCity = messages["checkout-io.profile.errors.empty"]
		}
	}
	return errors
}
