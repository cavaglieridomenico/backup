import React, { useEffect } from "react"
import { RadioGroup } from "vtex.styleguide"
import { useProfile } from "../context/ProfileContext"
import { useIntl, defineMessages } from "react-intl"
import style from "../invoices.css"

interface CustomDatasProps {
	defaultSelected?: Values
	isSelectVisible: boolean
	children: any
	invoiceValidation: any
}

export enum Values {
	private = "private",
	company = "company",
}

const CustomDatas: React.FC<CustomDatasProps> = ({
	defaultSelected = "private",
	isSelectVisible = true,
	children,
	invoiceValidation = {
		isInvoiceNameRequired:
			useProfile().customDataValues.sendInvoiceTo != undefined ? true : false,
		isInvoiceFiscalCodeRequired:
			useProfile().customDataValues.invoiceFiscalCode != undefined
				? true
				: false,
		isSDIPECRequired: false,
		isInvoiceSocialReasonRequired: true,
		isInvoiceVatRequired: true,
	},
}) => {
	const {
		selected,
		setSelected,
		setCustomDatasRequiredFields,
		customDataValues,
		setCustomDataValues,
	} = useProfile()

	const ProfileSection = children?.find(
		(child: any) =>
			child.props.id ==
			"profile-editable-form.invoice-datas.custom-datas.private-section",
	)
	const CompanySection = children?.find(
		(child: any) =>
			child.props.id ==
			"profile-editable-form.invoice-datas.custom-datas.company-section",
	)

	useEffect(() => {
		setSelected(defaultSelected)
		setCustomDatasRequiredFields(invoiceValidation)
	}, [])

	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()

	return (
		<div>
			{isSelectVisible && (
				<div className={style.invoiceSelectContainer}>
					<RadioGroup
						hideBorder
						name="invoice-datas"
						options={[
							{
								value: Values.private,
								label: intl.formatMessage(messages.private),
							},
							{
								value: Values.company,
								label: intl.formatMessage(messages.company),
							},
						]}
						value={selected}
						onChange={(e: any) => {
							setSelected(e.currentTarget.value),
								setCustomDataValues({
									...customDataValues,
									typeOfDocument: e.currentTarget.value,
								})
						}}
					/>
				</div>
			)}
			{selected == Values.private && ProfileSection}
			{selected == Values.company && CompanySection}
		</div>
	)
}

export default CustomDatas

const messages = defineMessages({
	private: {
		defaultMessage: "Private",
		id: "checkout-io.profile.invoice.select.private",
	},
	company: {
		defaultMessage: "Company",
		id: "checkout-io.profile.invoice.select.company",
	},
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
