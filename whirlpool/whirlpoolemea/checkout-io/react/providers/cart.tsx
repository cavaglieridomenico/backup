import React, { createContext, useContext, useMemo } from "react"
import { useMutation } from "react-apollo"
import quantity from "../graphql/updateQuantity.graphql"
import addOfferings from "../graphql/addOfferings.graphql"
import removeOfferings from "../graphql/removeOfferings.graphql"
// import addCoupon from "../graphql/insertCoupon.graphql"
import { useOrder } from "./orderform"
import { formatPrice } from "../utils/utils"
import { usePixel } from "vtex.pixel-manager"


interface Context {
	TOTAL_PRICE: string
	SUBTOTAL_PRICE: string
	SHIPPING_PRICE: string
	quantityMutation: any
	addItemOfferings: any
	removeItemOfferings: any
	// insertCoupon: any
	push: any
	quantityLoading: boolean
	offeringLoading: boolean
	removeOfferingLoading: boolean
	quantityError: any
	// couponData: any
}

const CartContext = createContext<Context>({} as Context)

export const CartContextProvider: StorefrontFunctionComponent = ({
	children,
}) => {
	const { push } = usePixel()
	const { orderForm, refreshOrder } = useOrder()

	// const {
	//   data,
	//   error,
	//   loading: orderLoading
	// } = useQuery(getOfferings, {
	//   fetchPolicy: 'no-cache',
	//   variables: {
	//     orderFormId: orderForm?.orderFormId,
	//   }
	// })
	// const orderError = Boolean(error)

	// const orderError = Boolean(error)
	// if(!production) {
	//   console.log('%c OFFERINGS ', 'background: blue; color: white', data?.orderForm?.items)
	//   console.log(
	//     '%c Loading? / Error? ',
	//     'background: white; color: black',
	//     orderLoading,
	//     orderError
	//   )
	// }

	// const offerings = data?.orderForm?.items

	// COSTANTS
	const shippingValue = orderForm?.totalizers?.find(
		(data: any) => data?.id == "Shipping",
	)?.value
	const SHIPPING_PRICE =
		orderForm?.totalizers?.find((data: any) => data?.id == "Shipping") &&
			shippingValue
			? formatPrice(
				shippingValue,
				orderForm?.storePreferencesData?.currencySymbol,
			)
			: ""
	const SUBTOTAL_PRICE = formatPrice(
		orderForm?.totalizers[0]?.value,
		orderForm?.storePreferencesData?.currencySymbol,
	)
	const TOTAL_PRICE = formatPrice(
		orderForm?.value,
		orderForm?.storePreferencesData.currencySymbol,
	)

	// @quantityMutation
	const quantityMutation = (
		id: string,
		index: number,
		productQuantity: number,
	) => {
		qntMutation({
			variables: {
				orderFormId: orderForm.orderFormId,
				orderItems: [
					{ id: parseInt(id), index: index, quantity: productQuantity },
				],
			},
		})
	}
	const [
		qntMutation,
		{ loading: quantityLoading, error: quantityError },
	]: any = useMutation(quantity, {
		onCompleted() {
			refreshOrder()
			orderForm?.items?.length == 1 && window?.location?.reload()
		},
	})

	// @addOfferings
	const addItemOfferings = (itemIndex: number, offeringId: string) => {
		addOff({
			variables: {
				orderFormId: orderForm.orderFormId,
				offeringInput: { itemIndex: itemIndex, offeringId: offeringId },
			},
		})
	}

	const [addOff, { loading: offeringLoading }]: any = useMutation(
		addOfferings,
		{
			onCompleted() {
				refreshOrder()
			},
		},
	)

	// @removeOfferings
	const removeItemOfferings = (itemIndex: number, offeringId: string) => {
		removeOff({
			variables: {
				orderFormId: orderForm.orderFormId,
				offeringInput: { itemIndex: itemIndex, offeringId: offeringId },
			},
		})
	}

	const [removeOff, { loading: removeOfferingLoading }]: any = useMutation(
		removeOfferings,
		{
			onCompleted() {
				refreshOrder()
			},
		},
	)

	// @insertCoupon
	// const insertCoupon = (text: string) => {
	// 	insCoupon({ variables: { orderFormId: orderForm.id, text: text } })
	// }

	// const [insCoupon, { data: couponData }]: any = useMutation(addCoupon, {
	// 	onCompleted: (data: any) => {
	// 		console.log("insCoupon - Response: ", data)
	// 		refreshOrder()
	// 	},
	// 	onError: (error: any) => {
	// 		console.log("COUPON Mutation ERROR: ", error)
	// 	},
	// })

	const context = useMemo(
		() => ({
			TOTAL_PRICE,
			SUBTOTAL_PRICE,
			SHIPPING_PRICE,
			push,
			quantityMutation,
			addItemOfferings,
			removeItemOfferings,
			// insertCoupon,
			quantityError,
			quantityLoading,
			offeringLoading,
			removeOfferingLoading,
			// couponData,
		}),
		[
			quantityLoading,
			offeringLoading,
			removeOfferingLoading,
			orderForm,
			// couponData,
		],
	)

	return <CartContext.Provider value={context}>{children}</CartContext.Provider>
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useCart = () => {
	const context = useContext(CartContext)

	if (context === undefined) {
		throw new Error("useOrder must be used within an OrderContextProvider")
	}

	return context
}

export default { CartContextProvider, useCart }

/*--- Mutations DOC ---*/

/**
 * @quantityMutation | GraphQL Mutation to change the quantity of a product
 *
 * @param id: productID,
 * @param index: index of the product in orderForm
 * @param productQuantity: quantity of product changed
 *
 **/

/**
 * @addOfferings | GraphQL Mutation to add the offering
 *
 * @param itemIndex: itemIndex,
 * @param offeringId: index of the offering
 *
 **/
