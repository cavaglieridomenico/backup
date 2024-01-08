import React, { createContext, useContext, useMemo, useState } from "react"
import { useMutation } from "react-apollo"
import { useRuntime } from "vtex.render-runtime"
import updatePayment from "../../../../graphql/updatePayment.graphql"
import { useOrder } from "../../../../providers/orderform"
// import { useHistory } from "react-router"

interface Context {
	updatePaymentMutation: any
	paymentMutationLoading: boolean
	selectedPaymentIndex: number | undefined
	setSelectedPaymentIndex: any
}

const PaymentContext = createContext<Context>({} as Context)

export const PaymentContextProvider: React.FC = ({ children }) => {
	const { production } = useRuntime()
	const { orderForm, refreshOrder } = useOrder()
	const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(undefined)
	// const history = useHistory()

	console.log(orderForm, "orderForm")

	/*--- MUTATIONS ---*/
	// @updatePaymentMutation
	const updatePaymentMutation = (orderFormId: string, payments: any) => {
		paymentMutation({
			variables: {
				orderFormId: orderFormId,
				query: payments,
			},
		})
	}

	const [paymentMutation, { loading: paymentMutationLoading }]: any =
		useMutation(updatePayment, {
			onCompleted() {
				refreshOrder()
				// .then(() => history.push("*"))
			},
		})

	/*--- CONSTS ---*/

	if (!production) {
		console.log(
			"%c paymentMutationLoading ",
			"background: green; color: white",
			paymentMutationLoading,
		)
	}

	const context = useMemo(
		() => ({
			updatePaymentMutation,
			paymentMutationLoading,
			selectedPaymentIndex,
			setSelectedPaymentIndex,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[paymentMutationLoading, selectedPaymentIndex],
	)

	return (
		<PaymentContext.Provider value={context}>
			{children}
		</PaymentContext.Provider>
	)
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const usePayment = () => {
	const context = useContext(PaymentContext)

	if (context === undefined) {
		throw new Error("useOrder must be used within an OrderContextProvider")
	}

	return context
}

export default { PaymentContextProvider, usePayment }
