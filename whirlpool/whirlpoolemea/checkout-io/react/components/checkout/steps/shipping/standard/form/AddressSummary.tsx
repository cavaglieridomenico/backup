import React from "react"
import { useIntl, defineMessages } from "react-intl"
import { useOrder } from "../../../../../../providers/orderform"
import { useShipping } from "../context/ShippingContext"
import { ButtonPlain, IconEdit } from "vtex.styleguide"
import style from "../address.css"
//import { addressIcon } from "../../../../../assets/addressIcon"
const messages = defineMessages({
	edit: {
		defaultMessage: "Edit",
		id: "checkout-io.edit",
	},
})

const AddressSummary: React.FC = (
	{
		// children
	},
) => {
	const intl = useIntl()
	const { orderForm } = useOrder()
	// const{shippingData} = orderForm
	// const {address} = shippingData
	const {
		setIsAddressSetted,
		addressValues,
		setIsSubmittingAddress,
	} = useShipping()
	// IT CANNOT BE USED, THE COMPONENT (SHIPPING-SUMMARY) IS NOT WRAPPED FROM THE CONTEXT-PROVIDER...
	// THE ORDERFORM SHALL BE USED INSTEAD...

	const handleEditAddress = () => {
		setIsSubmittingAddress(false)
		setIsAddressSetted(false)
	}

	return (
		<>
			<div
				className={`${style.addressSummaryContainer} bg-checkout flex justify-between items-center`}
			>
				<div className={`${style.addressSummaryLeftPart} flex`}>
					<div
						className={`${style.addressWrapper} flex justify-center flex-column items-start`}
					>
						{window.location.href.includes("co.uk") ?
							<>
								<span className={`${style.addressSummaryLabel} black`}>
									{addressValues?.street}
								</span>
							</> :
							<>
								<span className={`${style.addressSummaryLabel} black`}>
									{addressValues?.street}, {addressValues.number}
								</span>
							</>}
						<span
							className={`${style.addressSummaryLabel} black`}
						>{`${addressValues?.postalCode}, ${addressValues?.city}`}</span>
					</div>
				</div>
				{/*BUTTON EDIT*/}

				<div
					className={`dib ml4  underline-hover ${style.addressSummaryEditButtonsContainer}`}
				>
					<ButtonPlain
						onClick={handleEditAddress}
						disabled={!orderForm?.clientProfileData?.email}
					>
						<IconEdit solid />
						{intl.formatMessage(messages.edit)}
					</ButtonPlain>
				</div>
			</div>
		</>
	)
}

// const messages = defineMessages({
//   edit: {
//     defaultMessage: 'Edit',
//     id: 'checkout-io.edit',
//   }
// })

export default AddressSummary
