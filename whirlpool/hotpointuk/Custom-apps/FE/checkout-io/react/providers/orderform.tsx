import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { useQuery, useMutation, useLazyQuery } from "react-apollo"
import { OperationVariables } from "apollo-client"
import { useRuntime } from "vtex.render-runtime"
import addCoupon from "../graphql/insertCoupon.graphql"
import addDelivery from "../graphql/addDelivery.graphql"
import GET_ORDER from "../graphql/orderform.gql"
import { usePixel } from "vtex.pixel-manager"
import GET_SPECS from "../graphql/productsProperties.graphql"

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
	isSpecsInserted: boolean,
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
		onCompleted() {
			let itemIds = orderForm.items?.map((item) => item.id)
			//pulisco da doppioni
			itemIds = [...new Set(itemIds)]
			//tiro giù le properties dei prodotti
			getSpecs({ variables: {
				field: "sku",
				values: itemIds,
			} })
		},
	})

	const orderForm = data?.checkoutOrder as OrderForm
	const orderError = Boolean(error)

	const [isSpecsInserted, setIsSpecsInserted] = useState(false)

	const [getSpecs, { data: specsData, error: specsError }] = useLazyQuery(GET_SPECS, {
		onCompleted() {
			if(specsData && !specsError){
				orderForm.items.forEach(item => {
					item.properties = specsData.productsByIdentifier?.find((spec: any) => spec.productId == item.productId)?.properties
				})
			setIsSpecsInserted(true)
			}
		},
	})

	/*--- CONSTS ---*/
	const paymentSystems = orderForm?.paymentData?.paymentSystems
	const payments = orderForm?.paymentData?.payments
	const totalizers = orderForm?.totalizers
	const [isCouponCallDone, setIsCouponCallDone] = useState(false)
	const [isMutationDone, setIsMutationDone] = useState(false)

	if (!production) {
		console.log("%c ORDERFORM ", "background: green; color: white", orderForm)
		console.log(
			"%c Loading? / Error? ",
			"background: white; color: black",
			orderLoading,
			orderError,
		)
	}

  const [deliveryMutation]: any = useMutation(addDelivery, {
    onCompleted() {
      console.log("%c DELIVERY MUTATION FATTA", "background: grey; color: white")
	  refreshOrder()
    },
    onError: (error: any) => {
      console.log("Mutation ERROR: ", error)
      console.log(orderForm.orderFormId, "OrderID")
    },
  })

	useEffect(() => {
		if(!isMutationDone && orderForm){
			console.log("%c ORDERFORM ", "background: blue; color: white", orderForm)

		deliveryMutation({
			variables: {
			orderFormId: orderForm.orderFormId
			}
		})
			setIsMutationDone(true)
		}

	}, [orderForm, isMutationDone])



	// @insertCoupon
	const [couponData, setCouponData] = useState("")
	const [couponMessages, setCouponMessages] = useState({})

	useEffect(() => {
		if (orderForm) {
			setCouponData(orderForm?.marketingData?.coupon)
		}
	}, [orderForm, couponData])

	const insertCoupon = (text: string) => {
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

	//CART
	const hasItems = orderForm?.items?.length > 0

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
			isSpecsInserted,
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
			isSpecsInserted,
			hasItems,
			currentStep
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
