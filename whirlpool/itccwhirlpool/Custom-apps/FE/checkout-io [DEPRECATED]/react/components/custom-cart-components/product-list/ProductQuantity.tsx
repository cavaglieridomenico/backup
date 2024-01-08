import React, { useEffect } from "react"
import { useItemContext } from "./ItemContext"
import style from "./productList.css"
import { useCart } from "../../../providers/cart"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import { useOrder } from "../../../providers/orderform"

const ProductQuantity: React.FC = () => {
	const { item, itemIndex } = useItemContext()
	const { quantityMutation, push } = useCart()
	const { orderForm } = useOrder()

	const { data } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: item.id,
		},
	})
	const propertiesList = data?.productsByIdentifier

	propertiesList?.map((itemWithProps: any) => {
		if (itemWithProps.productId == item.productId) {
			let sellable = itemWithProps?.properties?.filter(
				(e: any) => e.name == "sellable",
			)
			let field5 = itemWithProps?.properties?.filter(
				(e: any) => e.name == "field5",
			)
			let colour = itemWithProps?.properties?.filter(
				(e: any) => e.name == "Colour",
			)

			item.sellable = sellable[0]?.values[0]
			item.field5 = field5[0]?.values[0]
			item.colour = colour[0]?.values[0]
			return item
		}
	})

	const sendEecAddToCartEvent = () => {
		push({ event: "eec.addToCartEec", item })
	}
	const sendEecRemoveFromCartEvent = () => {
		push({ event: "eec.removeFromCartEec", item })
	}
	/* const sendCartStateEvent = () => {
		setTimeout(() => {
			if (quantityLoading == false) push({ event: "cartState", orderForm })
		}, 1000)
	} */
	useEffect(() => {
		if (data != undefined) {
			push({ event: "cartState", orderForm })
		}
	}, [item.quantity])

	return (
		<div className={style.productquantityContainer}>
			<button
				className={
					item.quantity > 1 ? style.minusButton : style.minusButtonDisabled
				}
				onClick={() => {
					quantityMutation(item.id, itemIndex, item.quantity - 1)
					sendEecRemoveFromCartEvent()
				}}
			>
				-
			</button>

			<span className={style.quantity}>{item.quantity}</span>

			<button
				className={style.plusButton}
				onClick={() => {
					quantityMutation(item.id, itemIndex, item.quantity + 1)
					sendEecAddToCartEvent()
				}}
			>
				+
			</button>
		</div>
	)
}

export default ProductQuantity
