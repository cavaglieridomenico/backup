import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { useQuery, useMutation } from "react-apollo"
import { OperationVariables } from "apollo-client"
import { useRuntime } from "vtex.render-runtime"
import addCoupon from "../graphql/insertCoupon.graphql"
import addCouponWithLogs from "../graphql/insertCouponWithLogs.graphql"
import GET_ORDER from "../graphql/orderform.gql"
import { usePixel } from "vtex.pixel-manager"
import { formatPrice } from "../utils/utils"

interface Context {
	orderForm: OrderForm
	orderError: boolean
	orderLoading: boolean
	refreshOrder: (variables?: OperationVariables | undefined) => Promise<any>
	paymentSystems: any
	payments: any
	totalizers: any
	insertCoupon: any
	couponData: any
	couponMessages: any
	push: any
	isCouponCallDone: boolean
	setIsCouponCallDone: any
	hasItems: boolean
	TOTAL_PRICE: string
	PERCENTAGE_DISCOUNT: number
	currentStep: string
	setCurrentStep: any
}

const OrderContext = createContext<Context>({} as Context)

export const OrderContextProvider: React.FC = ({ children }) => {
	const { production } = useRuntime()
	const { push } = usePixel()

	const [currentStep, setCurrentStep] = useState(
		window?.location?.hash?.replace("#", ""),
	)

	useEffect(() => {
		window?.addEventListener("hashchange", () => {
			setCurrentStep(window?.location?.hash?.replace("#", ""))
		})
	}, [typeof window])

	const {
		data,
		error,
		loading: orderLoading,
		refetch: refreshOrder,
	} = useQuery(GET_ORDER, {
		fetchPolicy: "no-cache",
	})

	const orderForm = data?.checkoutOrder as OrderForm
	const orderError = Boolean(error)

	/*--- CONSTS ---*/
	const [isCouponCallDone, setIsCouponCallDone] = useState(false)
	const paymentSystems = orderForm?.paymentData?.paymentSystems
	const payments = orderForm?.paymentData?.payments
	const totalizers = orderForm?.totalizers

	const PERCENTAGE_DISCOUNT =
		((orderForm?.totalizers[0]?.value - orderForm?.value) /
			orderForm?.totalizers[0]?.value) *
		100

	if (!production) {
		console.log("%c ORDERFORM ", "background: green; color: white", orderForm)
		console.log(
			"%c Loading? / Error? ",
			"background: white; color: black",
			orderLoading,
			orderError,
		)
	}
	// @insertCoupon
	const [couponData, setCouponData] = useState("")
	const [couponMessages, setCouponMessages] = useState({})

	useEffect(() => {
		if (orderForm) {
			setCouponData(orderForm?.marketingData?.coupon)
		}
	}, [orderForm, couponData])

	const insertCoupon = (text: string, useLogs: boolean) => {
		useLogs ? insertCouponWithLogs(text) : insertCouponStandard(text)
	}

	const insertCouponStandard = (text: string) => {
		insCoupon({ variables: { orderFormId: orderForm.orderFormId, text: text } })
	}

	const [insCoupon, { data: couponDataOrderForm }]: any = useMutation(
		addCoupon,
		{
			onCompleted: (data: any) => {
				setCouponData(couponDataOrderForm)
				setCouponMessages(data.insertCoupon)
				setIsCouponCallDone(true)
				refreshOrder()
			},
			onError: (error: any) => {
				console.log("COUPON Mutation ERROR: ", error)
			},
		},
	)

	const insertCouponWithLogs = (text: string) => {
		insCouponWithLogs({
			variables: { orderFormId: orderForm.orderFormId, coupon: text },
		})
	}

	const [
		insCouponWithLogs,
		{ data: couponWithLogsDataOrderForm },
	]: any = useMutation(addCouponWithLogs, {
		onCompleted: (data: any) => {
			setCouponData(couponWithLogsDataOrderForm)
			setCouponMessages(data.insertCouponWithLogs)
			setIsCouponCallDone(true)
			refreshOrder()
		},
		onError: (error: any) => {
			console.log("COUPON-WITH-LOGS Mutation ERROR: ", error)
		},
	})

	//CART
	const hasItems = orderForm?.items?.length > 0

	const total = orderForm?.totalizers?.reduce(
		(accumulator: number, object: any) => {
			return accumulator + object.value
		},
		0,
	)
	const TOTAL_PRICE = formatPrice(
		total,
		orderForm?.storePreferencesData.currencySymbol,
	)

	const context = useMemo(
		() => ({
			orderForm,
			orderError,
			orderLoading,
			refreshOrder,
			paymentSystems,
			payments,
			totalizers,
			insertCoupon,
			couponData,
			couponMessages,
			push,
			isCouponCallDone,
			setIsCouponCallDone,
			hasItems,
			TOTAL_PRICE,
			PERCENTAGE_DISCOUNT,
			currentStep,
			setCurrentStep,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			orderForm,
			orderError,
			orderLoading,
			refreshOrder,
			paymentSystems,
			payments,
			totalizers,
			couponData,
			couponMessages,
			insertCoupon,
			isCouponCallDone,
			hasItems,
			TOTAL_PRICE,
			PERCENTAGE_DISCOUNT,
			currentStep,
		],
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
export const useOrder = () => {
	const context = useContext(OrderContext)

	if (context === undefined) {
		throw new Error("useOrder must be used within an OrderContextProvider")
	}

	return context
}

export default { OrderContextProvider, useOrder }
