import React from "react"
import { ProductSummarySkeleton } from "../../skeleton/ContentLoaders"
import useOrder from "../../../OrderForm"

const ProductSummary: React.FC = ({ children }) => {
	const { orderLoading } = useOrder()

	return (
		<>
			{!orderLoading ? (
				<>{children}</>
			) : (
				<ProductSummarySkeleton></ProductSummarySkeleton>
			)}
		</>
	)
}

export default ProductSummary
