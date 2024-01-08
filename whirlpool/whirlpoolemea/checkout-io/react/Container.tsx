/* eslint-disable no-console */
import React, { useEffect } from "react"
import { NoSSR, useRuntime } from "vtex.render-runtime"
import { HashRouter } from "react-router-dom"
import { useHistory } from "react-router"
import { OrderContextProvider, useOrder } from "./providers/orderform"
import { CheckoutContextProvider } from "./providers/checkout"
import { PaymentContextProvider } from "./components/checkout/steps/payment/context/PaymentContext"
import { AppSettingsContextProvider } from "./providers/appSettings"

import {
	ProductSummarySkeleton,
	CheckoutSkeleton,
} from "./components/common/skeleton/ContentLoaders"
// <ProductSummarySkeleton />

import routes from "./utils/routes"
import "./style.global.css"
import Adyen3DSInfoHandler from "./Adyen3DSInfoHandler"

interface CheckoutContainer {}

const Checkout: React.FC<CheckoutContainer> = ({ children }) => {
	const { orderForm, orderLoading } = useOrder()
	const { navigate, page } = useRuntime()
	const history = useHistory()

	const hasItems = orderForm?.items?.length > 0

	const isCheckoutPage = page == "store.checkout.order-form"
	// const isLogged = orderForm?.loggedIn
	if (orderLoading)
		return (
			<div className="center ph3 ph5-m ph2-xl mw8">
				<div className="fl w-70 pa3">
					<CheckoutSkeleton />
				</div>
				<div className="fl w-25 pa3 ">
					<ProductSummarySkeleton />
				</div>
			</div>
		)

	useEffect(() => {
		if (orderLoading) {
			return
		}

		if (!hasItems) {
			navigate({ page: "store.checkout.cart" })
			return
		}

		if (isCheckoutPage) {
			//qua aggiungo controllo sui customData o lo faccio atterra
			history.push(routes.PROFILE.route)
			return
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasItems, orderLoading, isCheckoutPage])

	return <>{children}</>
}

const Container: React.FC<CheckoutContainer> = ({ children }) => {
	return (
		<NoSSR>
			<HashRouter>
				<OrderContextProvider>
					<CheckoutContextProvider>
						<PaymentContextProvider>
							<AppSettingsContextProvider>
								<Checkout>
									<Adyen3DSInfoHandler />
									{children}
								</Checkout>
							</AppSettingsContextProvider>
						</PaymentContextProvider>
					</CheckoutContextProvider>
				</OrderContextProvider>
			</HashRouter>
		</NoSSR>
	)
}

export default Container
