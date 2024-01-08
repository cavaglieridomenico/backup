import React, { useEffect, useRef } from "react"
import { Checkbox } from "vtex.styleguide"
import style from "../invoices.css"
import { useIntl, defineMessages } from "react-intl"
import { useProfile } from "../context/ProfileContext"

interface InvoicesProps {
	children: any
}

const Invoices: React.FC<InvoicesProps> = ({ children }) => {
	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()
	/*--- REF MANAGEMENT ---*/
	const invRef: any = useRef()
	const {
		isInvoiceSectionOpen,
		setIsInvoiceSectionOpen,
		invoiceSectionHeight,
		setinvoiceSectionHeight,
		errors,
		isInvoiceChecked,
		setCustomDataValues,
		customDataValues,
		invoicesValues,
	} = useProfile()

	useEffect(() => {
		if (isInvoiceSectionOpen && isInvoiceChecked)
			setinvoiceSectionHeight(
				(invRef.current as any)?.getBoundingClientRect().height,
			)
		else setinvoiceSectionHeight(0)
	}, [isInvoiceSectionOpen, errors, isInvoiceChecked, invoicesValues])

	const InvoicesInputs = children?.find(
		(child: any) =>
			child.props.id == "profile-editable-form.invoice-datas.invoices-inputs",
	)
	return (
		<div className={style.invoiceSection}>
			<Checkbox
				onChange={() => {
					const newIsInvoiceSectionOpen = !isInvoiceSectionOpen
					setIsInvoiceSectionOpen(newIsInvoiceSectionOpen),
						setCustomDataValues({
							...customDataValues,
							// If the section is open, then the user does not want to use the shipping address
							useShippingAddress: !newIsInvoiceSectionOpen,
						})
				}}
				checked={!isInvoiceSectionOpen}
				label={intl.formatMessage(messages.invoiceSectionTitle)}
			/>
			<div
				style={{ height: invoiceSectionHeight }}
				className={style.CustomDatasContainer}
			>
				<div className={style.CustomDatasChildrenContainer} ref={invRef}>
					{InvoicesInputs}
				</div>
			</div>
		</div>
	)
}

export default Invoices

const messages = defineMessages({
	invoiceSectionTitle: {
		defaultMessage: "The billing address is the same as the shipping address",
		id: "checkout-io.profile.invoice.invoices-title",
	},
})
