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
	} = useProfile()
	/*--- STATE MANAGEMENT ---*/
	useEffect(() => {
		setIsInvoiceChecked(isInvoiceOpenDefault)
	}, [])

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

	/* useEffect(() => {
		if (isInvoiceChecked)
			setHeight((ref.current as any)?.getBoundingClientRect().height)
		else setHeight(0)
	}, [
		isInvoiceChecked,
		selected,
		errors,
		isInvoiceSectionOpen,
		invoiceSectionHeight,
	]) */

	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()

	return (
		<div className={style.InvoiceDataContainer}>
			{!isInvoiceMandatory ? (
				<Checkbox
					onChange={() => {
						setIsInvoiceChecked(!isInvoiceChecked),
							setCustomDataValues({
								...customDataValues,
								requestInvoice: !isInvoiceChecked,
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
