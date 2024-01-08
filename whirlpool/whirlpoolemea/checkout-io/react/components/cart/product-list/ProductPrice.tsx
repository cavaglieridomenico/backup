import React from "react"
import style from "./productList.css"
import { useItemContext } from "./ItemContext"
import { useOrder } from "../../../providers/orderform"
import { formatPrice } from "../../../utils/utils"

const ProductPrice: React.FC = () => {
	const { item } = useItemContext()
	const { orderForm } = useOrder()

	const listPrice = formatPrice(
		item.listPrice,
		orderForm?.storePreferencesData.currencySymbol,
	)
	const sellingPrice = formatPrice(
		item.sellingPrice,
		orderForm?.storePreferencesData.currencySymbol,
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
