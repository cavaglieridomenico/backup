import React from "react"
// import { useCartOrder } from "../../../providers/cartOrderform"
import { useCart } from "../../../providers/cart"
import style from "./productList.css"
import { useIntl, defineMessages } from "react-intl"
import { ProductListSkeleton } from "../../skeleton/ContentLoaders"
import { IconDelete } from "vtex.store-icons"
import useOrder from "../../../OrderForm"

const messages = defineMessages({
	subTextProductName: {
		defaultMessage: "Sold and shipped by Whirlpool",
		id: "checkout-io.cart.sub-text-product-name",
	},
})

const offerings = require("./mockOfferings.json")

// interface Props {

// }

const ProductList: React.FC = () => {
	const { quantityMutation, TOTAL_PRICE } = useCart()
	const { orderForm, refreshOrder, orderLoading } = useOrder()
	const intl = useIntl()

	console.log(offerings)
	return (
		<>
			{!orderLoading ? (
				orderForm?.items.map((item, index) => (
					<>
						<div key={index} className={style.productListContainer}>
							<div className={style.imageAndNameCol}>
								<a className={style.imageAndNameLink} href={item.detailUrl}>
									<img
										className={style.productImage}
										src={item.imageUrl}
										alt="Product Image"
									/>
									<div className={style.nameAndSubText}>
										<span className={style.productName}>{item.name}</span>
										<span className={style.subText}>
											{intl.formatMessage(messages.subTextProductName)}
										</span>
									</div>
								</a>
							</div>
							<div className={style.quantityCol}>
								<div className={style.productquantityContainer}>
									<button
										className={
											item.quantity > 1
												? style.minusButton
												: style.minusButtonDisabled
										}
										onClick={() => {
											quantityMutation(
												item.id,
												index,
												orderForm.items[index].quantity - 1,
											),
												refreshOrder()
										}}
									>
										-
									</button>
									<span>{item.quantity}</span>
									<button
										className={style.plusButton}
										onClick={() => {
											quantityMutation(
												item.id,
												index,
												orderForm.items[index].quantity + 1,
											),
												refreshOrder()
										}}
									>
										+
									</button>
								</div>
							</div>
							<div className={style.priceCol}>
								{TOTAL_PRICE}
								<span>
									{" "}
									{orderForm.storePreferencesData.currencySymbol}
								</span>
							</div>
							<div className={style.removeProductCol}>
								<button
									onClick={() => {
										quantityMutation(item.id, index, 0), refreshOrder()
									}}
									className={style.removeProductButton}
								>
									{/* <img
										className={style.removeProductImg}
										src="/arquivos/close-icon.svg"
										alt="Remove product"
									/> */}
									<IconDelete />
								</button>
							</div>
						</div>
					</>
				))
			) : (
				<ProductListSkeleton></ProductListSkeleton>
			)}
		</>
	)
}

export default ProductList
