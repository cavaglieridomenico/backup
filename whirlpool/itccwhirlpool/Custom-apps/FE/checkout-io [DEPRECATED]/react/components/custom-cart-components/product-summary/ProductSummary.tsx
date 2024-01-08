import React from "react"
import { useOrder } from "../../../providers/orderform"
import { ProductSummarySkeleton } from "../../skeleton/ContentLoaders"

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
