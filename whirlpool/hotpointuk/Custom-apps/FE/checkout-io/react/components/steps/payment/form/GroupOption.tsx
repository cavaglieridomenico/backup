import React, { useEffect } from "react"
// import { useListContext } from "./ListGroup"
import { useIntl, defineMessages } from "react-intl"
import { useOrder } from "../../../../providers/orderform"
import useDisclosure from "../../../../hooks/useDisclosure"
import { usePayment } from "../context/PaymentContext"
import PayPalBox from "../../../custom-checkout-components/PayPalBox"
import style from "../PaymentStyles.css"
import PaymentFlag from "./PaymentFlag"
import Tick from "./flags/Tick"
import { formatPrice } from "../.././../../utils/utils"
interface OptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	payment?: any
	selectedId?: any
	selected?: boolean
	caretAlign?: "start" | "center" | "end"
	lean?: boolean
	isLast?: boolean
	index: number
}

const GroupOption: React.FC<OptionProps> = ({
	onClick = () => {},
	payment,
	selectedId,
	selected = false,
}) => {
	const { selectedPaymentIndex, setSelectedPaymentIndex } = usePayment()
	const { onOpen, onClose } = useDisclosure()
	const { orderForm } = useOrder()
	const value = orderForm?.value
	const intl = useIntl()
	const currency = orderForm?.storePreferencesData?.currencySymbol

	//aggiungere parametro da cms per inserire paypal leasing

	useEffect(() => {
		if (selectedId === payment.id) {
			onOpen()
		} else {
			onClose()
		}
	}, [selectedId])

	useEffect(() => {
		const selectedPaymentOF =
			orderForm?.paymentData?.payments?.[0]?.paymentSystem

		selectedPaymentOF && setSelectedPaymentIndex(+selectedPaymentOF)
	}, [])

	return (
		<>
			<div
				className={`${style.paymentGroupContainer} br3 mb2 b--action-primary`}
			>
				<button
					className={`w-100 tl pointer db lh-copy ${
						selectedPaymentIndex != payment?.id
							? "bg-checkout"
							: "bg-action-primary"
					} b--action-primary ph5 pv5 flex br3 items-center justify-between bn`}
					onClick={onClick}
					role="option"
					aria-selected={selected}
				>
					<div className="flex items-center">
						<div
							className={`${style.paymentMethodCheckContainer} ${
								selectedPaymentIndex != payment?.id
									? "b--action-primary"
									: "b--action-white"
							} flex justify-center items-center`}
						>
							<Tick />
						</div>
						<span
							className={`${style.paymentMethodName} ${
								selectedPaymentIndex != payment?.id
									? "c-action-primary"
									: "c-action-white"
							} fw6`}
						>
							{payment.name}
						</span>
					</div>
					<div className="h2 mr4">
						<PaymentFlag paymentSystemGroup={payment.groupName} />
					</div>
					{/* {children} */}
					{/* <span className="c-action-primary inline-flex items-center">
						{paymentMutationLoading && index == selectedPaymentIndex ? (
							<span className="white h1 flex items-center">
								<Spinner color="currentColor" />
							</span>
						) : // <IconCaretRight />
						null}
					</span> */}
				</button>
				{payment?.name === "PayPal" && selectedPaymentIndex == payment?.id ? (
					<div className="p3 w-100 br3 lh-copy c-on-base bg-base ph5 pv5">
						{<PayPalBox />}
					</div>
				) : selectedPaymentIndex == payment?.id ? (
					<div className="p3 w-100  br3 lh-copy c-on-base bg-base ph5 pv5">
						<div className="flex">
							<div>{`${intl.formatMessage(messages.total)}: ${formatPrice(
								value,
								currency,
							)}`}</div>
						</div>
					</div>
				) : null}
			</div>
			{/* {(!isLast || borderPosition === "top") && (
				<div className="w-100 pr5 pr0-ns">
					<Divider orientation="horizontal" />
				</div>
			)} */}
		</>
	)
}
const messages = defineMessages({
	total: {
		defaultMessage: "Total",
		id: "checkout-io.total",
	},
})

export default GroupOption
