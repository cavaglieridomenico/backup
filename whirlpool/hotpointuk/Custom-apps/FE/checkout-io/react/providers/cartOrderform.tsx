import React, { createContext, useContext, useMemo } from "react"
import { useQuery } from "react-apollo"
import { useRuntime } from "vtex.render-runtime"
import cartOrder from "../graphql/cartOrderform.graphql"
import { useOrder } from "./orderform"

interface Context {
	cartOrderForm: CartOrderForm
	orderError: boolean
	cartOrderLoading: boolean
	refreshCartOrder: any
	hasItems: boolean
}

const OrderContext = createContext<Context>({} as Context)

export const CartOrderContextProvider: React.FC = ({ children }) => {
	const { production } = useRuntime()
	const { orderForm, orderLoading } = useOrder()

	const {
		data,
		error,
		loading: cartOrderLoading,
		refetch: refreshCartOrder,
	} = useQuery(cartOrder, {
		fetchPolicy: "no-cache",
		variables: {
			orderFormId: orderForm?.orderFormId,
		},
	})

	const cartOrderForm = data?.orderForm as CartOrderForm
	const orderError = Boolean(error)
	const hasItems = cartOrderForm?.items?.length > 0

	if (!production) {
		console.log(
			"%c CART-ORDERFORM ",
			"background: red; color: white",
			cartOrderForm,
		)
		console.log(
			"%c Loading? / Error? ",
			"background: white; color: black",
			orderLoading,
			orderError,
		)
	}

	const context = useMemo(
		() => ({
			cartOrderForm,
			orderError,
			cartOrderLoading,
			refreshCartOrder,
			hasItems,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[cartOrderForm, orderError, cartOrderLoading, refreshCartOrder, hasItems],
	)

	return (
		<OrderContext.Provider value={context}>{children}</OrderContext.Provider>
	)
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useCartOrder = () => {
	const context = useContext(OrderContext)

	if (context === undefined) {
		throw new Error("useOrder must be used within an OrderContextProvider")
	}

	return context
}

export default { CartOrderContextProvider, useCartOrder }
