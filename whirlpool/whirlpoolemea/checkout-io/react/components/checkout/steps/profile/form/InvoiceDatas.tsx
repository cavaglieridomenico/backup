import React, { useEffect, useRef } from "react"
import { Checkbox } from "vtex.styleguide"
import style from "../invoices.css"
import { useIntl, defineMessages } from "react-intl"
import { useProfile } from "../context/ProfileContext"

interface InvoiceDatasProps {
	isInvoiceOpenDefault: boolean
	isInvoiceMandatory: boolean
	children: any
}

const InvoiceDatas: React.FC<InvoiceDatasProps> = ({
	children,
	isInvoiceMandatory = false,
	isInvoiceOpenDefault = isInvoiceMandatory || false,
}) => {
	const {
		// selected,
		isInvoiceChecked,
		setIsInvoiceChecked,
		// errors,
		// isInvoiceSectionOpen,
		// invoiceSectionHeight,
		customDataValues,
		setCustomDataValues,
		setIsInvoiceSectionOpen,
	} = useProfile()
	/*--- STATE MANAGEMENT ---*/
	useEffect(() => {
		setIsInvoiceChecked(isInvoiceOpenDefault || isInvoiceChecked)
	}, [])

	// This useEffect avoids the user to be blocked if the invoice is not selected
	// In particular, if the user fills the invoice data, does not complete filling the invoice address data,
	// but then he decides not to request the invoice, in this way the validation on both the invoice and invoice address fields is skipped
	useEffect(() => {
		if (!isInvoiceChecked) {
			setIsInvoiceSectionOpen(false)
		}
	}, [isInvoiceChecked])

	// const [height, setHeight]: any = useState()

	/*--- REF MANAGEMENT ---*/
	const ref: any = useRef()

	const CustomDatas = children?.find(
		(child: any) =>
			child.props.id == "profile-editable-form.invoice-datas.custom-datas",
	)
	const InvoicesDatas = children?.find(
		(child: any) =>
			child.props.id == "profile-editable-form.invoice-datas.invoices",
	)

	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()

	return (
		<div className={style.InvoiceDataContainer}>
			{!isInvoiceMandatory ? (
				<Checkbox
					onChange={() => {
						const newIsInvoiceChecked = !isInvoiceChecked
						setIsInvoiceChecked(newIsInvoiceChecked),
							setCustomDataValues({
								...customDataValues,
								requestInvoice: newIsInvoiceChecked,
							})
					}}
					checked={isInvoiceChecked}
					label={intl.formatMessage(messages.requestInvoice)}
					disabled={isInvoiceMandatory}
				/>
			) : (
				<span>{intl.formatMessage(messages.requestInvoice)}</span>
			)}
			{isInvoiceChecked && (
				<div
					/* style={{
						height: !isInvoiceChecked ? height : height + invoiceSectionHeight,
					}} */
					className={style.CustomDatasContainer}
				>
					<div className={style.CustomDatasChildrenContainer} ref={ref}>
						{CustomDatas}
						{InvoicesDatas}
					</div>
				</div>
			)}
		</div>
	)
}

export default InvoiceDatas

const messages = defineMessages({
	requestInvoice: {
		defaultMessage: "Request the invoice",
		id: "checkout-io.profile.invoice.request-label",
	},
})
