import React, { createContext, useContext, useMemo } from "react"
import { useMutation } from "react-apollo"
import addOfferings from "../graphql/addOfferings.graphql"
import removeOfferings from "../graphql/removeOfferings.graphql"
import quantity from "../graphql/updateQuantity.graphql"
// import addCoupon from "../graphql/insertCoupon.graphql"
import { usePixel } from "vtex.pixel-manager"
// import { useCartOrder } from "./orderForm"
import { useOrder } from "./orderform"

interface Context {
	TOTAL_PRICE: string
	SUBTOTAL_PRICE: string
	SHIPPING_PRICE: string
  INSTALLATION_PRICE: string
  REMOVAL_PRICE: string
	quantityMutation: any
	addItemOfferings: any
	removeItemOfferings: any
	// insertCoupon: any
	push: any
	quantityLoading: boolean
	offeringLoading: boolean
	removeOfferingLoading: boolean
	quantityError: any,
	ORDER_FROM_ID:any
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

  // We take all the products' delivery price
  const productsDeliveryValues = orderForm?.items?.map((item) => item.bundleItems?.find((bundleItem) => bundleItem.name === "Delivery")?.sellingPrice).filter((item: any) => !!item)
  // We sum them all to obtain the total price
  const productsDeliveryTotal = productsDeliveryValues?.reduce((acc, curr) => curr ? (acc! + curr) : (acc! + 0), 0)
	const shippingValue = orderForm?.totalizers?.find((data:any) => data?.id == "Shipping")?.value
	const SHIPPING_PRICE = orderForm?.totalizers?.find((data:any) => data?.id == "Shipping")
		? orderForm?.storePreferencesData?.currencySymbol +
		  " " +
		  (shippingValue != undefined ? ( (shippingValue + (productsDeliveryTotal ? productsDeliveryTotal : 0)) / 100 ).toFixed(2).replace(",", ".") : "")
		: (((productsDeliveryTotal ? productsDeliveryTotal : 0) / 100).toFixed(2).replace(",", "."))
  // INSTALLATION VALUES
  const installationTotal = orderForm?.items?.reduce((sum, item) => {
    const installationOffering = item.bundleItems?.find(offering => offering.name === "Installation");
    const installationPrice = installationOffering ? installationOffering.price : 0;
    return sum + installationPrice;
  }, 0)
  const INSTALLATION_PRICE = installationTotal ? (installationTotal/100).toFixed(2) : "0.00";
  // REMOVAL VALUES
  const removalTotal = orderForm?.items?.reduce((sum, item) => {
    const removalOffering = item.bundleItems?.find(offering => offering.name === "Removal");
    const removalPrice = removalOffering ? removalOffering.price : 0;
    return sum + removalPrice;
  }, 0)
  const REMOVAL_PRICE = removalTotal ? (removalTotal/100).toFixed(2) : "0.00";
  // SUBTOTAL
	const SUBTOTAL_PRICE =
		orderForm?.storePreferencesData?.currencySymbol +
		" " +
		((orderForm?.totalizers[0]?.value - (installationTotal ? installationTotal : 0) - (removalTotal ? removalTotal : 0) - (productsDeliveryTotal ? productsDeliveryTotal : 0)) / 100).toFixed(2).replace(",", ".")
  const TOTAL_PRICE =
		orderForm?.storePreferencesData.currencySymbol +
		" " +
		(orderForm?.value / 100).toFixed(2).replace(",", ".")
	const ORDER_FROM_ID = orderForm?.orderFormId;
	// @quantityMutation
	const quantityMutation = (
		id: string,
		index: number,
		productQuantity: number,
	) => {
		qntMutation({
			variables: {
				orderFormId: orderForm?.orderFormId,
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
	// 	insCoupon({ variables: { orderFormId: orderForm.orderFormId, text: text } })
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
      INSTALLATION_PRICE,
      REMOVAL_PRICE,
			push,
			quantityMutation,
			addItemOfferings,
			removeItemOfferings,
			// insertCoupon,
			quantityError,
			quantityLoading,
			offeringLoading,
			removeOfferingLoading,
			ORDER_FROM_ID
			// couponData,
		}),
		[
			orderForm,
			quantityLoading,
			offeringLoading,
			removeOfferingLoading,
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
