import React from "react"
import { useIntl, defineMessages } from "react-intl"
import { Button } from "vtex.styleguide"
import style from "../address.css"
import { useShipping } from "../context/ShippingContext"
// import { useCheckout } from "../../../../providers/checkout"
// import { useOrder } from "../../../../providers/orderform"

interface AddressEditableFormProps {
	children: any,
	validation?: any
}

const AddressEditableForm: React.FC<AddressEditableFormProps> = ({
	children,
	validation = {
		isAddressRequired: true,
		isAdditionalInfoAddressRequired: false,
		isCityRequired: true,
		isStateRequired: true,
		isPostalCodeRequired: true,
	},
}: any) => {
	// const { push } = useCheckout()
	// const { orderForm } = useOrder()
	const intl = useIntl()
	const { handleAddressSubmit, isAddressSetted } = useShipping()

	const AddressSummary = children?.find(
		(child: any) => child.props.id == "shipping-editable-form.address-summary",
	)

	const AddressInfo = children?.find(
		(child: any) =>
			child.props.id ==
			"shipping-editable-form.address-editable-form.address-info",
	)

	return (
		<>
			{isAddressSetted ? (
				AddressSummary
			) : (
				<form
					className="mt6"
					onSubmit={(e: any) => handleAddressSubmit(e, validation)}
				>
					{/*  AddressInfo.tsx */}
					{AddressInfo}
					<div
						className={`${style.addressSumbitButton} flex mt5 justify-center`}
						data-testid="address-continue-wrapper"
					>
						<Button
							size="large"
							type="submit"
							// disabled={!validForm}
							// isLoading={isFetching}
							variant="primary"
							block
						>
							<span className="f5">{intl.formatMessage(messages.save)}</span>
						</Button>
					</div>
				</form>
			)}
		</>
	)
}

const messages = defineMessages({
	save: {
		defaultMessage: "Save",
		id: "checkout-io.save",
	},
})

export default AddressEditableForm
