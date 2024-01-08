import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePixel } from "vtex.pixel-manager"
import { useRuntime } from "vtex.render-runtime"
import { useOrder } from "./orderform"
interface Context {
	exhaustedDeliveries: boolean
	referenceValue: number
	paymentValue: number
	interestValue: number
	isFreePurchase: boolean
	session: any
	authCookie: string
	push: any,
  isScheduledDeliveryError: boolean,
  setIsScheduledDeliveryError: React.Dispatch<React.SetStateAction<boolean>>
}

const CheckoutContext = createContext<Context>({} as Context)

export const CheckoutContextProvider: StorefrontFunctionComponent = ({
	children,
}) => {
	const { push } = usePixel()
	const { orderForm } = useOrder()
	const { account } = useRuntime()

	const [session, setSession]: any = useState()
	const [authCookie, setAuthCookie]: any = useState()
  /*---ERRORS FOR SCHEDULED DELIVERY---*/
  const [isScheduledDeliveryError, setIsScheduledDeliveryError] = useState<boolean>(false)

	const postalCode =
		orderForm?.shippingData?.selectedAddresses[0]?.postalCode ?? ""

	useEffect(() => {
		const fetchSession = async () => {
			const result = await fetch("/api/sessions?items=*").then(res =>
				res.json(),
			)

			setSession(result)
		}

		fetchSession()
	}, [])

	useEffect(() => {
		if (session) {
			setAuthCookie(
				session.namespaces?.cookie?.[`VtexIdclientAutCookie_${account || ""}`]
					?.value,
			)
		}
	}, [session, account])

	const getCheckoutDelivieries = () => {
		const exhaustedDeliveries =
			orderForm?.shippingData?.logisticsInfo.every(
				(item: LogisticsInfo) => item.slas.length === 0,
			) ?? false

		return { exhaustedDeliveries }
	}

	const getCheckoutValues = () => {
		const referenceValue =
			orderForm?.totalizers?.reduce(
				(total: number, totalizer: { id: string; value: number }) => {
					if (totalizer?.id === "Tax" || totalizer?.id === "interest") {
						return total
					}

					return total + (totalizer?.value ?? 0)
				},
				0,
			) ?? 0

		const paymentValue =
			orderForm?.paymentData.payments?.reduce(
				(total: number, payment: { value: number }) =>
					total + (payment?.value ?? 0),
				0,
			) ?? 0

		const interestValue =
			orderForm?.paymentData.payments?.reduce(
				(total: number, payment: { value: number; referenceValue: number }) =>
					total + ((payment?.value ?? 0) - (payment?.referenceValue ?? 0)),
				0,
			) ?? 0

		const isFreePurchase = !referenceValue && orderForm?.items.length > 0

		return {
			referenceValue,
			paymentValue,
			interestValue,
			isFreePurchase,
		}
	}

	const deliveries = useMemo(
		() => getCheckoutDelivieries(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[postalCode]
	)

	const values = useMemo(
		() => getCheckoutValues(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[orderForm]
	)

	const context = { ...values, ...deliveries, session, authCookie, push, isScheduledDeliveryError, setIsScheduledDeliveryError}

	return (
		<CheckoutContext.Provider value={context}>
			{children}
		</CheckoutContext.Provider>
	)
}

/**
 * Use this hook to access data that you only want to
 * calculate once per render
 * @returns exhaustedDeliveries, referenceValue, paymentValue, interestValue, isFreePurchase
 */
export const useCheckout = () => {
	const context = useContext(CheckoutContext)

	if (context === undefined) {
		throw new Error(
			"useCheckout must be used within an CheckoutContextProvider",
		)
	}

	return context
}

export default { CheckoutContextProvider, useCheckout }
