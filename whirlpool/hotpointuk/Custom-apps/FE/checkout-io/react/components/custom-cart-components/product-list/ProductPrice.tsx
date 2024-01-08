import React from "react"
import style from "./productList.css"
import { useItemContext } from "./ItemContext"
import useOrder from "../../../OrderForm"

const ProductPrice: React.FC = () => {
	const { item } = useItemContext()
	const { orderForm } = useOrder()

	const listPrice = (item.listPrice / 100).toFixed(2).replace(",", ".")
	const sellingPrice = (item.sellingPrice / 100).toFixed(2).replace(",", ".")

	return (
		<>
			{listPrice == sellingPrice ? (
				<>
					<span className={style.productListPriceCurrency}>{orderForm?.storePreferencesData.currencySymbol}</span>
					<span className={style.productPrice}>{" " + listPrice}</span>
				</>
			) : (
				<div className={style.productPriceContainer}>
					<span className={style.productListPrice}>
						<span className={style.productListPriceCurrency}> {orderForm?.storePreferencesData.currencySymbol}</span>
						{" " + listPrice}
					</span>
					<span className={style.productPrice}>
						<span className={style.productListPriceCurrency}> {orderForm?.storePreferencesData.currencySymbol}</span>
						{" " + sellingPrice}
					</span>
				</div>
			)}
		</>
	)
}

export default ProductPrice
