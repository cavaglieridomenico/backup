import React from "react"
import { useCartOrder } from "../../../providers/cartOrderform"
import { ProductSummarySkeleton } from "../../skeleton/ContentLoaders"

const ProductSummary: React.FC = ({ children }) => {
	const { cartOrderLoading } = useCartOrder()

	return (
		<>
			{!cartOrderLoading ? (
				<>{children}</>
			) : (
				<ProductSummarySkeleton></ProductSummarySkeleton>
			)}
		</>
	)
}

export default ProductSummary
