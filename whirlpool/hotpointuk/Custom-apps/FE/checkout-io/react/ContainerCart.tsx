/* eslint-disable no-console */
import React, { useState, useEffect } from "react"
import { NoSSR, useRuntime } from "vtex.render-runtime"
import { HashRouter } from "react-router-dom"
import {
	CartOrderContextProvider
} from "./providers/cartOrderform"
import { CartContextProvider, useCart } from "./providers/cart"
import { OrderContextProvider, useOrder } from "./providers/orderform"

interface CheckoutContainer {
	enforceLogin?: boolean
}

const Cart: React.FC<CheckoutContainer> = ({ children }) => {
	const { orderLoading, hasItems } = useOrder()
	const { orderForm } = useOrder()
	const { push } = useCart()
	const { navigate } = useRuntime()
	const [isViewCartPushed, setIsViewCartPushed] = useState(false)

	useEffect(() => {
		if (orderLoading) {
			return
		}
		if (!hasItems) {
			navigate({
				page: "store.checkout.cart-add",
			})

			return
		}
	}, [hasItems, orderLoading])

	useEffect(() => {
		if (orderForm && !isViewCartPushed) {
			push({ event: "ga4-view_cart", orderForm })
			setIsViewCartPushed(true)
		}
	}, [orderForm])

	return <>{children}</>
}

const ContainerCart: React.FC<CheckoutContainer> = ({ children }) => {
	return (
		<NoSSR>
			<HashRouter>
				<OrderContextProvider>
					<CartOrderContextProvider>
						<CartContextProvider>
							<Cart>{children}</Cart>
						</CartContextProvider>
					</CartOrderContextProvider>
				</OrderContextProvider>
			</HashRouter>
		</NoSSR>
	)
}

export default ContainerCart
