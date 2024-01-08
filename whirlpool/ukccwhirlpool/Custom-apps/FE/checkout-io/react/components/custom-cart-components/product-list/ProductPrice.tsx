import React from "react"
import style from "./productList.css"
import { useItemContext } from "./ItemContext"
import { useCartOrder } from "../../../providers/cartOrderform"
import { formatPrice } from "../../../utils/utils"

const ProductPrice: React.FC = () => {
	const { item } = useItemContext()
	const { cartOrderForm } = useCartOrder()

	const listPrice = formatPrice(
		item.listPrice,
		cartOrderForm?.storePreferencesData.currencySymbol,
	)
	const sellingPrice = formatPrice(
		item.sellingPrice,
		cartOrderForm?.storePreferencesData.currencySymbol,
	)

	return (
		<>
			{listPrice == sellingPrice ? (
				<>
					<span className={style.productPrice}>{listPrice}</span>
				</>
			) : (
				<div className={style.productPriceContainer}>
					<span className={style.productListPrice}>{listPrice}</span>
					<span className={style.productPrice}>{sellingPrice}</span>
				</div>
			)}
		</>
	)
}

export default ProductPrice
