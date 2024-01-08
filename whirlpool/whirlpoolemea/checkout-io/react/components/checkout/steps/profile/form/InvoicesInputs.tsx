import React, { useEffect } from "react"
import { Input } from "vtex.styleguide"
import style from "../invoices.css"
import { useIntl, defineMessages } from "react-intl"
import { useProfile } from "../context/ProfileContext"

interface InvoicesInputsProps {
	invoiceSectionValidation?: InvoiceSectionValidation
}

interface InvoiceSectionValidation {
	isStreetRequired?: boolean
	isAdditionalInfosRequired?: boolean
	isInvoiceZipCodeRequired?: boolean
	isInvoiceCityRequired?: boolean
}

const InvoicesInputs: React.FC<InvoicesInputsProps> = ({
	invoiceSectionValidation = {
		isStreetRequired: true,
		isAdditionalInfosRequired: false,
		isInvoiceZipCodeRequired: true,
		isInvoiceCityRequired: true,
	},
}) => {
	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()

	const {
		invoiceRequiredFields,
		setInvoiceRequiredFields,
		invoicesValues,
		errors,
		handleChangeInputInvoices,
		resetInput,
	} = useProfile()

	useEffect(() => {
		setInvoiceRequiredFields(invoiceSectionValidation)
	}, [])

	return (
		<div>
			<div
				className={style.profileInput}
				data-testid="profile-first-name-wrapper"
			>
				<Input
					label={`${intl.formatMessage(messages.invoiceStreet)}${
						invoiceRequiredFields?.isStreetRequired ? "*" : ""
					}`}
					name="street"
					type="text"
					value={invoicesValues?.street}
					error={errors?.invoiceStreet}
					errorMessage={errors?.invoiceStreet}
					onChange={(e: any) => {
						handleChangeInputInvoices(e), resetInput("street")
					}}
				/>
			</div>
			<div
				className={style.profileInput}
				data-testid="profile-first-name-wrapper"
			>
				<Input
					label={`${intl.formatMessage(messages.invoiceAdditionalInfos)}${
						invoiceRequiredFields?.isAdditionalInfosRequired ? "*" : ""
					}`}
					name="complement"
					type="text"
					value={invoicesValues?.complement}
					error={errors?.invoiceAdditionalInfos}
					errorMessage={errors?.invoiceAdditionalInfos}
					onChange={(e: any) => {
						handleChangeInputInvoices(e), resetInput("complement")
					}}
				/>
			</div>
			<div
				className={style.profileInput}
				data-testid="profile-first-name-wrapper"
			>
				<Input
					label={`${intl.formatMessage(messages.invoiceZipCode)}${
						invoiceRequiredFields?.isInvoiceZipCodeRequired ? "*" : ""
					}`}
					name="postalCode"
					type="text"
					value={invoicesValues?.postalCode}
					error={errors?.invoiceZipCode}
					errorMessage={errors?.invoiceZipCode}
					onChange={(e: any) => {
						handleChangeInputInvoices(e), resetInput("postalCode")
					}}
				/>
			</div>
			<div
				className={style.profileInput}
				data-testid="profile-first-name-wrapper"
			>
				<Input
					label={`${intl.formatMessage(messages.invoiceCity)}${
						invoiceRequiredFields?.isInvoiceCityRequired ? "*" : ""
					}`}
					name="city"
					type="text"
					value={invoicesValues?.city}
					error={errors?.invoiceCity}
					errorMessage={errors?.invoiceCity}
					onChange={(e: any) => {
						handleChangeInputInvoices(e), resetInput("city")
					}}
				/>
			</div>
		</div>
	)
}

export default InvoicesInputs

const messages = defineMessages({
	invoiceStreet: {
		defaultMessage: "Street number and name",
		id: "checkout-io.profile.invoice.invoices.invoice-street",
	},
	invoiceAdditionalInfos: {
		defaultMessage: "Additional information for the address",
		id: "checkout-io.profile.invoice.invoices.invoice-additionalInfos",
	},
	invoiceZipCode: {
		defaultMessage: "Postal code",
		id: "checkout-io.profile.invoice.invoices.invoice-zipCode",
	},
	invoiceCity: {
		defaultMessage: "City",
		id: "checkout-io.profile.invoice.invoices.invoice-city",
	},
})
