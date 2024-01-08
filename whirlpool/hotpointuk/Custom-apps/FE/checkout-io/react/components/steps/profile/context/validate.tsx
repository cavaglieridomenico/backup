import { Validate } from "../../../../typings/validation"
import { InvoiceValidate } from "../../../../typings/invoiceValidation"
import { ErrorsObject } from "../../../../typings/errors"
import { Values } from "../form/CustomDatas"
import { EMAIL_REGEX } from "../../../../utils"
import { FIELD_REGEX } from "../../../../utils"

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
	validateProfilingOptin: any,
) {
	let errors: ErrorsObject = {}

	/*--- INFO DATA VALIDATION ---*/
	//Email validation
	if (validation.isEmailRequired && !values.email.trim()) {
		errors.email = messages["checkout-io.profile.errors.empty"]
	} else if (!EMAIL_REGEX.test(values.email)) {
		errors.email = messages["checkout-io.profile.errors.email"]
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
	if (validation.isPhoneRequired && !values.phone.trim()) {
		errors.phone = messages["checkout-io.profile.errors.empty"]
	} else if (values.phone.trim().length < 9) {
		errors.phone = messages["checkout-io.profile.errors.phone"]
	}

	/*--- INVOICE SECTION VALIDATION ---*/
	//PRIVATE VALIDATION
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
			if (
				invoiceValidation.isInvoiceFiscalCodeRequired &&
				!customDataValues.invoiceFiscalCode.trim()
			) {
				errors.invoiceFiscalCode = messages["checkout-io.profile.errors.empty"]
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
				!customDataValues.corporateDocument.trim()
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

	/*--- PROFILING OPTIN VALIDATION ---*/
	if (validateProfilingOptin.shouldValidate) {
		if (!validateProfilingOptin.newsOptin && validateProfilingOptin.profOptin) {
			errors.profiling = messages["checkout-io.profile.errors.profiling"]
		}
	}

	return errors
}
