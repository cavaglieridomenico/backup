import React from "react"
import { useIntl, defineMessages } from "react-intl"
import { Input } from "vtex.styleguide"
import style from "../invoices.css"
import { useProfile } from "../context/ProfileContext"
// import { Values } from "../form/CustomDatas"

interface PrivateSectionProps {
	propToShowName: boolean
	propToShowFiscalCode: boolean
	isFiscalCodeRequired: boolean
	propToShowPec: boolean
	isPecRequired: boolean
	isNameRequired: boolean
}

const PrivateSection: StorefrontFunctionComponent<PrivateSectionProps> = ({
	propToShowName,
	isNameRequired,
	propToShowFiscalCode,
	isFiscalCodeRequired = true,
	propToShowPec,
	isPecRequired,
}) => {
	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()

	const {
		customDataValues,
		errors,
		// customDatasRequiredFields,
		handleChangeInputCustomDatas,
		resetInput,
	} = useProfile()

	return (
		<>
			{/* NAME AND SURNAME */}
			{propToShowName && (
				<div
					className={style.profileInput}
					data-testid="profile--invoice-name-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.nameAndSurname)}${
							isNameRequired ? "*" : ""
						}`}
						name="sendInvoiceTo"
						type="text"
						value={customDataValues.sendInvoiceTo}
						error={errors?.sendInvoiceTo}
						errorMessage={errors?.sendInvoiceTo}
						onChange={(e: any) => {
							handleChangeInputCustomDatas(e), resetInput("sendInvoiceTo")
						}}
					/>
				</div>
			)}
			{/* FISCAL  CODE */}
			{propToShowFiscalCode && (
				<div
					className={style.profileInput}
					data-testid="profile--invoice-fiscl-code-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.invoiceFiscalCode)}${
							isFiscalCodeRequired ? "*" : ""
						}`}
						name="invoiceFiscalCode"
						type="text"
						value={customDataValues.invoiceFiscalCode}
						error={errors?.invoiceFiscalCode}
						errorMessage={errors?.invoiceFiscalCode}
						onChange={(e: any) => {
							handleChangeInputCustomDatas(e), resetInput("invoiceFiscalCode")
						}}
					/>
				</div>
			)}
			{/* PEC */}
			{propToShowPec && (
				<div
					className={style.profileInput}
					data-testid="profile--invoice-pec-wrapper"
				>
					<Input
						label={`${intl.formatMessage(messages.SDIPEC)}${
							isPecRequired ? "*" : ""
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
			)}
		</>
	)
}

PrivateSection.schema = {
	title: "Billing Option",
	description: "editor.private-section.description",
	type: "object",
	properties: {
		propToShowName: {
			title: "Name and Surname",
			description: "Choose if show or not",
			default: true,
			type: "boolean",
		},
		isNameRequired: {
			title: "Name and Surname Required",
			description: "Choose if required or not",
			default: true,
			type: "boolean",
		},
		propToShowFiscalCode: {
			title: "Fiscal Code",
			description: "Choose if show or not",
			default: true,
			type: "boolean",
		},
		isFiscalCodeRequired: {
			title: "Fiscal code Required",
			description: "Choose if required or not",
			default: true,
			type: "boolean",
		},
		propToShowPec: {
			title: "Pec",
			description: "Choose if show or not",
			default: true,
			type: "boolean",
		},
		isPecRequired: {
			title: "Pec Required",
			description: "Choose if required or not",
			default: true,
			type: "boolean",
		},
	},
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
