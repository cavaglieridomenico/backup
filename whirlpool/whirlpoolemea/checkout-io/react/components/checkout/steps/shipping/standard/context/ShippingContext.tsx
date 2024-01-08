import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { useMutation } from "react-apollo"
import { defineMessages, useIntl } from "react-intl"
import { useHistory } from "react-router"
import selectDeliveryOption from "../../../../../../graphql/selectDeliveryOption.graphql"
import updateInvoiceMutation from "../../../../../../graphql/updateInvoiceData.graphql"
import updateSelectedAddress from "../../../../../../graphql/updateSelectedAddress.graphql"
import { useOrder } from "../../../../../../providers/orderform"
import { ErrorsObject } from "../../../../../../typings/errors"
import { ValidateAddress } from "../../../../../../typings/validation"
import routes from "../../../../../../utils/routes"
import { getAddressBasicFields } from "../../../../../../utils/utils"
import validateAddress from "./validate"

interface Context {
	formattedAddress: string
	setFormattedAddress: any
	addressValues: AddressValues
	setAddressValues: any
	isAddressSetted: boolean
	setIsAddressSetted: any
	setIsSubmittingAddress: any
	deliveryValues: DeliveryValues
	setDeliveryValues: any
	isDeliverySetted: boolean
	handleUpdateStreet: any
	handleChangeAddressInput: any
	handleChangeDeliveryInput: any
	updateDeliveryMutation: any
	handleAddressSubmit: any
	handleDeliverySubmit: any
	errors: ErrorsObject
	resetInput: any
}

interface AddressValues {
	// address: string
	complement: string
	number: string
	street: string
	city: string
	state: string
	postalCode: string
	country: string
	geoCoordinates: []
	receiverName: string
}

interface DeliveryValues {
	receiver: string
	id: string
}

const ShippingContext = createContext<Context>({} as Context)

export const ShippingContextProvider: React.FC = ({ children }) => {
	const intl = useIntl()
	const history = useHistory()
	const { orderForm, refreshOrder } = useOrder()
	const [errors, setErrors]: any = useState({})
	const [isSubmittingAddress, setIsSubmittingAddress]: any = useState(false)
	const [formattedAddress, setFormattedAddress] = useState<string>("")

	// ADDRESS
	const [addressValues, setAddressValues]: any = useState({
		// address: orderForm?.shippingData?.address?.addressId || '',
		complement: orderForm?.shippingData?.address?.complement || "",
		number: orderForm?.shippingData?.address?.number || "",
		street: orderForm?.shippingData?.address?.street || "",
		city: orderForm?.shippingData?.address?.city || "",
		state: orderForm?.shippingData?.address?.state || "",
		postalCode: orderForm?.shippingData?.address?.postalCode || "",
		country: orderForm?.shippingData?.address?.country || "",
		geoCoordinates: orderForm?.shippingData?.address?.geoCoordinates || [],
		receiverName: orderForm?.shippingData?.address?.receiverName || "",
	})

	useEffect(() => {
		setAddressValues({
			...addressValues,
			complement: orderForm?.shippingData?.address?.complement || "",
			number: orderForm?.shippingData?.address?.number || "",
			street: orderForm?.shippingData?.address?.street || "",
			city: orderForm?.shippingData?.address?.city || "",
			state: orderForm?.shippingData?.address?.state || "",
			postalCode: orderForm?.shippingData?.address?.postalCode || "",
			country: orderForm?.shippingData?.address?.country || "",
			geoCoordinates: orderForm?.shippingData?.address?.geoCoordinates || [],
			receiverName: orderForm?.shippingData?.address?.receiverName || "",
		})
	}, [orderForm])

	const checkProfileData = () => {
		if (orderForm && orderForm.clientProfileData) {
			const { firstName, lastName, phone } = orderForm.clientProfileData
			if (!firstName || !lastName || !phone) {
				history.push(routes.PROFILE.route)
			}
		} else {
			history.push(routes.PROFILE.route)
		}
	}

	checkProfileData()

	const [isAddressSetted, setIsAddressSetted] = useState<boolean>(
		orderForm.shippingData.address !== null &&
		orderForm.shippingData.address.state !== null,
	)

	const handleChangeAddressInput = (e: any) => {
		const { name, value } = e.target
		setAddressValues({
			...addressValues,
			[name]: value,
		})
	}

	const handleUpdateStreet = (address: string) => {
		const street = address?.split(",")?.[0]?.trim() || ""
		setAddressValues({ ...addressValues, street: street })
	}

	/*--- ADDRESS FORM SUBMITTING ---*/
	const handleAddressSubmit = (e: any, validation: ValidateAddress) => {
		e.preventDefault()
		setErrors(
			validateAddress(
				formattedAddress,
				addressValues,
				validation,
				intl?.messages,
			),
		)
		setIsSubmittingAddress(true)
	}

	useEffect(() => {
		if (Object.keys(errors).length == 0 && isSubmittingAddress) {
			updateAddressInfoMutation()
		} else {
			setIsSubmittingAddress(false)
		}
	}, [errors])

	const updateAddressInfoMutation = () => {
		updateAddressData({
			variables: {
				orderFormId: orderForm.orderFormId,
				address: {
					...addressValues,
				},
			},
		})
	}

	/*--- ADDRESS MUTATION ---*/
	const [updateAddressData]: any = useMutation(updateSelectedAddress, {
		onCompleted() {
			refreshOrder()

			// After updating the address, if the user requests the invoice, and he wants to use the same value
			// for both the billing and the shipping addresses, then the address stored in invoiceData is updated with the values
			// of the shipping address
			const fiscalData = orderForm?.customData?.customApps?.find(
				app => app.id == "fiscaldata",
			)?.fields
			if (
				fiscalData &&
				fiscalData.requestInvoice == "true" &&
				fiscalData.useShippingAddress == "true"
			) {
				updateInvoiceData(orderForm.orderFormId, addressValues)
				// The address summary is shown once the invoice data are updated as wellì
			} else {
				setIsAddressSetted(true)
			}
		},
	})

	const [updateInvoice]: any = useMutation(updateInvoiceMutation, {
		onCompleted() {
			refreshOrder()
			setIsAddressSetted(true)
		},
		onError(err) {
			console.log(
				"Error updating the invoice address using the new shipping address: ",
				err,
			)
			setIsAddressSetted(true)
		},
	})

	const updateInvoiceData = (
		orderFormId: string,
		addressValues: AddressValues,
	) => {
		const invoiceAddress = getAddressBasicFields(addressValues)
		updateInvoice({
			variables: {
				orderFormId: orderFormId,
				invoiceData: {
					address: {
						...invoiceAddress,
					},
				},
			},
		})
	}

	// DELIVERY
	const [isDeliverySetted, setIsDeliverySetted] = useState<boolean>(false)

	const [deliveryValues, setDeliveryValues]: any = useState({
		receiver: orderForm?.shippingData?.address?.receiverName || "",
		id: orderForm?.shippingData?.logisticsInfo[0]?.selectedSla,
	})

	useEffect(() => {
		setDeliveryValues({
			...deliveryValues,
			receiver: orderForm?.shippingData?.address?.receiverName || "",
			id: orderForm?.shippingData?.logisticsInfo[0]?.selectedSla || "",
		})
	}, [orderForm])

	const handleChangeDeliveryInput = (e: any) => {
		const { name, value } = e.target
		setDeliveryValues({
			...deliveryValues,
			[name]: value,
		})
	}

	const handleDeliverySubmit = () => {
		console.log("I WILL REDIRECT YOU TO THE PAYMENT")
		history.push(routes.PAYMENT.route)
	}

	const updateDeliveryMutation = (deliveryId: string) => {
		updateDeliveryMethod({
			variables: {
				orderFormId: orderForm.orderFormId,
				deliveryOption: deliveryId,
			},
		})
	}

	/*--- DELIVERY MUTATION ---*/
	const [updateDeliveryMethod]: any = useMutation(selectDeliveryOption, {
		onCompleted() {
			refreshOrder()
			setIsDeliverySetted(true)
		},
	})

	/*---ERRORS RESET ---*/
	const resetInput = (value: string) => {
		errors[value] && delete errors[value], setErrors({ ...errors })
	}

	const context = useMemo(
		() => ({
			formattedAddress,
			setFormattedAddress,
			addressValues,
			setAddressValues,
			isAddressSetted,
			setIsAddressSetted,
			setIsSubmittingAddress,
			deliveryValues,
			setDeliveryValues,
			isDeliverySetted,
			handleUpdateStreet,
			handleChangeAddressInput,
			handleChangeDeliveryInput,
			updateDeliveryMutation,
			handleAddressSubmit,
			handleDeliverySubmit,
			errors,
			resetInput,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			formattedAddress,
			setFormattedAddress,
			addressValues,
			setAddressValues,
			isAddressSetted,
			setIsAddressSetted,
			setIsSubmittingAddress,
			deliveryValues,
			setDeliveryValues,
			isDeliverySetted,
			handleChangeAddressInput,
			handleChangeDeliveryInput,
			updateDeliveryMutation,
			handleAddressSubmit,
			handleDeliverySubmit,
			errors,
			resetInput,
		],
	)

	return (
		<ShippingContext.Provider value={context}>
			{children}
		</ShippingContext.Provider>
	)
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useShipping = () => {
	const context = useContext(ShippingContext)

	if (context === undefined) {
		throw new Error("useOrder must be used within an OrderContextProvider")
	}

	return context
}

export default { ShippingContextProvider, useShipping }

defineMessages({
	emptyError: {
		defaultMessage: "This field can't be empty",
		id: "checkout-io.address.errors.empty",
	},
	postalCodeError: {
		defaultMessage: "The postal code need to be digits",
		id: "checkout-io.address.errors.postal-code",
	},
})
