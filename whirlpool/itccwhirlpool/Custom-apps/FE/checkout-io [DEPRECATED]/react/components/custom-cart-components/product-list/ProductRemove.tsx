import React from "react"
import { useItemContext } from "./ItemContext"
import style from "./productList.css"
import { useCart } from "../../../providers/cart"
import { useOrder } from "../../../providers/orderform"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../graphql/productsProperties.graphql"
import { IconClose } from "vtex.store-icons"
import { Spinner } from "vtex.styleguide"

const ProductRemove: React.FC = () => {
	const { item, itemIndex } = useItemContext()
	const { quantityMutation, quantityLoading, push } = useCart()
	const { orderForm } = useOrder()

	console.log(orderForm?.items?.length, "orderForm?.items?.length")
	const { data } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: item.id,
		},
	})
	const propertiesList = data?.productsByIdentifier
	let sellableField5AndVariant = {}
	propertiesList?.map((itemWithProps: any) => {
		if (itemWithProps.productId == item.productId) {
			let sellable = itemWithProps.properties.filter(
				(e: any) => e.name == "sellable",
			)
			let field5 = itemWithProps.properties.filter(
				(e: any) => e.name == "field5",
			)
			let colour = itemWithProps.properties.filter(
				(e: any) => e.name == "Colour",
			)

			return (sellableField5AndVariant = {
				sellable: sellable[0]?.values[0],
				field5: field5[0]?.values[0],
				colour: colour[0]?.values[0],
			})
		} else {
			return
		}
	})

	const sendEecRemoveFromCart = () => {
		push({ event: "eec.removeFromCartBulkEec", item, sellableField5AndVariant, })
	}

	return (
		<>
			{quantityLoading ? (
				<span className="c-action-primary">
					<Spinner color="currentColor" />
				</span>
			) : (
				<button
					onClick={() => {
						quantityMutation(item.id, itemIndex, 0),
							orderForm?.items?.length == 1 && window?.location?.reload()
						sendEecRemoveFromCart()
					}}
					className={style.removeProductButton + " pointer grow"}
				>
					{/* <img
						className={style.removeProductImg + " grow"}
						src="/arquivos/close-icon.svg"
						alt="Remove product"
					/> */}
					<IconClose type="outline" />
				</button>
			)}
		</>
	)
}

export default ProductRemove
