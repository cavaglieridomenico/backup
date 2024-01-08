/* eslint-disable no-console */
import React, { useEffect, useState } from "react"
import { NoSSR, useRuntime } from "vtex.render-runtime"
import { HashRouter } from "react-router-dom"
import { CartContextProvider, useCart } from "./providers/cart"
import { OrderContextProvider, useOrder } from "./providers/orderform"
import { AppSettingsContextProvider } from "./providers/appSettings"

interface CheckoutContainer {
	enforceLogin?: boolean
}

const Cart: React.FC<CheckoutContainer> = ({ children }) => {
	const { orderLoading, hasItems, orderForm } = useOrder()
	const { push } = useCart()
	const { /* navigate, */ binding } = useRuntime()
	const [isViewCartPushed, setIsViewCartPushed] = useState(false)

	useEffect(() => {
		if (orderLoading) {
			return
		}
		if (!hasItems) {
			const hasBinding = window?.location?.href?.includes("myvtex")
			window.location.href = hasBinding ? "/cart/add?__bindingAddress=" + binding?.canonicalBaseAddress : "/cart/add"
			/* navigate({
				page: "store.checkout.cart-add",
			}) */
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
					<CartContextProvider>
						<AppSettingsContextProvider>
							<Cart>{children}</Cart>
						</AppSettingsContextProvider>
					</CartContextProvider>
				</OrderContextProvider>
			</HashRouter>
		</NoSSR>
	)
}

export default ContainerCart
