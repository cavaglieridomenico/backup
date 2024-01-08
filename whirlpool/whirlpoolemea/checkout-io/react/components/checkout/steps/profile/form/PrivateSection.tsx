import React from "react"
import { useIntl, defineMessages } from "react-intl"
import { Input } from "vtex.styleguide"
import style from "../invoices.css"
import { useProfile } from "../context/ProfileContext"
// import {
// 	useCodiceFiscaleAzienda,
// 	useInvoiceFiscalCode,
// } from "../config/checkInvoiceCustomField"
// import { useAppSettings } from "../../../../../providers/appSettings"

// import { Values } from "../form/CustomDatas"

interface PrivateSectionProps {}

const PrivateSection: StorefrontFunctionComponent<
	PrivateSectionProps
> = ({}) => {
	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()

	// const { appSettings } = useAppSettings()

	const {
		customDataValues,
		errors,
		customDatasRequiredFields,
		handleChangeInputCustomDatas,
		handleChangeInvoiceProfileData,
		resetInput,
		customInvoiceField,
	} = useProfile()

	return (
		<>
			{/* NAME AND SURNAME */}
			{
				<div
					className={style.profileInput}
					data-testid="profile--invoice-name-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.nameAndSurname)}${
							// isNameRequired ? "*" : ""
							customDatasRequiredFields.isInvoiceNameRequired ? "*" : ""
						}`}
						name="sendInvoiceTo"
						type="text"
						value={customDataValues.sendInvoiceTo}
						error={errors?.sendInvoiceTo}
						errorMessage={errors?.sendInvoiceTo}
						onChange={(e: any) => {
							handleChangeInputCustomDatas(e),
								handleChangeInvoiceProfileData("corporateName", e.target.value),
								resetInput("sendInvoiceTo")
						}}
					/>
				</div>
			}
			{/* FISCAL  CODE */}
			{/* {useInvoiceFiscalCode(appSettings) && (
				<div
					className={style.profileInput}
					data-testid="profile--invoice-fiscl-code-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.invoiceFiscalCode)}${
							customDatasRequiredFields.isFiscalCodeRequired ? "*" : ""
						}`}
						name="invoiceFiscalCode"
						type="text"
						value={customDataValues.invoiceFiscalCode}
						error={errors?.invoiceFiscalCode}
						errorMessage={errors?.invoiceFiscalCode}
						onChange={(e: any) => {
							handleChangeInputCustomDatas(e),
								handleChangeInvoiceProfileData("document", e.target.value),
								resetInput("invoiceFiscalCode")
						}}
					/>
				</div>
			)}
			{useCodiceFiscaleAzienda(appSettings) && (
				<div
					className={style.profileInput}
					data-testid="profile--invoice-fiscl-code-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.invoiceFiscalCode)}${
							customDatasRequiredFields.isFiscalCodeRequired ? "*" : ""
						}`}
						name="codiceFiscaleAzienda"
						type="text"
						value={customDataValues.codiceFiscaleAzienda}
						error={errors?.invoiceFiscalCode}
						errorMessage={errors?.invoiceFiscalCode}
						onChange={(e: any) => {
							handleChangeInputCustomDatas(e),
								handleChangeInvoiceProfileData("document", e.target.value),
								resetInput("invoiceFiscalCode")
						}}
					/>
				</div>
			)} */}
			{
				<div
					className={style.profileInput}
					data-testid="profile--invoice-fiscl-code-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.invoiceFiscalCode)}${
							customDatasRequiredFields.isFiscalCodeRequired ? "*" : ""
						}`}
						name={customInvoiceField}
						type="text"
						value={customDataValues[customInvoiceField]}
						error={errors?.invoiceFiscalCode}
						errorMessage={errors?.invoiceFiscalCode}
						onChange={(e: any) => {
							handleChangeInputCustomDatas(e),
								handleChangeInvoiceProfileData("document", e.target.value),
								// The value below should not be changed, since resetInput resets the values stored in errors,
								// and the field in error is always named invoiceFiscalCode
								resetInput("invoiceFiscalCode")
						}}
					/>
				</div>
			}
			{/* PEC */}
			{
				<div
					className={style.profileInput}
					data-testid="profile--invoice-pec-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.SDIPEC)}${
							// isPecRequired ? "*" : ""
							customDatasRequiredFields.isPecRequired ? "*" : ""
						}`}
						name="SDIPEC"
						type="text"
						value={customDataValues.SDIPEC}
						error={errors?.SDIPEC}
						errorMessage={errors?.SDIPEC}
						onChange={(e: any) => {
							handleChangeInputCustomDatas(e), resetInput("SDIPEC")
						}}
					/>
				</div>
			}
		</>
	)
}

export default PrivateSection

const messages = defineMessages({
	nameAndSurname: {
		defaultMessage: "Name and surname",
		id: "checkout-io.profile.invoice.select.nameSurname",
	},
	invoiceFiscalCode: {
		defaultMessage: "Fiscal code",
		id: "checkout-io.profile.invoice.select.invoiceFiscalCode",
	},
	SDIPEC: {
		defaultMessage: "PEC",
		id: "checkout-io.profile.invoice.select.pec",
	},
})
